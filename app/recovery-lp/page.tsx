import type { Metadata } from 'next'
import { Phone, ShieldCheck, Clock, Lock, CheckCircle2 } from 'lucide-react'
import CtmForm from '@/components/CtmForm'
import SiteChrome from '@/components/SiteChrome'
import { getSiteConfig, verifiedAccreditations } from '@/lib/content'
import { canonicalPath } from '@/lib/urls'

/** Paid-campaign landing page.
 *
 *  Two constraints come from the campaign brief, and both are deliberate:
 *
 *  1. CAMPAIGN_PHONE is the only telephone number allowed to appear anywhere on
 *     this page. It is a CallTrackingMetrics number, and a visitor who dials the
 *     site's main number instead has their call attributed to nothing, so the ad
 *     spend that produced it cannot be measured. That is why this route sits
 *     outside app/(site) and renders its own chrome: header and footer both read
 *     the number from site config, so they are given the campaign number here.
 *     It is also why no LocalBusiness graph is emitted — its `telephone` would
 *     reintroduce the main number, and a page that emits the campaign number
 *     instead would contradict the NAP every other page agrees on.
 *
 *  2. noindex. A paid landing page that ranks organically competes with the
 *     /programs and /what-we-treat pages written to rank, and would put a
 *     temporary tracking number into search results that outlives the campaign.
 *     It is deliberately NOT disallowed in robots.txt — Google Ads must be able
 *     to crawl a landing page, and a robots block is a common cause of ad
 *     disapproval. noindex keeps it out of the index while staying crawlable.
 *
 *  Every claim here is drawn from copy already verified elsewhere in content/.
 *  Nothing on this page may assert LegitScript certification (withheld — see
 *  site.config.json) or Partial Hospitalization (not offered). The CI guards
 *  that enforce that scan content/*.json, so scripts/check-claims.mjs and
 *  scripts/check-services.mjs were extended to scan this file too. */

const CAMPAIGN_PHONE = '(515) 303-2386'
const CAMPAIGN_PHONE_HREF = 'tel:+15153032386'

const CTM_FORM_URL =
  'https://264810.tctm.co/form/FRT472ABB2C5B9B141A1FFF98722836BB0F90260CACD64AE968086DF9BF29802CEF.html'

const PATH = canonicalPath('/recovery-lp')

const TITLE = 'Verify Your Insurance for Rehab in Des Moines, Iowa'
const DESCRIPTION =
  'Check your addiction treatment benefits in minutes — free, 100% confidential, and with no obligation to enroll. Accredited medical detox, residential care, IOP and virtual outpatient in Des Moines, Iowa.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Des Moines Wellness Center` },
  description: DESCRIPTION,
  // Overrides the layout default of index: true.
  robots: { index: false, follow: true },
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    // Next replaces the parent openGraph object rather than deep-merging it, so
    // url and images must both be restated or the layout's defaults are lost and
    // og:url falls back to '/'.
    url: PATH,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: TITLE }],
  },
}

const LEVELS = [
  {
    name: 'Medical detox',
    body: 'Physician-led withdrawal management, monitored 24/7 on site.',
  },
  {
    name: 'Residential treatment',
    body: 'Inpatient care with round-the-clock clinical staff and a private room.',
  },
  {
    name: 'Intensive outpatient (IOP)',
    body: 'Structured therapy on a schedule that fits work, study or family.',
  },
  {
    name: 'Outpatient',
    body: 'Continuing care while you live at home and keep your routine.',
  },
  {
    name: 'Virtual outpatient',
    body: 'Attend therapy from anywhere in Iowa by secure video.',
  },
]

const STEPS = [
  {
    title: 'Tell us about your plan',
    body: 'Send your details through the form, or call and read your card to an admissions specialist. It takes a couple of minutes.',
  },
  {
    title: 'We verify your benefits',
    body: 'We contact your provider directly and confirm what is covered — deductible, co-pay and length of stay — so there are no financial surprises.',
  },
  {
    title: 'You decide what happens next',
    body: 'We explain the level of care that fits your situation and what it would cost. There is no obligation to enroll, and same-day intake is often available.',
  },
]

