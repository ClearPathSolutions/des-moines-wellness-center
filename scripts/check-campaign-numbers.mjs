#!/usr/bin/env node
/**
 * Guard: a campaign landing page must display only its own tracking number.
 *
 * Paid landing pages are given a CallTrackingMetrics number, and it has to be
 * the only number a visitor can see or tap. A visitor who dials the site's main
 * number instead has their call attributed to nothing, so the ad spend that
 * produced it cannot be measured — the page still "works", which is exactly why
 * this regresses silently.
 *
 * It is easy to reintroduce. The header and footer both read the number from
 * site.config.json, so anything that renders standard chrome without the
 * override puts the main number back on the page. That is a one-line mistake in
 * a component nobody thought was related to the campaign.
 *
 * Checks the RENDERED markup, with <script> blocks stripped: what a visitor can
 * read and tap. React's flight payload serialises the not-found boundary — which
 * does carry the main number — into every page, but nothing there is displayed
 * or clickable, and call-tracking number insertion works on the DOM.
 *
 * Needs a running server. Run: npm run check:numbers -- [baseUrl]
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

const config = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'content', 'site.config.json'), 'utf-8')
)
const mainPhone = config.site.phone
const mainHref = config.site.phoneHref

/** Campaign pages and the single number each is allowed to show. */
const CAMPAIGN_PAGES = [
  {
    path: '/recovery-lp/',
    display: '(515) 303-2386',
    href: 'tel:+15153032386',
  },
]

const digits = (s) => s.replace(/\D/g, '')
/** Phone-shaped runs of text, e.g. (515) 303-2386 or 888-378-2158. */
const PHONE_TEXT = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g

let failed = 0

for (const page of CAMPAIGN_PAGES) {
  const url = `${BASE}${page.path}`
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`✗ ${page.path} returned ${res.status}`)
    failed++
    continue
  }
  const html = await res.text()
  const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')

  const problems = []

  const telLinks = [...new Set(rendered.match(/tel:\+?[\d-]+/g) ?? [])]
  for (const link of telLinks) {
    if (digits(link) !== digits(page.href)) {
      problems.push(`tappable link ${link} — only ${page.href} is allowed here`)
    }
  }

  if (digits(rendered).includes(digits(mainPhone))) {
    for (const m of rendered.match(PHONE_TEXT) ?? []) {
      if (digits(m) === digits(mainPhone)) {
        problems.push(`the site's main number (${mainPhone}) is displayed`)
        break
      }
    }
  }

  for (const m of new Set(rendered.match(PHONE_TEXT) ?? [])) {
    const d = digits(m)
    if (d.length >= 10 && d !== digits(page.display) && d !== digits(mainPhone)) {
      problems.push(`unexpected phone-shaped text "${m}"`)
    }
  }

  if (!rendered.includes(page.display)) {
    problems.push(`the campaign number ${page.display} is not displayed at all`)
  }

  if (problems.length) {
    failed++
    console.error(`✗ ${page.path}`)
    for (const p of problems) console.error(`    ${p}`)
  } else {
    const shown = (rendered.match(new RegExp(page.display.replace(/[()]/g, '\\$&'), 'g')) ?? []).length
    console.log(`✓ ${page.path} shows only ${page.display} (${shown} placements, all tel: links match)`)
  }
}

if (failed) {
  console.error(
    `\n${failed} campaign page(s) show the wrong number. The header and footer read\n` +
      `the number from content/site.config.json — pass the campaign number through\n` +
      `SiteChrome's \`phone\`/\`phoneHref\` props, as app/recovery-lp/page.tsx does.\n` +
      `Unused: ${mainHref}\n`
  )
  process.exit(1)
}
