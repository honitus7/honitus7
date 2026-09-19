import { render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { resume, SITE } from '@/content'
import { Site } from './Site'

describe('Site', () => {
  it('renders the hero H1 as the LCP element', () => {
    render(<Site />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(SITE.hero.h1)
    expect(h1).toHaveAttribute('data-lcp', 'h1')
  })

  it('has one section per nav link, each labelled by a heading', () => {
    const { container } = render(<Site />)
    for (const link of SITE.nav) {
      const section = container.querySelector(`section#${link.id}`)
      expect(section, `section #${link.id}`).not.toBeNull()
      const labelledBy = section?.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
      expect(container.querySelector(`#${labelledBy}`)).not.toBeNull()
    }
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    for (const link of SITE.nav) {
      const links = within(nav).getAllByRole('link', { name: link.label })
      expect(links).toHaveLength(2) // desktop list + mobile menu
      for (const a of links) expect(a).toHaveAttribute('href', `#${link.id}`)
    }
  })

  it('shows every role, project and skill group from the résumé', () => {
    render(<Site />)
    for (const role of resume.experience) {
      expect(screen.getByRole('heading', { level: 3, name: role.role })).toBeInTheDocument()
      for (const h of role.highlights) expect(screen.getByText(h)).toBeInTheDocument()
    }
    for (const project of resume.projects) expect(screen.getByRole('heading', { level: 3, name: project.name })).toBeInTheDocument()
    for (const skill of resume.skills.flatMap((g) => g.skills)) expect(screen.getAllByText(new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length).toBeGreaterThan(0)
  })

  it('links the résumé PDF and the contact channels', () => {
    render(<Site />)
    const pdf = screen.getAllByRole('link', { name: /résumé/i })
    expect(pdf.length).toBeGreaterThan(0)
    for (const a of pdf) expect(a).toHaveAttribute('href', '/Abhrajeet_Mukherjee_Resume_2026.pdf')
    const email = resume.contacts.find((c) => c.id === 'email')!
    expect(screen.getAllByRole('link', { name: email.value }).length).toBeGreaterThan(0)
    const linkedin = resume.contacts.find((c) => c.id === 'linkedin')!
    for (const a of screen.getAllByRole('link', { name: 'LinkedIn' })) {
      expect(a).toHaveAttribute('href', linkedin.href)
      expect(a).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it('renders to a string with Person JSON-LD (prerender path)', () => {
    const html = renderToString(<Site />)
    expect(html).toContain('<h1')
    expect(html).toMatch(/<script type="application\/ld\+json">[\s\S]*"@type":"Person"/)
    expect(html).not.toContain('</script><')
  })
})
