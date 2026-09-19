import { localAnswer, type Answer, type Source } from './localAnswer'

/**
 * Ask the site a question. Tries the LLM endpoint first (api/ask.ts, deployed as a serverless function); when it is
 * absent, slow or failing, falls back to the in-browser retrieval answer so the box always works on static hosting.
 */

export const ASK_ENDPOINT: string = (import.meta.env.VITE_ASK_ENDPOINT as string | undefined) ?? '/api/ask'
const TIMEOUT_MS = 15_000

interface EndpointResponse {
  readonly answer: string
  readonly sources?: readonly Source[]
}

function isEndpointResponse(v: unknown): v is EndpointResponse {
  return typeof v === 'object' && v !== null && typeof (v as { answer?: unknown }).answer === 'string'
}

export async function ask(question: string, fetchImpl: typeof fetch = fetch): Promise<Answer> {
  const q = question.trim()
  if (!q) throw new Error('empty question')
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    const res = await fetchImpl(ASK_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ question: q }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer))
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('application/json')) throw new Error(`endpoint ${res.status}`)
    const data: unknown = await res.json()
    if (!isEndpointResponse(data)) throw new Error('bad endpoint payload')
    return { mode: 'llm', text: data.answer, sources: data.sources ?? [] }
  } catch {
    return localAnswer(q)
  }
}
