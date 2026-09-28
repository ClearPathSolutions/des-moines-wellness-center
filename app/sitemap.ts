import type { MetadataRoute } from 'next'
import { getAllPages, getSiteConfig } from '@/lib/content'
import { getBlogPosts } from '@/lib/blog'
import { canonicalUrl, pathForSlug } from '@/lib/urls'
import { EDITORIAL_POLICY_PATH, policyIsLive } from '@/lib/editorialPolicy'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSiteConfig()
  const base = config.site.url

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
  const posts = await getBlogPosts()
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

  return [...pages, ...policy, ...postEntries]
}
