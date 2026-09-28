import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialPolicyJsonLd } from '@/components/JsonLd'
import { getSiteConfig } from '@/lib/content'
import {
  EDITORIAL_POLICY_PATH,
  policyBlockers,
  policyDescription,
  policyFields,
  policyIsRenderable,
  renderPolicyHtml,
} from '@/lib/editorialPolicy'

/**
 * /editorial-policy/ — the portfolio's shared editorial policy.
 *
 * The copy is content/editorial-policy.html, merged with this site's fields;
 * see lib/editorialPolicy.ts for why it is not authored here, and for the
 * launch gate that keeps this route a 404 in production until the policy has
 * every field and a content sign-off.
 */
export function generateMetadata(): Metadata {
  const config = getSiteConfig()
  if (!policyIsRenderable(config)) return {}
  const fields = policyFields(config)
  const title = `Editorial Policy | ${fields.FACILITY_NAME}`
  const description = policyDescription(fields)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: EDITORIAL_POLICY_PATH },
    openGraph: {
      title,
      description,
      url: EDITORIAL_POLICY_PATH,
      // Next replaces the layout's openGraph rather than merging it.
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: title }],
    },
  }
}

export default function EditorialPolicyPage() {
  const config = getSiteConfig()
  if (!policyIsRenderable(config)) notFound()

  const blockers = policyBlockers(config)
  const html = renderPolicyHtml(policyFields(config))

  return (
    <>
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            {/* Only reachable in `next dev`: production 404s while blocked. */}
            {blockers.length ? (
              <div className="mb-8 rounded-xl border border-gold bg-cream p-4 text-sm text-brand-dark">
                <strong>Preview only. Not live.</strong> Missing: {blockers.join(', ')}. Set these in
                content/site.config.json. Production builds serve a 404 until all are filled.
              </div>
            ) : null}
            <div
              className="prose-brand prose-post"
              // First-party template from the editorial policy package; the only
              // interpolated values are escaped site-config fields.
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </section>
      <EditorialPolicyJsonLd config={config} />
    </>
  )
}
