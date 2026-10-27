import LegalPage, { legalMetadata } from '@/components/LegalPage'

/** /notice-of-privacy-practices/ — interim HHS-model notice. See lib/legalPages.ts. */
export const metadata = legalMetadata(
  'notice-of-privacy-practices',
  'How Des Moines Wellness Center may use and disclose your protected health information, and your rights regarding that information.',
)

export default function NoticeOfPrivacyPracticesPage() {
  return <LegalPage slug="notice-of-privacy-practices" />
}
