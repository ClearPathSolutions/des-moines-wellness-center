export type Cta = { label: string; href: string }

export type ImageRef = { src: string; alt: string; role?: string }

export type SectionItem = { title?: string; text?: string; icon?: string }

export type Faq = { q: string; a: string }

export type SectionKind =
  | 'prose'
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
    accreditations: string[]
    insurancePartners: string[]
  }
  colors: Record<string, string>
  fonts: { heading: string; body: string; rationale?: string }
  nav: { primary: NavItem[] }
  footer: { columns: { title: string; links: Cta[] }[]; legal: string[]; napHtml: string }
  routes: { slug: string; route: string; pageType: string; title: string }[]
  collections: { programs: string[]; conditions: string[]; team: string[]; areas: string[] }
}
