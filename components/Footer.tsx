import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, ShieldCheck, Facebook, Instagram, Linkedin } from 'lucide-react'
import type { SiteConfig } from '@/lib/types'
import { verifiedAccreditations } from '@/lib/content'

/** Keyed by `site.social[].platform`. Adding a platform to the config without
 *  adding it here is a type error rather than a silently missing icon. */
const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
} as const

export default function Footer({ config }: { config: SiteConfig }) {
  const { site, footer } = config
  const social = site.social ?? []
  // T-02: only substantiated claims render.
  const accreditations = verifiedAccreditations(config)
  return (
    <footer className="bg-brand-dark text-cream/80">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Image
            src="/images/logo-white.png"
            alt={site.name}
            width={283}
            height={56}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
          <a href={site.phoneHref} className="btn-gold mt-6">
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>
          <div className="mt-5 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
            <span>{site.address.full}</span>
          </div>

          {social.length ? (
            /* Icon-only, so each link carries its own name for screen readers —
               the icon is aria-hidden and the label is visually hidden text, not
               a title attribute, which is not reliably announced. The p-2 takes
               the tap target to 36px (WCAG 2.5.8 wants 24px); the -m-2 cancels
               that padding visually so the row still lines up with the address
               above it. Icons measure 7.8:1 against the footer, 4.6:1 on hover. */
            <ul className="-m-2 mt-4 flex items-center">
              {social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform]
                return (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-2 text-cream/80 transition-colors hover:text-gold-light"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{site.name} on {s.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            {/* h2, not h4: these follow the page's own h2 sections, and an h4
                there skips two heading levels on every page of the site. */}
            <h2 className="font-heading text-base font-semibold text-cream">{col.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {accreditations.length ? (
        <div className="border-t border-white/10">
          <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-xs text-cream/70">
            {accreditations.map((a) => (
              <span key={a.label} className="inline-flex items-center gap-2.5">
                {/* Larger than the hero's: the footer is where someone who has
                    read the page looks for proof, and a seal only does its job
                    at a size where the mark is actually legible. */}
                {a.seal ? (
                  <Image
                    src={a.seal.src}
                    alt={a.seal.alt}
                    width={112}
                    height={112}
                    sizes="56px"
                    className="h-14 w-auto shrink-0"
                  />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-gold-light" />
                )}
                {a.verificationUrl ? (
                  <a
                    href={a.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gold-light"
                  >
                    {a.label}
                  </a>
                ) : (
                  a.label
                )}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {footer.legal.map((href) => (
              <Link key={href} href={href} className="hover:text-gold-light">
                Privacy Policy
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
