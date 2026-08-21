/**
 * Client-side session and attribution store.
 *
 * The problem this solves: the insurance form used to read attribution straight
 * off `window.location` at the moment of submit. That is only correct when the
 * visitor lands on the form page directly from the ad. In the normal case — land
 * on `/?utm_source=google&gclid=...`, read two pages, then submit — the query
 * string is long gone, so `utm` and `gclid` arrived empty, `referrer` was the
 * previous internal page (and got filtered to null), and `landing_page_url` was
 * set to the *current* page rather than the entry point. Every paid lead looked
 * like direct traffic.
 *
 * So attribution is captured on the first pageview of a session and persisted,
 * and the submit reads the stored session rather than the current URL.
 *
 * Everything here is defensive by design. Storage throws in Safari private mode,
 * cookies may be blocked, and `t.js` is a third-party script that can fail to
 * load. No failure in this file may ever stop a form from submitting — a lead
 * with no attribution is a bad outcome, a lead that never sends is a worse one.
 */

const FIRST_TOUCH_KEY = 'dmwc.first_touch.v1'
const SESSION_KEY = 'dmwc.session.v1'

/** Inactivity gap that ends a session. 30 minutes is the GA/CTM convention. */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

/** Cap on the page trail, so a long browse cannot bloat the submitted payload. */
const MAX_PAGES = 30

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const

/**
 * Ad-platform click identifiers. `gclid` is the one the CRM already understood;
 * the rest are here because the CTM account's own routing rules key off
 * `wbraid`/`gbraid` (Google's iOS/consent-mode substitutes for `gclid`), and a
 * lead attributed by CTM but not by us is a reconciliation problem later.
 */
const CLICK_ID_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'dclid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
  'irclickid',
] as const

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>
export type ClickIds = Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>

/** A single point of contact with the site: where they were, and what brought them. */
export type Touch = {
  page_url: string
  referrer: string | null
  referrer_domain: string | null
  utm: Utm | null
  click_ids: ClickIds | null
  at: string
}

type StoredSession = {
  id: string
  started_at: string
  last_active_at: string
  /** The first pageview of this session — the true landing page and campaign. */
  entry: Touch
  pageviews: number
  pages: string[]
}

export type CtmIdentity = {
  account_id: number | null
  session_id: string | null
  visitor_id: string | null
}

export type SessionData = {
  session_id: string | null
  session_started_at: string
  session_seconds: number | null
  session_pageviews: number
  pages: string[]
  first_touch: Touch
  session_entry: Touch
  last_touch: Touch
  ctm: CtmIdentity
  analytics: { ga_client_id: string | null; google_ads_cookie: string | null }
  client: {
    timezone: string | null
    language: string | null
    languages: string | null
    screen: string | null
    viewport: string | null
    device_pixel_ratio: number | null
  }
  submitted_at: string
}

const isBrowser = () => typeof window !== 'undefined'

/* -------------------------------------------------------------------------- */
/* storage                                                                     */
/* -------------------------------------------------------------------------- */

type MiniStorage = Pick<Storage, 'getItem' | 'setItem'>

const memoryStore = new Map<string, string>()
let resolvedStorage: MiniStorage | null = null

/**
 * localStorage, falling back to sessionStorage and then to memory.
 *
 * localStorage rather than sessionStorage deliberately: sessionStorage is scoped
 * per tab, so opening the site in a second tab would look like a second session
 * and re-attribute the lead. The 30-minute inactivity window below is what draws
 * the session boundary instead, which is also how GA and CTM do it.
 */
function storage(): MiniStorage {
  if (resolvedStorage) return resolvedStorage
  const probe = '__dmwc_probe__'
  for (const candidate of ['localStorage', 'sessionStorage'] as const) {
    try {
      const store = window[candidate]
      store.setItem(probe, '1')
      store.removeItem(probe)
      resolvedStorage = store
      return store
    } catch {
      /* blocked or full — try the next one */
    }
  }
  resolvedStorage = {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, value) => void memoryStore.set(key, value),
  }
  return resolvedStorage
}

function read<T>(key: string): T | null {
  try {
    const raw = storage().getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    storage().setItem(key, JSON.stringify(value))
  } catch {
    /* quota or private mode — the in-memory fallback still serves this pageview */
  }
}

/* -------------------------------------------------------------------------- */
/* primitives                                                                  */
/* -------------------------------------------------------------------------- */

