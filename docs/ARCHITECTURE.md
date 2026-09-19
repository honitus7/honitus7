# Architecture

React 19 · TypeScript 5.9 · Vite 8 · Vitest 5 · Playwright 1.63. No runtime dependencies beyond React and the DM Sans font.

## Shape
A single prerendered page. The whole site is one pure React tree (`Site`) rendered from typed content; the build renders it to `dist/index.html`, and the browser hydrates the same tree and attaches three small progressive enhancements.

```
content (resume.ts, site.ts)  →  site/Site.tsx (sections, art, icons, jsonLd)  →  app/main.tsx (hydrate + enhance)
                                                                                 ↘  app/prerender-entry.tsx → scripts/prerender.mjs → dist/index.html
```

## Modules
| Path | Responsibility |
|------|----------------|
| `src/content/types.ts` | Typed résumé model. |
| `src/content/resume.ts` | Résumé data, kept faithful to the PDF in `public/`. Single source of truth for roles, projects, skills, education, contacts. |
| `src/content/site.ts` | All page copy: nav labels, hero, section headings, about cards, contact and footer text. |
| `src/site/Site.tsx` | Page composition: Nav, Hero, About, Experience, Projects, Skills, Contact, Footer, Person JSON-LD. Pure render, no hooks. |
| `src/site/sections.tsx` | The section components. Read only from `content`. |
| `src/site/icons.tsx` | Inline SVG line icons. Photographs live in `public/images` (credits in DESIGN.md). |
| `src/site/jsonLd.ts` | schema.org Person built from content, serialised safely for a `<script>` tag. |
| `src/site/enhance.ts` | Progressive enhancement, framework-free: solid nav after the hero, reveal-on-scroll via IntersectionObserver, closing the mobile menu. All gated on `html.js`, so the page is complete with JS off. |
| `src/styles/site.css` | Design tokens and all styles. See DESIGN.md. |
| `src/app/main.tsx` | Entry: hydrates `#root` when prerendered, otherwise renders client-side (dev). |
| `src/app/prerender-entry.tsx` | SSR entry: `render()` and `expectations()` for the build verifier. |
| `scripts/prerender.mjs` | Build step: injects the markup, inlines the stylesheet under 24 KB, verifies H1, sections and JSON-LD. |

## Build
`npm run build` = typecheck → client build → SSR build → prerender. Output is a static `dist/` deployable to any static host.

## Testing
- Unit (Vitest, jsdom): `Site` renders every role, project, skill and contact from the résumé; sections match nav links; JSON-LD content and escaping; enhancement behaviour (nav state, reveal, menu).
- End to end (Playwright, local Chrome, desktop + Pixel 7): hero paints with no console errors and no horizontal overflow; nav links reach their sections and the nav turns solid; full résumé present; PDF served; every reveal block visible after scrolling; prerendered HTML alone carries content and JSON-LD.
