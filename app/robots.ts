import type { MetadataRoute } from 'next'
import { getSiteConfig } from '@/lib/content'
import { assertWwwHost } from '@/lib/urls'

export default function robots(): MetadataRoute.Robots {
  const config = getSiteConfig()
  const base = assertWwwHost(config.site.url)
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
