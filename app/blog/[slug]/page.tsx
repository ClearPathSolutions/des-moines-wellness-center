import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Phone } from 'lucide-react'
import PageRenderer from '@/components/PageRenderer'
import { getAllPages, getPage, getSiteConfig } from '@/lib/content'
import { formatPostDate, getBlogPost, getBlogPosts } from '@/lib/blog'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd'
import { canonicalPath, canonicalUrl } from '@/lib/urls'

// Must be a literal (Next statically analyses it); keep in step with
// BLOG_REVALIDATE_SECONDS in lib/blog.ts.
export const revalidate = 3600

// Posts published in Clarion after the last build should still resolve, so
// unknown slugs are rendered on demand rather than 404'd outright.
export const dynamicParams = true

/**
 * Posts come from two places and both live under /blog/<slug> (T-17):
 *
 *  - Migrated WordPress articles, stored as content pages with
 *    pageType 'blog-post'. Kept as full section models rather than flattened to
 *    HTML so nothing is lost in translation.
 *  - Posts authored in Clarion's CMS, fetched server-side.
 *
 * Local pages win on slug collision: they are ours and versioned in the repo.
 */
function localPost(slug: string) {
  return getAllPages().find(
    (p) => p.pageType === 'blog-post' && p.slug === `blog/${slug}`
  )
}

export async function generateStaticParams() {
  const remote = await getBlogPosts()
  const local = getAllPages()
    .filter((p) => p.pageType === 'blog-post')
    .map((p) => p.slug.replace(/^blog\//, ''))
  return [...new Set([...local, ...remote.map((p) => p.slug)])].map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const path = canonicalPath(`/blog/${slug}`)

  const local = localPost(slug)
  if (local) {
    return {
      title: { absolute: local.seo.title },
      description: local.seo.description,
      alternates: { canonical: path },
      openGraph: {
        type: 'article',
        title: local.seo.title,
        description: local.seo.description,
        url: path,
        // Same replace-not-merge trap as the other routes.
        images: [{ url: '/og.jpg', width: 1200, height: 630, alt: local.seo.title }],
      },
    }
  }

  const post = await getBlogPost(slug)
  if (!post) return {}
  const title = post.seo.title ?? post.title
  const description = post.seo.description ?? post.excerpt ?? undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description,
      url: path,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl }]
        : [{ url: '/og.jpg', width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getSiteConfig()
  const { site } = config
  const url = canonicalUrl(site.url, `/blog/${slug}`)

  // --- Migrated local article ---------------------------------------------
  const local = localPost(slug)
  if (local) {
    const faqs = (local.sections ?? []).flatMap((s) => s.faqs ?? [])
    return (
      <>
        <PageRenderer page={local} config={config} showReviews={false} />
        <ArticleJsonLd
          headline={local.hero.headline}
          description={local.seo.description}
          url={url}
          siteName={site.name}
          siteUrl={site.url}
        />
        <BreadcrumbJsonLd
          siteUrl={site.url}
          trail={[
            { name: 'Blog', path: '/blog' },
            { name: local.hero.headline, path: `/blog/${slug}` },
          ]}
        />
        <FaqJsonLd faqs={faqs} />
      </>
    )
  }

  // --- Clarion-authored post ----------------------------------------------
  const post = await getBlogPost(slug)
  if (!post) notFound()

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
        url={url}
        siteName={site.name}
        siteUrl={site.url}
      />
      <BreadcrumbJsonLd
        siteUrl={site.url}
        trail={[
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
    </>
  )
}
