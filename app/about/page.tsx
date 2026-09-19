import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Our Story & Founder | Future of Music", description: "Discover why Aereon Robinson founded Future of Music and how a young DJ’s first opportunity became a mission to support other young creators." };

const sources = {
  town: "https://townandstyle.com/student-standouts-aereon-robinson-of-principia-school/",
  american: "https://www.stlamerican.com/business/from-teen-dj-to-teen-mentor/",
  journal: "https://www.bizjournals.com/stlouis/news/2025/10/25/character-aereon-robinson-dj-future-of-music.html",
};

export default function AboutPage() {
  return (
    <PageShell active="about">
      <section className="page-hero about-hero">
        <div>
          <p className="eyebrow"><span></span> About Future of Music</p>
          <h1>Built with youth.<br /><em>Built for what’s next.</em></h1>
          <p className="hero-lede">We create free programs where music opens the door—and mentorship, leadership, technology, and entrepreneurship help young people walk through it.</p>
          <div className="button-row"><a className="button" href="#our-story">Read our story <Arrow /></a><a className="text-link" href="#founder">Meet our founder <Arrow /></a></div>
        </div>
        <figure className="page-hero-photo"><img src="/images/group-work.webp" alt="Future of Music students collaborating in a workshop" /></figure>
      </section>

      <section className="story-section section-pad" id="our-story" aria-labelledby="story-title" style={{ scrollMarginTop: 100 }}>
        <div className="section-number">01 / OUR STORY</div>
        <div style={{ maxWidth: 820, marginInline: "auto" }}>
          <h2 id="story-title" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", marginBottom: 24 }}>A first opportunity<br /><em>worth passing on.</em></h2>
          <p className="large-copy">Future of Music began with a young person’s curiosity—and grew from his determination to make getting started easier for someone else.</p>
          <p>Before founding FOM, Aereon Robinson discovered DJing through equipment passed down by his uncle. A small controller became an introduction to performing, then to running his own business, SaySo Entertainment. But building a business while young meant learning much more than music. There were taxes, paperwork, age restrictions, and decisions that few programs were helping someone his age navigate. <a className="text-link" href={sources.town} {...external}>Town &amp; Style <Arrow direction="up" /></a></p>

          <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", margin: "32px 0 18px" }}>Why Future of Music started</h3>
          <p>Aereon saw a gap between having a creative interest and knowing what to do with it. In St. Louis, he struggled to find guidance designed for young entrepreneurs in music and entertainment.</p>
          <p>Future of Music was his response: a place where young people could explore their interests with support, rather than having to figure everything out alone. Early one-on-one mentorship focused on entrepreneurship and personal development—the knowledge behind building something, not just the talent that gets it started. <a className="text-link" href={sources.town} {...external}>Town &amp; Style <Arrow direction="up" /></a></p>

          <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", margin: "32px 0 18px" }}>Music opens the door</h3>
          <p>Aereon’s own experience showed him how much a first opportunity could matter. His father helped him secure an early DJ appearance at a children’s pop-up event. That introduction led to relationships with clients who continued booking him.</p>
          <p>As he gained experience, performing also became an education in networking, promoting his work, and developing a business. Those lessons helped shape FOM’s purpose.</p>
          <blockquote style={{ margin: "24px 0", padding: "24px clamp(18px, 3vw, 32px)", borderLeft: "5px solid var(--blue)", background: "var(--paper)", borderRadius: "0 18px 18px 0" }}>
            <p className="large-copy" style={{ marginBottom: 12 }}>“Music is the face of it, but entrepreneurship is what we want them to pursue.”</p>
            <cite style={{ fontStyle: "normal", fontSize: ".9rem" }}>Aereon Robinson, speaking to <a className="text-link" href={sources.american} {...external}>The St. Louis American <Arrow direction="up" /></a></cite>
          </blockquote>
          <p>That purpose became tangible during a workshop with Beyond Housing’s Children’s Defense Fund Freedom School, where students explored DJing and music production. Their reactions reflected more than excitement about equipment: they were discovering something new they could do. <a className="text-link" href={sources.american} {...external}>The St. Louis American <Arrow direction="up" /></a></p>
        </div>
      </section>

      <section className="section-pad" id="founder" aria-labelledby="founder-title" style={{ background: "var(--mint)", scrollMarginTop: 100 }}>
        <div className="section-number">02 / MEET OUR FOUNDER</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(24px, 4vw, 56px)", alignItems: "center", maxWidth: 1100, marginInline: "auto" }}>
          <figure style={{ margin: 0, maxWidth: 420, width: "100%", background: "var(--paper)", border: "var(--line)", borderRadius: 24, overflow: "hidden" }}><img src="/images/aereon.webp" alt="Aereon Robinson, founder and executive director of Future of Music" loading="lazy" style={{ width: "100%", height: "auto" }} /></figure>
          <div>
            <h2 id="founder-title" style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)", marginBottom: 16 }}>Aereon Robinson</h2>
            <p className="section-label">Founder &amp; Executive Director</p>
            <p>Aereon is a St. Louis DJ, entrepreneur, and youth mentor whose path from performing to nonprofit leadership earned a profile in the <em>St. Louis Business Journal</em>. He brings firsthand experience of starting young to his work with Future of Music.</p>
            <a className="text-link" href={sources.journal} {...external}>Read the Business Journal profile <Arrow direction="up" /></a>
            <p style={{ marginTop: 24 }}>At the heart of FOM is a simple ambition: help young people take their interests seriously, build practical skills, and see possibilities for themselves.</p>
            <p className="large-copy">Music is where the story began. Helping others get started is why it continues.</p>
          </div>
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
        <div className="compact-heading"><div><p className="section-label light">In the news</p><h2>Read more<br /><em>about our story.</em></h2></div></div>
        <div className="story-link-grid">
          <a href={sources.town} {...external}><span>TOWN &amp; STYLE</span><h3>Student Standouts: Aereon Robinson</h3><Arrow direction="up" /></a>
          <a href={sources.american} {...external}><span>THE ST. LOUIS AMERICAN</span><h3>From teen DJ to teen mentor</h3><Arrow direction="up" /></a>
          <a href={sources.journal} {...external}><span>ST. LOUIS BUSINESS JOURNAL</span><h3>Teen DJ turns passion into nonprofit</h3><Arrow direction="up" /></a>
        </div>
      </section>
    </PageShell>
  );
}
