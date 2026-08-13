import Image from 'next/image'
import Link from 'next/link'
import { Phone, ShieldCheck, ArrowRight } from 'lucide-react'
import type { Accreditation, Hero as HeroType } from '@/lib/types'
import { orientation } from '@/lib/images'
import HeroVideo from './HeroVideo'
import SmartImage from './SmartImage'

type Props = {
  hero: HeroType
  accreditations?: Accreditation[]
  compact?: boolean
}

export default function Hero({ hero, accreditations, compact }: Props) {
  const video = hero.video?.src ? hero.video : null
  // A video background replaces the side image entirely — the point is full bleed.
  const hasImage = !video && !!hero.image?.src
  const isPortrait = orientation(hero.image?.src) === 'portrait'
  return (
    <section
      className={
        video
          ? 'relative isolate overflow-hidden bg-brand-dark'
          : 'relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream'
      }
    >
      {video ? (
        <>
          {/* The poster is the LCP element on the homepage, and it used to be a
              CSS background — invisible to the preload scanner, discovered only
              once the stylesheet applied, at default priority, and shipped at one
              fixed size to every device. Through next/image it is preloaded with a
              priority hint, served as AVIF, and sized to the viewport. It still
              paints before the loop arrives, and it is the whole hero on phones. */}
          <Image
            src={video.poster}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <HeroVideo src={video.src} poster={video.poster} />
          {/* Legibility scrim. Heaviest on the left, where the copy sits. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/35"
          />
        </>
      ) : null}
      <div
        className={`relative container-page grid items-center gap-10 ${
          hasImage ? 'lg:grid-cols-2' : ''
        } ${
          video
            ? 'min-h-[32rem] py-20 sm:min-h-[38rem] sm:py-28'
            : compact
              ? 'py-14 sm:py-16'
              : 'py-16 sm:py-24'
        }`}
      >
        <div className="animate-fade-up">
          {/* Over the video scrim the gold eyebrow measured 3.15:1 and darkening
              it would only sink it further into the background, so it goes white
              here (11.8:1), matching the headline. */}
          {hero.eyebrow ? (
            <p className={`eyebrow mb-4 ${video ? 'text-white' : ''}`}>{hero.eyebrow}</p>
          ) : null}
          <h1 className={`max-w-2xl ${video ? 'text-white' : ''}`}>{hero.headline}</h1>
          {hero.subhead ? (
            <p
              className={
                video
                  ? 'mt-5 max-w-xl text-lg leading-relaxed text-white/85'
                  : 'prose-brand mt-5 max-w-xl text-lg'
              }
            >
              {hero.subhead}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {/* Over video the palette inverts. The brand-green primary measures
                1.4:1 against the green scrim, so it read as the *weaker* of the
                two buttons — backwards, when the phone number is the whole point.
                White leads (11.4:1), outlined white follows. */}
            {hero.primaryCta?.href ? (
              <Link href={hero.primaryCta.href} className={video ? 'btn-white' : 'btn-primary'}>
                {hero.primaryCta.href.startsWith('tel:') ? <Phone className="h-4 w-4" /> : null}
                {hero.primaryCta.label}
              </Link>
            ) : null}
            {hero.secondaryCta?.href ? (
              <Link
                href={hero.secondaryCta.href}
                className={video ? 'btn-outline-white' : 'btn-outline'}
              >
                {hero.secondaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {accreditations?.length ? (
            <div
              className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm ${
                video ? 'text-white/80' : 'text-muted'
              }`}
            >
              {accreditations.map((a) => (
                <span key={a.label} className="inline-flex items-center gap-1.5">
                  <ShieldCheck className={`h-4 w-4 ${video ? 'text-gold' : 'text-brand'}`} />
                  {a.verificationUrl ? (
                    <a
                      href={a.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline ${video ? 'hover:text-white' : 'hover:text-brand'}`}
                    >
                      {a.label}
                    </a>
                  ) : (
                    a.label
                  )}
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
