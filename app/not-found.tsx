import type { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Des Moines Wellness Center' },
  robots: { index: false, follow: true },
}

/** Boundary for URLs that match no route at all.
 *
 *  This one sits above app/(site), so it has to supply its own header and footer
 *  — without it, a mistyped URL falls through to Next's built-in 404, which is
 *  unstyled, unbranded and offers no way back into the site. On a site people
 *  reach while looking for treatment, a dead end is the wrong answer. */
export default function GlobalNotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  )
}
