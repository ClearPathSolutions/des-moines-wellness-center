import SmartImage from './SmartImage'

/**
 * The real facility, grouped by the zones someone would actually walk through.
 * T-21 rows 409/414/487/490 and T-22 row 494.
 *
 * Order follows the arrival experience — outside, then reception, then where you
 * sleep, then where the clinical work happens, then where you spend downtime.
 * That sequence answers the questions a family asks in roughly the order they
 * ask them, which matters more here than grouping by room type.
 *
 * Every image is real photography of 5820 Winwood Dr. Nothing here is stock.
 */

type Shot = { slug: string; caption: string }
type Zone = { id: string; title: string; blurb: string; shots: Shot[] }

const ZONES: Zone[] = [
  {
    id: 'arrival',
    title: 'Arriving',
    blurb:
      'A covered entrance you can be dropped off at, and parking a few steps from the door.',
    shots: [
      { slug: 'exterior-entrance', caption: 'The covered main entrance' },
      { slug: 'exterior-entrance-doors', caption: 'Drop-off under cover, out of the weather' },
      { slug: 'aerial-facility', caption: 'The campus from above' },
      { slug: 'aerial-overhead', caption: 'The building wraps a private central courtyard' },
    ],
  },
  {
    id: 'reception',
    title: 'Reception & admissions',
    blurb: 'Where intake happens, and where families wait.',
    shots: [
      { slug: 'reception-lobby', caption: 'Reception and lobby' },
      { slug: 'reception-desk', caption: 'The admissions desk' },
      { slug: 'reception-entry', caption: 'Looking back toward the entrance' },
      { slug: 'reception-admin', caption: 'Administration offices' },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Where you sleep',
    blurb:
      'Shared bedrooms with real beds, storage for your things, and private bathrooms.',
    shots: [
      { slug: 'bedroom-twin-bright', caption: 'A shared room with garden light' },
      { slug: 'bedroom-twin', caption: 'Two beds, dresser and artwork' },
      { slug: 'bedroom-window', caption: 'Garden views from the residential wing' },
      { slug: 'bedroom-shared', caption: 'A shared residential bedroom' },
      { slug: 'bedroom-ensuite', caption: 'A room with its own bathroom' },
      { slug: 'bathroom-ensuite', caption: 'A private ensuite bathroom' },
      { slug: 'bathroom-accessible', caption: 'Accessible bathing, with grab bars and a roll-in shower' },
      { slug: 'corridor-seating', caption: 'Seating alcoves along the residential corridor' },
    ],
  },
  {
    id: 'clinical',
    title: 'Clinical care',
    blurb:
      'The nursing station is staffed around the clock during detox. Therapy happens in private rooms, not offices borrowed for the hour.',
    shots: [
      { slug: 'nurses-station', caption: 'The nursing station, staffed 24/7 during detox' },
      { slug: 'nurses-station-wide', caption: 'The clinical wing' },
      { slug: 'consult-room', caption: 'A private consultation room' },
      { slug: 'clinician-office', caption: "A clinician's office for one-to-one work" },
      { slug: 'therapy-room', caption: 'A therapy room with natural light' },
      { slug: 'therapy-nook', caption: 'A quiet two-chair space for private conversations' },
      { slug: 'meditation-room', caption: 'The meditation and mindfulness room' },
      { slug: 'meditation-chairs', caption: 'Somewhere to sit quietly' },
    ],
  },
  {
    id: 'groups',
    title: 'Groups & shared space',
    blurb: 'Daily process groups, education sessions, and meals taken together.',
    shots: [
      { slug: 'group-lounge-large', caption: 'The main group room' },
      { slug: 'group-lounge', caption: 'Group seating in a shared common area' },
      { slug: 'lounge-seating', caption: 'A residential lounge' },
      { slug: 'lounge-tv', caption: 'Downtime between sessions' },
      { slug: 'study-room', caption: 'The study room, used for education groups' },
      { slug: 'library-desk', caption: 'Books and a quiet desk' },
      { slug: 'dining-room', caption: 'The dining room' },
      { slug: 'dining-brick', caption: 'Dining beside the brick feature wall' },
      { slug: 'servery', caption: 'Meals prepared and served on site' },
      { slug: 'dining-recreation', caption: 'Dining opens onto the recreation room' },
    ],
  },
  {
    id: 'recreation',
    title: 'Downtime',
    blurb:
      'Recovery is not only clinical hours. There is somewhere to go when the day is done.',
    shots: [
      { slug: 'games-room', caption: 'The games room' },
      { slug: 'games-room-wide', caption: 'Pool, arcade and shuffleboard' },
      { slug: 'pool-table', caption: 'The pool table' },
      { slug: 'arcade', caption: 'Arcade machines' },
      { slug: 'recreation-shuffleboard', caption: 'Shuffleboard' },
      { slug: 'media-room', caption: 'The media room, with a projector screen' },
      { slug: 'quiet-room', caption: 'A quiet room for decompressing' },
    ],
  },
  {
    id: 'outdoors',
    title: 'Outdoors',
    blurb:
      'An enclosed courtyard with mature trees, and a covered patio — both fully private.',
    shots: [
      { slug: 'courtyard-tree', caption: 'The private courtyard' },
      { slug: 'courtyard-path', caption: 'Walking paths through the courtyard' },
      { slug: 'courtyard-building', caption: 'The courtyard, looking back at the residential wing' },
      { slug: 'courtyard-bench', caption: 'A bench in the shade' },
      { slug: 'patio-covered', caption: 'Covered patio and private lawn' },
    ],
  },
]

export default function FacilityGallery() {
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Photo Tour</p>
          <h2 className="mt-3">Every room, before you ever arrive</h2>
          <p className="prose-brand mt-4 text-lg">
            These are photographs of our own building at 5820 Winwood Dr in Johnston —
            not stock images. Deciding on treatment is hard enough without wondering
            what the place actually looks like.
          </p>
        </div>

        <div className="space-y-16">
          {ZONES.map((zone) => (
            <div key={zone.id} id={zone.id} className="scroll-mt-24">
              <div className="max-w-2xl">
                <h3 className="font-heading text-2xl font-semibold text-brand-dark">
                  {zone.title}
                </h3>
                <p className="prose-brand mt-2">{zone.blurb}</p>
              </div>

              <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {zone.shots.map((shot) => (
                  <li
                    key={shot.slug}
                    className="overflow-hidden rounded-2xl border border-line bg-white shadow-card"
                  >
                    {/* Fixed 3:2 frame. Every source is landscape, so nothing is
                        cropped through a subject — these are rooms, not faces. */}
                    <div className="relative aspect-[3/2] w-full">
                      <SmartImage
                        src={`/images/facility/${shot.slug}.webp`}
                        alt={shot.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="px-4 py-3 text-sm text-muted">{shot.caption}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
