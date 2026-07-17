import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "About | Future of Music", description: "Meet the youth-led mission, community, and partners behind Future of Music." };

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

      <section className="partner-section section-pad" id="partners">
        <div className="section-number">02 / OUR COMMUNITY</div>
        <div className="partner-layout">
          <div><h2>It takes a whole<br /><em>community.</em></h2><p>Schools, nonprofits, businesses, mentors, and donors make free programs possible. Every partner adds another door a student can walk through.</p><a className="button" href="mailto:info@fomusic.org?subject=Future%20of%20Music%20Partnership">Become a partner <Arrow /></a></div>
          <div className="partner-wall" aria-label="Future of Music partners">
            <div className="partner-logo blue-logo"><span>JSD</span><strong>Jennings<br />School District</strong></div>
            <div className="partner-logo yellow-logo"><span>CL</span><strong>Creator<br />Launch</strong></div>
            <div className="partner-logo coral-logo"><span>NP</span><strong>Next<br />Prep</strong></div>
            <div className="partner-logo ink-logo"><span>+</span><strong>Community<br />Leaders</strong></div>
          </div>
        </div>
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
