#!/usr/bin/env node
/**
 * T-02 guard: no page copy may assert an accreditation that isn't verified.
 *
 * Gating `site.config.json` stops the *badge list* rendering an unverified
 * claim, but body copy is a separate surface — the homepage asserted
 * "Joint Commission Gold Seal and LegitScript Certified facility" as a plain
 * sentence, which no amount of config gating would have caught.
 *
 * An unsubstantiated certification claim on an addiction-treatment site is a
 * Google Ads eligibility risk, so this fails the build rather than warning.
 *
 * Run: npm run check:claims
 */
import fs from 'node:fs'
import path from 'node:path'
import { pageSources } from './lib/page-sources.mjs'

const CONTENT = path.join(process.cwd(), 'content')

const config = JSON.parse(fs.readFileSync(path.join(CONTENT, 'site.config.json'), 'utf-8'))
const accreditations = config.site?.accreditations ?? []

if (!Array.isArray(accreditations) || accreditations.some((a) => typeof a !== 'object')) {
  console.error(
    '✗ site.config.json accreditations must be objects with a `status` field (see lib/types.ts Accreditation).'
  )
  process.exit(1)
}

const withheld = accreditations.filter((a) => a.status !== 'verified')
if (!withheld.length) {
  console.log('✓ all declared accreditations are marked verified — nothing to police')
  process.exit(0)
}

/** Distinctive tokens that constitute asserting the claim in prose. */
const CLAIM_TOKENS = {
  'LegitScript Certified': [/legit\s*script/i],
  'The Joint Commission (Gold Seal of Approval)': [/joint\s+commission/i, /gold\s+seal/i],
}

/** Fields that reach a rendered page. `images` and page-level `ctas` are
 *  declared in the content model but read by no component, and `withheldReason`
 *  necessarily names the claim it is withholding. */
const IGNORED_KEYS = new Set(['withheldReason', 'src', 'out', 'id'])
const IGNORED_ROOT_FIELDS = new Set(['images', 'ctas'])

const violations = []

function scanFile(file) {
  const rel = path.relative(process.cwd(), file)
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'))

  const walk = (node, p, rootField) => {
    if (typeof node === 'string') {
      if (IGNORED_ROOT_FIELDS.has(rootField)) return
      for (const claim of withheld) {
        const patterns = CLAIM_TOKENS[claim.label] ?? [
          new RegExp(claim.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        ]
        if (patterns.some((re) => re.test(node))) {
          violations.push({ file: rel, field: p, claim: claim.label, text: node.slice(0, 140) })
        }
      }
      return
    }
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${p}[${i}]`, rootField))
    if (!node || typeof node !== 'object') return
    for (const [k, v] of Object.entries(node)) {
      if (IGNORED_KEYS.has(k)) continue
      walk(v, p ? `${p}.${k}` : k, p ? rootField : k)
    }
  }
  walk(json, '', '')
}

// Scope: page content only. site.config.json is where the claim is *declared*
// (its own label would always match), componentInventory is documentation, and
// brand.json / image-map.json are reference data no component reads.
const PAGES = path.join(CONTENT, 'pages')
for (const f of fs.readdirSync(PAGES).filter((f) => f.endsWith('.json'))) {
  scanFile(path.join(PAGES, f))
}

// Same gap as check-services.mjs: a page whose copy is authored in TSX is not
// in content/, so walking JSON never sees it. Comments are stripped first, so
// the note explaining *why* a claim is withheld does not read as the claim.
for (const { label, text } of pageSources()) {
  for (const claim of withheld) {
    const patterns = CLAIM_TOKENS[claim.label] ?? [
      new RegExp(claim.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    ]
    const hit = patterns.find((re) => re.test(text))
    if (hit) {
      const m = text.match(hit)
      violations.push({
        file: label,
        field: `source match ${JSON.stringify(m[0])}`,
        claim: claim.label,
        text: text.slice(Math.max(0, m.index - 60), m.index + 80).replace(/\s+/g, ' ').trim(),
      })
    }
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} page(s) assert an accreditation that is not verified:\n`)
  for (const v of violations) {
    console.error(`  ${v.file} → ${v.field}`)
    console.error(`      claims: ${v.claim}`)
    console.error(`      "${v.text}"\n`)
  }
  console.error(
    'Either remove the claim from the copy, or — once the certificate is documented —\n' +
      'set that accreditation\'s status to "verified" in content/site.config.json with its\n' +
      'certificateId and verificationUrl.\n'
  )
  process.exit(1)
}

console.log(
  `✓ no page asserts a withheld accreditation (${withheld.map((w) => w.label).join(', ')})`
)
