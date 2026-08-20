#!/usr/bin/env node
/**
 * Guard: the site must not advertise a level of care the facility does not
 * provide.
 *
 * PHP (Partial Hospitalization) was advertised across 33 content files, the nav,
 * the footer and the homepage card row — a page of its own included — for a
 * service the facility does not offer. That is the same class of exposure as an
 * unverified accreditation (see check-claims.mjs): an unsubstantiated service
 * claim on an addiction-treatment site, which carries paid-search eligibility
 * and regulatory risk, not just a trust cost.
 *
 * Removing it once is not enough. The copy came from shared portfolio templates,
 * so any future content sync can quietly reintroduce it. This fails the build.
 *
 * To retire another service, add it to NOT_OFFERED. To reinstate one, delete its
 * entry here in the same commit that adds the content back.
 *
 * Run: npm run check:services
 */
import fs from 'node:fs'
import path from 'node:path'
import { pageSources } from './lib/page-sources.mjs'

const CONTENT = path.join(process.cwd(), 'content')
const PAGES = path.join(CONTENT, 'pages')

const NOT_OFFERED = [
  {
    service: 'Partial Hospitalization (PHP)',
    // \bPHP\b alone would fire on unrelated words; these are the forms the
    // migrated copy actually used.
    patterns: [/\bPHP\b/, /partial\s+hospitali[sz]ation/i],
    reason: 'the facility does not offer Partial Hospitalization',
    instead: 'residential, IOP, outpatient or virtual outpatient',
  },
]

/** Walk every string in a JSON document, yielding [dottedPath, value]. */
function* strings(node, at = '') {
  if (typeof node === 'string') {
    yield [at, node]
    return
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* strings(node[i], `${at}[${i}]`)
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) yield* strings(v, at ? `${at}.${k}` : k)
  }
}

const targets = [
  ...fs.readdirSync(PAGES).map((f) => ({ label: `content/pages/${f}`, file: path.join(PAGES, f) })),
  { label: 'content/site.config.json', file: path.join(CONTENT, 'site.config.json') },
].filter((t) => t.file.endsWith('.json'))

const violations = []

for (const { label, file } of targets) {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  for (const [at, value] of strings(data)) {
    for (const { service, patterns } of NOT_OFFERED) {
      if (patterns.some((re) => re.test(value))) {
        violations.push({ label, at, service, value })
        break
      }
    }
  }
}

// Pages whose copy lives in TSX rather than content/*.json — campaign landing
// pages — are scanned as source text, comments stripped. Without this a hand-
// built ads page could advertise a retired service and no guard would notice.
for (const { label, text } of pageSources()) {
  for (const { service, patterns } of NOT_OFFERED) {
    const hit = patterns.find((re) => re.test(text))
    if (hit) {
      const m = text.match(hit)
      const at = `source match ${JSON.stringify(m[0])}`
      violations.push({ label, at, service, value: excerpt(text, m.index) })
      break
    }
  }
}

/** A little context around a source match, for the error message. */
function excerpt(text, index) {
  return text.slice(Math.max(0, index - 60), index + 60).replace(/\s+/g, ' ').trim()
}

if (violations.length) {
  console.error(`✗ ${violations.length} reference(s) to a service that is not offered:\n`)
  const bySvc = new Map()
  for (const v of violations) {
    if (!bySvc.has(v.service)) bySvc.set(v.service, [])
    bySvc.get(v.service).push(v)
  }
  for (const [service, list] of bySvc) {
    const spec = NOT_OFFERED.find((n) => n.service === service)
    console.error(`  ${service} — ${spec.reason}. Use ${spec.instead} instead.`)
    for (const v of list) {
      const snippet = v.value.length > 110 ? `${v.value.slice(0, 110)}…` : v.value
      console.error(`    ${v.label} → ${v.at}`)
      console.error(`        ${snippet}`)
    }
  }
  console.error(
    '\nIf the facility has started offering this service, remove its entry from\n' +
      'NOT_OFFERED in scripts/check-services.mjs in the same commit that adds the copy.'
  )
  process.exit(1)
}

const names = NOT_OFFERED.map((n) => n.service).join(', ')
console.log(
  `✓ no page advertises a service that is not offered (${names}) — ` +
    `${targets.length} content file(s) + ${pageSources().length} page source(s)`
)
