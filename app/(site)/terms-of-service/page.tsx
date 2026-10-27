import LegalPage, { legalMetadata } from '@/components/LegalPage'

/** /terms-of-service/ — terms of service and website disclaimer. See lib/legalPages.ts. */
export const metadata = legalMetadata(
  'terms-of-service',
  'The terms that govern use of the Des Moines Wellness Center website, including our website disclaimer.',
)

export default function TermsOfServicePage() {
  return <LegalPage slug="terms-of-service" />
}
