import { resume } from '@/content/resume'
import { SITE } from '@/content/site'
import type { ResumeContent } from '@/content/types'

/**
 * The site, flattened into small retrievable chunks. Built purely from content so the browser fallback
 * (localAnswer.ts) and the LLM endpoint (api/ask.ts) reason over exactly what the page shows.
 */
export interface Chunk {
  readonly id: string
  /** Page section the chunk belongs to; used for source links (`#experience`). */
  readonly section: 'about' | 'experience' | 'projects' | 'skills' | 'contact'
  /** Human title for the source, e.g. "73 Strings · Software Developer, Full Stack AI Engineer". */
  readonly title: string
  readonly text: string
}

export function buildChunks(content: ResumeContent = resume): readonly Chunk[] {
  const chunks: Chunk[] = []
  const { profile, experience, projects, skills, education, leadership, contacts } = content

  chunks.push({ id: 'profile', section: 'about', title: 'Profile', text: `${profile.fullName} is a ${profile.title} based in ${profile.location}. ${profile.summary}` })
  chunks.push({ id: 'about-lead', section: 'about', title: 'About', text: SITE.about.lead.body })
  for (const p of SITE.about.principles) chunks.push({ id: `about-${p.eyebrow.toLowerCase()}`, section: 'about', title: p.eyebrow, text: `${p.title} ${p.body}` })

  for (const role of experience) {
    const title = `${role.company} · ${role.role}`
    const when = `${role.period.label}${role.period.end === null ? ' (current role)' : ''}`
    chunks.push({ id: `${role.id}-summary`, section: 'experience', title, text: `${profile.firstName} worked at ${role.company} as ${role.role} in ${role.location}, ${when}. Technologies: ${role.tech.join(', ')}.` })
    role.highlights.forEach((h, i) => chunks.push({ id: `${role.id}-${i}`, section: 'experience', title, text: `At ${role.company} (${role.period.label}): ${h}` }))
  }

  for (const project of projects) {
    const title = `Project · ${project.name}`
    chunks.push({ id: `${project.id}-summary`, section: 'projects', title, text: `${project.name} (${project.category}): ${project.summary} Built with ${project.tech.join(', ')}.` })
    project.highlights.forEach((h, i) => chunks.push({ id: `${project.id}-${i}`, section: 'projects', title, text: `${project.name}: ${h}` }))
  }

  for (const group of skills) chunks.push({ id: `skills-${group.id}`, section: 'skills', title: `Skills · ${group.name}`, text: `${group.name}: ${group.skills.join(', ')}.` })

  for (const e of education) {
    chunks.push({ id: `edu-${e.id}`, section: 'about', title: `Education · ${e.institution}`, text: `${e.institution}: ${e.degree}, ${e.year}, ${e.score}.${e.coursework ? ` Coursework: ${e.coursework.join(', ')}.` : ''}` })
  }
  for (const l of leadership) {
    const title = `Leadership · ${l.organisation}`
    chunks.push({ id: `lead-${l.id}`, section: 'about', title, text: `${l.role} at ${l.organisation}, ${l.period.label}. ${l.highlights.join(' ')}` })
  }

  const channels = contacts.map((c) => `${c.label}: ${c.value}`).join('; ')
  chunks.push({ id: 'contact', section: 'contact', title: 'Contact', text: `You can reach ${profile.firstName} via ${channels}.` })
  return chunks
}

/** The whole knowledge base as one document for the LLM system prompt. Stable text, so it caches well. */
export function knowledgeDocument(chunks: readonly Chunk[] = buildChunks()): string {
  const bySection = new Map<string, Chunk[]>()
  for (const c of chunks) bySection.set(c.section, [...(bySection.get(c.section) ?? []), c])
  return [...bySection.entries()]
    .map(([section, items]) => `## ${section}\n${items.map((c) => `- [${c.title}] ${c.text}`).join('\n')}`)
    .join('\n\n')
}
