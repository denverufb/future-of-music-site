const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const pillars = [
  ["01", "Personal development", "Confidence, communication, accountability, leadership, and goal setting."],
  ["02", "Academics", "Homework support, stronger learning habits, school progress, and academic planning."],
  ["03", "Entrepreneurship", "Ideas, branding, professionalism, and guidance from young business owners."],
  ["04", "College + career", "Career exploration, college pathways, networking, and next-step planning."],
];

const team = [
  {
    name: "Aereon Robinson",
    role: "Founder & Executive Director",
    image: "/images/aereon.webp",
    color: "blue",
    bio: "A young musician and entrepreneur building the platform he wished existed: a place where every young creator can turn imagination into real-world opportunity.",
  },
  {
    name: "Qwentin Blassingame",
    role: "Managing Director & Program Coach",
    image: "/images/qwentin.webp",
    color: "coral",
    bio: "A creator and strategist connecting the next generation of artists to mentorship, media, community, and pathways that help their ideas travel further.",
  },
  {
    name: "Gabriel Walker",
    role: "Program Coach",
    image: "/images/gabriel.webp",
    color: "yellow",
    bio: "A hands-on coach who helps students master new skills in a positive, practical learning environment built around encouragement and growth.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <div className="announcement">
        <p><span>St. Louis made</span><span>•</span><span>Youth led</span><span>•</span><span>Programs are free</span></p>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Future of Music home">
          <img src="/images/logo.png" alt="Future of Music" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#mentorship">Mentorship</a>
          <a href="#partners">Partners</a>
          <a href="#team">Team</a>
        </nav>
        <a className="button button-small" href="#donate">Donate <span aria-hidden="true">↗</span></a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span></span><span></span><span></span></summary>
          <nav aria-label="Mobile navigation">
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#mentorship">Mentorship</a>
            <a href="#partners">Partners</a>
            <a href="#team">Team</a>
            <a href="#donate">Donate</a>
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span></span> Music is only the beginning.</p>
            <h1>Young creators.<br /><em>Real futures.</em></h1>
            <p className="hero-lede">Future of Music gives young people free access to music, mentorship, leadership, technology, and entrepreneurship—so creativity becomes confidence, connection, and a path forward.</p>
            <div className="button-row">
              <a className="button" href="#programs">Explore programs <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply for mentorship <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-proof" aria-label="Organization highlights">
              <div><strong>501(c)(3)</strong><span>Recognized nonprofit</span></div>
              <div><strong>100% free</strong><span>For every student</span></div>
              <div><strong>St. Louis</strong><span>Built with community</span></div>
            </div>
          </div>

          <div className="hero-art">
            <div className="record record-one" aria-hidden="true"></div>
            <div className="record record-two" aria-hidden="true"></div>
            <figure className="hero-photo">
              <img src="/images/hero-collage.webp" alt="Young people learning together around a DJ controller" />
            </figure>
            <div className="hero-sticker sticker-yellow">CREATE<br />LOUDLY.</div>
            <div className="hero-sticker sticker-white">AGES 8—18</div>
          </div>
        </section>

        <div className="sound-strip" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>

        <section className="impact-rail" aria-label="Future of Music impact">
          <div><strong>50+</strong><span>young people reached through DJ education</span></div>
          <div><strong>500+</strong><span>mentorship minutes logged</span></div>
          <div><strong>2</strong><span>free pathways for youth opportunity</span></div>
        </section>

        <section className="section about" id="about">
          <div className="section-kicker"><span>01</span> Why we exist</div>
          <div className="about-grid">
            <div className="about-statement">
              <h2>Talent is everywhere.<br />Access <em>isn’t.</em></h2>
              <p>We remove the barriers between a young person and their next big idea.</p>
            </div>
            <div className="about-story">
              <p className="big-copy">Future of Music is a youth-led nonprofit built around a simple belief: creative young people deserve the tools, mentors, and room to become more than they can currently imagine.</p>
              <p>Our programs combine expression with practical development. Students learn music technology, build leadership skills, explore entrepreneurship, strengthen academics, and meet people who see their potential.</p>
              <a className="text-link" href="mailto:info@fomusic.org">Start a conversation <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="about-photo-grid">
            <figure className="photo-tall"><img src="/images/two-boys-dj.webp" alt="Two Future of Music students at a DJ controller" /></figure>
            <div className="photo-quote"><span>“</span><p>Built with young people, not just for them.</p></div>
            <figure className="photo-wide"><img src="/images/group-work.webp" alt="Students collaborating during a Future of Music program" /></figure>
          </div>
        </section>

        <section className="section programs" id="programs">
          <div className="section-kicker light"><span>02</span> Programs</div>
          <div className="section-heading inverse">
            <h2>Two paths.<br /><em>Endless possibility.</em></h2>
            <p>Hands-on experiences that meet students where they are—and help them imagine where they can go.</p>
          </div>

          <article className="program-feature dj-feature">
            <div className="program-image-wrap">
              <img src="/images/group-work.webp" alt="Youth learning with professional DJ equipment" />
              <div className="program-badge">FREE<br />AGES 8—18</div>
            </div>
            <div className="program-content">
              <p className="eyebrow">Pathway 01 / DJ Program</p>
              <h3>Learn to DJ.<br />Lead with purpose.</h3>
              <p>Students get hands-on with professional controllers, music software, rhythm, mixing, and performance—while building teamwork, confidence, and an entrepreneurial mindset.</p>
              <ul className="feature-list">
                <li><span>01</span> DJ fundamentals + equipment</li>
                <li><span>02</span> Music selection + smooth mixing</li>
                <li><span>03</span> Creative identity + entrepreneurship</li>
                <li><span>04</span> Leadership + live performance</li>
              </ul>
              <div className="button-row">
                <a className="button button-light" href="mailto:aereon@fomusic.org?subject=Bring%20the%20DJ%20Program">Bring this program <span aria-hidden="true">↗</span></a>
                <span className="program-stat"><strong>50+</strong> youth served</span>
              </div>
            </div>
          </article>

          <article className="program-feature mentor-feature" id="mentorship">
            <div className="program-content">
              <p className="eyebrow">Pathway 02 / Mentorship</p>
              <h3>Support that feels<br />real and useful.</h3>
              <p>A three-month peer mentorship experience for students in grades 5–12, guided by student business owners, community leaders, and college-and-career readiness partners.</p>
              <div className="mentor-facts">
                <div><strong>3</strong><span>months</span></div>
                <div><strong>$50</strong><span>student stipend</span></div>
                <div><strong>4</strong><span>core pillars</span></div>
              </div>
              <div className="button-row">
                <a className="button" href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply now <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#mentor-details">See how it works <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <div className="mentor-poster" aria-label="Mentorship program overview graphic">
              <p>FALL COHORT</p>
              <strong>OCT 01<br />— DEC 31</strong>
              <span>MENTOR</span><i></i><span>MENTEE</span><i></i><span>FUTURE</span>
            </div>
          </article>
        </section>

        <section className="section mentor-details" id="mentor-details">
          <div className="section-kicker"><span>03</span> Mentorship, together</div>
          <div className="section-heading">
            <h2>Four kinds of support.<br /><em>One stronger student.</em></h2>
            <p>Mentorship details and portal access are now together—program information, applications, partner details, and current-member access in one place.</p>
          </div>
          <div className="pillar-grid">
            {pillars.map(([number, title, copy]) => (
              <article className="pillar" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="experience-band">
            <div><span>MORE THAN A CHECK-IN</span><h3>Mentee days. Service trips. Networking. Belonging.</h3></div>
            <p>Students connect with one another, serve their community, meet young business owners, and build relationships that expand their world.</p>
          </div>
          <div className="portal-card">
            <div>
              <p className="eyebrow">Already in the program?</p>
              <h3>Your tools are right here.</h3>
              <p>Current mentors, mentees, and staff can open the active dashboard. Older cohort resources remain available when needed.</p>
            </div>
            <div className="portal-actions">
              <a className="button" href="https://fomusic.org/portal-v2/" {...external}>Current portal <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="https://mentee.fomusic.org/" {...external}>Legacy cohort portal <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="photo-break" aria-label="Future of Music program gallery">
          <figure className="gallery-one"><img src="/images/headphone-on.webp" alt="Future of Music student wearing headphones" /></figure>
          <div className="gallery-copy"><span>TURN</span><strong>IT</strong><em>UP.</em></div>
          <figure className="gallery-two"><img src="/images/two-boys-dj.webp" alt="Youth DJ participants learning together" /></figure>
          <figure className="gallery-three"><img src="/images/group-work.webp" alt="A Future of Music group workshop" /></figure>
        </section>

        <section className="section partners" id="partners">
          <div className="section-kicker"><span>04</span> Community powered</div>
          <div className="partners-grid">
            <div className="section-heading">
              <h2>It takes a whole<br /><em>community.</em></h2>
              <p>Schools, nonprofits, businesses, mentors, and donors make free programs possible. Every partner adds a door a student can walk through.</p>
              <a className="button" href="mailto:info@fomusic.org?subject=Future%20of%20Music%20Partnership">Become a partner <span aria-hidden="true">↗</span></a>
            </div>
            <div className="partner-wall" aria-label="Future of Music partners">
              <div className="partner-logo blue-logo"><span>JSD</span><strong>Jennings<br />School District</strong></div>
              <div className="partner-logo yellow-logo"><span>CL</span><strong>Creator<br />Launch</strong></div>
              <div className="partner-logo coral-logo"><span>NP</span><strong>Next<br />Prep</strong></div>
              <div className="partner-logo ink-logo"><span>+</span><strong>Community<br />Leaders</strong></div>
            </div>
          </div>
          <div className="partner-marquee" aria-hidden="true"><div>HOST A PROGRAM • SPONSOR EQUIPMENT • MENTOR A STUDENT • OPEN A DOOR • HOST A PROGRAM • SPONSOR EQUIPMENT • MENTOR A STUDENT • OPEN A DOOR •</div></div>
        </section>

        <section className="section team" id="team">
          <div className="section-kicker light"><span>05</span> Meet the team</div>
          <div className="section-heading inverse">
            <h2>Youth-led.<br /><em>Future-focused.</em></h2>
            <p>A small team with lived experience, big ideas, and an honest belief in what young people can build.</p>
          </div>
          <div className="team-grid">
            {team.map((person) => (
              <article className={`team-card ${person.color}`} key={person.name}>
                <div className="team-photo"><img src={person.image} alt={person.name} /></div>
                <div className="team-copy">
                  <p>{person.role}</p><h3>{person.name}</h3><span>{person.bio}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section stories">
          <div className="section-kicker"><span>06</span> Stories in the mix</div>
          <div className="stories-heading"><h2>Meet the people<br />behind the <em>movement.</em></h2><p>Read the stories, ideas, and lived experiences that shaped Future of Music.</p></div>
          <div className="stories-grid">
            <a href="https://fomusic.org/blog/why-we-started-fom.html" {...external} className="story-card story-main">
              <span>Our story / 5 min read</span><h3>Why we started Future of Music.</h3><p>Young creators needed more than inspiration. They needed access, guidance, and a platform.</p><b>Read story ↗</b>
            </a>
            <a href="https://fomusic.org/blog/meet-aereon.html" {...external} className="story-card story-aereon">
              <img src="/images/aereon.webp" alt="" /><span>Meet Aereon</span><h3>The vision behind the mission.</h3><b>Read story ↗</b>
            </a>
            <a href="https://fomusic.org/blog/meet-qwentin.html" {...external} className="story-card story-qwentin">
              <img src="/images/qwentin.webp" alt="" /><span>Meet Qwentin</span><h3>Creating connection that moves.</h3><b>Read story ↗</b>
            </a>
          </div>
        </section>

        <section className="donate" id="donate">
          <div className="donate-art" aria-hidden="true"><div className="donate-record"></div><span>GIVE<br />THE<br />FUTURE<br />VOLUME.</span></div>
          <div className="donate-copy">
            <p className="eyebrow">Keep every program free</p>
            <h2>Your gift puts the tools<br />in <em>their hands.</em></h2>
            <p>Donations support DJ equipment, workshops, mentorship resources, student supplies, and creative opportunities for young people.</p>
            <div className="amounts" aria-label="Suggested donation impacts">
              <div><strong>$25</strong><span>Student essentials</span></div>
              <div><strong>$100</strong><span>Program support</span></div>
              <div><strong>$500</strong><span>Major program impact</span></div>
            </div>
            <div className="button-row">
              <a className="button button-yellow" href="https://zeffy.com/en-US/peer-to-peer/free-youth-dj-program" {...external}>Donate securely <span aria-hidden="true">↗</span></a>
              <a className="text-link light-link" href="mailto:info@fomusic.org?subject=Donation%20Question">Ask a donation question <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Future of Music" />
            <p>Music, mentorship, leadership, technology, and entrepreneurship for the next generation.</p>
            <div className="footer-pills"><span>Youth-led</span><span>St. Louis</span><span>Free programs</span></div>
          </div>
          <div><h3>Explore</h3><a href="#about">About us</a><a href="#programs">Programs</a><a href="#mentorship">Mentorship</a><a href="#partners">Partners</a><a href="#team">Team</a></div>
          <div><h3>Take action</h3><a href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply</a><a href="#donate">Donate</a><a href="mailto:info@fomusic.org">Contact us</a><a href="https://fomusic.org/portal-v2/" {...external}>Member portal</a></div>
          <div><h3>Contact</h3><a href="mailto:info@fomusic.org">info@fomusic.org</a><a href="mailto:qwentin@fomusic.org">qwentin@fomusic.org</a><a href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/" {...external}>View Candid profile ↗</a></div>
        </div>
        <div className="footer-bottom"><p>Nationally recognized 501(c)(3) nonprofit • EIN 33-4753021</p><p>© 2026 Future of Music</p></div>
      </footer>
    </>
  );
}
