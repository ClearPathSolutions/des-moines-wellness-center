/** @type {import('next').NextConfig} */

// Third-party origins the site legitimately talks to. Kept in one place so the
// CSP below and any future review have a single list to check.
const VENDORS = {
  callTracking: 'https://264810.tctm.co',
  clarionScripts: 'https://www.clarionlabs.ai',
  clarionApi: 'https://api.clarionlabs.ai',
  clarionSocket: 'wss://*.clarionlabs.ai',
  trustindex: 'https://cdn.trustindex.io',
  // Keyless Google Maps embed (T-12).
  maps: 'https://www.google.com',
  // Google Tag Manager, plus the Google marketing endpoints a container
  // normally reaches once GA4 or Ads tags are configured in it. GTM can load
  // arbitrary tags, so this list covers the usual set rather than everything —
  // revisit it against the tags actually published in the container before
  // promoting the policy from report-only to enforcing.
  gtm: 'https://www.googletagmanager.com',
  // Note the bare host as well as the wildcard: the container collects to
  // `analytics.google.com`, and a CSP `*.analytics.google.com` does not match a
  // hostname with nothing in front of it.
  googleAnalytics:
    'https://analytics.google.com https://*.analytics.google.com https://www.google-analytics.com https://*.google-analytics.com',
  googleAds: 'https://*.doubleclick.net',
  // Microsoft Clarity (session replay + heatmaps) and the Bing pixel it links
  // to. Both arrive through the GTM container rather than from this codebase.
  clarity: 'https://*.clarity.ms',
  bing: 'https://c.bing.com',
}

// Every origin above was taken from the requests the published container
// actually makes, observed on a real page load, rather than from a generic
// allowlist. As of this commit GTM-WH4BQ54G publishes GA4 G-SLJ88ZSZ4L, Google
// Ads AW-18375305584 (including view-through conversion), Microsoft Clarity
// xye1rsrjkq and a Bing pixel. Tags can be added in the container without any
// change here, so re-check this list before promoting the policy from
// report-only to enforcing — a tag added later will be reported, not blocked,
// and is easy to miss.

// Reported, not enforced. The site loads four third-party scripts (call
// tracking, Clarion chat + form capture, Trustindex reviews) that inject their
// own styles and sub-resources; enforcing a policy before we have report data
// risks silently breaking the chat widget or the reviews carousel. Collect
// violations first, tighten, then promote to `Content-Security-Policy`.
const cspReportOnly = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${VENDORS.callTracking} ${VENDORS.clarionScripts} ${VENDORS.trustindex} ${VENDORS.gtm} ${VENDORS.googleAnalytics} ${VENDORS.googleAds} ${VENDORS.clarity}`,
  `style-src 'self' 'unsafe-inline' ${VENDORS.trustindex}`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${VENDORS.clarionApi} ${VENDORS.clarionSocket} ${VENDORS.callTracking} ${VENDORS.trustindex} ${VENDORS.gtm} ${VENDORS.googleAnalytics} ${VENDORS.googleAds} ${VENDORS.maps} ${VENDORS.clarity} ${VENDORS.bing}`,
  // callTracking is here for the FormReactor embed on /recovery-lp/, which is
  // an iframe on CTM's own host. Report-only today, so its absence was not
  // breaking the form — but it would have the moment this is enforced.
  `frame-src 'self' ${VENDORS.callTracking} ${VENDORS.trustindex} ${VENDORS.maps} ${VENDORS.gtm} ${VENDORS.googleAds}`,
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
  experimental: {
    // Inlining the stylesheet is a deliberate trade, not a free win, and it was
    // measured both ways (median of 5 Lighthouse mobile runs, third parties
    // blocked):
    //
    //              external CSS   inlined CSS
    //   perf             94            96
    //   LCP           2955 ms       2559 ms
    //   FCP           1535 ms       1684 ms
    //
    // The HTML document grows (~30 KB to ~45 KB gzipped) which costs first paint
    // ~150 ms, but dropping the render-blocking request frees the connection for
    // the preloaded hero image and buys ~400 ms of LCP. LCP carries 25% of the
    // mobile score against 10% each for FCP and Speed Index, so the trade nets
    // positive. Re-measure if the stylesheet grows a lot — the arithmetic
    // reverses once the document is big enough.
    inlineCss: true,
  },
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
        // mp4 belongs here too: the facility tour is 7.3 MB and the hero loop is
        // 1 MB, and without this they fell through to `max-age=0,
        // must-revalidate` and were revalidated on every visit.
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2|mp4)',
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

      // The facility does not offer Partial Hospitalization, so the page and
      // every PHP mention were removed — advertising it was an unsubstantiated
      // service claim. The URL is indexed and still returns 200 on live
      // production, so it is sent to the nearest level of care actually
      // offered rather than left to 404.
      {
        source: '/programs/php-des-moines/',
        destination: '/programs/des-moines-outpatient-rehab/',
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

      // Production's /therapies "Learn More" buttons point at flat, top-level
      // therapy slugs that have never existed — all six 404 there today. The
      // pages now exist, nested under /therapies/ to match how /programs and
      // /what-we-treat are organised. These redirects mean anyone following one
      // of the old buttons, or a bookmark, lands on the real page instead.
      { source: '/individual-therapy/', destination: '/therapies/individual-therapy/', permanent: true },
      { source: '/group-therapy/', destination: '/therapies/group-therapy/', permanent: true },
      { source: '/family-therapy/', destination: '/therapies/family-therapy/', permanent: true },
      { source: '/cognitive-behavioral-therapy/', destination: '/therapies/cognitive-behavioral-therapy/', permanent: true },
      { source: '/dialectical-behavior-therapy/', destination: '/therapies/dialectical-behavior-therapy/', permanent: true },
      { source: '/trauma-informed-care/', destination: '/therapies/trauma-informed-care/', permanent: true },

      // /emdr is linked from production's drug-rehab page and 404s there too.
      // We do not offer a dedicated EMDR page, so it goes to the therapies hub
      // rather than nowhere.
      { source: '/emdr/', destination: '/therapies/', permanent: true },
    ]
  },
}

export default nextConfig
