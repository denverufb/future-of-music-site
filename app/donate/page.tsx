import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";
import ZeffyEmbed from "./ZeffyEmbed";

export const metadata: Metadata = {
  title: "Donate | Future of Music",
  description: "Support free youth music, mentorship, leadership, technology, and entrepreneurship programs through Future of Music.",
};

export default function DonatePage() {
  return (
    <PageShell active="donate" mainClassName="donate-page">
      <section className="donate-new-hero">
        <div className="donate-new-copy">
          <p className="eyebrow"><span></span>Support Future of Music</p>
          <h1>Give young creators<br />room to <em>grow.</em></h1>
          <p className="donate-new-lede">Your support helps Future of Music keep music education, mentorship, leadership, technology, and entrepreneurship opportunities free and accessible for young people.</p>
          <div className="button-row">
            <a className="button button-yellow" href="#give">Donate securely <Arrow direction="down" /></a>
            <a className="text-link light-link" href="#our-work">Learn about our work <Arrow direction="down" /></a>
          </div>
          <p className="donate-powered">Secure giving powered by Zeffy • Future of Music is a 501(c)(3) nonprofit</p>
        </div>
        <figure className="donate-new-photo">
          <img src="/gallery/dj/01-program-group.png" alt="Future of Music students and instructors gathered around DJ equipment" />
          <figcaption><strong>YOUTH-LED</strong><span>ST. LOUIS</span><span>FREE PROGRAMS</span></figcaption>
        </figure>
      </section>

      <section className="donate-story section-pad" id="our-work">
        <div className="donate-story-heading">
          <p className="section-label">About our organization</p>
          <h2>Music is the doorway.<br /><em>Young people lead the way.</em></h2>
        </div>
        <div className="donate-story-copy">
          <p className="large-copy">Future of Music is a youth-led St. Louis nonprofit helping young people build creative skills, confidence, relationships, and real-world experience.</p>
          <p>Our programs connect music with mentorship, leadership, technology, and entrepreneurship. Students learn by creating, collaborating, practicing professional habits, and seeing new possibilities for their futures.</p>
          <a className="text-link" href="/about">Learn more about Future of Music <Arrow /></a>
        </div>
      </section>

      <section className="donate-work-grid section-pad" aria-label="What donations support">
        <article><span>01</span><h3>Creative access</h3><p>Equipment, workshops, supplies, and welcoming spaces where students can explore music and technology.</p></article>
        <article><span>02</span><h3>Mentorship + leadership</h3><p>Guidance, coaching, relationship-building, and opportunities for young people to practice leading.</p></article>
        <article><span>03</span><h3>Real-world pathways</h3><p>Experiences that connect creativity with communication, entrepreneurship, collaboration, and future careers.</p></article>
      </section>

      <section className="donate-photo-break">
        <figure><img src="/gallery/dj/02-workshop.png" alt="Young people learning to use DJ equipment during a Future of Music workshop" /></figure>
        <div><p>When young people have access to tools, trusted guidance, and room to create, they build more than music.</p><strong>They build confidence, community, and a future they can shape.</strong></div>
      </section>

      <section className="donate-form-section section-pad" id="give">
        <div className="donate-form-heading">
          <div><p className="section-label light">Secure donation portal</p><h2>Support the<br /><em>next generation.</em></h2></div>
          <div><p>Choose the contribution that feels right for you. Every gift is appreciated and securely processed through Zeffy.</p><p>If the embedded portal does not load, open the secure Zeffy form in a new tab.</p></div>
        </div>
        <ZeffyEmbed />
        <div className="button-row donate-form-actions"><a className="button button-yellow" href="https://www.zeffy.com/embed/donation-form/future-of-music" {...external}>Open Zeffy donation form <Arrow direction="up" /></a><a className="text-link light-link" href="mailto:info@fomusic.org?subject=Donation%20Question">Ask a donation question <Arrow /></a></div>
      </section>

      <section className="donate-trust-strip"><div><strong>501(c)(3)</strong><span>Nationally recognized nonprofit</span></div><div><strong>33-4753021</strong><span>Federal EIN</span></div><a href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/" {...external}>View our Candid transparency profile <Arrow direction="up" /></a></section>
    </PageShell>
  );
}
