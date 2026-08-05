#!/usr/bin/env node
/**
 * T-05 guard: a condition page's headings must not name a different substance.
 *
 * The migration copy-pasted template blocks between condition pages, leaving
 * e.g. "Managing Alcohol Withdrawal Symptoms Safely" on the benzo page and
 * "Cocaine Rehab and Detox" on the meth page. On an addiction-treatment site
 * that reads as clinical carelessness and undercuts the page's own keyword.
 *
 * Scope is deliberately narrow — headings, subheadings and section ids only.
 * Body copy legitimately references other substances (the fentanyl page must be
 * able to compare fentanyl to heroin; the prescription-drug page covers opioids
 * and benzodiazepines by definition).
 *
 * Run: npm run check:substances
 */
import fs from 'node:fs'
import path from 'node:path'

const PAGES = path.join(process.cwd(), 'content', 'pages')

/** Substance vocabulary. `aliases` are what may legitimately appear on that
 *  page; `names` are the tokens that identify a substance in a heading. */
const SUBSTANCES = [
  { key: 'alcohol', names: ['alcohol', 'alcoholism'] },
  { key: 'benzo', names: ['benzo', 'benzodiazepine', 'xanax', 'ativan', 'valium', 'klonopin'] },
  { key: 'cocaine', names: ['cocaine', 'crack'] },
  { key: 'fentanyl', names: ['fentanyl'] },
  { key: 'meth', names: ['meth', 'methamphetamine', 'crystal meth'] },
  { key: 'prescription-drug', names: ['prescription drug', 'percocet', 'oxycodone', 'vicodin'] },
  { key: 'drug', names: [] }, // generic hub page — no single owned substance
]

/** Which other substances each page may legitimately name in a heading. */
const ALLOWED_CROSS_REFERENCES = {
  // Fentanyl is an opioid; comparing it to heroin/morphine is clinically apt.
  fentanyl: ['heroin', 'morphine', 'opioid'],
  // These drug classes *are* prescription drugs.
  'prescription-drug': ['benzo', 'benzodiazepine', 'opioid', 'percocet', 'oxycodone', 'vicodin', 'xanax'],
  // Generic hub page covers everything.
  drug: SUBSTANCES.flatMap((s) => s.names),
}

/** "meth" must not match "method"/"methadone"; "crack" not "cracked". */
function mentions(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (name === 'meth') return new RegExp('\\bmeth\\b(?!od|adone|yl)', 'i').test(text)
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

const violations = []

for (const file of fs.readdirSync(PAGES).filter((f) => f.startsWith('what-we-treat__'))) {
  const slug = file.replace(/^what-we-treat__/, '').replace(/\.json$/, '')
  const ownKey = slug.replace(/-rehab-des-moines$/, '')
  const own = SUBSTANCES.find((s) => s.key === ownKey)
  if (!own) {
    violations.push({ file, field: '(page)', text: `unknown condition slug "${ownKey}" — add it to SUBSTANCES`, offender: '' })
    continue
  }

  const allowed = new Set([
    ...own.names,
    ...(ALLOWED_CROSS_REFERENCES[ownKey] ?? []),
  ].map((s) => s.toLowerCase()))

  const json = JSON.parse(fs.readFileSync(path.join(PAGES, file), 'utf-8'))

  // Headings, subheadings and ids only.
  const fields = []
  const collect = (node, p) => {
    if (Array.isArray(node)) return node.forEach((v, i) => collect(v, `${p}[${i}]`))
    if (!node || typeof node !== 'object') return
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && ['heading', 'subheading', 'id', 'headline'].includes(k)) {
        fields.push({ field: p ? `${p}.${k}` : k, text: v })
      }
      collect(v, p ? `${p}.${k}` : k)
    }
  }
  collect(json, '')

  for (const { field, text } of fields) {
    for (const other of SUBSTANCES) {
      if (other.key === ownKey) continue
      for (const name of other.names) {
        if (allowed.has(name.toLowerCase())) continue
        // ids are kebab-case, so normalise before matching.
        const haystack = text.replace(/-/g, ' ')
        if (mentions(haystack, name)) {
          violations.push({ file, field, text, offender: name })
        }
      }
    }
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} wrong-substance reference(s) in condition-page headings:\n`)
  for (const v of violations) {
    console.error(`  ${v.file} → ${v.field}`)
    console.error(`      "${v.text}"`)
    if (v.offender) console.error(`      names "${v.offender}", which is not this page's topic\n`)
  }
  console.error(
    'Fix the heading, or if the reference is clinically legitimate add it to\nALLOWED_CROSS_REFERENCES in scripts/check-substances.mjs.\n'
  )
  process.exit(1)
}

console.log('✓ no wrong-substance references in condition-page headings')
