import { buildChunks, knowledgeDocument, thirdPerson } from './knowledge'
import { expandQuery, localAnswer, rank, tokenize } from './localAnswer'

describe('knowledge', () => {
  const chunks = buildChunks()

  it('covers every section and every résumé highlight', () => {
    const sections = new Set(chunks.map((c) => c.section))
    expect([...sections].sort()).toEqual(['about', 'contact', 'experience', 'projects', 'skills'])
    expect(chunks.some((c) => c.text.includes('Sheriff validation agent'))).toBe(true)
    expect(chunks.some((c) => c.text.includes('BITS Pilani'))).toBe(true)
    expect(chunks.some((c) => c.text.includes('abhrajeet2002@gmail.com'))).toBe(true)
  })

  it('rewrites first-person page copy into the third person', () => {
    expect(thirdPerson('At 73 Strings I build systems. My interest began early, and I still treat it as core.', 'Abhrajeet')).toBe(
      'At 73 Strings he builds systems. His interest began early, and he still treats it as core.',
    )
    expect(chunks.find((c) => c.id === 'about-lead')?.text).not.toMatch(/\bI\b/)
  })

  it('has unique ids', () => {
    expect(new Set(chunks.map((c) => c.id)).size).toBe(chunks.length)
  })

  it('renders a stable document grouped by section', () => {
    const doc = knowledgeDocument(chunks)
    expect(doc).toContain('## experience')
    expect(doc).toContain('[73 Strings · Software Developer, Full Stack AI Engineer]')
    expect(knowledgeDocument(chunks)).toBe(doc)
  })
})

describe('retrieval', () => {
  it('tokenizes and drops stop words, expanding synonyms', () => {
    expect(tokenize('Has Abhrajeet worked with AI & C++?')).toEqual(['has', 'abhrajeet', 'worked', 'with', 'ai', 'c++'])
    const { terms, expanded } = expandQuery('Has Abhrajeet had AI experience?')
    expect([...terms]).toEqual(['ai'])
    expect(expanded.has('llm')).toBe(true)
    expect(expanded.has('agent')).toBe(true)
  })

  it('ranks AI questions to the 73 Strings agent work', () => {
    const top = rank('Has Abhrajeet had AI experience?').slice(0, 3)
    expect(top.length).toBeGreaterThan(0)
    expect(top.some((s) => /73 Strings|Gen AI|LLM/i.test(`${s.chunk.title} ${s.chunk.text}`))).toBe(true)
  })

  it('ranks education questions to BITS Pilani', () => {
    const top = rank('Where did he study?')[0]
    expect(top?.chunk.text).toContain('BITS Pilani')
  })

  it('ranks contact questions to the contact chunk', () => {
    expect(rank('How can I contact him by email?')[0]?.chunk.id).toBe('contact')
  })
})

describe('localAnswer', () => {
  it('answers yes/no questions with a lead and sources', () => {
    const a = localAnswer('Has Abhrajeet worked with AI?')
    expect(a.mode).toBe('local')
    expect(a.text.startsWith('Yes. ')).toBe(true)
    expect(a.sources.length).toBeGreaterThan(0)
    for (const s of a.sources) expect(s.href).toMatch(/^#(about|experience|projects|skills|contact)$/)
  })

  it('says when the site does not cover a topic', () => {
    const a = localAnswer('What is the weather on Mars?')
    expect(a.sources).toEqual([])
    expect(a.text).toMatch(/does not cover/)
  })
})
