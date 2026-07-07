import type { MetadataRoute } from 'next'
import { getAllPages, getSiteConfig } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSiteConfig()
  const base = config.site.url.replace(/\/$/, '')
  return getAllPages().map((p) => ({
    url: p.slug === 'home' ? base : `${base}/${p.slug}`,
    changeFrequency: 'monthly',
    priority: p.slug === 'home' ? 1 : 0.7,
  }))
}
