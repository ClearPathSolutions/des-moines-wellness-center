import type { Faq, SiteConfig } from '@/lib/types'
import { canonicalUrl } from '@/lib/urls'
import {
  correctionsPolicyUrl,
  policyDescription,
  policyFields,
  policyIsLive,
  policyUrl,
} from '@/lib/editorialPolicy'

/** Stable identifier for the organization entity, so page-level schema can
 *  reference the same business rather than describing a new one each time. */
export const orgId = (siteUrl: string) => `${siteUrl}/#organization`

/** Stable identifier for a person, keyed by their bio page, so a byline's
 *  author or reviewer and the Person node on the bio page are one entity. */
export const personId = (bioUrl: string) => `${bioUrl}#person`

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
    /* The official profiles for this business. `sameAs` is how a search engine
       ties them to this entity rather than treating them as unrelated pages, so
       these are the same URLs the footer links — one list in site.config.json,
       used twice. Omitted entirely when empty: an empty array is a weaker
       signal than saying nothing. */
    ...(site.social?.length ? { sameAs: site.social.map((s) => s.href) } : {}),
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
    /* Merged into this node rather than emitted as a second Organization, which
       would split the entity. Absent until the policy page is live, so the
       graph never points at a URL that 404s. */
    ...(policyIsLive(config)
      ? {
          publishingPrinciples: policyUrl(config),
          correctionsPolicy: correctionsPolicyUrl(config),
        }
      : {}),
  }
  return <JsonLdScript data={data} />
}

/** WebPage schema for /editorial-policy/. `lastReviewed` is the ISO date. */
export function EditorialPolicyJsonLd({ config }: { config: SiteConfig }) {
  const { site } = config
  const fields = policyFields(config)
  const lastReviewed = config.editorialPolicy?.lastReviewed?.trim()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${policyUrl(config)}#webpage`,
    url: policyUrl(config),
    name: 'Editorial Policy',
    description: policyDescription(fields),
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: canonicalUrl(site.url, '/'),
      name: site.name,
    },
    about: { '@id': orgId(site.url) },
    ...(lastReviewed ? { lastReviewed } : {}),
    inLanguage: 'en-US',
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
  credentials,
}: {
  name: string
  jobTitle?: string | null
  image?: string | null
  url: string
  siteUrl: string
  siteName: string
  description?: string | null
  /** Post-nominals as published in the staff bios, e.g. "MSN, RN". Only
   *  real, verifiable credentials — leave unset rather than guess. */
  credentials?: string | null
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(url),
    name,
    ...(credentials ? { honorificSuffix: credentials } : {}),
    ...(jobTitle ? { jobTitle } : {}),
    ...(image ? { image } : {}),
    ...(description ? { description } : {}),
    url,
    worksFor: { '@id': orgId(siteUrl), name: siteName },
  }
  return <JsonLdScript data={data} />
}

export type SchemaPerson = { name: string; bioUrl?: string | null; credentials?: string | null }

/** A byline person as schema: a reference to their bio page's Person node when
 *  they have one, otherwise a bare named Person. */
function personRef(p: SchemaPerson) {
  return {
    ...(p.bioUrl ? { '@id': personId(p.bioUrl), url: p.bioUrl } : {}),
    '@type': 'Person',
    name: p.name,
    ...(p.credentials ? { honorificSuffix: p.credentials } : {}),
  }
}

/**
 * Article schema for blog posts: a MedicalWebPage wrapping a BlogPosting
 * (editorial policy package, clinical-article.jsonld).
 *
 * `reviewedBy` and `lastReviewed` are emitted only when the post has both a
 * reviewer and a review date of its own — never a site-wide default.
 */
export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  reviewer,
  lastReviewed,
  url,
  siteName,
  siteUrl,
}: {
  headline: string
  description?: string | null
  image?: string | null
  datePublished?: string | null
  dateModified?: string | null
  author?: SchemaPerson | null
  reviewer?: SchemaPerson | null
  /** YYYY-MM-DD */
  lastReviewed?: string | null
  url: string
  siteName: string
  siteUrl: string
}) {
  const reviewed = reviewer && lastReviewed
  const publisher = { '@id': orgId(siteUrl), name: siteName }
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: headline,
        ...(description ? { description } : {}),
        ...(reviewed ? { lastReviewed, reviewedBy: personRef(reviewer) } : {}),
        publisher,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline,
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        mainEntityOfPage: { '@id': `${url}#webpage` },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
        author: author ? personRef(author) : publisher,
        publisher,
      },
    ],
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
