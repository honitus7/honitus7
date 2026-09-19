import { resume, RESUME_PDF_PATH, SITE } from '@/content'
import type { ExperienceRole, Project } from '@/content/types'
import { ArrowDown, ArrowUpRight, Brain, Cloud, Cpu, Download, Layers, Menu, Search, Server } from './icons'

const external = { target: '_blank', rel: 'noreferrer noopener' } as const

/** Self-hosted photographs (public/images). Unsplash licence; credits in docs/DESIGN.md. */
const IMAGES = {
  hero: { src: '/images/hero.jpg', alt: '' },
  aboutClouds: { src: '/images/about-clouds.jpg', alt: '' },
  projectVoice: { src: '/images/project-voice.jpg', alt: 'Star trails over a night sky' },
  projectSales: { src: '/images/project-sales.jpg', alt: 'Glass office tower seen from below' },
  projectMarketostate: { src: '/images/project-marketostate.jpg', alt: 'City skyline at sunset from above' },
  skillsEngineering: { src: '/images/skills-engineering.jpg', alt: 'Fjord between steep cliffs' },
  skillsAi: { src: '/images/skills-ai.jpg', alt: 'Clouds in a bright blue sky' },
  contact: { src: '/images/contact.jpg', alt: 'Calm beach at low tide under a wide sky' },
} as const

const PROJECT_COVERS: Record<string, { readonly src: string; readonly alt: string }> = {
  'voice-sentiment': IMAGES.projectVoice,
  'agentic-sales-calls': IMAGES.projectSales,
  marketostate: IMAGES.projectMarketostate,
}

function contact(id: (typeof resume.contacts)[number]['id']) {
  return resume.contacts.find((c) => c.id === id)
}

