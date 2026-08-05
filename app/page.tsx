import PageRenderer from '@/components/PageRenderer'
import { FaqJsonLd } from '@/components/JsonLd'
import { getPage, getSiteConfig } from '@/lib/content'
import { notFound } from 'next/navigation'

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
