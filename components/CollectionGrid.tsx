import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PageModel } from '@/lib/types'
import { GRID_WRAP, gridItem } from '@/lib/layout'
import SmartImage from './SmartImage'

function routeFor(slug: string) {
  return slug === 'home' ? '/' : `/${slug}`
}

type Props = {
  heading?: string
  subheading?: string
  pages: PageModel[]
  alt?: boolean
}

export default function CollectionGrid({ heading, subheading, pages, alt }: Props) {
  return (
    <section className={`section ${alt ? 'bg-white' : 'bg-cream'}`}>
      <div className="container-page">
        {heading ? (
          <div className="mb-10 max-w-2xl">
            <h2>{heading}</h2>
            {subheading ? <p className="prose-brand mt-4 text-lg">{subheading}</p> : null}
          </div>
        ) : null}
        <div className={GRID_WRAP}>
          {pages.map((p) => {
            const img = p.hero?.image?.src
            return (
              <Link
                key={p.slug}
                href={routeFor(p.slug)}
                className={`${gridItem(pages.length)} group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-transform hover:-translate-y-1`}
              >
                {img ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SmartImage
                      src={img}
                      alt={p.hero.image!.alt}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg">{p.hero?.headline ?? p.seo.title}</h3>
                  {p.hero?.subhead ? (
                    <p className="prose-brand mt-2 line-clamp-3 text-base">{p.hero.subhead}</p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
                    Learn more <ArrowRight className="h-4 w-4 transition-all" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
