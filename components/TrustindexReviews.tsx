'use client'

import { useEffect, useRef } from 'react'

const WIDGET_ID = '6af23827370d29844f262301bb0'

/** Re-embeds the site's live Google Reviews (Trustindex) widget.
 *  The loader script renders the review carousel into this container.
 *
 *  The loader is ~86 KB — on its own larger than this site's entire first-load
 *  JS — and the section sits well below the fold on every page that shows it.
 *  So it is fetched only once the section is near the viewport. */
export default function TrustindexReviews() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return
    // Avoid double-injection (React StrictMode / client nav) via a stable id.
    if (document.getElementById('ti-loader')) return

    const inject = () => {
      if (document.getElementById('ti-loader')) return
      const s = document.createElement('script')
      s.id = 'ti-loader'
      s.src = `https://cdn.trustindex.io/loader.js?${WIDGET_ID}`
      s.async = true
      s.defer = true
      mount.appendChild(s)
    }

    if (typeof IntersectionObserver === 'undefined') {
      inject()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          inject()
          observer.disconnect()
        }
      },
      // Start loading a little before it scrolls into view so reviews are
      // already painted by the time the visitor reaches them.
      { rootMargin: '400px' }
    )
    observer.observe(mount)
    return () => observer.disconnect()
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
