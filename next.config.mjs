/** @type {import('next').NextConfig} */

// Third-party origins the site legitimately talks to. Kept in one place so the
// CSP below and any future review have a single list to check.
const VENDORS = {
  callTracking: 'https://264810.tctm.co',
  clarionScripts: 'https://www.clarionlabs.ai',
  clarionApi: 'https://api.clarionlabs.ai',
  clarionSocket: 'wss://*.clarionlabs.ai',
  trustindex: 'https://cdn.trustindex.io',
}

// Reported, not enforced. The site loads four third-party scripts (call
// tracking, Clarion chat + form capture, Trustindex reviews) that inject their
// own styles and sub-resources; enforcing a policy before we have report data
// risks silently breaking the chat widget or the reviews carousel. Collect
// violations first, tighten, then promote to `Content-Security-Policy`.
const cspReportOnly = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${VENDORS.callTracking} ${VENDORS.clarionScripts} ${VENDORS.trustindex}`,
  `style-src 'self' 'unsafe-inline' ${VENDORS.trustindex}`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${VENDORS.clarionApi} ${VENDORS.clarionSocket} ${VENDORS.callTracking} ${VENDORS.trustindex}`,
  `frame-src 'self' ${VENDORS.trustindex}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
].join('; ')

// Applied to every route. `Referrer-Policy` is the load-bearing one here: on a
// substance-use-treatment site the URL itself is sensitive (a path like
// /what-we-treat/fentanyl-rehab-des-moines implies a condition), and without
// this header the full URL is sent to every third-party script in the Referer.
const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // T-03. Production is slash-canonical (`/about` 301s to `/about/`), and that
  // is what is indexed and linked today. Matching it means existing inbound
  // links stay direct hits instead of becoming redirects. See lib/urls.ts —
  // canonical, og:url and sitemap must all use the same form.
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Blog cover images come from Clarion's CMS, which currently serves them
      // from Unsplash. Routing them through next/image keeps them optimized and
      // avoids a raw hotlink.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.clarionlabs.ai' },
      { protocol: 'https', hostname: 'api.clarionlabs.ai' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  // Sources AND destinations are written in slashed form. With
  // trailingSlash: true, Next normalises to the slashed URL before matching,
  // so a slashless source never matches the indexed URL, and a slashless
  // destination adds a second hop. Both sides slashed = one hop, which is
  // what T-13's "no redirect chains" criterion requires.
  async redirects() {
    return [
      // The team slug preserves the original site's misspelling ("welsey") to
      // keep its indexed URL. Anyone typing or linking the correct spelling —
      // including our own page title, which reads "Wesley Starlin" — hit a 404.
      {
        source: '/team/wesley-starlin/',
        destination: '/team/welsey-starlin/',
        permanent: true,
      },

      // T-17: blog posts move off root-level slugs onto /blog/<slug>. Root-level
      // post URLs share a namespace with page slugs, which is a collision risk
      // as pages are added. Both of these are live and indexed on production, so
      // each needs a permanent redirect at cutover.
      {
        source: '/how-long-does-percocet-stay-in-your-system/',
        destination: '/blog/how-long-does-percocet-stay-in-your-system/',
        permanent: true,
      },
      {
        source: '/how-alcohol-addiction-can-impact-every-area-of-life/',
        destination: '/blog/how-alcohol-addiction-can-impact-every-area-of-life/',
        permanent: true,
      },

      // Two WordPress taxonomy templates, deliberately not rebuilt: both are
      // thin, indexable pages with no unique content (T-04/T-13). Sent to the
      // blog rather than 410'd so any inbound link lands somewhere useful.
      { source: '/author/cpts/', destination: '/blog/', permanent: true },
      { source: '/category/uncategorized/', destination: '/blog/', permanent: true },
    ]
  },
}

export default nextConfig
