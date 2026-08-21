import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { getSiteConfig } from '@/lib/content'
import SessionTracker from '@/components/SessionTracker'

// Deliberately not preloaded. Preloading both faces put 85 KB of high-priority
// font requests ahead of the hero image, which is the LCP element on every page.
// Measured (median of 5 Lighthouse mobile runs, CSS inlined, third parties
// blocked): preloading both scores 93 with LCP 3029 ms; preloading only the body
// face scores 96 with LCP 2559 ms.
//
// Headings are the right thing to give up, because `display: swap` paints them
// immediately in a size-matched fallback and adjustFontFallback keeps the swap
// from shifting layout — CLS stays at 0.000. Do not add `preload: true` here
// without re-measuring LCP.
const heading = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
  preload: false,
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const config = getSiteConfig()

/** Google Tag Manager container. Every marketing tag the site loads through GTM
 *  — GA4, Ads conversions, remarketing — is configured inside the container, not
 *  here, so this is the only place the site itself needs to know about it.
 *
 *  Worth knowing when adding tags: the paths on this site are themselves
 *  sensitive. A pageview for /what-we-treat/fentanyl-rehab-des-moines/ tells the
 *  receiving system what a visitor is seeking treatment for, which is why
 *  Referrer-Policy is locked down in next.config.mjs. Anything configured in the
 *  container gets that path as page_location regardless, so do not add tags that
 *  forward form fields, phone numbers or any other identifier alongside it. */
const GTM_CONTAINER_ID = 'GTM-WH4BQ54G'

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    // Fallback only — every page now supplies its own absolute title, the
    // homepage included. Names mental health so a future page that forgets its
    // own title still reflects both halves of what the facility treats.
    default: `${config.site.name} | Addiction & Mental Health Treatment in Des Moines, Iowa`,
    template: `%s | ${config.site.name}`,
  },
  description: config.site.tagline,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: config.site.name,
    locale: 'en_US',
    // Appendix D regression guard: seven other facilities are being corrected
    // against this build's og:url, so it must equal the page's own canonical on
    // every page — including the homepage, which inherits from here.
    url: '/',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: config.site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
  // Google Search Console ownership proof. Emitted as
  // <meta name="google-site-verification" ...> on every page. Public by design —
  // it proves control of the domain and grants no access on its own.
  //
  // Keep this until the property is verified by another method (DNS TXT is the
  // more durable option, since it survives any change of host or framework).
  // Removing it can un-verify the property and cut off Search Console data.
  verification: {
    google: 'O-fkQZR9RbgY6BX1WFO0hfCycwvtezkEFkDFAxypK5A',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <head>
        {/* Site-wide call tracking (t.js), CTM account 264810 — loaded on every
            page from the root layout so the campaign landing pages are covered
            too. Deliberately not `lazyOnload`: it does the number swap, which
            has to happen before a visitor reads the number off the page.

            It also establishes the CTM session that lib/session.ts reads
            (`__ctm.config.sid` / the `__ctmid` cookie) and the `__ctm_cvars`
            channel it writes attribution back into, so a form lead and a phone
            call from the same visit reconcile to one session. */}
        <Script src="https://264810.tctm.co/t.js" strategy="afterInteractive" />
        {/* Google Tag Manager. GTM's own snippet, kept intact: it pushes gtm.start
            before injecting gtm.js, and that ordering is what lets the container
            measure its own load time. Splitting it into a dataLayer push plus a
            plain src= would work but breaks that. */}
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
        </Script>
      </head>
      <body>
        {/* GTM's no-JavaScript fallback. Must be the first thing in the body, and
            it is inert markup rather than a Script, so next/script does not apply. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* Header, main and footer are rendered per route group, not here — see
            app/(site)/layout.tsx. A root layout sits above every page and cannot
            vary by route without reading headers(), which would opt all 48
            static pages into dynamic rendering. Campaign landing pages need
            different chrome, so the chrome moved down a level. */}
        {children}
        {/* Chat widget. `lazyOnload` because it is purely interactive — nothing
            above the fold depends on it, and it competes with our own JS for
            bandwidth during hydration. */}
        <Script
          src="https://www.clarionlabs.ai/widget.v1.js"
          data-site-key="cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33"
          data-api="https://api.clarionlabs.ai"
          data-color="#2D5A3D"
          data-header-text="#ffffff"
          data-title="Chat with our team"
          data-font="var(--font-body), system-ui, sans-serif"
          data-position="right"
          strategy="lazyOnload"
        />
        {/* Session + attribution capture for form submissions. This replaces
            what forms-capture.v1.js used to do here: that script was removed
            because the insurance form now submits through /api/verify-insurance,
            and while both were active every submission was sent twice. Re-adding
            it would resurrect the duplicate. */}
        <SessionTracker />
      </body>
    </html>
  )
}
