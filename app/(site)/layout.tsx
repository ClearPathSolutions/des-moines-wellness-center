import SiteChrome from '@/components/SiteChrome'
import LocalBusinessJsonLd from '@/components/JsonLd'
import { getSiteConfig } from '@/lib/content'

/** Every page of the site proper: header, footer and the LocalBusiness graph.
 *
 *  Campaign landing pages live outside this group. They render their own chrome
 *  with their own call-tracking number, and deliberately emit no LocalBusiness
 *  markup — a second telephone in the graph would contradict the NAP that the
 *  rest of the site, Google Business Profile and directory listings all agree
 *  on, and a noindex page gains nothing from structured data anyway. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = getSiteConfig()
  return (
    <SiteChrome>
      {children}
      <LocalBusinessJsonLd config={config} />
    </SiteChrome>
  )
}
