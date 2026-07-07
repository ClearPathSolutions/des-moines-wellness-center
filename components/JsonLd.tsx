import type { SiteConfig } from '@/lib/types'

export default function LocalBusinessJsonLd({ config }: { config: SiteConfig }) {
  const { site } = config
  const data = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'MedicalClinic'],
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og.jpg`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.687,
      longitude: -93.708,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: [
      { '@type': 'City', name: 'Des Moines' },
      { '@type': 'City', name: 'West Des Moines' },
      { '@type': 'City', name: 'Ankeny' },
      { '@type': 'AdministrativeArea', name: 'Polk County' },
    ],
    medicalSpecialty: 'Addiction Medicine',
    description: site.tagline,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
