import Link from 'next/link'

type Item = { slug: string; title: string; excerpt: string | null }

/**
 * "Keep reading" links at the foot of a post. The site audit found posts whose
 * only internal link was the blog index; this gives every post links from its
 * neighbours. Picks the next `count` posts after the current one in the
 * (newest-first) list, wrapping round, so every post is linked from several
 * others rather than all posts linking to the same newest few.
 */
export function pickRelated<T extends { slug: string }>(posts: T[], slug: string, count = 3): T[] {
  const others = posts.filter((p) => p.slug !== slug)
  if (others.length <= count) return others
  const at = posts.findIndex((p) => p.slug === slug)
  const start = at < 0 ? 0 : at % others.length
  return Array.from({ length: count }, (_, i) => others[(start + i) % others.length])
}

export default function RelatedPosts({ posts }: { posts: Item[] }) {
  if (!posts.length) return null
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl">Related articles</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h3 className="font-heading text-lg font-semibold text-brand-dark">
                  <Link href={`/blog/${p.slug}`} className="hover:text-brand">
                    {p.title}
                  </Link>
                </h3>
                {p.excerpt ? <p className="prose-brand mt-2 line-clamp-3 text-sm">{p.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
