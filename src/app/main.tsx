import '@fontsource-variable/dm-sans'
import '@/styles/site.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Site } from '@/site/Site'
import { enhance } from '@/site/enhance'

/**
 * Entry. In production the page is prerendered into #root at build time and hydrated here; in dev the root is
 * empty and the page is rendered client-side. Either way the progressive enhancements attach afterwards.
 */
const root = document.getElementById('root')
if (!root) throw new Error('#root missing')

const tree = (
  <StrictMode>
    <Site />
  </StrictMode>
)

if (root.childElementCount > 0) hydrateRoot(root, tree)
else createRoot(root).render(tree)

// Enhance once the first paint has happened; the static markup is already complete before this runs.
requestAnimationFrame(() => enhance())