/* ───────────────────────────── Nav ───────────────────────────── */
export function Nav() {
  return (
    <nav className="nav" aria-label="Primary" data-nav>
      <a className="nav-brand" href="#top">
        <span className="mark" aria-hidden="true">
          A
        </span>
        {SITE.wordmark}
      </a>
      <div className="nav-links">
        {SITE.nav.map((l) => (
          <a key={l.id} href={`#${l.id}`}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        <a className="nav-cta" href={RESUME_PDF_PATH} download>
          Résumé
        </a>
        <details className="nav-menu">
          <summary aria-label="Open menu">
            <Menu />
          </summary>
          <div className="nav-menu-list">
            {SITE.nav.map((l) => (
              <a key={l.id} href={`#${l.id}`}>
                {l.label}
              </a>
            ))}
          </div>
        </details>
      </div>
    </nav>
  )
}

/* ───────────────────────────── Hero ───────────────────────────── */
export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-blob b1" aria-hidden="true" />
      <div className="hero-blob b2" aria-hidden="true" />
      <div className="hero-blob b3" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <img className="hero-photo" src={IMAGES.hero.src} alt="" width="2400" height="1500" fetchPriority="high" decoding="async" />
      <div className="hero-inner" data-parallax="0.1">
        <p className="hero-eyebrow">{SITE.hero.eyebrow}</p>
        <h1 className="hero-h1" data-lcp="h1">
          {SITE.hero.h1}
        </h1>
        <div className="hero-row">
          <div>
            <p className="hero-tagline">{SITE.hero.tagline}</p>
            <p className="hero-sub">{SITE.hero.sub}</p>
          </div>
          <div className="hero-actions">
            <a className="btn btn-light" href="#experience">
              {SITE.hero.ctaPrimary}
              <ArrowDown />
            </a>
            <a className="btn btn-ghost" href={RESUME_PDF_PATH} download>
              {SITE.hero.ctaSecondary}
              <Download />
            </a>
          </div>
        </div>
        <ul className="hero-strip" aria-label="Companies and education">
          {SITE.hero.strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </header>
  )
}

/* ───────────────────────────── About ───────────────────────────── */
export function About() {
  const { statement, statementEmphasis, lead, principles } = SITE.about
  const [approach, education, current] = principles
  const currentRole = resume.experience.find((r) => r.period.end === null)
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <p className="about-statement reveal">
          {statement} <strong>{statementEmphasis}</strong>
        </p>
        <div className="bento">
          <article className="card card-lead reveal reveal-left">
            <span className="eyebrow">{lead.eyebrow}</span>
            <h2 id="about-title" className="card-title">
              {lead.title}
            </h2>
            <p>{lead.body}</p>
            <ul className="card-tags" aria-label="Focus areas">
              {['LLM orchestration', 'Agentic workflows', 'Async systems', 'Product thinking'].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
          <article className="card card-accent reveal reveal-right" data-delay="1">
            <span className="eyebrow">{approach.eyebrow}</span>
            <h3 className="card-title">{approach.title}</h3>
            <p>{approach.body}</p>
            <img className="card-photo" src={IMAGES.aboutClouds.src} alt="" width="1400" height="1000" loading="lazy" decoding="async" />
          </article>
          <article className="card card-3 reveal reveal-scale">
            <span className="eyebrow">{education.eyebrow}</span>
            <h3 className="card-title">{education.title}</h3>
            <p>{education.body}</p>
          </article>
          <article className="card card-3 reveal reveal-scale" data-delay="1">
            <span className="eyebrow">{current.eyebrow}</span>
            <h3 className="card-title">{current.title}</h3>
            <p>{current.body}</p>
            {currentRole ? (
              <ul className="card-tags" aria-label="Current stack">
                {currentRole.tech.slice(0, 4).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
          </article>
          <article className="card card-3 reveal reveal-scale" data-delay="2">
            <span className="eyebrow">Location</span>
            <h3 className="card-title">{resume.profile.location}</h3>
            <p>Working with teams across India, Europe and the United States.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── Experience ───────────────────────────── */
function Role({ role, index }: { readonly role: ExperienceRole; readonly index: number }) {
  const current = role.period.end === null
  const direction = index % 2 === 0 ? 'reveal-left' : 'reveal-right'
  return (
    <li className={current ? `role is-current reveal ${direction}` : `role reveal ${direction}`} data-delay={String(Math.min(index, 2))}>
      <div className="role-meta">
        {current ? <span className="role-badge">Current</span> : null}
        <span className="role-period">{role.period.label}</span>
        <span className="role-place">{role.location}</span>
      </div>
      <div className="role-body">
        <div>
          <h3 className="role-title">{role.role}</h3>
          <p className="role-company">{role.company}</p>
        </div>
        <ul className="role-list">
          {role.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className="tags" aria-label="Technologies">
          {role.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{SITE.experience.eyebrow}</span>
          <h2 id="experience-title" className="h-display h-l">
            {SITE.experience.heading}
          </h2>
          <p className="lede">{SITE.experience.sub}</p>
        </div>
        <ol className="timeline">
          {resume.experience.map((r, i) => (
            <Role key={r.id} role={r} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ───────────────────────────── Projects ───────────────────────────── */
function ProjectCard({ project, index }: { readonly project: Project; readonly index: number }) {
  const cover = PROJECT_COVERS[project.id] ?? IMAGES.projectVoice
  return (
    <li className="project reveal reveal-scale" data-delay={String(index % 3)}>
      <div className="project-cover">
        <img src={cover.src} alt={cover.alt} width="1200" height="750" loading="lazy" decoding="async" />
        <span className="project-category">{project.category}</span>
      </div>
      <div className="project-body">
        <h3 className="project-title">{project.name}</h3>
        <p className="project-summary">{project.summary}</p>
        <ul className="project-list">
          {project.highlights.slice(0, 2).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className="tags" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">{SITE.projects.eyebrow}</span>
          <h2 id="projects-title" className="h-display h-l">
            {SITE.projects.heading}
          </h2>
          <p className="lede">{SITE.projects.sub}</p>
        </div>
        <ul className="projects-grid">
          {resume.projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────────────────── Skills ───────────────────────────── */
function group(id: string) {
  return resume.skills.find((g) => g.id === id)?.skills ?? []
}

export function Skills() {
  const engineering = [
    { Icon: Server, text: <><b>Backend:</b> {group('backend').join(', ')}</> },
    { Icon: Layers, text: <><b>Frontend:</b> {group('frontend').join(', ')}</> },
    { Icon: Cloud, text: <><b>Data and infrastructure:</b> {group('infra').join(', ')}</> },
  ]
  const ai = [
    { Icon: Brain, text: <><b>Gen AI systems:</b> {group('genai').slice(0, 6).join(', ')}</> },
    { Icon: Search, text: <><b>Retrieval and evaluation:</b> {group('genai').slice(6).join(', ')}</> },
    { Icon: Cpu, text: <><b>ML frameworks:</b> {group('ml').join(', ')}</> },
  ]
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{SITE.skills.eyebrow}</span>
          <h2 id="skills-title" className="h-display h-l">
            {SITE.skills.heading}
          </h2>
        </div>

        <div className="skills-row">
          <div className="skills-copy reveal">
            <h3 className="h-m">{SITE.skills.engineering.title}</h3>
            <p className="lede">{SITE.skills.engineering.body}</p>
            <ul className="feature-list">
              {engineering.map(({ Icon, text }, i) => (
                <li key={i} className="feature">
                  <span className="feature-icon">
                    <Icon />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <ul className="chips" aria-label="Programming languages">
              {group('languages').map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="skills-art reveal reveal-right" data-delay="1">
            <img src={IMAGES.skillsEngineering.src} alt={IMAGES.skillsEngineering.alt} width="1400" height="1120" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="skills-row reverse">
          <div className="skills-copy reveal">
            <h3 className="h-m">{SITE.skills.ai.title}</h3>
            <p className="lede">{SITE.skills.ai.body}</p>
            <ul className="feature-list">
              {ai.map(({ Icon, text }, i) => (
                <li key={i} className="feature">
                  <span className="feature-icon">
                    <Icon />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="skills-art reveal reveal-left" data-delay="1">
            <img src={IMAGES.skillsAi.src} alt={IMAGES.skillsAi.alt} width="1400" height="1120" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── Contact + footer ───────────────────────────── */
export function Contact() {
  const email = contact('email')
  const linkedin = contact('linkedin')
  const phone = contact('phone')
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <div className="contact-photo reveal">
          <img src={IMAGES.contact.src} alt={IMAGES.contact.alt} width="1800" height="700" loading="lazy" decoding="async" />
        </div>
        <h2 id="contact-title" className="h-display h-l reveal">
          {SITE.contact.heading}
        </h2>
        <p className="lede reveal" style={{ maxWidth: '38rem' }}>
          {SITE.contact.body}
        </p>
        {email ? (
          <a className="btn btn-dark reveal" href={email.href}>
            {SITE.contact.cta}
            <ArrowUpRight />
          </a>
        ) : null}
        <ul className="contact-links reveal">
          {email ? <li><a href={email.href}>{email.value}</a></li> : null}
          {phone ? <li><a href={phone.href}>{phone.value}</a></li> : null}
          {linkedin ? <li><a href={linkedin.href} {...external}>{linkedin.label}</a></li> : null}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  const year = 2026
  const connect = ['email', 'linkedin', 'github', 'phone'].flatMap((id) => resume.contacts.filter((c) => c.id === id))
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="name">{SITE.wordmark}</span>
          <span className="tag">{SITE.footer.tagline}</span>
        </div>
        <div className="footer-col">
          <h3>{SITE.footer.connect}</h3>
          {connect.map((c) => (
            <a key={c.id} href={c.href} {...(c.external ? external : {})}>
              {c.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <h3>{SITE.footer.more}</h3>
          {SITE.nav.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
          <a href={RESUME_PDF_PATH} download>
            Résumé (PDF)
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {year} {resume.profile.fullName}
        </span>
        <span>{resume.profile.location}</span>
      </div>
    </footer>
  )
}
