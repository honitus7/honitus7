import { test, expect, type Page } from '@playwright/test'
import { SITE } from '../src/content/site'
import { resume } from '../src/content/resume'

const BENIGN = [/favicon/i]

function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !BENIGN.some((re) => re.test(msg.text()))) errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  return errors
}

test('home paints the hero, hydrates without errors and has no horizontal overflow', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  const h1 = page.locator('h1')
  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(SITE.hero.h1)
  await expect(page.locator('html')).toHaveClass(/js/)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  expect(errors).toEqual([])
})

test('every nav link scrolls to its section and the nav turns solid', async ({ page, isMobile }) => {
  await page.goto('/')
  const nav = page.locator('nav[aria-label="Primary"]')
  await expect(nav).not.toHaveClass(/is-solid/)
  for (const link of SITE.nav) {
    if (isMobile) {
      await nav.locator('.nav-menu > summary').click()
      await nav.locator('.nav-menu-list').getByRole('link', { name: link.label }).click()
      await expect(nav.locator('.nav-menu')).not.toHaveAttribute('open', '')
    } else {
      await nav.getByRole('link', { name: link.label }).click()
    }
    const section = page.locator(`section#${link.id}`)
    await expect(section).toBeInViewport({ ratio: 0.05 })
  }
  await expect(nav).toHaveClass(/is-solid/)
})

test('the page contains the full résumé: roles, projects, skills and contacts', async ({ page }) => {
  await page.goto('/')
  for (const role of resume.experience) await expect(page.getByRole('heading', { level: 3, name: role.role, exact: true })).toBeAttached()
  for (const project of resume.projects) await expect(page.getByRole('heading', { level: 3, name: project.name, exact: true })).toBeAttached()
  const email = resume.contacts.find((c) => c.id === 'email')!
  await expect(page.getByRole('link', { name: email.value }).first()).toHaveAttribute('href', email.href)
  const pdf = page.getByRole('link', { name: 'Résumé', exact: true })
  await expect(pdf).toHaveAttribute('href', '/Abhrajeet_Mukherjee_Resume_2026.pdf')
  const res = await page.request.get('/Abhrajeet_Mukherjee_Resume_2026.pdf')
  expect(res.ok()).toBe(true)
  expect(res.headers()['content-type']).toContain('pdf')
})

test('reveal-on-scroll shows every block by the time the footer is reached', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/js/)
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 3))
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 120)))
    }
    window.scrollTo(0, document.body.scrollHeight)
  })
  await expect.poll(async () => page.locator('.reveal:not(.is-visible)').count(), { timeout: 15_000 }).toBe(0)
})

test('the built page is prerendered: HTML alone carries the content and JSON-LD', async ({ request }) => {
  const res = await request.get('/')
  const html = await res.text()
  expect(html).toContain(`<h1 class="hero-h1" data-lcp="h1">${SITE.hero.h1}</h1>`)
  for (const link of SITE.nav) expect(html).toMatch(new RegExp(`<section[^>]*id="${link.id}"`))
  expect(html).toMatch(/<script type="application\/ld\+json">[\s\S]*"@type":"Person"/)
})

test('the hero search answers a question from site content (local fallback without the endpoint)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/js/)
  const box = page.getByRole('searchbox', { name: 'Ask about Abhrajeet' })
  await box.fill('Has Abhrajeet had AI experience?')
  await page.getByRole('button', { name: /^Ask$/ }).click()
  const answer = page.getByRole('region', { name: 'Answer' })
  await expect(answer).toBeVisible({ timeout: 20_000 })
  await expect(answer).toContainText(/^Yes\./)
  await expect(answer).toContainText(/73 Strings|LLM|agent/i)
  const source = answer.getByRole('link').first()
  await expect(source).toHaveAttribute('href', /^#(about|experience|projects|skills|contact)$/)
})

test('suggestion chips run a question', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/js/)
  await page.getByRole('button', { name: 'Where did he study?' }).click()
  const answer = page.getByRole('region', { name: 'Answer' })
  await expect(answer).toContainText('BITS Pilani', { timeout: 20_000 })
})
