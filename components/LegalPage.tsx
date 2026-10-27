import type { Metadata } from 'next'
import Hero from './Hero'
import { getSiteConfig } from '@/lib/content'
import { LEGAL_PAGES, renderLegalHtml, type LegalSlug } from '@/lib/legalPages'

/** Metadata for a legal page, in the site's "<Page> | <Facility>" title form. */
export function legalMetadata(slug: LegalSlug, description: string): Metadata {
  const { site } = getSiteConfig()
  const { title, path } = LEGAL_PAGES[slug]
  const full = `${title} | ${site.name}`
  return {
    title: { absolute: full },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description,
      url: path,
      // Next replaces the layout's openGraph rather than merging it.
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: full }],
    },
  }
}

/**
 * Shell for the legal pages: the same hero the migrated privacy policy had
 * (eyebrow, headline, call and verify-insurance CTAs), then the merged template
 * in the editorial policy's prose styling. See lib/legalPages.ts.
 */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const config = getSiteConfig()
  const { site } = config
  const html = renderLegalHtml(slug, config)

  return (
    <>
      <Hero
        hero={{
          eyebrow: `${site.name} – Iowa`,
          headline: LEGAL_PAGES[slug].title,
          primaryCta: { label: site.phone, href: site.phoneHref },
          secondaryCta: { label: 'Verify Insurance', href: '/verify-insurance' },
        }}
      />
      <section className="section">
        <div className="container-page">
          <div
            className="prose-brand prose-post mx-auto max-w-3xl"
            // First-party template from the legal pages package; the only
            // interpolated values are escaped site-config fields.
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </>
  )
}
