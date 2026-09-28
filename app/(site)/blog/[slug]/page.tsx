import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Phone } from 'lucide-react'
import PageRenderer from '@/components/PageRenderer'
import ArticleByline from '@/components/ArticleByline'
import { getAllPages, getSiteConfig } from '@/lib/content'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { policyIsLive } from '@/lib/editorialPolicy'
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

/** A Clarion reviewer URL on this site's own host, as a local path, so the
 *  byline links internally and the schema @id matches the bio page's own. */
function ownPath(url: string | null, siteUrl: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const own = new URL(siteUrl)
    const bare = (h: string) => h.replace(/^www\./, '')
    return bare(u.hostname) === bare(own.hostname) ? canonicalPath(u.pathname) : null
  } catch {
    return null
  }
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
  const showPolicyLink = policyIsLive(config)

  // --- Migrated local article ---------------------------------------------
  const local = localPost(slug)
  if (local) {
    const faqs = (local.sections ?? []).flatMap((s) => s.faqs ?? [])
    const { writtenBy, reviewedBy, lastReviewed, modifiedAt } = local.byline ?? {}
    const modified = modifiedAt ?? local.publishedAt ?? null
    const bio = (p?: { bioPath?: string }) => (p?.bioPath ? canonicalPath(p.bioPath) : null)
    return (
      <>
        <PageRenderer
          page={local}
          config={config}
          showReviews={false}
          afterHero={
            <div className="container-page pt-8">
              <div className="mx-auto max-w-3xl">
                <ArticleByline
                  author={writtenBy ? { name: writtenBy.name, href: bio(writtenBy) } : null}
                  reviewer={
                    reviewedBy
                      ? { name: reviewedBy.name, href: bio(reviewedBy), credentials: reviewedBy.credentials }
                      : null
                  }
                  lastReviewed={lastReviewed}
                  modifiedAt={modified}
                  showPolicyLink={showPolicyLink}
                />
              </div>
            </div>
          }
        />
        <ArticleJsonLd
          headline={local.hero.headline}
          description={local.seo.description}
          datePublished={local.publishedAt ?? null}
          dateModified={modified}
          author={
            writtenBy
              ? { name: writtenBy.name, bioUrl: writtenBy.bioPath ? canonicalUrl(site.url, writtenBy.bioPath) : null }
              : null
          }
          reviewer={
            reviewedBy
              ? {
                  name: reviewedBy.name,
                  credentials: reviewedBy.credentials,
                  bioUrl: reviewedBy.bioPath ? canonicalUrl(site.url, reviewedBy.bioPath) : null,
                }
              : null
          }
          lastReviewed={lastReviewed}
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

  const reviewerPath = ownPath(post.reviewer?.url ?? null, site.url)
  const reviewer = post.reviewer
    ? {
        name: post.reviewer.name,
        credentials: post.reviewer.credentials,
        href: reviewerPath,
        bioUrl: reviewerPath ? canonicalUrl(site.url, reviewerPath) : null,
      }
    : null
  // Clarion has no review-date field, so its posts carry no reviewer line or
  // reviewedBy schema until it does. Wire the date in here when it exists.
  const lastReviewed: string | null = null

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

            <ArticleByline
              author={post.authorName ? { name: post.authorName } : null}
              reviewer={reviewer}
              lastReviewed={lastReviewed}
              modifiedAt={post.publishedAt}
              showPolicyLink={showPolicyLink}
            />

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
            <a href={site.phoneHref} className="btn-gold" suppressHydrationWarning>
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
        author={post.authorName ? { name: post.authorName } : null}
        reviewer={reviewer}
        lastReviewed={lastReviewed}
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
