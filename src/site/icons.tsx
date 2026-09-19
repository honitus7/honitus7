import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ArrowUpRight = () => (
  <svg {...base}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)
export const ArrowDown = () => (
  <svg {...base}>
    <path d="M12 5v14m-6-6 6 6 6-6" />
  </svg>
)
export const Download = () => (
  <svg {...base}>
    <path d="M12 4v11m-5-4 5 5 5-5M5 20h14" />
  </svg>
)
export const Server = () => (
  <svg {...base}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </svg>
)
export const Layers = () => (
  <svg {...base}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  </svg>
)
export const Cloud = () => (
  <svg {...base}>
    <path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.3 4.5 4.5 0 0 0 7 18Z" />
  </svg>
)
export const Cpu = () => (
  <svg {...base}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="10" y="10" width="4" height="4" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
)
export const Brain = () => (
  <svg {...base}>
    <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" />
    <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0V7a3 3 0 0 1 3-3Z" />
  </svg>
)
export const Search = () => (
  <svg {...base}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const Check = () => (
  <svg {...base}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </svg>
)
export const Menu = () => (
  <svg {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
