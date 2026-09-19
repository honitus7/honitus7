/**
 * Build step: renders the page into dist/index.html from the Vite SSR bundle, inlines the stylesheet when it is
 * small enough (≤ 24 KB) so the first paint needs no extra request, verifies the page and removes dist-ssr.
 *
 *   vite build && vite build --ssr src/app/prerender-entry.tsx --outDir dist-ssr && node scripts/prerender.mjs
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const DIST = resolve(ROOT, 'dist')
const SSR = resolve(ROOT, 'dist-ssr')
const INDEX = join(DIST, 'index.html')
const ROOT_SLOT = '<!--prerender-->'
const CSS_SLOT = '<!--critical-css-->'
const INLINE_CSS_LIMIT = 24 * 1024

function fail(message) {
  console.error(`prerender: ${message}`)
  process.exit(1)
}

const entry = join(SSR, 'prerender-entry.js')
if (!existsSync(entry)) fail(`missing ${entry} — run the SSR build first`)
if (!existsSync(INDEX)) fail(`missing ${INDEX} — run vite build first`)

const { render, expectations } = await import(pathToFileURL(entry).href)
const markup = render()
let html = readFileSync(INDEX, 'utf8')
if (!html.includes(ROOT_SLOT)) fail(`${ROOT_SLOT} not found in dist/index.html`)
html = html.replace(ROOT_SLOT, markup)

// Critical CSS: inline the built stylesheet(s) when the total fits the budget, otherwise keep the <link>s.
const linkRe = /<link[^>]*rel="stylesheet"[^>]*>/g
const links = html.match(linkRe) ?? []
const sheets = links.map((tag) => {
  const href = /href="([^"]+)"/.exec(tag)?.[1]
  if (!href) fail(`stylesheet link without href: ${tag}`)
  const file = join(DIST, href.replace(/^\//, ''))
  if (!existsSync(file)) fail(`stylesheet not found: ${file}`)
  return { tag, href, css: readFileSync(file, 'utf8') }
})
const totalCss = sheets.reduce((n, s) => n + Buffer.byteLength(s.css), 0)
if (sheets.length > 0 && totalCss <= INLINE_CSS_LIMIT) {
  const inline = sheets.map((s) => s.css).join('\n')
  for (const s of sheets) html = html.replace(s.tag, '')
  html = html.replace(CSS_SLOT, `<style>${inline}</style>`)
  console.log(`prerender: inlined ${sheets.length} stylesheet(s), ${(totalCss / 1024).toFixed(1)} KB`)
} else {
  html = html.replace(CSS_SLOT, '')
  console.log(`prerender: kept ${sheets.length} stylesheet link(s) (${(totalCss / 1024).toFixed(1)} KB > ${INLINE_CSS_LIMIT / 1024} KB budget)`)
}

// Verify the page before writing it.
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '')
const expected = expectations()
if (!text.includes(expected.h1)) fail(`H1 text missing: "${expected.h1}"`)
for (const id of expected.sectionIds) {
  if (!new RegExp(`<section[^>]*id="${id}"`).test(html)) fail(`section #${id} missing`)
}
if (!/<script type="application\/ld\+json">[\s\S]*"@type":"Person"/.test(html)) fail('Person JSON-LD missing')
if (html.includes(ROOT_SLOT) || html.includes(CSS_SLOT)) fail('placeholder comment left in page')
if (!/<h1[^>]*data-lcp="h1"/.test(html)) fail('hero H1 (LCP element) missing')

writeFileSync(INDEX, html)
rmSync(SSR, { recursive: true, force: true })
console.log(`prerender: dist/index.html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB, markup ${(Buffer.byteLength(markup) / 1024).toFixed(1)} KB`)
