import Link from 'next/link'
import SmartImage from './SmartImage'
import { resolveImage } from '@/lib/images'
import { GRID_WRAP, gridItem } from '@/lib/layout'
import type { PageModel } from '@/lib/types'

/**
 * The team grid, used in two places:
 *   - `/team` as the page's primary content, directly under the hero
 *   - `/about` as the "faces behind your care" teaser
 *
 * Real staff portraits only. Anyone without a photo gets their initials rather
 * than a stock headshot — inventing a face for a named clinician on a treatment
 * site would be worse than an initial.
 *
 * Portraits are portrait-orientation, so they get a 4:5 frame anchored to the
 * top: the crop that keeps heads intact.
 */

function initials(name: string) {
  return name
    .replace(/[“”"']/g, '')
    .split(/[\s,]+/)
    .filter((w) => /^[A-Za-z]/.test(w) && w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** Team pages store the job title only in the portrait's alt text, as
 *  "Name, CREDS - Job Title". */
function roleFrom(alt: string | undefined, headline: string) {
  if (!alt) return null
  const tail = alt.slice(headline.length).replace(/^\s*[-–—,]\s*/, '').trim()
  return tail || null
}

/**
 * Split "Parneet “Pam” Sahota, MA, LMHC, IADC, CCMHC" into the name and the
 * post-nominals, so a five-credential clinician doesn't render as one cramped
 * line. Only splits when every trailing comma-separated token actually looks
 * like a credential; otherwise the headline is left whole.
 */
function splitCredentials(headline: string): { name: string; creds: string | null } {
  const parts = headline.split(',').map((p) => p.trim())
  if (parts.length < 2) return { name: headline, creds: null }
  const tail = parts.slice(1)
  const looksLikeCredential = (t: string) =>
    /^[A-Za-z.]{2,8}$/.test(t) && !/[a-z]{3}/.test(t)
  if (!tail.every(looksLikeCredential)) return { name: headline, creds: null }
  return { name: parts[0], creds: tail.join(', ') }
}

type Props = {
  team: PageModel[]
  eyebrow?: string
  heading?: string
  intro?: string
}

export default function TeamFaces({
  team,
  eyebrow = 'Our People',
  heading = 'The faces behind your care',
  intro = 'You will work with the same small clinical team throughout your stay, not a rotating roster.',
}: Props) {
  if (!team.length) return null

  return (
    <section className="section bg-white">
      <div className="container-page">
        {heading ? (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 className="mt-3">{heading}</h2>
            {intro ? <p className="prose-brand mt-4 text-lg">{intro}</p> : null}
          </div>
        ) : null}

        <ul className={GRID_WRAP}>
          {team.map((person) => {
            const headline = person.hero.headline
            const { name, creds } = splitCredentials(headline)
            const role = roleFrom(person.hero.image?.alt, headline)
            const portrait = resolveImage(person.hero.image?.src)
            return (
              <li
                key={person.slug}
                className={`${gridItem(team.length)} overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-transform hover:-translate-y-1`}
              >
                <Link href={`/${person.slug}`} className="group block h-full">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-50">
                    {portrait ? (
                      <SmartImage
                        src={person.hero.image!.src}
                        alt={person.hero.image!.alt || name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-heading text-4xl font-semibold text-brand/40">
                        {initials(name)}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    {/* Role leads in colour — it is what a reader scans this grid for. */}
                    {role ? (
                      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                        {role}
                      </p>
                    ) : null}
                    <h3 className="mt-1 font-heading text-lg font-semibold text-brand-dark">
                      {name}
                    </h3>
                    {creds ? <p className="mt-1 text-sm text-muted">{creds}</p> : null}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
