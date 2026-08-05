import { Phone } from 'lucide-react'

/**
 * The facility walkthrough. T-22 row 494 ("Take the virtual tour section with
 * facility video").
 *
 * The source folder held two files — "..._2_v1" and "..._3" — which sampling
 * frame-by-frame showed to be two cuts of the SAME walkthrough, near-identical
 * at every timestamp. Shipping both would read as a bug and cost 14 MB, so only
 * the longer, higher-bitrate cut ships.
 *
 * It was shot vertically on a phone (1080x1920), so it renders in a portrait
 * 9:16 frame rather than being letterboxed into a landscape player.
 *
 * `preload="none"` plus a poster means the 7 MB is only fetched if someone
 * presses play. The poster is a frame from 12s in — the reception desk — rather
 * than the drone shot the video opens on, which would just repeat the hero.
 */

const VIDEO = {
  src: '/video/facility-tour.mp4',
  poster: '/images/facility/facility-tour-poster.webp',
  length: '1:06',
}

export default function FacilityVideo({
  phone,
  phoneHref,
}: {
  phone: string
  phoneHref: string
}) {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <p className="eyebrow">Virtual Tour</p>
            <h2 className="mt-3">Take the virtual tour</h2>
            <p className="prose-brand mt-4 text-lg">
              A one-minute walkthrough, filmed on site: the covered entrance, reception,
              the dining room, a residential bedroom, and the games room — in the order
              you would actually see them.
            </p>
            <p className="prose-brand mt-4">
              If you would rather be shown around in person, we arrange tours seven days
              a week, and you are welcome to bring family.
            </p>
            <a href={phoneHref} className="btn-primary mt-7">
              <Phone className="h-4 w-4" />
              Arrange a tour — {phone}
            </a>
          </div>

          <figure className="mx-auto w-full max-w-[300px]">
            <div className="overflow-hidden rounded-2xl border border-line bg-brand-dark shadow-card">
              <video
                className="aspect-[9/16] w-full"
                controls
                preload="none"
                poster={VIDEO.poster}
                playsInline
              >
                <source src={VIDEO.src} type="video/mp4" />
                Your browser cannot play this video.{' '}
                <a href={VIDEO.src} className="underline">
                  Download the walkthrough
                </a>{' '}
                instead.
              </video>
            </div>
            <figcaption className="mt-3 text-center text-sm text-muted">
              Facility walkthrough · {VIDEO.length}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
