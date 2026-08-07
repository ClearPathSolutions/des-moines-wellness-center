import Link from 'next/link'
import type { Metadata } from 'next'

// Without this the 404 inherits the layout's default title, so a not-found page
// announces itself in the tab and in history as the homepage.
export const metadata: Metadata = {
  title: { absolute: 'Page not found | Des Moines Wellness Center' },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page flex flex-col items-center text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3">This page could not be found</h1>
        <p className="prose-brand mt-4 max-w-md">
          The page you’re looking for may have moved. Let’s get you back on the path to recovery.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/contact/" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
