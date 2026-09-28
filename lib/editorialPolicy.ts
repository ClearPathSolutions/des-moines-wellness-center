/**
 * The portfolio-wide editorial policy at /editorial-policy/.
 *
 * The copy is shared word for word across every Quadrant Health Group site, so
 * it is not authored here: content/editorial-policy.html is the package
 * template, unmodified, and only its five merge fields vary per site. To pick up
 * a change to the master copy, replace that file with the new template rather
 * than editing it — copy changes go through the content owner, not this repo.
 *
 * Launch is gated. The policy is only served, linked from the footer and About
 * page, listed in the sitemap and referenced from the Organization schema once
 * every field is filled AND content has signed off. Until then production
 * builds 404 the route and nothing points at it, because a live page carrying
 * "{{EDITORIAL_EMAIL}}" or an unapproved policy is worse than no page at all.
 * `next dev` renders it anyway, with the gaps left visible, so it can be
 * reviewed before sign-off.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from './types'
import { canonicalUrl } from './urls'

export const EDITORIAL_POLICY_PATH = '/editorial-policy/'

/** Anchor the template gives its corrections section; `correctionsPolicy`
 *  in the Organization schema points at it. */
const CORRECTIONS_ANCHOR = 'content-updates-and-corrections'

const TEMPLATE_FILE = path.join(process.cwd(), 'content', 'editorial-policy.html')

export type PolicyFields = {
  FACILITY_NAME: string
  DOMAIN: string
  EDITORIAL_EMAIL: string
  PHONE: string
  PHONE_TEL: string
  /** "Month YYYY", as the page shows it. */
  LAST_REVIEWED: string
}

/** 888-378-2158 -> +18883782158. A number already written with its leading
 *  country code (1-866-525-3026) keeps a single 1. */
export function phoneTel(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  return national ? `+1${national}` : ''
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** 2026-09-30 -> "September 2026". Empty when the date is missing or malformed. */
export function reviewedDisplay(iso: string): string {
  if (!ISO_DATE.test(iso)) return ''
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export function policyFields(config: SiteConfig): PolicyFields {
  const { site } = config
  const policy = config.editorialPolicy
  return {
    FACILITY_NAME: site.name,
    DOMAIN: new URL(site.url).hostname.replace(/^www\./, ''),
    EDITORIAL_EMAIL: policy?.editorialEmail?.trim() ?? '',
    PHONE: site.phone,
    PHONE_TEL: phoneTel(site.phone),
    LAST_REVIEWED: reviewedDisplay(policy?.lastReviewed?.trim() ?? ''),
  }
}

/** Everything standing between this site and a live policy, in plain words.
 *  Empty means ready. */
export function policyBlockers(config: SiteConfig): string[] {
  const fields = policyFields(config)
  const blockers: string[] = (Object.keys(fields) as (keyof PolicyFields)[])
    .filter((k) => !fields[k])
    .map((k) =>
      k === 'LAST_REVIEWED'
        ? 'editorialPolicy.lastReviewed (YYYY-MM-DD)'
        : k === 'EDITORIAL_EMAIL'
          ? 'editorialPolicy.editorialEmail'
          : k,
    )
  if (!config.editorialPolicy?.contentSignoff?.trim()) {
    blockers.push('editorialPolicy.contentSignoff')
  }
  return blockers
}

/** True only when the policy may be served and linked in production. */
export function policyIsLive(config: SiteConfig): boolean {
  return policyBlockers(config).length === 0
}

/** Serve the page? Always in `next dev`, so it can be reviewed before sign-off. */
export function policyIsRenderable(config: SiteConfig): boolean {
  return policyIsLive(config) || process.env.NODE_ENV === 'development'
}

export function policyUrl(config: SiteConfig): string {
  return canonicalUrl(config.site.url, EDITORIAL_POLICY_PATH)
}

export function correctionsPolicyUrl(config: SiteConfig): string {
  return `${policyUrl(config)}#${CORRECTIONS_ANCHOR}`
}

/** Page description, from the template's own meta description line. */
export function policyDescription(fields: PolicyFields): string {
  return `How ${fields.FACILITY_NAME} researches, writes, clinically reviews and updates the health information on ${fields.DOMAIN}.`
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * The policy body with its fields merged. Unfilled fields are left as
 * `{{FIELD}}`, which only a dev render can ever show — production never serves
 * the page until policyIsLive(). The template's leading instructions comment
 * is dropped; it is for developers, not readers.
 */
export function renderPolicyHtml(fields: PolicyFields): string {
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8').replace(/^\s*<!--[\s\S]*?-->\s*/, '')
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (token, name: string) => {
    // A field this code doesn't know means the master template changed shape;
    // fail the build rather than ship the raw token.
    if (!(name in fields)) throw new Error(`editorial-policy.html: unknown merge field ${token}`)
    const value = fields[name as keyof PolicyFields]
    return value ? escapeHtml(value) : token
  })
}
