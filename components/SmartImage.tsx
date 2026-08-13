import Image from 'next/image'
import { resolveImage } from '@/lib/images'

type Props = {
  src?: string
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
}

/** Renders a mirrored content image via next/image, resolving the original
 *  WordPress src to the optimized local asset + intrinsic dimensions.
 *
 *  `priority` alone is not enough. Next passes `fetchPriority` straight through
 *  from props and never derives it from `priority`, so `<Image priority />` emits
 *  the preload link and eager loading but no priority hint — Lighthouse's LCP
 *  request-discovery check fails on every page for exactly that reason. Since
 *  every hero on the site renders through here, tying the two together fixes the
 *  LCP hint sitewide. */
export default function SmartImage({ src, alt = '', className, sizes, priority, fill }: Props) {
  const img = resolveImage(src)
  if (!img) return null

  const fetchPriority = priority ? 'high' : undefined

  if (fill) {
    return (
      <Image
        src={img.out}
        alt={alt}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        fetchPriority={fetchPriority}
        className={className}
      />
    )
  }

  return (
    <Image
      src={img.out}
      alt={alt}
      width={img.width}
      height={img.height}
      sizes={sizes}
      priority={priority}
      fetchPriority={fetchPriority}
      className={className}
    />
  )
}
