import { NextResponse } from 'next/server'

/**
 * Server-side relay for insurance verification leads.
 *
 * The browser used to POST straight to Clarion. That is unreliable here for two
 * reasons: the request is cross-origin with a JSON content type, so it needs a
 * CORS preflight that Clarion's endpoint does not answer with the required
 * `Access-Control-Allow-*` headers; and Clarion pins this site key to an origin
 * allowlist that does not currently include desmoinesrecovery.com. Relaying
 * server-to-server sends no `Origin` header at all, so neither applies.
 *
 * It also keeps the submitted PHI (date of birth, member ID, free-text notes)
 * out of a third-party script running in the visitor's browser, and gives the
 * form a real success/failure signal to show instead of guessing.
 */

const CLARION_ENDPOINT = 'https://api.clarionlabs.ai/forms/public/submit'
const SITE_KEY = 'cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33'
const FORM_KEY = 'insurance_verification'

/** Fields we forward, and the cap applied to each. Anything else is dropped. */
const FIELD_LIMITS: Record<string, number> = {
  name: 120,
  phone: 40,
  email: 160,
  date_of_birth: 40,
  provider: 120,
  member_id: 80,
  message: 2000,
}

/** Attribution fields the vendor's client script used to gather itself. */
const ATTRIBUTION_LIMITS: Record<string, number> = {
  page_url: 500,
  landing_page_url: 500,
  referrer: 500,
  gclid: 200,
}

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

/* -------------------------------------------------------------------------- */
/* session blob                                                                */
/* -------------------------------------------------------------------------- */

// This endpoint is public and unauthenticated, and the session object is shaped
// entirely by the client (see lib/session.ts). It is therefore treated as
// untrusted input and rebuilt rather than passed through: a caller must not be
// able to relay an arbitrarily large or deeply nested payload to the vendor
// under our site key.
const SESSION_MAX_DEPTH = 4
const SESSION_MAX_KEYS = 60
const SESSION_MAX_ARRAY = 40
const SESSION_MAX_STRING = 500
/** Belt and braces on top of the structural caps above. */
const SESSION_MAX_BYTES = 16_000

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

function sanitize(value: unknown, depth: number): Json | undefined {
  if (value === null) return null
  if (typeof value === 'string') return value.slice(0, SESSION_MAX_STRING)
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (depth >= SESSION_MAX_DEPTH) return undefined

  if (Array.isArray(value)) {
    const out: Json[] = []
    for (const item of value.slice(0, SESSION_MAX_ARRAY)) {
      const cleaned = sanitize(item, depth + 1)
      if (cleaned !== undefined) out.push(cleaned)
    }
    return out
  }

  if (typeof value === 'object') {
    const out: { [key: string]: Json } = {}
    let keys = 0
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (keys >= SESSION_MAX_KEYS) break
      // Prototype-pollution-safe by construction (plain object literal), but
      // there is no reason to forward these to the vendor either.
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
      const cleaned = sanitize(item, depth + 1)
      if (cleaned === undefined) continue
      out[key.slice(0, 64)] = cleaned
      keys++
    }
    return out
  }

  return undefined
}

function sanitizeSession(value: unknown): Json | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const cleaned = sanitize(value, 0)
  if (!cleaned || typeof cleaned !== 'object') return null
  try {
    if (JSON.stringify(cleaned).length > SESSION_MAX_BYTES) return null
  } catch {
    return null
  }
  return cleaned
}

/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  const body = payload as Record<string, unknown>

  const data: Record<string, string> = {}
  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    const value = clean(body[field], max)
    if (value) data[field] = value
  }

  // The fields the form marks required. Without these a lead is not actionable,
  // so reject rather than forwarding a useless record.
  for (const required of ['name', 'phone', 'email', 'date_of_birth', 'provider']) {
    if (!data[required]) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }
  }

  const attribution: Record<string, string> = {}
  for (const [field, max] of Object.entries(ATTRIBUTION_LIMITS)) {
    const value = clean(body[field], max)
    if (value) attribution[field] = value
  }

  const rawUtm = (body.utm ?? null) as Record<string, unknown> | null
  const utm: Record<string, string> = {}
  if (rawUtm && typeof rawUtm === 'object') {
    for (const key of UTM_KEYS) {
      const value = clean(rawUtm[key], 200)
      if (value) utm[key] = value
    }
  }

  const session = sanitizeSession(body.session)

  const envelope = {
    site_key: SITE_KEY,
    form_key: FORM_KEY,
    data,
    page_url: attribution.page_url ?? null,
    landing_page_url: attribution.landing_page_url ?? null,
    referrer: attribution.referrer ?? null,
    utm: Object.keys(utm).length ? utm : null,
    gclid: attribution.gclid ?? null,
    user_agent: request.headers.get('user-agent') ?? null,
  }

  const send = (withSession: boolean) =>
    fetch(CLARION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(withSession && session ? { ...envelope, session } : envelope),
      // Don't let a hung vendor hold the visitor on a spinner indefinitely.
      signal: AbortSignal.timeout(10_000),
    })

  try {
    let upstream = await send(true)

    // `session` is a field Clarion has not been asked to accept before. If it
    // validates its envelope strictly, an unknown key would turn every lead into
    // a 4xx — trading better attribution for lost admissions enquiries, which is
    // not a trade worth making. So a rejected submission is retried once without
    // it, and the lead still lands with the flat attribution fields it always
    // had. Remove this fallback once a real lead has been confirmed in the CRM
    // with `session` attached.
    if (!upstream.ok && session && upstream.status >= 400 && upstream.status < 500) {
      console.warn(
        `[verify-insurance] Clarion rejected the lead with session data ` +
          `(HTTP ${upstream.status}); retrying without it.`
      )
      upstream = await send(false)
    }

    if (!upstream.ok) {
      // Deliberately not logging the body — it contains PHI.
      console.error(
        `[verify-insurance] Clarion rejected the lead: HTTP ${upstream.status}`
      )
      return NextResponse.json({ ok: false, error: 'upstream_error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const reason = err instanceof Error ? err.name : 'unknown'
    console.error(`[verify-insurance] Clarion request failed: ${reason}`)
    return NextResponse.json({ ok: false, error: 'upstream_unreachable' }, { status: 502 })
  }
}
