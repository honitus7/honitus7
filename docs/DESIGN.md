# Design

A calm, editorial single page in the style of modern studio sites: warm cream canvas, deep plum type, one vivid gradient moment in the hero, dark bento cards for the personal story, and a rounded blue footer.

## Palette
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#faf7f0` | Page background |
| `--bg-soft` | `#f3eee4` | Alternate section background (Experience, Skills) |
| `--ink` | `#271c40` | Headings and primary text |
| `--ink-2` / `--muted` | `#4a4060` / `#6f6683` | Body and secondary text |
| `--card` | `#271c40` | Dark bento cards and the current-role card |
| `--accent` / `--accent-2` | `#ff5fa2` / `#7c6cff` | Eyebrows, bullets, highlights |
| `--blue` | `#2f55c4` | Footer |
| Hero | `#4f7bff → #7a6cff → #c56cf0 → #ff8fc8 → #ffb08a` | Gradient multiplied over a misty-mountain photograph, with drifting blurred blobs and grain |

## Typography
DM Sans (variable, self-hosted via fontsource). Display headings are weight 700–800 with tight tracking (−0.035 to −0.05 em) and line-height ≈ 0.95. Body is 17 px / 1.55. Eyebrows are 12 px, 700, uppercase, +0.18 em tracking in `--accent-2`.

## Sections, in order
1. **Nav** — fixed, transparent over the hero, solid cream with blur once scrolled past it. Mobile uses a `<details>` menu.
2. **Hero** — eyebrow, the name as the H1 (LCP element), tagline, two buttons, the Ask search box with suggestion chips (see ASK.md), and a strip of companies and university.
3. **About** — one centred statement, then a bento grid of dark cards: lead, approach (with a cloud photograph), education, current role, location.
4. **Experience** — role cards; the current role is a dark gradient card with a "Current" badge.
5. **Projects** — three cards with photographic covers and category pills.
6. **Skills** — two alternating rows: copy with icon feature list beside a tinted photograph.
7. **Contact** — wide sky photograph, heading, one dark pill button, plain contact links.
8. **Footer** — rounded blue block: name, connect links, section links, résumé, copyright.

## Photography
Real photographs, self-hosted in `public/images` (≈ 1.2 MB total, lazy-loaded except the hero). All from Unsplash via picsum.photos under the Unsplash licence:

| File | Photographer | Source |
|------|--------------|--------|
| `hero.jpg` | Aleksandra Boguslawska | https://unsplash.com/photos/USOu_Ob9rxo |
| `about-clouds.jpg` | Olivier Miche | https://unsplash.com/photos/iIg4F2IWbTM |
| `project-voice.jpg` | Jeremy Thomas | https://unsplash.com/photos/rMmibFe4czY |
| `project-sales.jpg` | Mike Wilson | https://unsplash.com/photos/rM7B4DheQc0 |
| `project-marketostate.jpg` | Kevin Young | https://unsplash.com/photos/-icmOdYWXuQ |
| `skills-engineering.jpg` | Alexey Topolyanskiy | https://unsplash.com/photos/-oWyJoSqBRM |
| `skills-ai.jpg` | Susanne Feldt | https://unsplash.com/photos/SIoHky3TPeo |
| `contact.jpg` | Neil Thomas | https://unsplash.com/photos/12rzbJhQ89E |

Photos carry a soft purple tint (multiply gradient on the hero, soft-light overlay on the skills images) so they read as one palette.

## Motion
Reveal-on-scroll (fade + 18 px rise, 700 ms) with small stagger via `data-delay`. Hero blobs drift over 22–30 s. Everything is disabled under `prefers-reduced-motion`, and all motion styles are gated on `html.js` so the no-JS page is fully visible.

## Budgets
Stylesheet inlined when ≤ 24 KB (currently ≈ 16 KB). Single JS chunk ≈ 69 KB gzipped (React 19 + page). No third-party requests. H1 is the LCP element; no horizontal overflow at 412 px.
