import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageRenderer from '@/components/PageRenderer'
import BlogPostList from '@/components/BlogPostList'
import { getAllPages, getPage, getSiteConfig } from '@/lib/content'
import { getBlogPosts } from '@/lib/blog'
import { canonicalPath } from '@/lib/urls'

// A dedicated route rather than the [...slug] catch-all so that only the blog
// revalidates against Clarion's feed — the other 34 pages stay fully static.
// Must be a literal (Next statically analyses it); keep in step with
// BLOG_REVALIDATE_SECONDS in lib/blog.ts.
export const revalidate = 3600

const SLUG = 'blog'

export function generateMetadata(): Metadata {
  const page = getPage(SLUG)
  if (!page) return {}
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: canonicalPath('/blog') },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: canonicalPath('/blog'),
      // Explicit: Next replaces the parent openGraph rather than merging, so
      // without this the layout's default card is dropped.
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: page.hero?.headline ?? page.seo.title }],
    },
  }
}

export default async function BlogIndexPage() {
  const page = getPage(SLUG)
  if (!page) notFound()

  const config = getSiteConfig()

  // Two sources, one index (T-17/T-24): articles migrated from WordPress live as
  // content pages with pageType 'blog-post'; newer posts are authored in
  // Clarion. Local ones win on slug collision.
  const remote = await getBlogPosts()
  const local = getAllPages()
    .filter((p) => p.pageType === 'blog-post')
    .map((p) => ({
      slug: p.slug.replace(/^blog\//, ''),
      title: p.hero.headline,
      excerpt: p.seo.description || null,
      coverImageUrl: null,
      authorName: null,
      publishedAt: null,
      seo: { title: p.seo.title, description: p.seo.description },
    }))
  const localSlugs = new Set(local.map((p) => p.slug))
  const posts = [...local, ...remote.filter((p) => !localSlugs.has(p.slug))]

  // The JSON still carries the migrated placeholder post list ("hub-list"),
  // which would duplicate the real feed below it.
  const renderPage = {
    ...page,
    sections: (page.sections ?? []).filter((s) => s.kind !== 'hub-list'),
  }

  return (
    <PageRenderer
      page={renderPage}
      config={config}
      afterHero={
        <BlogPostList
          posts={posts}
          phone={config.site.phone}
          phoneHref={config.site.phoneHref}
        />
      }
    />
  )
}
