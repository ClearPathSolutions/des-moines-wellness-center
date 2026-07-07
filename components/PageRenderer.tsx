import Hero from './Hero'
import Section from './Section'
import TrustindexReviews from './TrustindexReviews'
import type { PageModel, SiteConfig, Section as SectionType } from '@/lib/types'

/** A heading-only prose/team-bio block renders as a lonely title — drop it so the
 *  page rhythm stays even and the alternating backgrounds don't collide. */
function isRenderable(s: SectionType): boolean {
  if (s.kind !== 'prose' && s.kind !== 'team-bio') return true
  const body = (s.body ?? []).filter(Boolean)
  const items = (s.items ?? []).filter((i) => i.title || i.text)
  return body.length > 0 || items.length > 0 || !!s.image?.src
}

type Props = {
  page: PageModel
  config: SiteConfig
  showAccreditations?: boolean
  /** Show the live Google Reviews widget (as on most of the original pages) */
  showReviews?: boolean
  /** Extra content injected after the hero (e.g. collection grids on hub pages) */
  afterHero?: React.ReactNode
}

export default function PageRenderer({ page, config, showAccreditations, showReviews, afterHero }: Props) {
  const sections = (page.sections ?? []).filter(isRenderable)
  // Insert reviews before a trailing CTA so the closing call-to-action stays last.
  const lastIsCta = sections.length > 0 && sections[sections.length - 1].kind === 'cta'
  const reviewsAt = showReviews ? (lastIsCta ? sections.length - 1 : sections.length) : -1

  return (
    <>
      <Hero hero={page.hero} accreditations={showAccreditations ? config.site.accreditations : undefined} />
      {afterHero}
      {sections.flatMap((s, i) => {
        const nodes = []
        if (i === reviewsAt) nodes.push(<TrustindexReviews key="reviews" />)
        nodes.push(
          <Section
            key={s.id ?? i}
            section={s}
            alt={i % 2 === 1}
            slug={page.slug}
            phone={config.site.phone}
            phoneHref={config.site.phoneHref}
          />
        )
        return nodes
      })}
      {reviewsAt === sections.length ? <TrustindexReviews /> : null}
    </>
  )
}
