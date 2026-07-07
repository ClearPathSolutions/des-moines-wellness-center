'use client'

import { useEffect, useRef } from 'react'

const WIDGET_ID = '6af23827370d29844f262301bb0'

/** Re-embeds the site's live Google Reviews (Trustindex) widget.
 *  The loader script renders the review carousel into this container. */
export default function TrustindexReviews() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // Avoid double-injection (React StrictMode / client nav) via a stable id.
    if (document.getElementById('ti-loader')) return
    const s = document.createElement('script')
    s.id = 'ti-loader'
    s.src = `https://cdn.trustindex.io/loader.js?${WIDGET_ID}`
    s.async = true
    s.defer = true
    ref.current.appendChild(s)
  }, [])

  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="eyebrow">Client Testimonials</p>
          <h2 className="mt-3">They Trusted Us. So Can You.</h2>
        </div>
        <div ref={ref} />
      </div>
    </section>
  )
}
