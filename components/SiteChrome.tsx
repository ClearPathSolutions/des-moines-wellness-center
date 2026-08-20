import type { SiteConfig } from '@/lib/types'
import { getSiteConfig } from '@/lib/content'
import Header from './Header'
import Footer from './Footer'

type Props = {
  children: React.ReactNode
  /** Overrides the site-wide number in the header and footer.
   *
   *  Campaign landing pages are told which call-tracking number to display, and
   *  that number has to be the *only* one on the page or calls attribute to the
   *  wrong source — a visitor who dials the main number instead has their call
   *  credited to nothing. The header renders the number twice (desktop and the
   *  mobile menu) and the footer once, and all three read from site config, so
   *  the override is applied here rather than in three call sites. */
  phone?: string
  phoneHref?: string
}

/** Skip link, header, main and footer — everything wrapped around a page.
 *
 *  This lives in a component rather than in the root layout so that a route can
 *  render it with different props, or not render it at all. The root layout is
 *  above every page in the tree and cannot vary per route without opting the
 *  whole site out of static generation. */
export default function SiteChrome({ children, phone, phoneHref }: Props) {
  const config = getSiteConfig()
  const displayPhone = phone ?? config.site.phone
  const href = phoneHref ?? config.site.phoneHref

  const scoped: SiteConfig =
    phone || phoneHref
      ? { ...config, site: { ...config.site, phone: displayPhone, phoneHref: href } }
      : config

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header
        nav={config.nav.primary}
        phone={displayPhone}
        phoneHref={href}
        siteName={config.site.name}
      />
      <main id="main">{children}</main>
      <Footer config={scoped} />
    </>
  )
}
