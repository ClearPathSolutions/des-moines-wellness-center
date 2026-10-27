import LegalPage, { legalMetadata } from '@/components/LegalPage'

/** /privacy-policy/ — the portfolio privacy policy. See lib/legalPages.ts. */
export const metadata = legalMetadata(
  'privacy-policy',
  'How Des Moines Wellness Center collects, uses, discloses, and protects information when you visit desmoinesrecovery.com or contact our admissions team.',
)

export default function PrivacyPolicyPage() {
  return <LegalPage slug="privacy-policy" />
}
