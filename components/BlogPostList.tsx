import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Phone } from 'lucide-react'
import { formatPostDate, type BlogPostSummary } from '@/lib/blog'

/** Server-rendered post grid for /blog. Replaces Clarion's client-side embed,
 *  whose fetch is blocked for this origin and produced no crawlable markup. */
export default function BlogPostList({
  posts,
  phone,
  phoneHref,
}: {
  posts: BlogPostSummary[]
  phone: string
  phoneHref: string
}) {
  if (!posts.length) {
    // Vendor feed unavailable. Say so plainly and keep the conversion path open
    // rather than leaving a bare heading with nothing under it.
    return (
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
            <h2 className="text-2xl">New articles are on the way</h2>
            <p className="prose-brand mt-3">
              Our latest recovery resources aren&rsquo;t available to view right now. If you
              have a question about treatment, our admissions team can answer it directly.
            </p>
            <a href={phoneHref} className="btn-primary mt-6">
              <Phone className="h-4 w-4" />
              Call {phone}
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container-page">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const date = formatPostDate(post.publishedAt)
            return (
              <article
                key={post.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-shadow hover:shadow-lg"
              >
                {post.coverImageUrl ? (
                  // Deliberately not a link: the title and "Read the full
                  // article" below already point at the post, and a third
                  // duplicate link adds nothing but noise for screen readers.
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={post.coverImageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  {date ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <time dateTime={post.publishedAt ?? undefined}>{date}</time>
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-heading text-xl font-semibold text-brand-dark">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="prose-brand mt-3 flex-1 text-sm">{post.excerpt}</p>
                  ) : null}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 text-sm font-semibold text-brand hover:text-brand-dark"
                  >
                    Read the full article
                    <span className="sr-only"> — {post.title}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
