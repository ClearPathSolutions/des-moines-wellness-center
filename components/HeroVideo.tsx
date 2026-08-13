'use client'

import { useEffect, useState } from 'react'

/** The aerial loop behind the homepage hero. Decoration only: muted, looping,
 *  aria-hidden, out of the tab order.
 *
 *  It used to be server-rendered with `motion-reduce:hidden`, which is a CSS
 *  `display:none` — it hid the element without stopping the download. So every
 *  phone, and every visitor who had asked for reduced motion, still paid 1 MB
 *  for it: 72% of the homepage's entire mobile payload, for something a phone
 *  never showed and some people had explicitly opted out of.
 *
 *  Mounting it from the client instead means the `<video>` only enters the DOM
 *  where it earns its bytes — a viewport wide enough to see it, and no
 *  reduced-motion request. Everywhere else the hero keeps the poster, which is
 *  what those visitors were seeing anyway. */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setPlay(wide.matches && !still.matches)

    decide()
    wide.addEventListener('change', decide)
    still.addEventListener('change', decide)
    return () => {
      wide.removeEventListener('change', decide)
      still.removeEventListener('change', decide)
    }
  }, [])

  if (!play) return null

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