export default function RecoveryLandingPage() {
  const config = getSiteConfig()
  // T-02: only substantiated accreditations render, here as everywhere.
  const accreditations = verifiedAccreditations(config)
  const insurers = config.site.insurancePartners

  return (
    <SiteChrome phone={CAMPAIGN_PHONE} phoneHref={CAMPAIGN_PHONE_HREF}>
      {/* Hero + form. The form sits in the first screen on desktop: this page
          exists to capture a verification, so it should never need a scroll. */}
      <section className="bg-gradient-to-b from-brand-50 to-cream">
        <div className="container-page grid items-start gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Des Moines, Iowa</p>
            <h1 className="mt-4 max-w-xl">{TITLE}</h1>
            <p className="prose-brand mt-5 max-w-xl text-lg">
              Find out what your plan covers in minutes — free, 100% confidential, and with no
              obligation to enroll. Complete the short form or call us any time and our admissions
              team will handle the rest.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={CAMPAIGN_PHONE_HREF} className="btn-gold">
                <Phone className="h-4 w-4" />
                Call {CAMPAIGN_PHONE}
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4 text-brand" />
                Answered 24/7
              </span>
            </div>

            <ul className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-2">
              {accreditations.map((a) => (
                <li key={a.label} className="inline-flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{a.label}</span>
                </li>
              ))}
              <li className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>Most major private insurance plans accepted</span>
              </li>
              <li className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>Dual-diagnosis care for co-occurring mental health conditions</span>
              </li>
              <li className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>Same-day intake often available</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="font-heading text-2xl">Check your coverage</h2>
            <p className="mt-2 text-sm text-muted">
              Free and confidential. We only use these details to verify your benefits.
            </p>
            <div className="mt-6">
              <CtmForm
                formUrl={CTM_FORM_URL}
                title="Insurance verification form"
              />
            </div>
            <p className="mt-6 inline-flex items-start gap-2 text-xs text-muted">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span>
                Your information is handled in accordance with applicable healthcare privacy laws,
                including HIPAA. Submitting the form does not commit you to treatment.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Insurance partners named in site config — no plan is claimed here that
          is not already claimed elsewhere on the site. */}
      <section className="border-y border-line bg-surface py-10">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <p className="eyebrow">Plans we work with</p>
          <p className="text-lg font-semibold text-ink">{insurers.join(' · ')}</p>
          <p className="max-w-xl text-sm text-muted">
            Don&rsquo;t see your plan? Call {CAMPAIGN_PHONE} — we&rsquo;ll check it for you. We work
            with most major private insurance providers and handle the verification on your behalf.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Levels of care</p>
          <h2 className="mt-3 max-w-2xl">A full continuum, all in Des Moines</h2>
          <p className="prose-brand mt-4 max-w-2xl">
            Treatment is not one thing. After a short assessment we recommend the level of care that
            matches where you actually are — and we say so plainly if a lower or higher level would
            be safer.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((l) => (
              <li
                key={l.name}
                className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
              >
                <h3 className="font-heading text-lg font-semibold text-ink">{l.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <p className="eyebrow">What happens next</p>
          <h2 className="mt-3 max-w-2xl">Three steps, and no pressure at any of them</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-brand-dark text-cream">
        <div className="container-page flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-white">Talk to an admissions specialist now</h2>
          <p className="mt-4 max-w-xl text-cream/85">
            Calls are free, confidential and answered 24/7. One conversation is enough to understand
            your options and check your insurance — with no obligation to enroll.
          </p>
          <a href={CAMPAIGN_PHONE_HREF} className="btn-white mt-8">
            <Phone className="h-4 w-4" />
            Call {CAMPAIGN_PHONE}
          </a>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-cream/70">
            <CheckCircle2 className="h-4 w-4" />
            {config.site.address.full}
          </p>
        </div>
      </section>
    </SiteChrome>
  )
}
