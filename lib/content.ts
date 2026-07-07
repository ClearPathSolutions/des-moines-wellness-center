import fs from 'node:fs'
import path from 'node:path'
import type { PageModel, SiteConfig } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PAGES_DIR = path.join(CONTENT_DIR, 'pages')

function flat(slug: string) {
  return slug.replace(/\//g, '__')
}

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'site.config.json'), 'utf-8')
  return JSON.parse(raw) as SiteConfig
}

export function getPage(slug: string): PageModel | null {
  const file = path.join(PAGES_DIR, `${flat(slug)}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as PageModel
}

export function getAllPages(): PageModel[] {
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(PAGES_DIR, f), 'utf-8')) as PageModel)
}

export function getPagesByType(pageType: string): PageModel[] {
  return getAllPages().filter((p) => p.pageType === pageType)
}
