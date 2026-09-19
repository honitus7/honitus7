import { enhanceMenu, enhanceNav, enhanceParallax, enhanceReveal } from './enhance'

function setup(html: string, reducedMotion = false) {
  document.body.innerHTML = html
  document.documentElement.className = ''
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reducedMotion }) as MediaQueryList))
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('enhanceNav', () => {
  it('turns the nav solid once the page is scrolled past the hero', () => {
    setup('<nav data-nav></nav><header class="hero"></header>')
    const hero = document.querySelector<HTMLElement>('.hero')!
    Object.defineProperty(hero, 'offsetHeight', { value: 800, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    const off = enhanceNav()
    const nav = document.querySelector('[data-nav]')!
    expect(nav.classList.contains('is-solid')).toBe(false)
    ;(window as unknown as { scrollY: number }).scrollY = 900
    window.dispatchEvent(new Event('scroll'))
    expect(nav.classList.contains('is-solid')).toBe(true)
    off()
    ;(window as unknown as { scrollY: number }).scrollY = 0
    window.dispatchEvent(new Event('scroll'))
    expect(nav.classList.contains('is-solid')).toBe(true) // listener removed
  })

  it('is a no-op without a nav or hero', () => {
    setup('<div></div>')
    expect(() => enhanceNav()()).not.toThrow()
  })
})

describe('enhanceReveal', () => {
  it('reveals everything immediately when reduced motion is preferred', () => {
    setup('<div class="reveal"></div><div class="reveal"></div>', true)
    enhanceReveal()
    expect(document.querySelectorAll('.reveal.is-visible')).toHaveLength(2)
  })

  it('reveals items as they intersect and stops observing them', () => {
    setup('<div class="reveal" id="a"></div><div class="reveal" id="b"></div>')
    let callback: IntersectionObserverCallback = () => undefined
    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb
      }
      observe = observe
      unobserve = unobserve
      disconnect = disconnect
    }
    vi.stubGlobal('IntersectionObserver', FakeIO)
    const off = enhanceReveal()
    expect(observe).toHaveBeenCalledTimes(2)
    const a = document.getElementById('a')!
    callback([{ isIntersecting: true, target: a } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
    expect(a.classList.contains('is-visible')).toBe(true)
    expect(unobserve).toHaveBeenCalledWith(a)
    expect(document.getElementById('b')!.classList.contains('is-visible')).toBe(false)
    off()
    expect(disconnect).toHaveBeenCalled()
  })
})

describe('enhanceParallax', () => {
  it('offsets elements based on distance from viewport centre and updates on scroll', () => {
    setup('<div data-parallax="0.5" style="height:100px"></div>')
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    const el = document.querySelector<HTMLElement>('[data-parallax]')!
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 500, height: 100 } as DOMRect)
    let rafCb: FrameRequestCallback = () => undefined
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
      rafCb = cb
      return 1
    }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    const off = enhanceParallax()
    expect(el.style.transform).toBe('translate3d(0, 75.00px, 0)')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 100, height: 100 } as DOMRect)
    window.dispatchEvent(new Event('scroll'))
    rafCb(0)
    expect(el.style.transform).toBe('translate3d(0, -125.00px, 0)')
    off()
  })

  it('does nothing when reduced motion is preferred', () => {
    setup('<div data-parallax="0.5"></div>', true)
    const el = document.querySelector<HTMLElement>('[data-parallax]')!
    enhanceParallax()
    expect(el.style.transform).toBe('')
  })

  it('is a no-op without any parallax elements', () => {
    setup('<div></div>')
    expect(() => enhanceParallax()()).not.toThrow()
  })
})

describe('enhanceMenu', () => {
  it('closes the mobile menu when a link inside it is clicked', () => {
    setup('<details class="nav-menu" open><summary>Menu</summary><div><a href="#about">About</a></div></details>')
    const off = enhanceMenu()
    const menu = document.querySelector('.nav-menu')!
    document.querySelector('a')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(menu.hasAttribute('open')).toBe(false)
    off()
  })
})
