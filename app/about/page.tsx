import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "About | Future of Music", description: "Meet the youth-led mission and community behind Future of Music." };

export default function AboutPage() {
  return (
    <PageShell active="about">
      <section className="page-hero about-hero">
        <div>
          <p className="eyebrow"><span></span> About Future of Music</p>
          <h1>Built with youth.<br /><em>Built for what’s next.</em></h1>
          <p className="hero-lede">We create free programs where music opens the door—and mentorship, leadership, technology, and entrepreneurship help young people walk through it.</p>
          <a className="button" href="mailto:info@fomusic.org">Start a conversation <Arrow /></a>
        </div>
        <figure className="page-hero-photo"><img src="/images/group-work.webp" alt="Future of Music students collaborating in a workshop" /></figure>
      </section>

      <section className="story-section section-pad">
        <div className="section-number">01 / OUR STORY</div>
        <div className="story-grid">
          <h2>Young creators needed more than inspiration.</h2>
          <div><p className="large-copy">They needed access, guidance, and a platform.</p><p>Future of Music was founded by young creators who understand the challenges and possibilities facing today’s youth. We pair creative expression with practical support so students can build confidence, skills, relationships, and real pathways for their future.</p><p>That means professional equipment. Consistent mentors. Leadership opportunities. Business thinking. And a community that expects young people to do meaningful things.</p></div>
        </div>
      </section>

      <section className="values section-pad">
        <div className="compact-heading"><div><p className="section-label">What guides us</p><h2>Our work stays<br /><em>grounded in four things.</em></h2></div></div>
        <div className="value-grid">
          <article><span>01</span><h3>Access</h3><p>High-quality opportunities should not depend on what a family can afford.</p></article>
          <article><span>02</span><h3>Youth voice</h3><p>Young people help shape the programs, culture, and future of the organization.</p></article>
          <article><span>03</span><h3>Real skills</h3><p>Every experience should leave students with something useful in school, work, and life.</p></article>
          <article><span>04</span><h3>Community</h3><p>Progress grows faster when schools, leaders, businesses, and families work together.</p></article>
        </div>
      </section>

      <section className="about-gallery" aria-label="Future of Music program photos">
        <figure><img src="/images/two-boys-dj.webp" alt="Two youth DJ students" /></figure>
        <div><span>“</span><p>Built with young people,<br />not just for them.</p></div>
        <figure><img src="/images/headphone-on.webp" alt="Student wearing headphones during a music session" /></figure>
      </section>

      <section className="story-links section-pad">
        <div className="compact-heading"><div><p className="section-label light">From the organization</p><h2>Stories in<br /><em>the mix.</em></h2></div></div>
        <div className="story-link-grid">
          <a href="https://fomusic.org/blog/why-we-started-fom.html" {...external}><span>OUR STORY</span><h3>Why we started Future of Music.</h3><Arrow direction="up" /></a>
          <a href="https://fomusic.org/blog/meet-aereon.html" {...external}><span>MEET THE TEAM</span><h3>The vision behind the mission.</h3><Arrow direction="up" /></a>
          <a href="https://fomusic.org/blog/meet-qwentin.html" {...external}><span>MEET THE TEAM</span><h3>Creating connection that moves.</h3><Arrow direction="up" /></a>
        </div>
      </section>
    </PageShell>
  );
}
