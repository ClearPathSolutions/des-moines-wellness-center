import { MapPin, Phone } from 'lucide-react'

/**
 * The facility's location. T-12.
 *
 * Pinned to 41.687, -93.698 — 5820 Winwood Dr, Johnston, IA 50131.
 *
 * ⚠️ Do NOT copy production's embed. On production's five highest-intent pages
 * (/, /about, /admissions, /contact, /tour) the map is centred on
 * 38.1205, -92.5896 at roughly an 800 km span — central Missouri, about 250
 * miles from the facility. A prospective patient on the Contact page is shown a
 * map of the wrong state.
 *
 * Uses Google's keyless `output=embed` endpoint rather than the Maps JavaScript
 * API. That deliberately avoids needing an API key in the repo — production had
 * one exposed in its HTML (CONTENT-NOTES item 4) and the rebuild dropped it. If
 * the richer JS API is ever wanted, add a referrer-restricted key then; this
 * needs none.
 *
 * Rendered once per page and lazy-loaded; production ships the iframe twice.
 */

const LAT = 41.687
const LNG = -93.698
const ZOOM = 16

export default function LocationMap({
  address,
  phone,
  phoneHref,
  className = '',
}: {
  address: string
  phone: string
  phoneHref: string
  className?: string
}) {
  const query = encodeURIComponent(`${address}`)
  const src = `https://www.google.com/maps?q=${query}&ll=${LAT},${LNG}&z=${ZOOM}&output=embed`

  return (
    <section className={`section bg-white ${className}`}>
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Find Us</p>
            <h2 className="mt-3">Minutes from Des Moines, in Johnston</h2>
            <p className="prose-brand mt-4">
              Our campus sits at {address}, a short drive from downtown Des Moines and
              easily reached from Polk and Dallas County.
            </p>
            <div className="mt-5 flex items-start gap-2 text-sm text-brand-dark">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <address className="not-italic font-medium">{address}</address>
            </div>
            <a href={phoneHref} className="btn-primary mt-6">
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line shadow-card">
            <iframe
              title={`Map showing Des Moines Wellness Center at ${address}`}
              src={src}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full lg:aspect-[16/10]"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
