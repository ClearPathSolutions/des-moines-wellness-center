#!/usr/bin/env node
/**
 * Internal-link integrity guard for content/.
 *
 * Every internal `href` in the content JSON must resolve to a page that exists
 * (or to a known non-content route). Exits non-zero with a list of offenders so
 * this can gate CI.
 *
 * Run: npm run check:links
 */
import fs from 'node:fs'
import path from 'node:path'

const CONTENT = path.join(process.cwd(), 'content')
const PAGES = path.join(CONTENT, 'pages')

// Routes that exist as code, not as a content/pages/*.json file.
const CODE_ROUTES = new Set(['/', '/blog'])

const pageSlugs = new Set(
  fs
    .readdirSync(PAGES)
    .filter((f) => f.endsWith('.json'))
    .map((f) => '/' + f.replace(/\.json$/, '').replace(/__/g, '/'))
    .map((p) => (p === '/home' ? '/' : p))
)

const known = new Set([...pageSlugs, ...CODE_ROUTES])

/** Collect every { href, file, jsonPath } in the content tree. */
function collect(dir) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      found.push(...collect(full))
      continue
    }
    if (!entry.name.endsWith('.json')) continue
    const json = JSON.parse(fs.readFileSync(full, 'utf-8'))
    const rel = path.relative(process.cwd(), full)
    const walk = (node, jsonPath) => {
      if (Array.isArray(node)) {
        node.forEach((v, i) => walk(v, `${jsonPath}[${i}]`))
        return
      }
      if (!node || typeof node !== 'object') return
      for (const [key, value] of Object.entries(node)) {
        if (key === 'href' && typeof value === 'string') {
          found.push({ href: value, file: rel, jsonPath })
        }
        walk(value, jsonPath ? `${jsonPath}.${key}` : key)
      }
    }
    walk(json, '')
  }
  return found
}

const all = collect(CONTENT)
const broken = []

for (const item of all) {
  const { href } = item
  // External, phone, mail and in-page anchors are out of scope.
  if (/^(https?:|tel:|mailto:|#)/.test(href)) continue
  if (!href.startsWith('/')) {
    broken.push({ ...item, reason: 'not an absolute internal path' })
    continue
  }
  const clean = href.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/'
  if (!known.has(clean)) broken.push({ ...item, reason: 'no such page' })
}

const internalCount = all.filter((i) => !/^(https?:|tel:|mailto:|#)/.test(i.href)).length

if (broken.length) {
  console.error(`\n✗ ${broken.length} unresolvable internal href(s) in content/:\n`)
  for (const b of broken) {
    console.error(`  ${b.href}`)
    console.error(`      ${b.file} → ${b.jsonPath} (${b.reason})`)
  }
  console.error(
    `\nChecked ${internalCount} internal hrefs across ${all.length} total. Fix the paths above or add the route to CODE_ROUTES.\n`
  )
  process.exit(1)
}

console.log(
  `✓ all ${internalCount} internal hrefs in content/ resolve (${known.size} known routes)`
)
