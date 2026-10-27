import LegalPage, { legalMetadata } from '@/components/LegalPage'

/** /sms-terms/ — text-messaging terms. See lib/legalPages.ts. */
export const metadata = legalMetadata(
  'sms-terms',
  'How text-message communications from Des Moines Wellness Center work: program description, cost, opt-out, and privacy.',
)

export default function SmsTermsPage() {
  return <LegalPage slug="sms-terms" />
}
