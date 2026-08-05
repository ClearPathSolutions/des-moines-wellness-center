#!/usr/bin/env node
/**
 * Pre-cutover gate. Covers T-04 step 3/4 and T-13's verification.
 *
 * T-04 offers two ways to close: freeze publishing on production, or stand up a
 * re-sync step. This is the second — it makes the drift *measurable and
 * blocking*, so nobody has to remember to eyeball a sitemap diff on launch day.
 *
 * Checks, in order:
 *   1. Every production URL is either present in the build, deliberately
 *      redirected, or on the documented drop list. A new production URL that is
 *      none of those fails the run — that is the content drift T-04 is about.
 *   2. Every build sitemap URL returns 200 with no redirect hop.
 *   3. Every documented redirect is exactly one hop to a 200.
 *
 * Usage
 *   npm run cutover:check                 # against a locally running build
 *   BASE=https://preview.vercel.app npm run cutover:check
 *
 * The build must already be running (npm start) unless BASE is given.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const BASE = (process.env.BASE ?? 'http://localhost:3000').replace(/\/$/, '')
const PRODUCTION = 'https://desmoinesrecovery.com'
const TIMEOUT_MS = 20_000

const map = JSON.parse(
  readFileSync(path.join(process.cwd(), 'audit/cutover/redirect-map.json'), 'utf-8')
)

const fail = []
const warn = []
const ok = []

async function head(url) {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return { status: res.status, location: res.headers.get('location') }
  } catch (err) {
    return { status: 0, error: String(err?.name ?? err) }
  }
}

/** Follow redirects manually so hops can be counted. */
async function trace(url, max = 5) {
  const chain = []
  let current = url
  for (let i = 0; i < max; i++) {
    const { status, location, error } = await head(current)
    if (error) return { chain, final: 0, hops: chain.length, error }
    if (status >= 300 && status < 400 && location) {
      chain.push({ from: current, status, to: location })
      current = new URL(location, current).toString()
      continue
    }
    return { chain, final: status, hops: chain.length, url: current }
  }
  return { chain, final: -1, hops: chain.length, error: 'too many redirects' }
}

const paths = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    try {
      return new URL(m[1]).pathname
    } catch {
      return null
    }
  }).filter(Boolean)

async function productionPaths() {
  const idx = await (await fetch(`${PRODUCTION}/sitemap_index.xml`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })).text()
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const out = new Set()
  for (const child of children) {
    const xml = await (await fetch(child, { signal: AbortSignal.timeout(TIMEOUT_MS) })).text()
    paths(xml).forEach((p) => out.add(p))
  }
  return [...out].sort()
}

console.log(`cutover check\n  build:      ${BASE}\n  production: ${PRODUCTION}\n`)

// ---------------------------------------------------------------- 1. drift
console.log('1. production URLs accounted for')
let prodPaths = []
try {
  prodPaths = await productionPaths()
} catch (err) {
  fail.push(`could not read production sitemap index: ${err}`)
}

const buildSitemap = await (await fetch(`${BASE}/sitemap.xml`, {
  signal: AbortSignal.timeout(TIMEOUT_MS),
})).text()
const buildPaths = new Set(paths(buildSitemap))

const norm = (p) => '/' + p.replace(/^\/+|\/+$/g, '') + (p === '/' ? '' : '/')
const buildNorm = new Set([...buildPaths].map(norm))
const redirected = new Set(Object.keys(map.redirects).map(norm))
const dropped = new Set(map.intentionalDrops.map((d) => norm(d.path)))

let unaccounted = 0
for (const p of prodPaths) {
  const n = norm(p)
  if (buildNorm.has(n) || redirected.has(n) || dropped.has(n)) continue
  unaccounted++
  fail.push(
    `production URL not in the build, not redirected, not on the drop list: ${p}\n` +
      `      -> migrate it, add a redirect, or add it to intentionalDrops in audit/cutover/redirect-map.json`
  )
}
console.log(
  `   production: ${prodPaths.length} URLs · build: ${buildPaths.size} · unaccounted: ${unaccounted}`
)
if (!unaccounted && prodPaths.length) ok.push('every production URL is accounted for')

// ---------------------------------------------------------------- 2. sitemap
console.log('\n2. build sitemap URLs are 200 with no redirect')
let sitemapBad = 0
for (const p of buildPaths) {
  const { status, location } = await head(BASE + p)
  if (status !== 200) {
    sitemapBad++
    fail.push(`sitemap URL ${p} returned ${status}${location ? ` -> ${location}` : ''} (want 200)`)
  }
}
console.log(`   checked ${buildPaths.size} · failures: ${sitemapBad}`)
if (!sitemapBad) ok.push(`all ${buildPaths.size} sitemap URLs are 200 with no redirect`)

// ---------------------------------------------------------------- 3. redirects
console.log('\n3. documented redirects are single-hop to a 200')
let redirectBad = 0
for (const [from, to] of Object.entries(map.redirects)) {
  const t = await trace(BASE + from)
  const landed = t.url ? new URL(t.url).pathname : ''
  const wanted = norm(to)
  if (t.error) {
    redirectBad++
    fail.push(`redirect ${from}: ${t.error}`)
  } else if (t.hops !== 1) {
    redirectBad++
    fail.push(`redirect ${from}: ${t.hops} hop(s), want exactly 1 (chain: ${t.chain.map((c) => c.to).join(' -> ')})`)
  } else if (t.final !== 200) {
    redirectBad++
    fail.push(`redirect ${from}: lands on ${t.final}, want 200`)
  } else if (norm(landed) !== wanted) {
    warn.push(`redirect ${from}: lands on ${landed}, map says ${to}`)
  }
}
console.log(`   checked ${Object.keys(map.redirects).length} · failures: ${redirectBad}`)
if (!redirectBad) ok.push('every documented redirect is one hop to a 200')

// ---------------------------------------------------------------- report
console.log('\n' + '='.repeat(72))
ok.forEach((o) => console.log(`✓ ${o}`))
warn.forEach((w) => console.log(`! ${w}`))
if (fail.length) {
  console.error(`\n✗ ${fail.length} problem(s):\n`)
  fail.forEach((f) => console.error(`  - ${f}`))
  console.error(
    '\nThis gate must pass, re-run within 24h of cutover (T-04 step 3).\n'
  )
  process.exit(1)
}
console.log('\nAll cutover checks passed.')
console.log('Re-run within 24h of go-live — production keeps publishing (T-04).')
