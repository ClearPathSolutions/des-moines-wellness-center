#!/usr/bin/env node
/**
 * T-09: confirm an insurance-verification lead actually reaches Clarion.
 *
 * Why this needs a human: only someone with CRM access can confirm receipt, and
 * a successful run creates a REAL lead record. So this is deliberately not run
 * automatically and refuses to do anything without --i-will-delete-this.
 *
 * Background — why the form submits server-side at all:
 * Clarion's endpoint answers the CORS preflight with no Access-Control-Allow-*
 * headers, and pins this site key to an origin allowlist that does not include
 * desmoinesrecovery.com. A browser POST therefore never leaves the page. The
 * form now posts to /api/verify-insurance, which relays server-to-server (no
 * Origin header), so neither restriction applies.
 *
 * Attribution — read this before trusting the result:
 * A lead is only fully correct if CTM staples it to the visit it came from,
 * which needs CTM's session id (`ctm_visitor_sid`). That id only exists in a
 * real browser, so this script cannot invent one. Without it CTM still accepts
 * the lead and answers 200, but files it against no visit — which looks exactly
 * like the bug this field was added to fix. Pass --ctm-sid to avoid a false
 * negative; get the value by opening the site and running `__ctm.config.sid` in
 * the console, or by copying the `__ctmid` cookie.
 *
 * Usage
 *   # 1. Safe: check the endpoint is wired and the failure path works.
 *   node scripts/verify-lead.mjs --dry-run
 *
 *   # 2. Real: creates ONE lead you must then delete from the CRM.
 *   BASE=https://your-preview.vercel.app \
 *     node scripts/verify-lead.mjs --i-will-delete-this \
 *     --ctm-sid=6a88a9cc00040a6a4743909d
 */
const BASE = (process.env.BASE ?? 'http://localhost:3000').replace(/\/$/, '')
const ENDPOINT = `${BASE}/api/verify-insurance/`  // slashed: next.config sets trailingSlash
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const confirmed = args.includes('--i-will-delete-this')

// CTM identifiers are 24 hex characters with no dashes. Our own session id is a
// UUID, and passing that by mistake is the precise failure this flag exists to
// catch, so it is rejected rather than sent.
const CTM_ID_RE = /^[0-9a-f]{24}$/i
const ctmSid = (args.find((a) => a.startsWith('--ctm-sid=')) ?? '').split('=')[1] || null
if (ctmSid && !CTM_ID_RE.test(ctmSid)) {
  console.error(
    `\n--ctm-sid=${ctmSid} is not a CTM session id.\n\n` +
      `  CTM ids are 24 hex characters, no dashes:  6a88a9cc00040a6a4743909d\n` +
      `  That value has ${ctmSid.length} characters${ctmSid.includes('-') ? ' and contains dashes' : ''}.\n\n` +
      `  If you copied it from a form payload, check you took ctm_visitor_sid and\n` +
      `  not session.session_id — the latter is the app's own id, not CTM's.\n`
  )
  process.exit(2)
}

if (!dryRun && !confirmed) {
  console.error(
    `\nRefusing to run without an explicit mode.\n\n` +
      `  --dry-run                 validate wiring and the failure path; creates nothing\n` +
      `  --i-will-delete-this      submit ONE real lead; you must delete it afterwards\n`
  )
  process.exit(2)
}

const post = async (body) => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  })
  let json = null
  try {
    json = await res.json()
  } catch {}
  return { status: res.status, json }
}

console.log(`endpoint: ${ENDPOINT}\n`)

// --- Always run: the failure path must be visible, not silent -------------
// The original form showed "We're now running a verification of your coverage"
// unconditionally, so a dropped lead looked exactly like a delivered one. These
// assertions are what stop that regressing.
console.log('validating the failure path (creates nothing)')
const checks = [
  { name: 'empty body rejected', body: {}, want: 400, wantError: 'missing_fields' },
  {
    name: 'partial body rejected',
    body: { name: 'Test' },
    want: 400,
    wantError: 'missing_fields',
  },
]
let failed = 0
for (const c of checks) {
  const { status, json } = await post(c.body)
  const pass = status === c.want && json?.error === c.wantError && json?.ok === false
  console.log(
    `  ${pass ? '✓' : '✗'} ${c.name}: HTTP ${status} ${JSON.stringify(json)}`
  )
  if (!pass) failed++
}