function cookie(name: string): string | null {
  try {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + escaped + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}`
}

function hostOf(url: string | null): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname || null
  } catch {
    return null
  }
}

/** `document.referrer`, but null for same-origin navigation between our pages. */
function externalReferrer(): string | null {
  try {
    const ref = document.referrer
    if (!ref) return null
    return new URL(ref).origin === window.location.origin ? null : ref
  } catch {
    return null
  }
}

function currentPath(): string {
  try {
    return window.location.pathname.slice(0, 200)
  } catch {
    return '/'
  }
}

/** What this pageview knows about itself, before any history is consulted. */
function currentTouch(): Touch {
  const params = new URLSearchParams(window.location.search)

  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`)
    if (value) utm[key] = value.slice(0, 200)
  }

  const clickIds: ClickIds = {}
  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key)
    if (value) clickIds[key] = value.slice(0, 200)
  }

  const referrer = externalReferrer()
  return {
    page_url: window.location.href.slice(0, 500),
    referrer,
    referrer_domain: hostOf(referrer),
    utm: Object.keys(utm).length ? utm : null,
    click_ids: Object.keys(clickIds).length ? clickIds : null,
    at: new Date().toISOString(),
  }
}

const campaignKey = (touch: Touch) => JSON.stringify([touch.utm ?? null, touch.click_ids ?? null])

function startsNewSession(prev: StoredSession | null, now: Touch, nowMs: number): boolean {
  if (!prev) return true

  const lastActive = Date.parse(prev.last_active_at)
  if (!Number.isFinite(lastActive) || nowMs - lastActive > SESSION_TIMEOUT_MS) return true

  // A fresh ad click part-way through a visit re-attributes the session, the way
  // GA and CTM both treat it. Guarded on this pageview actually carrying campaign
  // data — navigating to a clean internal URL must not wipe the attribution.
  if ((now.utm || now.click_ids) && campaignKey(now) !== campaignKey(prev.entry)) return true

  return false
}

/* -------------------------------------------------------------------------- */
/* CallTrackingMetrics                                                         */
/* -------------------------------------------------------------------------- */

type CtmWindow = Window & {
  __ctm?: { config?: { aid?: unknown; sid?: unknown } }
  __ctm_cvars?: unknown[]
}

/**
 * The CTM visitor/session identity, so a form lead can be stitched to the same
 * CTM session as any call the visitor makes.
 *
 * Both halves are read because either can be missing independently. `t.js`
 * reconciles the two on load: a valid 24-character `__ctmid` cookie for this
 * account overwrites `config.sid`, and if there is no such cookie one is written
 * from `config.sid`. So they normally agree — but the cookie is absent when
 * cookies are blocked, and `config` is absent when the script is blocked.
 */
function ctmIdentity(): CtmIdentity {
  const identity: CtmIdentity = { account_id: null, session_id: null, visitor_id: null }
  try {
    const config = (window as CtmWindow).__ctm?.config
    if (config) {
      if (typeof config.aid === 'number') identity.account_id = config.aid
      if (typeof config.sid === 'string') identity.session_id = config.sid
    }
  } catch {
    /* third-party script — never let its shape changing break a submit */
  }
  identity.visitor_id = cookie('__ctmid')
  return identity
}

let ctmVarsPushedFor: string | null = null

/**
 * Attach this session's attribution to the CTM session as custom variables.
 *
 * `t.js` serialises `window.__ctm_cvars` onto every event it sends, so this is
 * what carries our attribution across to the CTM side — including the FormReactor
 * form on /recovery-lp/, which is CTM's own cross-origin iframe and cannot be
 * reached any other way.
 *
 * Pushed once per session: the array is sent whole, so pushing per pageview would
 * send the same object a dozen times. Safe to run before `t.js` loads, because it
 * adopts any pre-existing array (`__ctm_cvars = __ctm_cvars || []`).
 *
 * Deliberately attribution only, no page trail. On this site a path implies a
 * medical condition, and there is no reason to widen what a third party is told.
 */
function pushCtmVars(session: StoredSession): void {
  if (ctmVarsPushedFor === session.id) return
  try {
    const vars: Record<string, string> = { web_session_id: session.id }
    for (const [key, value] of Object.entries(session.entry.utm ?? {})) {
      if (value) vars[`utm_${key}`] = value
    }
    for (const [key, value] of Object.entries(session.entry.click_ids ?? {})) {
      if (value) vars[key] = value
    }
    if (session.entry.referrer_domain) vars.referrer_domain = session.entry.referrer_domain

    const w = window as CtmWindow
    w.__ctm_cvars = w.__ctm_cvars || []
    w.__ctm_cvars.push(vars)
    ctmVarsPushedFor = session.id
  } catch {
    /* non-fatal: the lead still carries the same data to the CRM */
  }
}

/* -------------------------------------------------------------------------- */
/* public API                                                                  */
/* -------------------------------------------------------------------------- */

