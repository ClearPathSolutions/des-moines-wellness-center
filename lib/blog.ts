/**
 * Blog content from Clarion Labs, fetched on the server.
 *
 * Why server-side: Clarion's public feed rejects browser requests from this
 * site. It pins access to an origin allowlist that does not include
 * desmoinesrecovery.com, so a client-side fetch gets
 *   403 {"detail":"origin not allowed for this site"}
 * and the embed renders "Blog is unavailable right now." Requests without an
 * `Origin` header — i.e. server-to-server — are served normally.
 *
 * Fetching here also makes posts crawlable: the previous embed rendered the
 * whole blog client-side at `?post=slug` URLs, so no post was indexable and
 * none appeared in the sitemap.
 *
 * Every function fails soft. A vendor outage must degrade the blog, never break
 * the build or take down the other 34 pages.
 */

import { getSiteConfig } from '@/lib/content'

const SITE_KEY = 'cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33'
const API = 'https://api.clarionlabs.ai'

/**
 * Blog images on this site's own domain. Clarion stores them and hands out
 * `https://api.clarionlabs.ai/blog/public/image/<key>` (or, once Clarion is told
 * this site proxies them, `<this site>/blog-images/<key>`). Both become
 * `/blog-images/<key>`, which next.config.mjs rewrites to Clarion's bytes route,
 * so the address a visitor, Google Images or a social card sees is this site's.
 */
export const IMAGE_PATH = '/blog-images'
const CLARION_IMAGE = `${API}/blog/public/image/`
const OWN_IMAGE = new RegExp(
  `https://(?:www\\.)?${new URL(getSiteConfig().site.url).hostname
    .replace(/^www\./, '')
    .replace(/\./g, '\\.')}(?=${IMAGE_PATH}/)`,
  'g'
)

export function onSiteImage(src: string): string {
  if (src.startsWith(CLARION_IMAGE)) return `${IMAGE_PATH}/${src.slice(CLARION_IMAGE.length)}`
  return src.replace(OWN_IMAGE, '')
}

function onSiteImages(html: string): string {
  return html.split(CLARION_IMAGE).join(`${IMAGE_PATH}/`).replace(OWN_IMAGE, '')
}

/** Re-fetch at most once an hour so new posts appear without a redeploy. */
export const BLOG_REVALIDATE_SECONDS = 3600

/**
 * The post list (sitemap, /blog/ index) refreshes faster, so a newly published
 * post is listed within minutes. There is no Clarion publish webhook to push
 * this instead; one feed call per 5 minutes per region is the cost.
 */
export const FEED_REVALIDATE_SECONDS = 300

export type BlogPostSummary = {
  slug: string
  title: string
  excerpt: string | null
  coverImageUrl: string | null
  /** Clarion's alt text for the cover, else the post title. Never empty. */
  coverImageAlt: string
  authorName: string | null
  publishedAt: string | null
  seo: { title: string | null; description: string | null }
}

export type BlogPost = BlogPostSummary & {
  bodyHtml: string
  /** Medical reviewer: Clarion's fields where populated, each missing field
   *  filled from DEFAULT_REVIEWER. Always set, so every post shows one. */
  reviewer: Reviewer
}

export type Reviewer = { name: string; credentials: string | null; url: string | null }

/**
 * The site's default medical reviewer. The client has overridden the editorial
 * package's "no default reviewer / reviewer only with a review date" rule: every
 * blog post, from every source, shows a medical reviewer. Clarion's
 * medically_reviewed_by* fields win where populated; each missing field falls
 * back to this individually. Posts that don't come from Clarion (the migrated
 * WordPress articles) get this outright. The URL is the live, slash-canonical
 * bio, so the byline link doesn't redirect.
 */
export const DEFAULT_REVIEWER: Reviewer = {
  name: 'Dr. Pamela Tambini',
  credentials: 'M.D.',
  url: 'https://www.desmoinesrecovery.com/team/pamela-tambini/',
}

/** Clarion's reviewer fields, each missing one filled from DEFAULT_REVIEWER. */
export function resolveReviewer(raw: {
  medically_reviewed_by?: unknown
  medically_reviewed_by_credentials?: unknown
  medically_reviewed_by_url?: unknown
}): Reviewer {
  return {
    name: str(raw.medically_reviewed_by) ?? DEFAULT_REVIEWER.name,
    credentials: str(raw.medically_reviewed_by_credentials) ?? DEFAULT_REVIEWER.credentials,
    url: str(raw.medically_reviewed_by_url) ?? DEFAULT_REVIEWER.url,
  }
}

type RawPost = {
  slug?: unknown
  title?: unknown
  excerpt?: unknown
  cover_image_url?: unknown
  cover_image_alt?: unknown
  author_name?: unknown
  published_at?: unknown
  body_html?: unknown
  medically_reviewed_by?: unknown
  medically_reviewed_by_credentials?: unknown
  medically_reviewed_by_url?: unknown
  seo_meta?: { title?: unknown; description?: unknown } | null
  meta_title?: unknown
}

const str = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() ? v : null

function toSummary(raw: RawPost): BlogPostSummary | null {
  const slug = str(raw.slug)
  const title = str(raw.title)
  if (!slug || !title) return null // unusable without these
  return {
    slug,
    title,
    excerpt: str(raw.excerpt),
    coverImageUrl: str(raw.cover_image_url) ? onSiteImage(str(raw.cover_image_url) as string) : null,
    coverImageAlt: str(raw.cover_image_alt)?.trim() || title,
    authorName: str(raw.author_name),
    publishedAt: str(raw.published_at),
    seo: {
      title: str(raw.seo_meta?.title) ?? str(raw.meta_title),
      description: str(raw.seo_meta?.description),
    },
  }
}

async function getJson(
  url: string,
  revalidate: number = BLOG_REVALIDATE_SECONDS
): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      // No Origin header is sent server-side, which is what makes this work.
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** All published posts, newest first. Empty array if the feed is unavailable. */
export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const data = await getJson(
    `${API}/blog/public/feed?site_key=${encodeURIComponent(SITE_KEY)}`,
    FEED_REVALIDATE_SECONDS
  )
  const posts = (data as { posts?: unknown } | null)?.posts
  if (!Array.isArray(posts)) return []
  return posts
    .map((p) => toSummary(p as RawPost))
    .filter((p): p is BlogPostSummary => p !== null)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

/** One post with its body. Null if missing or the feed is unavailable. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await getJson(
    `${API}/blog/public/post?site_key=${encodeURIComponent(SITE_KEY)}&slug=${encodeURIComponent(slug)}`
  )
  if (!data || typeof data !== 'object') return null
  const summary = toSummary(data as RawPost)
  if (!summary) return null
  const raw = data as RawPost
  return {
    ...summary,
    bodyHtml: onSiteImages(str(raw.body_html) ?? ''),
    reviewer: resolveReviewer(raw),
  }
}

/** e.g. "July 16, 2026". Empty string when the date is missing or unparseable. */
export function formatPostDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
