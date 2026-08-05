import type { Faq, SiteConfig } from '@/lib/types'
import { canonicalUrl } from '@/lib/urls'

/** Stable identifier for the organization entity, so page-level schema can
 *  reference the same business rather than describing a new one each time. */
export const orgId = (siteUrl: string) => `${siteUrl}/#organization`

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function LocalBusinessJsonLd({ config }: { config: SiteConfig }) {
  const { site } = config
  const data = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'MedicalClinic'],
    '@id': orgId(site.url),
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og.jpg`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.687,
      longitude: -93.708,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: [
      { '@type': 'City', name: 'Des Moines' },
      { '@type': 'City', name: 'West Des Moines' },
      { '@type': 'City', name: 'Ankeny' },
      { '@type': 'AdministrativeArea', name: 'Polk County' },
    ],
    medicalSpecialty: 'Addiction Medicine',
    description: site.tagline,
  }
  return <JsonLdScript data={data} />
}

/** Marks up on-page FAQ accordions so they can qualify for FAQ rich results.
 *  Renders nothing when a page has no FAQs. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const usable = faqs.filter((f) => f.q?.trim() && f.a?.trim())
  if (!usable.length) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return <JsonLdScript data={data} />
}

/** Breadcrumb trail for nested pages (/programs/x, /what-we-treat/x, /blog/x).
 *  `trail` excludes Home, which is prepended here. */
export function BreadcrumbJsonLd({
  siteUrl,
  trail,
}: {
  siteUrl: string
  trail: { name: string; path: string }[]
}) {
  if (!trail.length) return null
  const items = [{ name: 'Home', path: '/' }, ...trail]
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      // Same slash-canonical form as the page's own canonical (T-03).
      item: canonicalUrl(siteUrl, item.path),
    })),
  }
  return <JsonLdScript data={data} />
}

/** Person schema for a team member's own page. */
export function PersonJsonLd({
  name,
  jobTitle,
  image,
  url,
  siteUrl,
  siteName,
  description,
}: {
  name: string
  jobTitle?: string | null
  image?: string | null
  url: string
  siteUrl: string
  siteName: string
  description?: string | null
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(jobTitle ? { jobTitle } : {}),
    ...(image ? { image } : {}),
    ...(description ? { description } : {}),
    url,
    worksFor: { '@id': orgId(siteUrl), name: siteName },
  }
  return <JsonLdScript data={data} />
}

/** Article schema for blog posts. */
export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  authorName,
  url,
  siteName,
  siteUrl,
}: {
  headline: string
  description?: string | null
  image?: string | null
  datePublished?: string | null
  authorName?: string | null
  url: string
  siteName: string
  siteUrl: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : { '@id': orgId(siteUrl), name: siteName },
    publisher: { '@id': orgId(siteUrl), name: siteName },
  }
  return <JsonLdScript data={data} />
}

/** Tells search engines what a condition or program page is *about*, which the
 *  site-wide business schema alone does not convey. */
export function MedicalPageJsonLd({
  kind,
  name,
  description,
  url,
  siteUrl,
  siteName,
}: {
  kind: 'condition' | 'program'
  name: string
  description?: string | null
  url: string
  siteUrl: string
  siteName: string
}) {
  const data =
    kind === 'condition'
      ? {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name,
          ...(description ? { description } : {}),
          url,
          about: { '@type': 'MedicalCondition', name },
          audience: { '@type': 'Patient' },
          provider: { '@id': orgId(siteUrl), name: siteName },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'MedicalTherapy',
          name,
          ...(description ? { description } : {}),
          url,
          provider: { '@id': orgId(siteUrl), name: siteName },
        }
  return <JsonLdScript data={data} />
}
