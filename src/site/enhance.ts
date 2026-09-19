/**
 * Progressive enhancement, independent of React: solid nav once the hero scrolls away, and reveal-on-scroll.
 * Everything here degrades to the fully visible static page when JS is off (styles are gated on `html.js`).
 */

export function enhanceNav(doc: Document = document, win: Window = window): () => void {
  const nav = doc.querySelector<HTMLElement>('[data-nav]')
  const hero = doc.querySelector<HTMLElement>('.hero')
  if (!nav || !hero) return () => undefined
  const update = () => {
    const threshold = Math.max(hero.offsetHeight - 80, 120)
    nav.classList.toggle('is-solid', win.scrollY > threshold)
  }
  update()
  win.addEventListener('scroll', update, { passive: true })
  win.addEventListener('resize', update)
  return () => {
    win.removeEventListener('scroll', update)
    win.removeEventListener('resize', update)
  }
}

export function enhanceReveal(doc: Document = document, win: Window = window): () => void {
  const items = Array.from(doc.querySelectorAll<HTMLElement>('.reveal'))
  if (items.length === 0) return () => undefined
  const reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches
  const IO = (win as Window & { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver
  if (reduce || typeof IO !== 'function') {
    for (const el of items) el.classList.add('is-visible')
    return () => undefined
  }
  const io = new IO(
    (entries: IntersectionObserverEntry[]) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )
  for (const el of items) io.observe(el)
  return () => io.disconnect()
}

/**
 * Continuous scroll-linked motion: elements with `data-parallax="<factor>"` drift as the page scrolls,
 * offset by their own distance from the viewport centre, so the page feels like it's playing rather than
 * jumping between static states.
 */
export function enhanceParallax(doc: Document = document, win: Window = window): () => void {
  const items = Array.from(doc.querySelectorAll<HTMLElement>('[data-parallax]'))
  if (items.length === 0) return () => undefined
  if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined
  let raf = 0
  const update = () => {
    raf = 0
    const mid = win.innerHeight / 2
    for (const el of items) {
      const factor = Number(el.dataset.parallax) || 0
      const rect = el.getBoundingClientRect()
      const delta = (rect.top + rect.height / 2 - mid) * factor
      el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`
    }
  }
  const onScroll = () => {
    if (raf) return
    raf = win.requestAnimationFrame(update)
  }
  update()
  win.addEventListener('scroll', onScroll, { passive: true })
  win.addEventListener('resize', onScroll)
  return () => {
    win.removeEventListener('scroll', onScroll)
    win.removeEventListener('resize', onScroll)
    if (raf) win.cancelAnimationFrame(raf)
  }
}

export function enhanceMenu(doc: Document = document): () => void {
  const menu = doc.querySelector<HTMLDetailsElement>('.nav-menu')
  if (!menu) return () => undefined
  const close = (e: Event) => {
    if ((e.target as Element | null)?.closest('a')) menu.removeAttribute('open')
  }
  menu.addEventListener('click', close)
  return () => menu.removeEventListener('click', close)
}

export function enhance(doc: Document = document, win: Window = window): () => void {
  doc.documentElement.classList.add('js')
  const offNav = enhanceNav(doc, win)
  const offReveal = enhanceReveal(doc, win)
  const offParallax = enhanceParallax(doc, win)
  const offMenu = enhanceMenu(doc)
  return () => {
    offNav()
    offReveal()
    offParallax()
    offMenu()
  }
}
