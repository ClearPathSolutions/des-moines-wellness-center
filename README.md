# Des Moines Wellness Center — Website

A fast, modern **Next.js 15** rebuild of [desmoinesrecovery.com](https://desmoinesrecovery.com),
migrated off WordPress/Elementor. All content, images, and structure were faithfully
extracted from the original site; the code is brand-new, optimized, and Vercel-ready.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** design system (forest-green / sage / gold brand palette)
- **next/font** (Fraunces + Inter) — self-hosted, zero layout shift
- **next/image** — all imagery served as optimized AVIF/WebP
- Fully **static** (SSG) — every page pre-rendered

## Content model

Page content lives as data, not markup, so it's easy to edit:

- `content/pages/*.json` — one file per page (hero, sections, FAQs, CTAs, images)
- `content/site.config.json` — nav, footer, brand, colors, fonts, collections
- `content/image-map.json` — maps original image paths → optimized local assets
- `public/images/` — 76 optimized images + logos (4.2 MB total, down from ~103 MB)

Components in `components/` render these models. To edit copy, change the JSON.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Deploy (Vercel)

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected, no config needed.
3. Verify the preview deployment, then point the `desmoinesrecovery.com` domain at it.

Or via CLI: `npm i -g vercel && vercel` (preview) / `vercel --prod` (production).

## Before going live

See **CONTENT-NOTES.md** for a short list of source-content items that need an owner
decision (a couple of copy-pasted SEO tags, testimonials that were dynamic on the old
site, the Wesley/Welsey slug, Google Maps API key, etc.).
