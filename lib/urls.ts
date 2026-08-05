/**
 * One source of truth for URL form. T-03.
 *
 * Production (`desmoinesrecovery.com`) is slash-canonical: `/about` 301s to
 * `/about/`. The build previously emitted slashless canonicals, og:urls and
 * sitemap entries pointing at production hostnames, so every sitemap entry
 * would have redirected on the target domain the moment it went live.
 *
 * `trailingSlash: true` in next.config.mjs makes the *served* form match.
 * These helpers make the *declared* form match too — canonical, og:url and
 * sitemap must all be byte-identical to the served URL, and seven other
 * facilities in the portfolio are being corrected against this build's og:url
 * as the reference model, so it has to stay right.
 */

/** Canonical path form: leading slash, exactly one trailing slash. */
export function canonicalPath(path: string): string {
  if (!path || path === '/') return '/'
  const withLeading = path.startsWith('/') ? path : `/${path}`
  const trimmed = withLeading.replace(/\/+$/, '')
  return `${trimmed}/`
}

/** Absolute canonical URL for a path, e.g. https://host/about/ */
export function canonicalUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${canonicalPath(path)}`
}

/** Path for a content page's slug ('home' -> '/'). */
export function pathForSlug(slug: string): string {
  return slug === 'home' ? '/' : canonicalPath(`/${slug}`)
}
