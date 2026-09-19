import { buildChunks, type Chunk } from './knowledge'

/**
 * Browser-only fallback: lexical retrieval over the knowledge chunks, no network. Used when the LLM endpoint is
 * not deployed or unreachable, so the search box always answers from the site's own content.
 */

export interface Source {
  readonly title: string
  readonly href: string
}

export interface Answer {
  readonly text: string
  readonly sources: readonly Source[]
  /** "llm" when produced by the endpoint, "local" when produced here. */
  readonly mode: 'llm' | 'local'
}

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'does', 'do', 'did', 'he', 'his', 'him', 'what', 'which', 'who', 'where', 'when', 'how', 'any', 'with', 'in', 'on', 'at', 'of', 'to', 'for', 'and', 'or', 'about', 'tell', 'me', 'abhrajeet', 'abrajeet', 'mukherjee', 'experience', 'experienced', 'worked', 'work', 'know', 'knows', 'used', 'use', 'skills', 'skill', 'you', 'your', 'can', 'could', 'please'])

/** Query-side synonym expansion so "AI" reaches "LLM", "agent", "RAG" chunks and so on. */
const SYNONYMS: Record<string, readonly string[]> = {
  ai: ['llm', 'agent', 'agentic', 'rag', 'orchestration', 'genai', 'ml', 'machine', 'learning', 'model', 'multimodal', 'prompt', 'sidebar', 'sheriff'],
  ml: ['pytorch', 'tensorflow', 'scikit', 'transformers', 'learning', 'speech', 'sentiment'],
  llm: ['ai', 'agent', 'agentic', 'rag', 'orchestration', 'prompt'],
  agents: ['agent', 'agentic', 'sidebar', 'sheriff'],
  backend: ['api', 'apis', 'spring', 'node', 'fastapi', 'orchestration', 'services'],
  frontend: ['react', 'angular', 'next', 'flutter', 'ui', 'modules'],
  cloud: ['aws', 'azure', 's3', 'docker'],
  database: ['postgresql', 'redis', 'elasticsearch'],
  finance: ['financial', 'valuation', 'private', 'equity', 'pe', 'fund', 'portfolio', 'nav', 'investment'],
  fintech: ['financial', 'valuation', 'private', 'equity', 'fund', 'portfolio'],
  education: ['bits', 'pilani', 'degree', 'cgpa', 'engineering', 'school'],
  study: ['bits', 'pilani', 'degree', 'engineering'],
  college: ['bits', 'pilani', 'degree', 'engineering'],
  university: ['bits', 'pilani', 'degree', 'engineering'],
  leadership: ['led', 'coordinator', 'team', 'quark', 'fest'],
  lead: ['led', 'coordinator', 'team'],
  contact: ['email', 'linkedin', 'phone', 'reach'],
  email: ['contact', 'reach'],
  hire: ['contact', 'email', 'linkedin', 'open'],
  company: ['73', 'strings', 'unity', 'growth', 'fund'],
  job: ['73', 'strings', 'role', 'engineer', 'developer'],
  current: ['present', 'currently'],
  languages: ['python', 'java', 'c++', 'typescript'],
  language: ['python', 'java', 'c++', 'typescript'],
  voice: ['speech', 'sentiment', 'audio', 'acoustic'],
  '3d': ['three.js', 'visualisation', 'marketostate'],
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((t) => t.length > 1)
}

function stem(t: string): string {
  return t.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '')
}

export function expandQuery(question: string): { readonly terms: Set<string>; readonly expanded: Set<string> } {
  const terms = new Set(tokenize(question).filter((t) => !STOP.has(t)).map(stem))
  const expanded = new Set(terms)
  for (const t of terms) for (const s of SYNONYMS[t] ?? []) expanded.add(stem(s))
  return { terms, expanded }
}

export interface Scored {
  readonly chunk: Chunk
  readonly score: number
}

export function rank(question: string, chunks: readonly Chunk[] = buildChunks()): Scored[] {
  const { terms, expanded } = expandQuery(question)
  if (expanded.size === 0) return []
  const docs = chunks.map((chunk) => ({ chunk, tokens: tokenize(`${chunk.title} ${chunk.text}`).map(stem) }))
  const df = new Map<string, number>()
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1)
  const n = docs.length
  return docs
    .map(({ chunk, tokens }) => {
      let score = 0
      const bag = new Map<string, number>()
      for (const t of tokens) bag.set(t, (bag.get(t) ?? 0) + 1)
      for (const q of expanded) {
        const tf = bag.get(q) ?? 0
        if (tf === 0) continue
        const idf = Math.log(1 + n / (df.get(q) ?? 1))
        const weight = terms.has(q) ? 1 : 0.6 // synonyms count less than the user's own words
        score += weight * idf * (tf / (tf + 1.2))
      }
      return { chunk, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
}

const YES_NO = /^(has|have|had|does|do|did|is|are|was|were|can|could)\b/i

/** Compose a short grounded answer from the top-ranked chunks. */
export function localAnswer(question: string, chunks: readonly Chunk[] = buildChunks()): Answer {
  const ranked = rank(question, chunks)
  if (ranked.length === 0) {
    return {
      mode: 'local',
      text: 'The site does not cover that. It describes Abhrajeet’s experience at 73 Strings and Unity Growth Fund, his projects, skills, education and how to reach him. Try asking about one of those.',
      sources: [],
    }
  }
  const top = ranked.slice(0, 3)
  const yesNo = YES_NO.test(question.trim())
  const lead = yesNo ? 'Yes. ' : ''
  const body = top.map((s) => s.chunk.text).join(' ')
  const sources = dedupe(top.map((s) => ({ title: s.chunk.title, href: `#${s.chunk.section}` })))
  return { mode: 'local', text: `${lead}${body}`, sources }
}

function dedupe(sources: readonly Source[]): Source[] {
  const seen = new Set<string>()
  return sources.filter((s) => (seen.has(s.title) ? false : (seen.add(s.title), true)))
}
