import { useId, useRef, useState, type FormEvent } from 'react'
import { ask } from '@/ask/client'
import type { Answer } from '@/ask/localAnswer'
import { SITE } from '@/content'
import { ArrowUpRight, Search } from './icons'

type Status = 'idle' | 'loading' | 'done' | 'error'

/**
 * Hero search: ask anything about Abhrajeet and get a grounded answer from the site's own content. Renders as a
 * plain form on the server; behaviour attaches on hydration. Works without the LLM endpoint via local retrieval.
 */
export function Ask({ askImpl = ask }: { readonly askImpl?: typeof ask }) {
  const id = useId()
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [answer, setAnswer] = useState<Answer | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function submit(q: string) {
    const trimmed = q.trim()
    if (!trimmed || status === 'loading') return
    setQuestion(trimmed)
    setStatus('loading')
    try {
      setAnswer(await askImpl(trimmed))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void submit(question)
  }

  return (
    <div className="ask" data-status={status}>
      <form className="ask-form" role="search" aria-label={SITE.ask.label} onSubmit={onSubmit}>
        <label htmlFor={id} className="visually-hidden">
          {SITE.ask.label}
        </label>
        <span className="ask-icon" aria-hidden="true">
          <Search />
        </span>
        <input
          id={id}
          ref={inputRef}
          className="ask-input"
          type="search"
          name="q"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={400}
          placeholder={SITE.ask.placeholder}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="ask-submit" type="submit" disabled={status === 'loading' || question.trim() === ''}>
          {status === 'loading' ? SITE.ask.thinking : SITE.ask.submit}
          <ArrowUpRight />
        </button>
      </form>

      <ul className="ask-suggestions" aria-label="Example questions">
        {SITE.ask.suggestions.map((s) => (
          <li key={s}>
            <button type="button" onClick={() => void submit(s)} disabled={status === 'loading'}>
              {s}
            </button>
          </li>
        ))}
      </ul>

      {status === 'error' ? (
        <p className="ask-answer" role="alert">
          {SITE.ask.error}
        </p>
      ) : null}
      {status === 'done' && answer ? (
        <div className="ask-answer" role="region" aria-live="polite" aria-label="Answer">
          <p>{answer.text}</p>
          {answer.sources.length > 0 ? (
            <p className="ask-sources">
              <span>{SITE.ask.sources}</span>
              {answer.sources.map((s) => (
                <a key={s.title} href={s.href}>
                  {s.title}
                </a>
              ))}
            </p>
          ) : null}
          <p className="ask-mode">{answer.mode === 'llm' ? SITE.ask.modeLlm : SITE.ask.modeLocal}</p>
        </div>
      ) : null}
    </div>
  )
}
