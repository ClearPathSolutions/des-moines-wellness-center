import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageRenderer from '@/components/PageRenderer'
import CollectionGrid from '@/components/CollectionGrid'
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  MedicalPageJsonLd,
  PersonJsonLd,
} from '@/components/JsonLd'
import { getAllPages, getPage, getSiteConfig } from '@/lib/content'
import { canonicalPath, canonicalUrl } from '@/lib/urls'
import { resolveImage } from '@/lib/images'
import type { Faq, PageModel } from '@/lib/types'

export const dynamicParams = false

// `/` and everything under `/blog/` have dedicated routes — the blog reads from
// Clarion's feed and revalidates, and migrated articles are served by
// app/blog/[slug]. Everything here stays fully static.
function hasOwnRoute(slug: string) {
  return slug === 'home' || slug === 'blog' || slug.startsWith('blog/')
}

export function generateStaticParams() {
  return getAllPages()
    .filter((p) => !hasOwnRoute(p.slug))
    .map((p) => ({ slug: p.slug.split('/') }))
}

function loadPage(slugArr: string[]): PageModel | null {
  return getPage(slugArr.join('/'))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = loadPage(slug)
  if (!page) return {}
  // Slash-canonical, matching what the server actually serves (T-03).
  const path = canonicalPath('/' + slug.join('/'))
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: { title: page.seo.title, description: page.seo.description, url: path },
  }
}

/** Every FAQ on the page, in render order, for FAQPage markup. */
function collectFaqs(page: PageModel): Faq[] {
  return (page.sections ?? []).flatMap((s) => s.faqs ?? [])
}

/** Breadcrumb trail (excluding Home) built from the slug's ancestors, labelled
 *  with each ancestor's own headline so the crumb text matches the page. */
function buildTrail(page: PageModel, all: PageModel[]) {
  const parts = page.slug.split('/')
  return parts.map((_, i) => {
    const slug = parts.slice(0, i + 1).join('/')
    const match = all.find((p) => p.slug === slug)
    return {
      name: match?.hero?.headline ?? parts[i].replace(/-/g, ' '),
      path: `/${slug}`,
    }
  })
}

/** Team pages store the job title only in the portrait's alt text, formatted
 *  "Name, CREDS - Job Title". */
function jobTitleFrom(alt: string | undefined, headline: string) {
  if (!alt) return null
  const tail = alt.slice(headline.length).replace(/^\s*[-–—,]\s*/, '').trim()
  return tail || null
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const page = loadPage(slug)
  if (!page) notFound()

  const config = getSiteConfig()
  const { site } = config
  const all = getAllPages()
  const byType = (t: string) => all.filter((p) => p.pageType === t)
  const url = canonicalUrl(site.url, '/' + slug.join('/'))

  // T-18(c) rows 486/495: hub collection grids render BELOW the page's own
  // opening section, not above it.
  let collection: React.ReactNode = null
  if (page.pageType === 'hub-programs') {
    collection = (
      <CollectionGrid
        heading="Our Levels of Care"
        subheading="A full continuum of addiction treatment, tailored to where you are in recovery."
        pages={byType('program')}
        alt
      />
    )
  } else if (page.pageType === 'hub-conditions') {
    collection = (
      <CollectionGrid
        heading="Conditions We Treat"
        subheading="Specialized, evidence-based care for substance use and co-occurring disorders."
        pages={byType('condition')}
        alt
      />
    )
  } else if (page.pageType === 'hub-team') {
    collection = (
      <CollectionGrid
        heading="Our Team"
        subheading="Board-certified clinicians and leadership guiding your recovery."
        pages={byType('team')}
        alt
      />
    )
  } else if (page.pageType === 'hub-areas') {
    collection = (
      <CollectionGrid
        heading="Communities We Serve"
        subheading="Accredited detox and rehab within reach of Central Iowa."
        pages={byType('area')}
        alt
      />
    )
  }

  const reviewsTypes = [
    'program', 'condition', 'area', 'page',
    'hub-programs', 'hub-conditions', 'hub-team', 'hub-areas',
  ]

  const faqs = collectFaqs(page)
  const trail = buildTrail(page, all)
  const portrait = resolveImage(page.hero?.image?.src)

  return (
    <>
      <PageRenderer
        page={page}
        config={config}
        showAccreditations={['program', 'condition', 'area', 'page'].includes(page.pageType)}
        showReviews={reviewsTypes.includes(page.pageType)}
        // T-12: the location map belongs on every page a prospective patient
        // might use to work out where we are. Excludes legal and blog pages.
        showMap={['program', 'condition', 'area', 'page', 'hub-programs', 'hub-conditions', 'hub-areas'].includes(page.pageType)}
        afterFirstSection={collection}
      />

      <FaqJsonLd faqs={faqs} />
      {/* Only nested pages get breadcrumbs; a single crumb adds nothing. */}
      {trail.length > 1 ? <BreadcrumbJsonLd siteUrl={site.url} trail={trail} /> : null}

      {page.pageType === 'team' ? (
        <PersonJsonLd
          name={page.hero.headline}
          jobTitle={jobTitleFrom(page.hero.image?.alt, page.hero.headline)}
          image={portrait ? `${site.url}${portrait.out}` : null}
          description={page.hero.subhead || null}
          url={url}
          siteUrl={site.url}
          siteName={site.name}
        />
      ) : null}

      {page.pageType === 'condition' || page.pageType === 'program' ? (
        <MedicalPageJsonLd
          kind={page.pageType}
          name={page.hero.headline}
          description={page.seo.description}
          url={url}
          siteUrl={site.url}
          siteName={site.name}
        />
      ) : null}
    </>
  )
}
