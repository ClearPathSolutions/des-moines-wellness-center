'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { recordPageview } from '@/lib/session'

/**
 * Records a pageview into the session store on first paint and on every
 * client-side route change, so a form submitted three pages into a visit still
 * knows the landing page and the campaign that brought the visitor in.
 *
 * Renders nothing. Reads the query string from `window.location` inside
 * `recordPageview` rather than through `useSearchParams`, which would demand a
 * Suspense boundary and opt all 48 statically rendered pages into dynamic
 * rendering. `usePathname` carries no such cost.
 *
 * Mounted in the root layout, so it covers the campaign landing pages too.
 */
export default function SessionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    recordPageview()
  }, [pathname])

  return null
}
