import Link from 'next/link'
import { Phone, ShieldCheck, ArrowRight } from 'lucide-react'
import type { Hero as HeroType } from '@/lib/types'
import { orientation } from '@/lib/images'
import SmartImage from './SmartImage'

type Props = {
  hero: HeroType
  accreditations?: string[]
  compact?: boolean
}

export default function Hero({ hero, accreditations, compact }: Props) {
  const hasImage = !!hero.image?.src
  const isPortrait = orientation(hero.image?.src) === 'portrait'
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream">
      <div
        className={`container-page grid items-center gap-10 ${
          hasImage ? 'lg:grid-cols-2' : ''
        } ${compact ? 'py-14 sm:py-16' : 'py-16 sm:py-24'}`}
      >
        <div className="animate-fade-up">
          {hero.eyebrow ? <p className="eyebrow mb-4">{hero.eyebrow}</p> : null}
          <h1 className="max-w-2xl">{hero.headline}</h1>
          {hero.subhead ? (
            <p className="prose-brand mt-5 max-w-xl text-lg">{hero.subhead}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryCta?.href ? (
              <Link href={hero.primaryCta.href} className="btn-primary">
                {hero.primaryCta.href.startsWith('tel:') ? <Phone className="h-4 w-4" /> : null}
                {hero.primaryCta.label}
              </Link>
            ) : null}
            {hero.secondaryCta?.href ? (
              <Link href={hero.secondaryCta.href} className="btn-outline">
                {hero.secondaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {accreditations?.length ? (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {accreditations.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand" />
                  {a}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {hasImage ? (
          <div className="relative animate-fade-up">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />
            <div
              className={`relative overflow-hidden rounded-2xl shadow-soft ${
                isPortrait ? 'mx-auto aspect-[4/5] w-full max-w-sm' : 'aspect-[4/3]'
              }`}
            >
              <SmartImage
                src={hero.image!.src}
                alt={hero.image!.alt}
                fill
                priority
                sizes={isPortrait ? '(max-width: 1024px) 100vw, 24rem' : '(max-width: 1024px) 100vw, 50vw'}
                className={`object-cover ${isPortrait ? 'object-top' : ''}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
