import { resume } from '@/content'
import { personJsonLd, serializeJsonLd } from './jsonLd'
import { About, Contact, Experience, Footer, Hero, Nav, Projects, Skills } from './sections'

/**
 * The whole page. Pure render from content, no hooks or browser APIs, so the same tree is prerendered at build
 * time and hydrated in the browser. Progressive behaviour (nav state, reveal-on-scroll) is attached in enhance.ts.
 */
export function Site() {
  const jsonLd = serializeJsonLd(personJsonLd(resume))
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  )
}
