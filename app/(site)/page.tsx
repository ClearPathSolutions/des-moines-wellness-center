import type { Metadata } from 'next'
import PageRenderer from '@/components/PageRenderer'
import { FaqJsonLd } from '@/components/JsonLd'
import { getPage, getSiteConfig } from '@/lib/content'
import { canonicalPath } from '@/lib/urls'
import { notFound } from 'next/navigation'

/**
 * The homepage had no metadata export, so it silently fell back to the layout's
 * generic default title and used `site.tagline` as its description — 34
 * characters, well under the ~120 search engines will show. Meanwhile the
 * hand-written `seo` block in content/pages/home.json was never rendered.
 * Every other page reads its own seo; the most important one now does too.
 */
export function generateMetadata(): Metadata {
  const page = getPage('home')
  if (!page) return {}
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: canonicalPath('/') },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: canonicalPath('/'),
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: page.hero?.headline ?? page.seo.title }],
    },
  }
}

export default function HomePage() {
  const page = getPage('home')
  if (!page) notFound()
  const config = getSiteConfig()
  const faqs = (page.sections ?? []).flatMap((s) => s.faqs ?? [])
  return (
    <>
      <PageRenderer
        page={page}
        config={config}
        showAccreditations
        showReviews
        showMap
        // T-18(c) row 604: swap the accreditation block with the reviews
        // block. The accreditation section moved down in home.json; reviews
        // take its place directly under the opening highlights row.
        reviewsAfter={0}
      />
      <FaqJsonLd faqs={faqs} />
    </>
  )
}
