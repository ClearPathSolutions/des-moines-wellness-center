/**
 * The portfolio-wide legal pages: /privacy-policy/, /notice-of-privacy-practices/
 * and /sms-terms/.
 *
 * Like the editorial policy (lib/editorialPolicy.ts), the copy is shared word
 * for word across every Quadrant Health Group site, so it is not authored
 * here. content/legal/*.html are unmodified copies of the approved templates in
 * legal-pages-dev-package/production/ (the interim NPP saved as
 * notice-of-privacy-practices.html); only the merge fields vary per site. To
 * pick up a wording change, replace the file with the new template rather than
 * editing it.
 *
 * The NPP is the interim HHS-model notice, placed because this site had none.
 * Replace content/legal/notice-of-privacy-practices.html with the text QHG
 * compliance/legal supplies when it arrives.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from './types'

export const LEGAL_PAGES = {
  'privacy-policy': { title: 'Privacy Policy', path: '/privacy-policy/' },
  'notice-of-privacy-practices': {
    title: 'Notice of Privacy Practices',
    path: '/notice-of-privacy-practices/',
  },
  'sms-terms': { title: 'SMS Terms & Conditions', path: '/sms-terms/' },
} as const

export type LegalSlug = keyof typeof LEGAL_PAGES

/** Date the current templates took effect on this site. */
const EFFECTIVE = 'October 27, 2026'

/** site.address.region is the postal code; the NPP names the state in full. */
const STATE_NAME = 'Iowa'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Merge values as HTML. Phone and email are links, per the package. */
function fieldsHtml(config: SiteConfig): Record<string, string> {
  const { site } = config
  return {
    FACILITY_NAME: escapeHtml(site.name),
    DOMAIN: escapeHtml(new URL(site.url).hostname.replace(/^www\./, '')),
    PHONE: `<a href="${escapeHtml(site.phoneHref)}">${escapeHtml(site.phone)}</a>`,
    PRIVACY_EMAIL: `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>`,
    STREET_ADDRESS: escapeHtml(site.address.full),
    // Only greatertexasbehavioral.com carries a legal-entity prefix.
    LEGAL_ENTITY_LINE: '',
    STATE_NAME,
    PP_LAST_UPDATED: EFFECTIVE,
    SMS_LAST_UPDATED: EFFECTIVE,
    NPP_EFFECTIVE_DATE: EFFECTIVE,
  }
}

/**
 * The page body with its fields merged. The template's leading developer
 * comment is dropped. An unknown or unfilled field fails the build rather than
 * shipping a raw `{{TOKEN}}`.
 */
export function renderLegalHtml(slug: LegalSlug, config: SiteConfig): string {
  const file = path.join(process.cwd(), 'content', 'legal', `${slug}.html`)
  const fields = fieldsHtml(config)
  const html = fs
    .readFileSync(file, 'utf-8')
    .replace(/^\s*<!--[\s\S]*?-->\s*/, '')
    .replace(/\{\{([A-Z_]+)\}\}/g, (token, name: string) => {
      if (!(name in fields)) throw new Error(`content/legal/${slug}.html: unknown merge field ${token}`)
      return fields[name]
    })
    .trim()
  if (html.includes('{{')) throw new Error(`content/legal/${slug}.html: unmerged placeholder`)
  return html
}
