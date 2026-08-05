import type { MetadataRoute } from 'next'
import { getAllPages, getSiteConfig } from '@/lib/content'
import { getBlogPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSiteConfig()
  const base = config.site.url.replace(/\/$/, '')

  const pages: MetadataRoute.Sitemap = getAllPages().map((p) => ({
    url: p.slug === 'home' ? base : `${base}/${p.slug}`,
    changeFrequency: 'monthly',
    priority: p.slug === 'home' ? 1 : 0.7,
  }))

  // Blog posts live in Clarion, so they were previously absent from the sitemap
  // entirely. If the feed is unavailable this contributes nothing rather than
  // failing the build.
  const posts = await getBlogPosts()
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...pages, ...postEntries]
}