/** Call on the first render of every page, including client-side route changes. */
export function recordPageview(): void {
  if (!isBrowser()) return
  try {
    const now = currentTouch()
    const nowMs = Date.now()

    // Written once and never overwritten: which ad first brought them here, even
    // if they convert on a later visit weeks afterwards.
    if (!read<Touch>(FIRST_TOUCH_KEY)) write(FIRST_TOUCH_KEY, now)

    const prev = read<StoredSession>(SESSION_KEY)
    const session: StoredSession = startsNewSession(prev, now, nowMs)
      ? {
          id: newId(),
          started_at: now.at,
          last_active_at: now.at,
          entry: now,
          pageviews: 1,
          pages: [currentPath()],
        }
      : {
          ...(prev as StoredSession),
          last_active_at: now.at,
          pageviews: (prev as StoredSession).pageviews + 1,
          // Most recent MAX_PAGES. The landing page is held separately on
          // `entry`, so trimming the head loses nothing that matters.
          pages: [...(prev as StoredSession).pages, currentPath()].slice(-MAX_PAGES),
        }

    write(SESSION_KEY, session)
    pushCtmVars(session)
  } catch {
    /* never throw from a tracking side effect */
  }
}

/** The full session snapshot to send alongside a form submission. */
export function getSessionData(): SessionData | null {
  if (!isBrowser()) return null
  try {
    const now = currentTouch()
    const stored = read<StoredSession>(SESSION_KEY)

    // A submit can in principle beat the tracker's effect, and storage can be
    // blocked outright. Falling back to this pageview means a submission is never
    // sent with no attribution at all, only with less of it.
    const entry = stored?.entry ?? now
    const startedAt = stored?.started_at ?? now.at
    const startedMs = Date.parse(startedAt)

    return {
      session_id: stored?.id ?? null,
      session_started_at: startedAt,
      session_seconds: Number.isFinite(startedMs)
        ? Math.max(0, Math.round((Date.now() - startedMs) / 1000))
        : null,
      session_pageviews: stored?.pageviews ?? 1,
      pages: stored?.pages ?? [currentPath()],
      first_touch: read<Touch>(FIRST_TOUCH_KEY) ?? entry,
      session_entry: entry,
      last_touch: now,
      ctm: ctmIdentity(),
      analytics: {
        // `_ga` is `GA1.1.<client id>.<first seen>`; the client id is the last
        // two segments. Lets a lead be matched back to its GA4 session.
        ga_client_id: (() => {
          const raw = cookie('_ga')
          const parts = raw ? raw.split('.') : []
          return parts.length >= 4 ? parts.slice(-2).join('.') : null
        })(),
        google_ads_cookie: cookie('_gcl_aw'),
      },
      client: {
        timezone: (() => {
          try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
          } catch {
            return null
          }
        })(),
        language: navigator.language ?? null,
        languages: navigator.languages?.join(',').slice(0, 200) ?? null,
        screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        device_pixel_ratio: window.devicePixelRatio ?? null,
      },
      submitted_at: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

/** A CTM identifier: 24 hex characters, no dashes. Our own session id is a UUID,
 *  so this also tells the two apart if they are ever confused for each other. */
export const isCtmId = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{24}$/i.test(value)

/**
 * CTM's session id, which is what CTM needs in order to staple this submission
 * to the visit — and thereby to the ad click and any call from the same visit.
 *
 * Read live at submit time from the JS global, falling back to the `__ctmid`
 * cookie that `t.js` writes. No copy is kept in sessionStorage: the cookie is
 * already the durable store CTM itself reconciles against (first-party, 30-day
 * `cookie_dur`), it survives a full page load and a second tab, and `t.js` runs
 * on every route here, so a stashed copy could only ever be staler than this.
 *
 * Never falls back to our own session id. They are different identifiers for
 * different systems, and substituting one for the other is precisely the failure
 * that leaves a lead filed against no visit.
 */
export function ctmSessionId(): string | null {
  if (!isBrowser()) return null
  const { session_id: sid, visitor_id: vid } = ctmIdentity()
  if (isCtmId(sid)) return sid
  if (isCtmId(vid)) return vid
  return sid ?? vid ?? null
}

/**
 * The submission payload's attribution half.
 *
 * The four flat fields are the shape the CRM already accepts, so they are kept
 * exactly — only their values get more accurate, resolved from the stored session
 * instead of from whatever happens to be in the address bar at submit time.
 * `session` is the new structured blob, and `ctm_visitor_sid` is the flat
 * top-level copy of CTM's session id that Clarion reads.
 */
export function submissionAttribution(): Record<string, unknown> {
  const session = getSessionData()
  if (!session) return {}

  const entry = session.session_entry
  const utm = entry.utm ?? session.first_touch.utm
  const gclid =
    entry.click_ids?.gclid ??
    entry.click_ids?.wbraid ??
    entry.click_ids?.gbraid ??
    session.first_touch.click_ids?.gclid ??
    null

  return {
    page_url: session.last_touch.page_url,
    landing_page_url: entry.page_url,
    referrer: entry.referrer ?? session.first_touch.referrer,
    utm: utm && Object.keys(utm).length ? utm : null,
    gclid,
    // Flat and top-level because that is where Clarion looks for it. The same
    // value is inside `session.ctm.session_id`; `session.session_id` next to it
    // is OUR id (a UUID) and is not interchangeable with this one.
    ctm_visitor_sid: ctmSessionId(),
    session,
  }
}
