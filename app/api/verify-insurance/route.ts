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

  try {
    const upstream = await fetch(CLARION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_key: SITE_KEY,
        form_key: FORM_KEY,
        data,
        page_url: attribution.page_url ?? null,
        landing_page_url: attribution.landing_page_url ?? null,
        referrer: attribution.referrer ?? null,
        utm: Object.keys(utm).length ? utm : null,
        gclid: attribution.gclid ?? null,
        user_agent: request.headers.get('user-agent') ?? null,
      }),
      // Don't let a hung vendor hold the visitor on a spinner indefinitely.
      signal: AbortSignal.timeout(10_000),
    })

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
