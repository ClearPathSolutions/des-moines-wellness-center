import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Phone } from 'lucide-react'
import { getSiteConfig } from '@/lib/content'
import { formatPostDate, getBlogPost, getBlogPosts } from '@/lib/blog'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import { canonicalPath, canonicalUrl } from '@/lib/urls'

// Must be a literal (Next statically analyses it); keep in step with
// BLOG_REVALIDATE_SECONDS in lib/blog.ts.
export const revalidate = 3600

// Posts published after the last build should still resolve, so unknown slugs
// are rendered on demand rather than 404'd outright.
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}
  const title = post.seo.title ?? post.title
  const description = post.seo.description ?? post.excerpt ?? undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalPath(`/blog/${post.slug}`),
      publishedTime: post.publishedAt ?? undefined,
      ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const { site } = getSiteConfig()
  const date = formatPostDate(post.publishedAt)

  return (
    <>
      <article className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>

            <h1 className="mt-5">{post.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              {date ? (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <time dateTime={post.publishedAt ?? undefined}>{date}</time>
                </span>
              ) : null}
              {post.authorName ? <span>By {post.authorName}</span> : null}
            </div>

            {post.coverImageUrl ? (
              <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48rem"
                  className="object-cover"
                />
              </div>
            ) : null}

            {post.bodyHtml ? (
              <div
                className="prose-brand mt-8 prose-post"
                // Body HTML is authored in Clarion's CMS by the facility's own
                // team; it is trusted first-party editorial content.
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />
            ) : post.excerpt ? (
              <p className="prose-brand mt-8">{post.excerpt}</p>
            ) : null}
          </div>
        </div>
      </article>

      <section className="section bg-brand-dark text-cream">
        <div className="container-page text-center">
          <h2 className="text-cream">Ready to talk to someone who understands?</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Our admissions team is available 24/7. Calls are free and confidential.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={site.phoneHref} className="btn-gold">
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
            <Link href="/verify-insurance" className="btn-white">
              Verify Insurance
            </Link>
          </div>
        </div>
      </section>

      <ArticleJsonLd
        headline={post.title}
        description={post.seo.description ?? post.excerpt}
        image={post.coverImageUrl}
        datePublished={post.publishedAt}
        authorName={post.authorName}
        url={canonicalUrl(site.url, `/blog/${post.slug}`)}
        siteName={site.name}
        siteUrl={site.url}
      />
      <BreadcrumbJsonLd
        siteUrl={site.url}
        trail={[
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
    </>
  )
}
