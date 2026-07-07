import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageRenderer from '@/components/PageRenderer'
import CollectionGrid from '@/components/CollectionGrid'
import { getAllPages, getPage, getSiteConfig } from '@/lib/content'
import type { PageModel } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPages()
    .filter((p) => p.slug !== 'home')
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
  const path = '/' + slug.join('/')
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: { title: page.seo.title, description: page.seo.description, url: path },
  }
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
  const all = getAllPages()
  const byType = (t: string) => all.filter((p) => p.pageType === t)

  let afterHero: React.ReactNode = null
  if (page.pageType === 'hub-programs') {
    afterHero = (
      <CollectionGrid
        heading="Our Levels of Care"
        subheading="A full continuum of addiction treatment, tailored to where you are in recovery."
        pages={byType('program')}
        alt
      />
    )
  } else if (page.pageType === 'hub-conditions') {
    afterHero = (
      <CollectionGrid
        heading="Conditions We Treat"
        subheading="Specialized, evidence-based care for substance use and co-occurring disorders."
        pages={byType('condition')}
        alt
      />
    )
  } else if (page.pageType === 'hub-team') {
    afterHero = (
      <CollectionGrid
        heading="Our Team"
        subheading="Board-certified clinicians and leadership guiding your recovery."
        pages={byType('team')}
        alt
      />
    )
  } else if (page.pageType === 'hub-areas') {
    afterHero = (
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
  return (
    <PageRenderer
      page={page}
      config={config}
      showAccreditations={['program', 'condition', 'area', 'page'].includes(page.pageType)}
      showReviews={reviewsTypes.includes(page.pageType)}
      afterHero={afterHero}
    />
  )
}
