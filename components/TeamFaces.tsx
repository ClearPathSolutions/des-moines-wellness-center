import Link from 'next/link'
import SmartImage from './SmartImage'
import { resolveImage } from '@/lib/images'
import type { PageModel } from '@/lib/types'

/**
 * "Faces Behind Your Care" — T-21 row 409.
 *
 * Uses the real staff portraits already in the repo. Anyone without a photo is
 * shown with their initials rather than a stock headshot or a broken frame:
 * Bethany Hamilton's photo is genuinely outstanding (T-26), and inventing a face
 * for a named clinician on a treatment site would be worse than an initial.
 *
 * Portraits are portrait-orientation, so they get a 4:5 frame anchored to the
 * top — the crop that keeps heads intact.
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

export default function TeamFaces({ team }: { team: PageModel[] }) {
  if (!team.length) return null

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Our People</p>
          <h2 className="mt-3">The faces behind your care</h2>
          <p className="prose-brand mt-4 text-lg">
            You will work with the same small clinical team throughout your stay, not a
            rotating roster.
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => {
            const name = person.hero.headline
            const role = roleFrom(person.hero.image?.alt, name)
            const portrait = resolveImage(person.hero.image?.src)
            return (
              <li
                key={person.slug}
                className="overflow-hidden rounded-2xl border border-line bg-white shadow-card"
              >
                <Link href={`/${person.slug}`} className="block">
                  <div className="relative aspect-[4/5] w-full bg-brand-50">
                    {portrait ? (
                      <SmartImage
                        src={person.hero.image!.src}
                        alt={person.hero.image!.alt || name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-heading text-4xl font-semibold text-brand/40">
                        {initials(name)}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-brand-dark">
                      {name}
                    </h3>
                    {role ? <p className="mt-1 text-sm text-muted">{role}</p> : null}
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
