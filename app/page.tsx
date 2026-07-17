import { Arrow, external, PageShell } from "./components/SiteChrome";

export default function Home() {
  return (
    <PageShell active="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span></span> Music is only the beginning.</p>
          <h1>Young creators.<br /><em>Real futures.</em></h1>
          <p className="hero-lede">Free programs in music, mentorship, leadership, technology, and entrepreneurship—built to turn creativity into confidence and a path forward.</p>
          <div className="button-row">
            <a className="button" href="/programs">Explore programs <Arrow /></a>
            <a className="text-link" href="/about">Meet Future of Music <Arrow /></a>
          </div>
        </div>
        <div className="hero-art">
          <figure className="hero-photo"><img src="/images/hero-collage.webp" alt="Young people learning together around a DJ controller" /></figure>
          <div className="hero-sticker sticker-yellow">CREATE<br />LOUDLY.</div>
          <div className="hero-sticker sticker-white">ST. LOUIS</div>
        </div>
      </section>

      <section className="impact-rail" aria-label="Future of Music impact">
        <div><strong>50+</strong><span>young people reached through DJ education</span></div>
        <div><strong>500+</strong><span>mentorship minutes logged</span></div>
        <div><strong>100%</strong><span>free for every participating student</span></div>
      </section>

      <section className="home-intro section-pad">
        <div>
          <p className="section-label">Youth-led. Community-powered.</p>
          <h2>Talent is everywhere.<br />Access <em>isn’t.</em></h2>
          <p>Future of Music gives young people the equipment, mentors, opportunities, and room to become more than they can currently imagine.</p>
          <a className="button" href="/about">Our story <Arrow /></a>
        </div>
        <figure><img src="/images/two-boys-dj.webp" alt="Two Future of Music students learning to DJ" /></figure>
      </section>

      <section className="home-programs section-pad">
        <div className="compact-heading">
          <div><p className="section-label light">Choose a pathway</p><h2>What will you<br /><em>build next?</em></h2></div>
          <a className="text-link light-link" href="/programs">View all programs <Arrow /></a>
        </div>
        <div className="home-program-grid">
          <article className="home-program-card dj-card">
            <div className="card-photo"><img src="/images/group-work.webp" alt="Youth DJ Program workshop" /></div>
            <div><p>AGES 8–18 / FREE</p><h3>Youth DJ Program</h3><span>DJ controllers, mixing, performance, music technology, leadership, and entrepreneurship.</span><a className="button button-light" href="/programs/dj">Explore DJ Program <Arrow /></a></div>
          </article>
          <article className="home-program-card mentor-card">
            <div className="mentor-mini-poster" aria-hidden="true"><span>MENTOR</span><i></i><span>MENTEE</span><i></i><span>FUTURE</span></div>
            <div><p>GRADES 5–12 / 3 MONTHS</p><h3>Mentorship Program</h3><span>Personal development, academics, entrepreneurship, and college-and-career readiness.</span><a className="button" href="/programs/mentorship">Explore Mentorship <Arrow /></a></div>
          </article>
        </div>
      </section>

      <section className="home-action">
        <div><p className="section-label">Ready to move?</p><h2>There’s a place for you<br />in the <em>mix.</em></h2></div>
        <div className="action-links">
          <a href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}><strong>Apply for mentorship</strong><Arrow direction="up" /></a>
          <a href="mailto:info@fomusic.org?subject=Future%20of%20Music%20Partnership"><strong>Bring us to your school</strong><Arrow /></a>
          <a href="/donate"><strong>Support free programs</strong><Arrow /></a>
        </div>
      </section>
    </PageShell>
  );
}
