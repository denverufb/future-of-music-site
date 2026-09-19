import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";
import styles from "./story.module.css";

export const metadata: Metadata = { title: "Our Story & Founder | Future of Music", description: "Discover why Aereon Robinson founded Future of Music—a youth-led St. Louis nonprofit creating opportunities through music, mentorship, and entrepreneurship." };

const sources = {
  town: "https://townandstyle.com/student-standouts-aereon-robinson-of-principia-school/",
  american: "https://www.stlamerican.com/business/from-teen-dj-to-teen-mentor/",
  journal: "https://www.bizjournals.com/stlouis/news/2025/10/25/character-aereon-robinson-dj-future-of-music.html",
};

function Photo({ name, alt, caption, width, height, eager = false }: { name: string; alt: string; caption: string; width: number; height: number; eager?: boolean }) {
  return <figure className={styles.photo}>
    <img src={`/images/about/${name}-1600.webp`} srcSet={`/images/about/${name}-800.webp 800w, /images/about/${name}-1600.webp 1600w`} sizes={eager ? "(max-width: 1150px) 94vw, 1100px" : "(max-width: 600px) 94vw, (max-width: 1150px) 48vw, 540px"} width={width} height={height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export default function AboutPage() {
  return <PageShell active="about" mainClassName={styles.about}>
    <header className={styles.intro}>
      <p className={styles.kicker}>Our story · St. Louis, Missouri</p>
      <div className={styles.introGrid}>
        <h1>A first opportunity<br /><em>worth passing on.</em></h1>
        <div><p className={styles.lede}>We’re Future of Music, a youth-led nonprofit helping young people turn creative interests into skills, confidence, and possibility.</p><nav className={styles.jumpLinks} aria-label="On this page"><a href="#our-story">The FOM story</a><a href="#founder">Meet Aereon</a><a href="#our-mission">Our mission</a></nav></div>
      </div>
    </header>

    <article id="our-story" className={styles.chapter} aria-labelledby="story-title" data-photo-section="fom">
      <Photo name="fom-community" alt="Future of Music students gathered with headphones, laptops, and DJ equipment" caption="Young creators. Shared experiences. A place to get started." width={1600} height={944} eager />
      <div className={styles.chapterGrid}>
        <aside className={styles.marginNote}><p className={styles.kicker}>The FOM story</p><p>Built with youth.<br />Rooted in community.</p><span>Music · Mentorship · Opportunity</span></aside>
        <div className={styles.prose}>
          <h2 id="story-title">Young people have ideas.<br />They deserve a place to begin.</h2>
          <p className={styles.lede}>Future of Music began with a young person’s curiosity—and grew from his determination to make getting started easier for someone else.</p>
          <p>Aereon saw a gap between having a creative interest and knowing what to do with it. In St. Louis, he struggled to find guidance designed for young entrepreneurs in music and entertainment.</p>
          <p>Future of Music was his response: a place where young people could explore their interests with support, rather than having to figure everything out alone. Early one-on-one mentorship focused on entrepreneurship and personal development—the knowledge behind building something, not just the talent that gets it started. <a href={sources.town} {...external}>Town &amp; Style <Arrow direction="up" /></a></p>
          <p>That purpose became tangible during a workshop with Beyond Housing’s Children’s Defense Fund Freedom School, where students explored DJing and music production. Their reactions reflected more than excitement about equipment: they were discovering something new they could do. <a href={sources.american} {...external}>The St. Louis American <Arrow direction="up" /></a></p>
        </div>
      </div>
      <div className={styles.photoPair}>
        <Photo name="students-learning" alt="Students practicing together at a table of DJ controllers and laptops" caption="Room to try something new." width={1600} height={1454} />
        <Photo name="students-creating" alt="A student mixing at a DJ controller while peers watch and learn" caption="Learning by doing—and learning from each other." width={1600} height={1479} />
      </div>
    </article>

    <section id="founder" className={styles.founder} aria-labelledby="founder-title" data-photo-section="founder">
      <div className={styles.founderHeading}><p className={styles.kicker}>The person behind the beginning</p><h2 id="founder-title">Meet Aereon Robinson.</h2><p>Founder &amp; Executive Director</p></div>
      <div className={styles.founderGrid}>
        <Photo name="founder-at-the-decks" alt="Aereon Robinson working at a table of DJ equipment during a workshop" caption="Aereon at the decks, sharing the craft that started it all." width={1600} height={2400} />
        <div className={styles.prose}>
          <h3>From finding his sound<br />to helping others find theirs.</h3>
          <p>Aereon is a St. Louis DJ, entrepreneur, and youth mentor whose path from performing to nonprofit leadership earned a profile in the <em>St. Louis Business Journal</em>. He brings firsthand experience of starting young to his work with Future of Music.</p>
          <p><a href={sources.journal} {...external}>Read the Business Journal profile.</a></p>
          <p>Before founding FOM, Aereon Robinson discovered DJing through equipment passed down by his uncle. A small controller became an introduction to performing, then to running his own business, SaySo Entertainment. But building a business while young meant learning much more than music. There were taxes, paperwork, age restrictions, and decisions that few programs were helping someone his age navigate. <a href={sources.town} {...external}>Town &amp; Style <Arrow direction="up" /></a></p>
          <p>Aereon’s own experience showed him how much a first opportunity could matter. His father helped him secure an early DJ appearance at a children’s pop-up event. That introduction led to relationships with clients who continued booking him.</p>
          <p>As he gained experience, performing also became an education in networking, promoting his work, and developing a business. Those lessons helped shape FOM’s purpose.</p>
        </div>
      </div>
      <blockquote className={styles.quote}><p>“Music is the face of it, but entrepreneurship is what we want them to pursue.”</p><cite>Aereon Robinson, in <a href={sources.american} {...external}>The St. Louis American</a></cite></blockquote>
      <div className={styles.photoPair}>
        <Photo name="founder-teaching" alt="Aereon leading a classroom discussion about music genres" caption="Sharing the possibilities within music." width={1600} height={1067} />
        <Photo name="founder-with-students" alt="Aereon seated with young students around a DJ controller" caption="Making space for questions, curiosity, and connection." width={1600} height={1067} />
      </div>
    </section>

    <section id="our-mission" className={styles.mission} aria-labelledby="mission-title">
      <div className={styles.chapterGrid}>
        <aside className={styles.marginNote}><p className={styles.kicker}>Why we’re here</p><p>Youth-led.<br />Community-centered.<br />Free programs.</p><span>501(c)(3) nonprofit<br />EIN: 33-4753021</span></aside>
        <div className={styles.prose}>
          <h2 id="mission-title">Music is the beginning.<br />Opportunity is the purpose.</h2>
          <p>We create free programs where music opens the door—and mentorship, leadership, technology, and entrepreneurship help young people walk through it.</p>
          <p>At the heart of FOM is a simple ambition: help young people take their interests seriously, build practical skills, and see possibilities for themselves.</p>
          <dl className={styles.values}>
            <div><dt>Access</dt><dd>High-quality opportunities should not depend on what a family can afford.</dd></div>
            <div><dt>Youth voice</dt><dd>Young people help shape the programs, culture, and future of the organization.</dd></div>
            <div><dt>Real skills</dt><dd>Every experience should leave students with something useful in school, work, and life.</dd></div>
            <div><dt>Community</dt><dd>Progress grows faster when schools, leaders, businesses, and families work together.</dd></div>
          </dl>
          <p className={styles.closing}>Music is where the story began.<br />Helping others get started is why it continues.</p>
          <div className={styles.jumpLinks}><a href="/team">Meet our team <Arrow /></a><a href="mailto:info@fomusic.org">Get in touch <Arrow /></a><a href="/donate">Support our work <Arrow /></a></div>
        </div>
      </div>
    </section>

    <section className={styles.press} aria-labelledby="press-title"><p className={styles.kicker}>Further reading</p><h2 id="press-title">Our story, in the community.</h2><div className={styles.pressLinks}>
      <a href={sources.town} {...external}><span>Town &amp; Style</span><strong>Student Standouts: Aereon Robinson</strong><span aria-hidden="true">↗</span></a>
      <a href={sources.american} {...external}><span>The St. Louis American</span><strong>From teen DJ to teen mentor</strong><span aria-hidden="true">↗</span></a>
      <a href={sources.journal} {...external}><span>St. Louis Business Journal</span><strong>Teen DJ turns passion into nonprofit</strong><span aria-hidden="true">↗</span></a>
    </div></section>
  </PageShell>;
}
