import type { Metadata } from "next";
import { Arrow, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Programs | Future of Music", description: "Explore free Future of Music programs in DJ education and youth mentorship." };

export default function ProgramsPage() {
  return (
    <PageShell active="programs">
      <section className="page-hero programs-hero">
        <div><p className="eyebrow"><span></span> Free youth programs</p><h1>Find your<br /><em>pathway.</em></h1><p className="hero-lede">Two focused programs. Hands-on learning. Real relationships. Practical skills that travel far beyond the classroom.</p></div>
        <div className="sound-poster" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><strong>MAKE<br />SOME<br />FUTURE.</strong></div>
      </section>

      <section className="program-index section-pad">
        <article className="index-card index-dj">
          <figure><img src="/images/group-work.webp" alt="Future of Music Youth DJ Program" /></figure>
          <div><p className="section-label">PROGRAM 01 / AGES 8–18</p><h2>Youth DJ<br />Program</h2><p>Professional DJ equipment, music selection, mixing, rhythm, performance, leadership, and entrepreneurship in a beginner-friendly environment.</p><div className="tag-row"><span>Music tech</span><span>Hands-on</span><span>Performance</span></div><a className="button button-light" href="/programs/dj">See program details <Arrow /></a></div>
        </article>
        <article className="index-card index-mentor">
          <div className="mentor-index-art" aria-hidden="true"><div><span>MENTOR</span><i></i><span>MENTEE</span><i></i><span>FUTURE</span></div></div>
          <div><p className="section-label">PROGRAM 02 / GRADES 5–12</p><h2>Mentorship<br />Program</h2><p>A three-month peer mentorship experience focused on personal development, academics, entrepreneurship, and college-and-career readiness.</p><div className="tag-row"><span>3 months</span><span>$50 stipend</span><span>Peer support</span></div><a className="button" href="/programs/mentorship">See program details <Arrow /></a></div>
        </article>
      </section>

      <section className="format-section section-pad">
        <div className="compact-heading"><div><p className="section-label">Flexible by design</p><h2>Built to meet youth<br /><em>where they are.</em></h2></div><p>Programs can be adapted for schools, after-school groups, summer experiences, and community organizations.</p></div>
        <div className="format-grid">
          <article><span>01</span><h3>Workshops</h3><p>Short, high-energy introductions to DJ equipment, creativity, confidence, and collaboration.</p></article>
          <article><span>02</span><h3>Enrichment</h3><p>Multi-session after-school, summer, or partner programming with room for deeper skill building.</p></article>
          <article><span>03</span><h3>Mentorship</h3><p>Consistent relationships and experiences that support personal, academic, and professional growth.</p></article>
        </div>
      </section>

      <section className="split-cta">
        <div><p className="section-label light">For organizations</p><h2>Bring Future of Music<br />to your community.</h2></div>
        <div><p>Schools, nonprofits, and businesses can host, sponsor, or support a Future of Music program.</p><a className="button button-yellow" href="mailto:info@fomusic.org?subject=Bring%20Future%20of%20Music%20to%20Our%20Community">Start a partnership <Arrow /></a></div>
      </section>
    </PageShell>
  );
}
