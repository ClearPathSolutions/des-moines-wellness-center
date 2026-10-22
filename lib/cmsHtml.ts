/**
 * Post-processing for blog body HTML authored in Clarion's CMS.
 *
 * Clarion stamps `rel="noopener noreferrer nofollow"` on every link it emits,
 * including in-page anchors and links back to this site, writes internal links
 * as absolute URLs on whichever host the author pasted (apex or www, slashed or
 * not), and leaves inline images with an empty or missing alt. A site audit
 * flagged all three: nofollowed internal links, internal links that redirect,
 * and images without alt text. This normalises the HTML before render:
 *
 *  - internal links (own host or root-relative) become root-relative paths in
 *    the site's trailing-slash convention, without nofollow;
 *  - internal links to paths in `missingPaths` (posts that exist on sister
 *    sites but not this one) are pointed at `fallbackPath`;
 *  - external links keep `noopener noreferrer` but drop `nofollow` — they are
 *    editorial citations (NIDA, SAMHSA, ASAM...), not untrusted links;
 *  - `<img>` with no or empty alt gets `fallbackAlt` (the post title).
 *
 * Pure string transform; safe to run on server-rendered HTML.
 */

export type CmsHtmlOptions = {
  /** Canonical site origin, e.g. https://www.example.com */
  siteUrl: string
  /** Whether the site's canonical paths end in a slash. */
  trailingSlash: boolean
  /** Alt text for content images that have none. */
  fallbackAlt: string
  /** Root-relative paths (any slash form) known not to exist on this site. */
  missingPaths?: string[]
  /** Predicate for internal paths that don't exist on this site. */
  isMissing?: (path: string) => boolean
  /** Where links to `missingPaths` / `isMissing` paths should go instead. */
  fallbackPath?: string
  /** Old external URL -> replacement URL ('' to unlink). */
  externalRemap?: Record<string, string>
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const bareHost = (h: string) => h.toLowerCase().replace(/^www\./, '')

function normalisePath(path: string, trailingSlash: boolean): string {
  // Leave file-like paths (/foo.pdf) alone.
  if (path === '' || path === '/') return '/'
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return path
  const trimmed = path.replace(/\/+$/, '')
  return trailingSlash ? `${trimmed}/` : trimmed
}

function stripNofollow(tag: string): string {
  return tag.replace(/\srel=("|')([^"']*)\1/i, (_m, q: string, val: string) => {
    const kept = val
      .split(/\s+/)
      .filter((t) => t && t.toLowerCase() !== 'nofollow')
    return kept.length ? ` rel=${q}${kept.join(' ')}${q}` : ''
  })
}

export function cleanCmsHtml(html: string, opts: CmsHtmlOptions): string {
  if (!html) return html
  const own = bareHost(new URL(opts.siteUrl).hostname)
  const missing = new Set(
    (opts.missingPaths ?? []).map((p) => p.replace(/\/+$/, '') || '/')
  )
  const remap = opts.externalRemap ?? {}

  let out = html.replace(/<a\b[^>]*>/gi, (tag) => {
    let t = stripNofollow(tag)
    const m = t.match(/\shref=("|')([^"']*)\1/i)
    if (!m) return t
    const href = m[2].trim()
    if (!href || href.startsWith('#') || /^(mailto|tel|sms):/i.test(href)) return t

    let next: string | null = null
    try {
      const u = new URL(href, opts.siteUrl)
      const isOwn = /^https?:$/.test(u.protocol) && bareHost(u.hostname) === own
      if (isOwn) {
        let path = normalisePath(u.pathname, opts.trailingSlash)
        if (missing.has(path.replace(/\/+$/, '') || '/') || opts.isMissing?.(path)) {
          path = normalisePath(opts.fallbackPath ?? '/blog', opts.trailingSlash)
          next = path
        } else {
          next = `${path}${u.search}${u.hash}`
        }
        // Internal links open in the same tab.
        t = t.replace(/\starget=("|')[^"']*\1/i, '')
      } else if (Object.prototype.hasOwnProperty.call(remap, href)) {
        next = remap[href]
      }
    } catch {
      return t
    }
    if (next === null) return t
    if (next === '') return '<a data-unlinked="true">'
    return t.replace(m[0], ` href="${escapeAttr(next)}"`)
  })
  // Unlinked citations render as plain text.
  out = out.replace(/<a data-unlinked="true">([\s\S]*?)<\/a>/gi, '$1')

  const alt = escapeAttr(opts.fallbackAlt)
  out = out.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\salt=("|')\s*\1/i.test(tag)) return tag.replace(/\salt=("|')\s*\1/i, ` alt="${alt}"`)
    if (/\salt=/i.test(tag)) return tag
    return tag.replace(/^<img\b/i, `<img alt="${alt}"`)
  })
  return out
}
