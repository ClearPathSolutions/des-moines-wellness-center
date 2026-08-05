import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageRenderer from '@/components/PageRenderer'
import BlogPostList from '@/components/BlogPostList'
import { getPage, getSiteConfig } from '@/lib/content'
import { getBlogPosts } from '@/lib/blog'

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
    alternates: { canonical: '/blog' },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: '/blog',
    },
  }
}

export default async function BlogIndexPage() {
  const page = getPage(SLUG)
  if (!page) notFound()

  const config = getSiteConfig()
  const posts = await getBlogPosts()

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
