import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { getSiteConfig } from '@/lib/content'

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
        {/* Site-wide call tracking (t.js) — loaded on every page. */}
        <Script src="https://264810.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body>
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
        {/* forms-capture.v1.js was removed: the insurance form now submits
            through /api/verify-insurance, so the capture script had no form to
            attach to. While both were active every submission was sent twice. */}
      </body>
    </html>
  )
}
