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

const SITE_KEY = 'cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33'
const API = 'https://api.clarionlabs.ai'

/** Re-fetch at most once an hour so new posts appear without a redeploy. */
export const BLOG_REVALIDATE_SECONDS = 3600

export type BlogPostSummary = {
  slug: string
  title: string
  excerpt: string | null
  coverImageUrl: string | null
  authorName: string | null
  publishedAt: string | null
  seo: { title: string | null; description: string | null }
}

export type BlogPost = BlogPostSummary & {
  bodyHtml: string
}

type RawPost = {
  slug?: unknown
  title?: unknown
  excerpt?: unknown
  cover_image_url?: unknown
  author_name?: unknown
  published_at?: unknown
  body_html?: unknown
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
    coverImageUrl: str(raw.cover_image_url),
    authorName: str(raw.author_name),
    publishedAt: str(raw.published_at),
    seo: {
      title: str(raw.seo_meta?.title) ?? str(raw.meta_title),
      description: str(raw.seo_meta?.description),
    },
  }
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      // No Origin header is sent server-side, which is what makes this work.
      headers: { Accept: 'application/json' },
      next: { revalidate: BLOG_REVALIDATE_SECONDS },
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
    `${API}/blog/public/feed?site_key=${encodeURIComponent(SITE_KEY)}`
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
  return { ...summary, bodyHtml: str((data as RawPost).body_html) ?? '' }
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
