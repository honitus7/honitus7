import { ask, ASK_ENDPOINT } from './client'

function response(body: unknown, init: { status?: number; type?: string } = {}) {
  return new Response(JSON.stringify(body), { status: init.status ?? 200, headers: { 'content-type': init.type ?? 'application/json' } })
}

describe('ask', () => {
  it('uses the endpoint answer when it responds with JSON', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(response({ answer: 'Yes, at 73 Strings.', sources: [{ title: 'x', href: '#experience' }] })))
    const a = await ask('Has he worked with AI?', fetchImpl)
    expect(a).toEqual({ mode: 'llm', text: 'Yes, at 73 Strings.', sources: [{ title: 'x', href: '#experience' }] })
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(ASK_ENDPOINT)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({ question: 'Has he worked with AI?' })
  })

  it('falls back to local retrieval when the endpoint is missing (404 HTML)', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(new Response('<!doctype html>', { status: 404, headers: { 'content-type': 'text/html' } })))
    const a = await ask('Has he worked with AI?', fetchImpl)
    expect(a.mode).toBe('local')
    expect(a.text).toMatch(/^Yes\./)
  })

  it('falls back when the network fails or the payload is malformed', async () => {
    const failing = vi.fn(() => Promise.reject(new TypeError('offline')))
    expect((await ask('Where did he study?', failing as unknown as typeof fetch)).mode).toBe('local')
    const malformed = vi.fn(() => Promise.resolve(response({ nope: true })))
    expect((await ask('Where did he study?', malformed as unknown as typeof fetch)).mode).toBe('local')
  })

  it('rejects an empty question', async () => {
    await expect(ask('   ')).rejects.toThrow('empty question')
  })
})
