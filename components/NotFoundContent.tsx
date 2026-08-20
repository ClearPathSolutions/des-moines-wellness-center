import Link from 'next/link'

/** The body of the 404 page, without chrome.
 *
 *  Rendered from two places, which is why it is a component rather than living
 *  in one not-found.tsx. Next resolves `notFound()` inside app/(site) to that
 *  group's boundary, where the group layout already supplies header and footer —
 *  but a URL that matches no route at all resolves to the ROOT boundary, which
 *  sits above the group and gets no chrome from it. A single not-found.tsx can
 *  serve only one of those two cases without either losing its header or
 *  rendering it twice. */
export default function NotFoundContent() {
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
