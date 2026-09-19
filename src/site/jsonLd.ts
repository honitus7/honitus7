import type { ResumeContent } from '@/content/types'

/** schema.org Person, built purely from résumé content and emitted by the static page. */
export interface PersonJsonLd {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'Person'
  readonly name: string
  readonly jobTitle: string
  readonly description: string
  readonly alumniOf?: { readonly '@type': 'CollegeOrUniversity'; readonly name: string }
  readonly worksFor?: { readonly '@type': 'Organization'; readonly name: string }
  readonly sameAs: readonly string[]
  readonly email?: string
  readonly telephone?: string
  readonly address: { readonly '@type': 'PostalAddress'; readonly addressLocality: string; readonly addressCountry?: string }
}

export function personJsonLd(content: ResumeContent): PersonJsonLd {
  const { profile, contacts, education, experience } = content
  const email = contacts.find((c) => c.id === 'email')
  const phone = contacts.find((c) => c.id === 'phone')
  const [locality = profile.location, country] = profile.location.split(',').map((s) => s.trim())
  const university = education[0]
  const current = experience.find((r) => r.period.end === null)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.title,
    description: profile.summary,
    sameAs: contacts.filter((c) => c.id === 'linkedin' || c.id === 'github').map((c) => c.href),
    address: { '@type': 'PostalAddress', addressLocality: locality, ...(country ? { addressCountry: country } : {}) },
    ...(university ? { alumniOf: { '@type': 'CollegeOrUniversity', name: university.institution } } : {}),
    ...(current ? { worksFor: { '@type': 'Organization', name: current.company } } : {}),
    ...(email ? { email: email.value } : {}),
    ...(phone ? { telephone: phone.value } : {}),
  }
}

/** JSON safe to embed in a <script> tag: `<` is escaped so `</script>` can never terminate the block early. */
export function serializeJsonLd(data: PersonJsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
