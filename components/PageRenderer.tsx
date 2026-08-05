import Hero from './Hero'
import Section from './Section'
import TrustindexReviews from './TrustindexReviews'
import LocationMap from './LocationMap'
import type { PageModel, SiteConfig, Section as SectionType } from '@/lib/types'
import { verifiedAccreditations } from '@/lib/content'

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
  /** T-12: render the location map. Once per page, never twice. */
  showMap?: boolean
  /** Extra content injected after the hero (e.g. the blog post list) */
  afterHero?: React.ReactNode
  /** T-18(c) rows 486 + 495: on hub pages the collection grid must sit BELOW
   *  the page's own intro section — /team's intro says "select any team member
   *  below", and /what-we-treat's "Targeted Solutions" is meant to lead. */
  afterFirstSection?: React.ReactNode
  /** T-18(c) row 604: index after which the reviews block renders. Defaults to
   *  just before a trailing CTA. */
  reviewsAfter?: number
}

export default function PageRenderer({
  page,
  config,
  showAccreditations,
  showReviews,
  showMap,
  afterHero,
  afterFirstSection,
  reviewsAfter,
}: Props) {
  const renderable = (page.sections ?? []).filter(isRenderable)
  // Collapse runs of back-to-back CTA sections into the single richest one — stacked
  // dark CTA boxes (some pages had three in a row) read as repetitive and unbalanced.
  const sections = renderable.reduce<SectionType[]>((acc, s) => {
    const prev = acc[acc.length - 1]
    if (s.kind === 'cta' && prev?.kind === 'cta') {
      const len = (sec: SectionType) => (sec.body ?? []).join(' ').length
      if (len(s) > len(prev)) acc[acc.length - 1] = s
      return acc
    }
    acc.push(s)
    return acc
  }, [])
  // Insert reviews before a trailing CTA so the closing call-to-action stays last.
  const lastIsCta = sections.length > 0 && sections[sections.length - 1].kind === 'cta'
  const defaultReviewsAt = lastIsCta ? sections.length - 1 : sections.length
  const reviewsAt = showReviews
    ? reviewsAfter !== undefined
      ? reviewsAfter + 1
      : defaultReviewsAt
    : -1

  return (
    <>
      {/* T-02: verifiedAccreditations(), never config.site.accreditations —
          unsubstantiated certification claims must not reach the page. */}
      <Hero
        hero={page.hero}
        accreditations={showAccreditations ? verifiedAccreditations(config) : undefined}
      />
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
            heroSrc={page.hero?.image?.src}
          />
        )
        if (i === 0 && afterFirstSection) nodes.push(
          <div key="after-first">{afterFirstSection}</div>
        )
        return nodes
      })}
      {reviewsAt === sections.length ? <TrustindexReviews /> : null}
      {/* T-12: rendered once, after the page's own sections, so the pin is the
          last thing a reader sees before the footer CTA. */}
      {showMap ? (
        <LocationMap
          address={config.site.address.full}
          phone={config.site.phone}
          phoneHref={config.site.phoneHref}
        />
      ) : null}
    </>
  )
}
