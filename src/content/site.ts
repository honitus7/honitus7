/** All page copy in one place. Sections read from here; the résumé data lives in resume.ts. */

export interface NavLink {
  readonly id: 'about' | 'experience' | 'projects' | 'skills' | 'contact'
  readonly label: string
}

export interface Principle {
  readonly eyebrow: string
  readonly title: string
  readonly body: string
}

export const SITE = {
  title: 'Abhrajeet Mukherjee — Software Engineer, AI Backend',
  description:
    'Abhrajeet Mukherjee is a software engineer building LLM-powered backend systems, agentic workflows and the interfaces on top of them for private-equity valuation platforms.',
  wordmark: 'Abhrajeet',
  nav: [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ] as const satisfies readonly NavLink[],
  hero: {
    eyebrow: 'Hello, I am',
    /** The LCP element. */
    h1: 'Abhrajeet Mukherjee',
    tagline: 'I build the systems behind modern financial intelligence.',
    sub: 'Software Engineer, AI Backend at 73 Strings, Bengaluru.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Download résumé',
    strip: ['73 Strings', 'Unity Growth Fund', 'BITS Pilani'],
  },
  ask: {
    label: 'Ask about Abhrajeet',
    placeholder: 'Ask anything, e.g. “Has Abhrajeet worked with AI?”',
    submit: 'Ask',
    thinking: 'Thinking',
    sources: 'From:',
    error: 'Something went wrong. Please try again.',
    modeLlm: 'Answered by an AI model using only this site’s content.',
    modeLocal: 'Answered from this site’s content.',
    suggestions: ['Has Abhrajeet worked with AI?', 'What did he build at 73 Strings?', 'Which languages and frameworks does he use?', 'Where did he study?'],
  },
  about: {
    statement: 'I start with the person using the product, then engineer for the moment it breaks.',
    statementEmphasis: 'The reliability follows.',
    lead: {
      eyebrow: 'About',
      title: 'Full-stack engineer with an AI backend focus.',
      body:
        'At 73 Strings I build LLM-powered systems for private-equity valuation platforms: agentic workflows, retrieval pipelines, async orchestration and the APIs that hold them together. My interest in software began with understanding users and their requirements, and I still treat bridging product and engineering as the core of the job.',
    },
    principles: [
      {
        eyebrow: 'Approach',
        title: 'Understand the user. Then build it right.',
        body: 'Every system I ship starts as a conversation about who uses it and where it can fail.',
      },
      {
        eyebrow: 'Education',
        title: 'BITS Pilani, B.E. Computer Science.',
        body: 'Class of 2025. Led a 250+ member team as Chief Coordinator of Quark, the annual technical festival.',
      },
      {
        eyebrow: 'Currently',
        title: 'Software Developer, Full Stack AI Engineer.',
        body: 'Shipping valuation automation used by leading private-equity firms.',
      },
    ] as const satisfies readonly Principle[],
  },
  experience: {
    eyebrow: 'Experience',
    heading: 'Where the work happened.',
    sub: 'Two internships and a full-time role, all in financial software.',
  },
  projects: {
    eyebrow: 'Projects',
    heading: 'Built to answer a question.',
    sub: 'Independent and research work outside the day job.',
  },
  skills: {
    eyebrow: 'Skills',
    heading: 'The stack behind it.',
    engineering: {
      title: 'Engineering depth.',
      body: 'Backend services, async systems and the frontends that expose them.',
    },
    ai: {
      title: 'And the AI layer.',
      body: 'Agents, retrieval and evaluation, grounded in production constraints.',
    },
  },
  contact: {
    heading: 'Let us build something that lasts.',
    body: 'Open to conversations about AI systems, financial software and roles where product and engineering meet.',
    cta: 'Say hello',
  },
  footer: {
    tagline: 'Software Engineer, AI Backend',
    connect: 'Connect',
    more: 'More',
  },
} as const
