export type Cta = { label: string; href: string }

export type ImageRef = { src: string; alt: string; role?: string }

/** `href` makes a card link to the page it describes. Hub pages previously
 *  described their children as plain text, so crawl equity never flowed to
 *  them and readers hit dead ends (T-10). */
export type SectionItem = { title?: string; text?: string; icon?: string; href?: string }

export type Faq = { q: string; a: string }

export type SectionKind =
  | 'prose'
  // Real <ul> bullet list. Migrated article copy interleaves paragraphs and
  // list items; rendering those as paragraphs loses the list semantics.
  | 'list'
  | 'features'
  | 'cards'
  | 'steps'
  | 'faq'
  | 'testimonials'
  | 'cta'
  | 'stats'
  | 'insurance'
  | 'team-bio'
  | 'contact'
  | 'gallery'
  | 'hub-list'
  | 'verify-form'

export type Section = {
  id: string
  kind: SectionKind
  heading?: string
  subheading?: string
  body?: string[]
  items?: SectionItem[]
  faqs?: Faq[]
  image?: ImageRef
  /** T-11: an inline phone CTA for high-intent sections (job protection,
   *  FMLA, closing sections). Rendered under the section body. */
  primaryCta?: Cta
}

export type Hero = {
  eyebrow?: string
  headline: string
  subhead?: string
  image?: ImageRef
  primaryCta?: Cta
  secondaryCta?: Cta
}

export type PageModel = {
  slug: string
  pageType: string
  seo: { title: string; description: string }
  hero: Hero
  sections: Section[]
  images: ImageRef[]
  ctas: Cta[]
}

export type NavItem = { label: string; href: string; children?: NavItem[] }

/**
 * An accreditation or certification the facility claims. T-02.
 *
 * Only `status: 'verified'` entries render. An unsubstantiated certification
 * claim on an addiction-treatment site is a paid-search eligibility risk and a
 * regulatory one, so the data model makes withholding the default rather than
 * something a reviewer has to notice.
 */
export type Accreditation = {
  label: string
  status: 'verified' | 'pending-verification'
  /** Public record backing the claim. Rendered as a link when present. */
  verificationUrl?: string
  certificateId?: string
  /** Required when status is not 'verified', so the next person understands
   *  what evidence is missing instead of just flipping the flag. */
  withheldReason?: string
}

export type SiteConfig = {
  site: {
    name: string
    shortName: string
    url: string
    phone: string
    phoneHref: string
    email: string
    address: { street: string; city: string; region: string; postalCode: string; full: string }
    tagline: string
    accreditations: Accreditation[]
    insurancePartners: string[]
  }
  colors: Record<string, string>
  fonts: { heading: string; body: string; rationale?: string }
  nav: { primary: NavItem[] }
  footer: { columns: { title: string; links: Cta[] }[]; legal: string[]; napHtml: string }
  routes: { slug: string; route: string; pageType: string; title: string }[]
  collections: { programs: string[]; conditions: string[]; team: string[]; areas: string[] }
}
