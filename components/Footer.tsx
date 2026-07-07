import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, ShieldCheck } from 'lucide-react'
import type { SiteConfig } from '@/lib/types'

export default function Footer({ config }: { config: SiteConfig }) {
  const { site, footer } = config
  return (
    <footer className="bg-brand-dark text-cream/80">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Image
            src="/images/logo-white.png"
            alt={site.name}
            width={220}
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
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-base font-semibold text-cream">{col.title}</h4>
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

      {site.accreditations?.length ? (
        <div className="border-t border-white/10">
          <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-xs text-cream/70">
            {site.accreditations.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold-light" />
                {a}
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
