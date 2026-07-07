import Link from 'next/link'

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
          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
