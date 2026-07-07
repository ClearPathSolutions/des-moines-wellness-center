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
 *  WordPress src to the optimized local asset + intrinsic dimensions. */
export default function SmartImage({ src, alt = '', className, sizes, priority, fill }: Props) {
  const img = resolveImage(src)
  if (!img) return null

  if (fill) {
    return (
      <Image
        src={img.out}
        alt={alt}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
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
      className={className}
    />
  )
}
