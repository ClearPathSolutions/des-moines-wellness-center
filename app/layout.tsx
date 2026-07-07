import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocalBusinessJsonLd from '@/components/JsonLd'
import { getSiteConfig } from '@/lib/content'

const heading = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
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
    default: `${config.site.name} | Alcohol & Drug Rehab in Des Moines, Iowa`,
    template: `%s | ${config.site.name}`,
  },
  description: config.site.tagline,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: config.site.name,
    locale: 'en_US',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: config.site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header
          nav={config.nav.primary}
          phone={config.site.phone}
          phoneHref={config.site.phoneHref}
          siteName={config.site.name}
        />
        <main id="main">{children}</main>
        <Footer config={config} />
        <LocalBusinessJsonLd config={config} />
        <Script
          src="https://www.clarionlabs.ai/widget.v1.js"
          data-site-key="cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33"
          data-api="https://api.clarionlabs.ai"
          data-color="#2D5A3D"
          data-header-text="#ffffff"
          data-title="Chat with our team"
          data-font="var(--font-body), system-ui, sans-serif"
          data-position="right"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
