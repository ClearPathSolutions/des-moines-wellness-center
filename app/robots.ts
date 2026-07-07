import type { MetadataRoute } from 'next'
import { getSiteConfig } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  const config = getSiteConfig()
  const base = config.site.url.replace(/\/$/, '')
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
