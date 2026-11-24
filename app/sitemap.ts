import type { MetadataRoute } from 'next'
import { getAllPages, getSiteConfig } from '@/lib/content'
import { getBlogPosts } from '@/lib/blog'
import { assertWwwHost, canonicalUrl, pathForSlug } from '@/lib/urls'
import { EDITORIAL_POLICY_PATH, policyIsLive } from '@/lib/editorialPolicy'
import { LEGAL_PAGES } from '@/lib/legalPages'

// Rendered per request, like the other Quadrant sites. As ISR (inherited from
// the feed fetch's revalidate) every background regeneration since Aug 23 threw
// ENOENT on content/site.config.json, so Vercel served the build-time copy
// forever and posts published after a deploy never reached the sitemap. The
// feed fetch keeps its own short cache (FEED_REVALIDATE_SECONDS in lib/blog.ts),
// and next.config.mjs traces content/ into this function.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSiteConfig()
  const base = assertWwwHost(config.site.url)

  // Slash-canonical, matching the served form and each page's own canonical
  // (T-03). Previously every entry was slashless against slash-canonical
  // production, so 100% of the sitemap would have redirected at cutover.
  const pages: MetadataRoute.Sitemap = getAllPages().map((p) => ({
    url: canonicalUrl(base, pathForSlug(p.slug)),
    changeFrequency: 'monthly',
    priority: p.slug === 'home' ? 1 : 0.7,
  }))

  // Blog posts live in Clarion, so they were previously absent from the sitemap
  // entirely. If the feed is unavailable this contributes nothing rather than
  // failing the build.
  // Posts that also exist as local content pages are already listed above.
  const localSlugs = new Set(getAllPages().map((p) => p.slug))
  const posts = (await getBlogPosts()).filter((p) => !localSlugs.has(`blog/${p.slug}`))
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: canonicalUrl(base, `/blog/${p.slug}`),
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // A code route, not a content page, and only listed once it is live — the CI
  // sitemap check requires every entry to return 200.
  const policy: MetadataRoute.Sitemap = policyIsLive(config)
    ? [{ url: canonicalUrl(base, EDITORIAL_POLICY_PATH), changeFrequency: 'yearly', priority: 0.4 }]
    : []

  // Privacy policy, NPP, SMS terms and terms of service are code routes too (lib/legalPages.ts).
  const legal: MetadataRoute.Sitemap = Object.values(LEGAL_PAGES).map((l) => ({
    url: canonicalUrl(base, l.path),
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...pages, ...legal, ...policy, ...postEntries]
}