const bad = await fetch(ENDPOINT, { method: 'GET', signal: AbortSignal.timeout(10_000) })
console.log(`  ${bad.status === 405 ? '✓' : '✗'} GET rejected: HTTP ${bad.status} (want 405)`)
if (bad.status !== 405) failed++

if (failed) {
  console.error(`\n✗ ${failed} wiring check(s) failed — fix before testing a real lead.`)
  process.exit(1)
}
console.log('\n✓ endpoint is wired and rejects bad input without contacting the vendor.')

if (dryRun) {
  console.log(
    '\nDry run complete. Nothing was sent to Clarion.\n' +
      'To close T-09, run with --i-will-delete-this against the production origin\n' +
      'and confirm the lead appears in the CRM for THIS facility.\n'
  )
  process.exit(0)
}

// --- Real submission ------------------------------------------------------
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
const lead = {
  name: `ZZ TEST DELETE ME ${stamp}`,
  phone: '515-555-0100',
  email: `qa+${stamp}@example.invalid`,
  date_of_birth: '1990-01-01',
  provider: 'Aetna',
  member_id: 'TEST-DO-NOT-PROCESS',
  message:
    'Automated T-09 verification test. NOT a real enquiry — please delete this record. Do not contact.',
  page_url: `${BASE}/verify-insurance/`,
  landing_page_url: `${BASE}/?utm_source=verify-lead-script&utm_medium=qa&gclid=QA-TEST-GCLID`,
  utm: { source: 'verify-lead-script', medium: 'qa', campaign: 't-09-verification' },
  gclid: 'QA-TEST-GCLID',
  // Exercises the same shape a real browser sends, so a run proves the whole
  // path rather than only the fields the form had before session capture.
  session: {
    session_id: 'qa-script-not-a-real-browser-session',
    session_pageviews: 1,
    pages: ['/verify-insurance/'],
    ctm: { account_id: 264810, session_id: ctmSid, visitor_id: ctmSid },
    session_entry: {
      page_url: `${BASE}/?utm_source=verify-lead-script&utm_medium=qa&gclid=QA-TEST-GCLID`,
      utm: { source: 'verify-lead-script', medium: 'qa' },
      click_ids: { gclid: 'QA-TEST-GCLID' },
    },
  },
}
if (ctmSid) lead.ctm_visitor_sid = ctmSid

console.log('\nsubmitting ONE real lead:')
console.log(`  name:  ${lead.name}`)
console.log(`  email: ${lead.email}`)
console.log(`  ctm:   ${ctmSid ?? 'NONE — see the warning below'}`)

if (!ctmSid) {
  // Without this the operator checks CTM, sees a lead with no visit attached,
  // and concludes the fix failed — when in fact the script never supplied the
  // one value that makes the link possible.
  console.warn(
    `\n  ⚠ No --ctm-sid given.\n\n` +
      `    This lead WILL arrive in the CRM, and CTM WILL answer 200 — but it\n` +
      `    will be filed against no visit, because there is no CTM session to\n` +
      `    staple it to. That is this script's limitation, not a bug in the site:\n` +
      `    the id only exists in a real browser.\n\n` +
      `    So do not read "no session data" from this run as a failure. To test\n` +
      `    the link for real, either re-run with --ctm-sid=<24 hex chars> or,\n` +
      `    better, submit the form in a browser and check that record instead.\n`
  )
}

const { status, json } = await post(lead)
console.log(`\nHTTP ${status} ${JSON.stringify(json)}`)

if (status === 200 && json?.ok) {
  console.log(
    `\n✓ The relay accepted and forwarded the lead.\n\n` +
      `  Now confirm in Clarion that a lead named "${lead.name}" arrived, and that\n` +
      `  it is routed to Des Moines Wellness Center and not another facility.\n` +
      (ctmSid
        ? `  Then confirm in CTM that the visit ${ctmSid} has this form attached —\n` +
          `  that is the half a 200 response cannot tell you.\n`
        : `  Attribution was NOT tested by this run (no --ctm-sid). See the warning\n` +
          `  above before reporting a missing session as a defect.\n`) +
      `  Then DELETE it. Only after that is T-09 closed.\n`
  )
  process.exit(0)
}

console.error(
  `\n✗ The relay did not accept the lead.\n\n` +
    `  502 upstream_error / upstream_unreachable means Clarion rejected or timed\n` +
    `  out. Most likely the site key's origin allowlist or form_key is wrong —\n` +
    `  check server logs for the "[verify-insurance]" line, which records the\n` +
    `  status without logging any PHI.\n`
)
process.exit(1)
