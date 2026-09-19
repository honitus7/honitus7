import { renderToString } from 'react-dom/server'
import { SITE } from '@/content'
import { Site } from '@/site/Site'

/** Build-time entry (Vite SSR build): the page as HTML for scripts/prerender.mjs. */
export function render(): string {
  return renderToString(<Site />)
}

/** What the prerendered page must contain, from the same content the page renders. */
export function expectations(): { readonly h1: string; readonly sectionIds: readonly string[] } {
  return { h1: SITE.hero.h1, sectionIds: SITE.nav.map((l) => l.id) }
}
