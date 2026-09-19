import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { Answer } from '@/ask/localAnswer'
import { Ask } from './Ask'

const llm: Answer = { mode: 'llm', text: 'Yes. He builds agentic systems at 73 Strings.', sources: [{ title: '73 Strings', href: '#experience' }] }

describe('Ask', () => {
  it('submits the typed question and shows the answer with sources', async () => {
    const askImpl = vi.fn(() => Promise.resolve(llm))
    render(<Ask askImpl={askImpl} />)
    const input = screen.getByRole('searchbox', { name: 'Ask about Abhrajeet' })
    const button = screen.getByRole('button', { name: /^Ask$/ })
    expect(button).toBeDisabled()
    await userEvent.type(input, 'Has he worked with AI?')
    expect(button).toBeEnabled()
    await userEvent.click(button)
    expect(askImpl).toHaveBeenCalledWith('Has he worked with AI?')
    const region = await screen.findByRole('region', { name: 'Answer' })
    expect(region).toHaveTextContent('Yes. He builds agentic systems at 73 Strings.')
    expect(screen.getByRole('link', { name: '73 Strings' })).toHaveAttribute('href', '#experience')
    expect(region).toHaveTextContent(/AI model/)
  })

  it('runs a suggestion chip and fills the input with it', async () => {
    const askImpl = vi.fn((q: string): Promise<Answer> => Promise.resolve({ mode: 'local', text: `local: ${q}`, sources: [] }))
    render(<Ask askImpl={askImpl} />)
    await userEvent.click(screen.getByRole('button', { name: 'Where did he study?' }))
    await waitFor(() => expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('local: Where did he study?'))
    expect(screen.getByRole('searchbox')).toHaveValue('Where did he study?')
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent(/from this site/)
  })

  it('shows an error state when asking throws', async () => {
    const askImpl = vi.fn(() => Promise.reject(new Error('boom')))
    render(<Ask askImpl={askImpl} />)
    await userEvent.type(screen.getByRole('searchbox'), 'anything')
    await userEvent.click(screen.getByRole('button', { name: /^Ask$/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/try again/i)
  })
})
