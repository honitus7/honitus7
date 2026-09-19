import { resume } from '@/content'
import { personJsonLd, serializeJsonLd } from './jsonLd'

describe('personJsonLd', () => {
  const person = personJsonLd(resume)

  it('describes the person from résumé content', () => {
    expect(person['@type']).toBe('Person')
    expect(person.name).toBe(resume.profile.fullName)
    expect(person.jobTitle).toBe(resume.profile.title)
    expect(person.address.addressLocality).toBe('Bengaluru')
    expect(person.address.addressCountry).toBe('India')
    expect(person.alumniOf?.name).toBe('BITS Pilani')
    expect(person.worksFor?.name).toBe('73 Strings')
    expect(person.email).toBe('abhrajeet2002@gmail.com')
  })

  it('lists LinkedIn and GitHub as sameAs', () => {
    expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringContaining('linkedin.com'), expect.stringContaining('github.com')]))
  })

  it('serialises without a raw "<" so it is safe inside a script tag', () => {
    const out = serializeJsonLd({ ...person, description: '</script><img src=x>' })
    expect(out).not.toContain('<')
    expect((JSON.parse(out) as { description: string }).description).toBe('</script><img src=x>')
  })
})
