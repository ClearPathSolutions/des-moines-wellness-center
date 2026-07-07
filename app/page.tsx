import PageRenderer from '@/components/PageRenderer'
import { getPage, getSiteConfig } from '@/lib/content'
import { notFound } from 'next/navigation'

export default function HomePage() {
  const page = getPage('home')
  if (!page) notFound()
  const config = getSiteConfig()
  return <PageRenderer page={page} config={config} showAccreditations showReviews />
}
