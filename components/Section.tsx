import Link from 'next/link'
import {
  Check,
  ArrowRight,
  Quote,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Users,
  Home,
  Activity,
  Star,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import type { Section as SectionType } from '@/lib/types'
import { GRID_WRAP, gridItem } from '@/lib/layout'
import { orientation, canonicalKey } from '@/lib/images'
import SmartImage from './SmartImage'
import FaqAccordion from './FaqAccordion'
import VerifyInsuranceForm from './VerifyInsuranceForm'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  heart: HeartHandshake,
  medical: Stethoscope,
  users: Users,
  home: Home,
  activity: Activity,
  star: Star,
}

function pickIcon(i: number) {
  const list = [HeartHandshake, ShieldCheck, Stethoscope, Users, Home, Activity]
  return list[i % list.length]
}

/** Accreditation seals / partner logos should render contained, not cropped like photos. */
function isBadge(src: string) {
  return /seal|logo|certified|legit|badge|accredit/i.test(src)
}

function SectionHeader({ heading, subheading, center }: { heading?: string; subheading?: string; center?: boolean }) {
  if (!heading && !subheading) return null
  return (
    <div className={`mb-10 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {heading ? <h2>{heading}</h2> : null}
      {subheading ? <p className="prose-brand mt-4 text-lg">{subheading}</p> : null}
    </div>
  )
}

type SectionProps = {
  section: SectionType
  alt?: boolean
  slug?: string
  phone?: string
  phoneHref?: string
  /** The page's hero image, so a repeated bio portrait isn't shown twice. */
  heroSrc?: string
}

export default function Section({ section, alt, slug, phone, phoneHref, heroSrc }: SectionProps) {
  const { kind } = section
  const body = section.body ?? []
  const items = section.items ?? []
  const bg = alt ? 'bg-white' : 'bg-cream'
  const onAdmissions = slug === 'admissions'
  const onVerify = slug === 'verify-insurance'
  const callHref = phoneHref ?? 'tel:+18883782158'

  switch (kind) {
    case 'prose': {
      const src = section.image?.src
      const hasImage = !!src
      const badge = hasImage && isBadge(src!)
      const portrait = hasImage && !badge && orientation(src) === 'portrait'

      // A heading with no body and no image renders as a lonely, unbalanced title — skip it.
      if (!hasImage && body.length === 0) return null

      // Heading-only or badge-only section -> tidy centered callout (no giant cropped photo)
      if (hasImage && body.length === 0) {
        const frame = badge
          ? 'h-40 w-40'
          : portrait
            ? 'aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-card'
            : 'aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl shadow-card'
        return (
          <section className={`section ${bg}`}>
            <div className="container-page flex flex-col items-center text-center">
              <SectionHeader heading={section.heading} subheading={section.subheading} center />
              <div className={`relative mt-2 ${frame}`}>
                <SmartImage src={src!} alt={section.image!.alt} fill sizes="(max-width:768px) 90vw, 24rem" className={badge ? 'object-contain' : `object-cover ${portrait ? 'object-top' : ''}`} />
              </div>
            </div>
          </section>
        )
      }

      return (
        <section className={`section ${bg}`}>
          <div className={`container-page grid items-center gap-10 ${hasImage ? 'lg:grid-cols-2' : ''}`}>
            <div>
              <SectionHeader heading={section.heading} subheading={section.subheading} />
              <div className="prose-brand">
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            {hasImage ? (
              badge ? (
                <div className="relative mx-auto h-52 w-52">
                  <SmartImage src={src!} alt={section.image!.alt} fill sizes="200px" className="object-contain" />
                </div>
              ) : portrait ? (
                <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-card">
                  <SmartImage src={src!} alt={section.image!.alt} fill sizes="(max-width:1024px) 90vw, 24rem" className="object-cover object-top" />
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
                  <SmartImage src={src!} alt={section.image!.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </div>
              )
            ) : null}
          </div>
        </section>
      )
    }

    case 'features':
    case 'cards': {
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            <div className={GRID_WRAP}>
              {items.map((it, i) => {
                const Icon = (it.icon && ICONS[it.icon]) || pickIcon(i)
                return (
                  <div key={i} className={`${gridItem(items.length)} rounded-2xl border border-line bg-white p-7 shadow-card transition-transform hover:-translate-y-1`}>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    {it.title ? <h3 className="text-lg">{it.title}</h3> : null}
                    {it.text ? <p className="prose-brand mt-2 text-base">{it.text}</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    case 'steps': {
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            <ol className={GRID_WRAP}>
              {items.map((it, i) => (
                <li key={i} className={`${gridItem(items.length)} flex gap-4 rounded-2xl border border-line bg-white p-6 shadow-card`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-heading font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    {it.title ? <h3 className="text-lg">{it.title}</h3> : null}
                    {it.text ? <p className="prose-brand mt-1 text-base">{it.text}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )
    }

    case 'faq': {
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading ?? 'Frequently Asked Questions'} subheading={section.subheading} center />
            <FaqAccordion faqs={section.faqs ?? []} />
          </div>
        </section>
      )
    }

    case 'testimonials': {
      const quotes = items.length ? items : body.map((t) => ({ text: t, title: '' }))
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading ?? 'They Trusted Us. So Can You.'} subheading={section.subheading} center />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((q, i) => (
                <figure key={i} className="rounded-2xl border border-line bg-white p-7 shadow-card">
                  <Quote className="h-7 w-7 text-gold/60" />
                  <blockquote className="prose-brand mt-3 text-base italic">{q.text}</blockquote>
                  {q.title ? <figcaption className="mt-4 font-semibold text-brand-dark">— {q.title}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'stats': {
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            <div className={GRID_WRAP}>
              {items.map((it, i) => (
                <div key={i} className={`${gridItem(items.length)} rounded-2xl bg-brand p-8 text-center text-white`}>
                  <div className="font-heading text-4xl font-bold text-gold-light">{it.title}</div>
                  <p className="mt-2 text-sm text-cream/80">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'insurance': {
      const logos = items.filter((it) => it.icon && it.icon.startsWith('http'))
      return (
        <section className={`section ${bg}`}>
          <div className="container-page text-center">
            <SectionHeader heading={section.heading ?? 'We Accept Most Major Insurance'} subheading={section.subheading} center />
            <div className="prose-brand mx-auto max-w-2xl">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {logos.length ? (
              <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 items-center gap-x-8 gap-y-6 rounded-3xl bg-brand-dark px-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
                {logos.map((it, i) => (
                  <div key={i} className="relative mx-auto h-9 w-full max-w-[130px]">
                    <SmartImage
                      src={it.icon!}
                      alt={`${it.title} insurance accepted`}
                      fill
                      sizes="130px"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <Link href={onVerify ? '#verify' : '/verify-insurance'} className="btn-gold mt-8">
              Verify Your Insurance
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )
    }

    case 'cta': {
      return (
        <section className="section bg-cream">
          <div className="container-page">
            <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-14 text-center text-cream sm:px-12">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
              {section.heading ? <h2 className="mx-auto max-w-2xl text-cream">{section.heading}</h2> : null}
              {body.map((p, i) => (
                <p key={i} className="mx-auto mt-4 max-w-xl text-cream/80">
                  {p}
                </p>
              ))}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={callHref} className="btn-gold">
                  <Phone className="h-4 w-4" />
                  {phone ? `Call ${phone}` : 'Call Now'}
                </a>
                <Link href={onAdmissions || onVerify ? '/contact' : '/verify-insurance'} className="btn-white">
                  {onAdmissions || onVerify ? 'Contact Us' : 'Verify Insurance'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )
    }

    case 'team-bio': {
      const src = section.image?.src
      // Show the portrait beside the bio — but not when it's the same photo already
      // in the hero (team member pages), which would show the same face twice.
      const showAvatar = !!src && canonicalKey(src) !== canonicalKey(heroSrc ?? '')

      // With no body and no avatar to show (the image just repeats the hero), this
      // would render as a lonely heading over empty space — drop it.
      if (!showAvatar && body.filter(Boolean).length === 0) return null

      if (showAvatar) {
        return (
          <section className={`section ${bg}`}>
            <div className="container-page">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border border-line bg-white p-7 text-center shadow-card sm:flex-row sm:gap-6 sm:text-left">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-brand-50">
                  <SmartImage src={src!} alt={section.image!.alt} fill sizes="96px" className="object-cover object-top" />
                </div>
                <div>
                  {section.heading ? <h3 className="text-lg">{section.heading}</h3> : null}
                  <div className="prose-brand mt-2 text-base">
                    {body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            <div className="prose-brand mx-auto max-w-3xl">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'contact': {
      const phoneRe = /\d{3}[^\d]*\d{3}[^\d]*\d{4}/
      const hrefFor = (text: string) => {
        const t = text.trim()
        if (t.includes('@')) return `mailto:${t}`
        if (phoneRe.test(t)) return `tel:+1${t.replace(/\D/g, '')}`
        return null
      }
      const iconFor = (text: string) => (text.includes('@') ? Mail : phoneRe.test(text) ? Phone : MapPin)
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            {/* Some "contact" sections are really closing statements with body copy and
                no cards — render that copy instead of dropping it and leaving a lonely heading. */}
            {body.length ? (
              <div className={`prose-brand mx-auto max-w-3xl text-center ${items.length ? 'mb-10' : ''}`}>
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {items.length ? (
            <div className={GRID_WRAP}>
              {items.map((it, i) => {
                const text = it.text ?? ''
                const Icon = iconFor(text)
                const href = hrefFor(text)
                const cardW = gridItem(items.length)
                const inner = (
                  <>
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    {it.title ? <h3 className="text-lg">{it.title}</h3> : null}
                    {text ? <p className="prose-brand mt-1 text-base">{text}</p> : null}
                  </>
                )
                return href ? (
                  <a
                    key={i}
                    href={href}
                    className={`${cardW} block rounded-2xl border border-line bg-white p-7 text-center shadow-card transition-transform hover:-translate-y-1`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className={`${cardW} rounded-2xl border border-line bg-white p-7 text-center shadow-card`}>
                    {inner}
                  </div>
                )
              })}
            </div>
            ) : null}
          </div>
        </section>
      )
    }

    case 'hub-list': {
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} center />
            {body.length ? (
              <div className="prose-brand mx-auto mb-10 max-w-3xl text-center">
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            <div className={GRID_WRAP}>
              {items.map((it, i) => (
                <div key={i} className={`${gridItem(items.length)} rounded-2xl border border-line bg-white p-6 shadow-card`}>
                  {it.title ? <h3 className="text-lg">{it.title}</h3> : null}
                  {it.text ? <p className="prose-brand mt-2 text-base">{it.text}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'verify-form': {
      return (
        <section id={section.id} className={`section scroll-mt-24 ${bg}`}>
          <div className="container-page">
            <SectionHeader
              heading={section.heading ?? 'Verify Your Insurance'}
              subheading={section.subheading ?? 'Free, confidential, and no obligation — get your benefits checked in minutes.'}
              center
            />
            <VerifyInsuranceForm />
          </div>
        </section>
      )
    }

    default: {
      // prose fallback for gallery and other rich sections, etc.
      return (
        <section className={`section ${bg}`}>
          <div className="container-page">
            <SectionHeader heading={section.heading} subheading={section.subheading} />
            <div className="prose-brand max-w-3xl">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {items.length ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      {it.title ? <strong className="text-brand-dark">{it.title}. </strong> : null}
                      {it.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      )
    }
  }
}
