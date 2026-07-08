import imageMap from '@/content/image-map.json'

type Entry = { out: string; width: number; height: number }
const MAP = imageMap as Record<string, Entry>

/** Normalize any original src (full URL, relative, ../ prefixed, querystring) to the
 *  canonical `wp-content/uploads/...` key used in the image map. */
export function canonicalKey(src: string): string {
  if (!src) return ''
  let s = src.split('?')[0].split('#')[0]
  s = s.replace(/^https?:\/\/[^/]+\//, '') // strip protocol + host
  s = s.replace(/^(\.\.\/)+/, '') // strip ../
  s = s.replace(/^\/+/, '') // strip leading slash
  return s
}

export function resolveImage(src?: string): Entry | null {
  if (!src) return null
  const key = canonicalKey(src)
  return MAP[key] ?? null
}

export type Orientation = 'portrait' | 'landscape' | 'square'

/** Classify a mirrored image by its intrinsic aspect ratio so callers can pick a
 *  frame that matches the source instead of cropping a portrait into a landscape
 *  box (the cause of "heads cut off" on team photos). */
export function orientation(src?: string): Orientation | null {
  const img = resolveImage(src)
  if (!img) return null
  const ratio = img.width / img.height
  if (ratio <= 0.92) return 'portrait'
  if (ratio >= 1.1) return 'landscape'
  return 'square'
}
