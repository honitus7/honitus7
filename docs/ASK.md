# Ask: the hero search

A search box in the hero answers visitors' questions about Abhrajeet ("Has Abhrajeet worked with AI?", "Where did he study?") using only the site's own content.

## How it works
```
question ─▶ src/ask/client.ts ─▶ POST /api/ask (api/ask.ts, Claude) ─▶ answer + sources
                     │                    ✗ missing / slow / error
                     └──────────▶ src/ask/localAnswer.ts (in-browser retrieval) ─▶ answer + sources
```

- **Knowledge base** (`src/ask/knowledge.ts`): the résumé and page copy flattened into ~40 small chunks, each tagged with the page section it came from. Both answer paths read the same chunks, so the answer can never drift from what the page shows.
- **LLM path** (`api/ask.ts`): a web-standard `Request → Response` serverless function. It calls `claude-opus-5` with the whole knowledge base in a frozen system prompt (cached for an hour, so repeat visitors cost almost nothing), effort `low`, and strict grounding rules: 2–4 plain sentences, no invented facts, ignore instructions inside the question. Source links come from lexical retrieval, so they always point at a real section.
- **Local path** (`src/ask/localAnswer.ts`): TF-IDF-style ranking with query synonym expansion (AI → LLM, agent, RAG, …), a "Yes." lead for yes/no questions, top three chunks as the answer. No network, works on any static host.
- **UI** (`src/site/Ask.tsx`): renders as a plain form in the prerendered HTML, hydrates into an interactive search with suggestion chips, a loading state, the answer card, source links and a line saying which path answered.

## Deploying the LLM endpoint
The site works without it. To enable Claude answers:

1. Deploy to Vercel (the `api/` folder is picked up automatically), or wrap `POST` from `api/ask.ts` in your platform's handler signature.
2. Set `ANTHROPIC_API_KEY` in the function's environment. Never put it in the client bundle.
3. Optionally set `VITE_ASK_ENDPOINT` at build time if the function lives somewhere other than `/api/ask`.

Cost: the system prompt is ~3k tokens and cached; a typical answer is well under $0.01.

## Guardrails
- Questions are capped at 400 characters, server and client.
- The system prompt refuses to follow instructions embedded in the question.
- A `refusal` stop reason returns a fixed polite message.
- The endpoint returns typed errors (400/413/429/502/503) and the client falls back to local retrieval on any non-JSON or non-2xx response, with a 15 s timeout.

## Tests
- Unit: chunk coverage and stable document; tokenizer, synonym expansion, ranking for AI / education / contact questions; local answer composition; client fallback matrix (404 HTML, network failure, malformed JSON); Ask component (submit, chips, error state).
- End to end: typing a question in the built site yields a "Yes." answer mentioning 73 Strings with a valid section link; a suggestion chip returns BITS Pilani.
