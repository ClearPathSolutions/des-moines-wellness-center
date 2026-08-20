import type { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'

// Without this the 404 inherits the layout's default title, so a not-found page
// announces itself in the tab and in history as the homepage.
export const metadata: Metadata = {
  title: { absolute: 'Page not found | Des Moines Wellness Center' },
  robots: { index: false, follow: true },
}

/** Boundary for `notFound()` raised inside app/(site). Chrome comes from that
 *  group's layout, so this renders the body only. */
export default function NotFound() {
  return <NotFoundContent />
}
