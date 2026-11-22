import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { external, PageShell } from "../../components/SiteChrome";
import styles from "./dj.module.css";

export const metadata: Metadata = {
  title: "Youth DJ Program & Free Class Registration | Future of Music",
  description: "Free hands-on DJ education for youth ages 8–18 in St. Louis. Learn with professional equipment, build creative confidence, and register for a community DJ class.",
};

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdLz2Zg9kjSuQ-EWac49RiWBfvSS_Pz1LxSh4zH0I3Exp08Jg/viewform";

const learningAreas = [
  ["01", "DJ fundamentals", "Students learn the decks, jog wheels, pads, headphones, music software, and the practical choices behind a mix."],
  ["02", "Music & mixing", "Sessions cover rhythm, tempo, cueing, song selection, and transitions through guided practice on the equipment."],
  ["03", "Leadership & teamwork", "Students take turns, make group decisions, give feedback, and practice communicating their creative choices."],
  ["04", "Creative pathways", "Students explore performance, creative identity, professionalism, entrepreneurship, and their next steps in music."],
];

function SoundBars() {
  return <div className={styles.soundBars} aria-hidden="true">
    {Array.from({ length: 20 }, (_, index) => <i key={index} style={{ "--bar": `${(index * 23) % 92 + 20}%`, "--delay": `${index * -0.13}s` } as CSSProperties} />)}
  </div>;
}

export default function DjProgramPage() {
  return <PageShell active="programs" mainClassName={styles.djPage}>
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.signal}>Free youth music education <span></span> St. Louis</p>
          <h1>Future of Music<br /><em>DJ Program</em></h1>
          <p className={styles.heroLede}>A free, hands-on program where young people learn to DJ with professional equipment while developing leadership, communication, and confidence through music.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#registration">Register for a free class</a>
            <a className={styles.secondaryAction} href="#inside">Explore the program</a>
          </div>
          <div className={styles.liveLine}><span aria-hidden="true"></span><p>Free to students · Professional equipment · In-person instruction</p></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroGridLines} aria-hidden="true"></div>
          <figure className={styles.heroPhoto}>
            <img src="/images/programs/hands-on-instruction-1600.webp" alt="Future of Music students learning together around DJ controllers" loading="eager" />
          </figure>
          <div className={styles.deckGraphic} aria-hidden="true"><div className={styles.vinyl}><i></i><b></b></div><div className={styles.deckReadout}>FOM // LIVE<br /><strong>120.0</strong> BPM</div></div>
          <p className={styles.photoNote}>Music technology in practice</p>
        </div>
      </div>
    </section>

    <section className={styles.infoStrip} aria-label="Youth DJ Program details">
      <div><strong>100+</strong><span>Youth served through Future of Music programs</span></div>
      <div><strong>Ages 8–18</strong><span>Welcoming new and returning learners</span></div>
      <div><strong>$0</strong><span>Always free for students</span></div>
      <div><strong>In person</strong><span>Instruction, practice, and group learning</span></div>
    </section>

    <section className={styles.inside} id="inside">
      <header className={styles.sectionHeading}>
        <p>Program approach</p>
        <h2>Intentional<br /><em>lessons.</em></h2>
        <span>Music is the foundation, but each session is designed to develop confidence, leadership, communication, collaboration, and comfort trying something new.</span>
      </header>
      <div className={styles.learningGrid}>
        {learningAreas.map(([number, title, copy]) => <article key={number}>
          <span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true"></i>
        </article>)}
      </div>
    </section>

    <section className={styles.equipment}>
      <div className={styles.equipmentPhoto}><img src="/images/programs/dj-equipment-1600.webp" alt="Professional DJ controllers arranged for a Future of Music workshop" loading="lazy" /><span>DDJ-FLX4 controllers</span></div>
      <div className={styles.equipmentCopy}>
        <p className={styles.signal}>Equipment access</p>
        <h2>Professional<br /><em>DJ equipment</em></h2>
        <p>Students get time on Pioneer DJ DDJ-FLX4 controllers, headphones, laptops, and music software. They do not watch from the side—they make the choices, test the controls, and learn by doing.</p>
        <dl><div><dt>Hands-on</dt><dd>Students use the equipment in every session.</dd></div><div><dt>Supported</dt><dd>Instruction leaves room for questions and independent practice.</dd></div><div><dt>Collaborative</dt><dd>Participants learn how to share a setup, a plan, and a sound.</dd></div></dl>
      </div>
    </section>

    <section className={styles.galleryBand}>
      <div className={styles.galleryHeading}><p>Learning in practice</p><h2>Students at<br />the controls.</h2><SoundBars /></div>
      <div className={styles.photoGrid}>
        <figure className={styles.photoTall}><img src="/images/programs/student-headphones-1600.webp" alt="A student practicing at a DJ controller while wearing headphones" loading="lazy" /><figcaption>Independent listening and practice</figcaption></figure>
        <figure className={styles.photoWide}><img src="/images/programs/students-together-1600.webp" alt="Two students gathered beside Future of Music DJ equipment" loading="lazy" /><figcaption>Shared equipment and peer learning</figcaption></figure>
        <figure className={styles.photoWide}><img src="/images/programs/class-community-1600.webp" alt="Future of Music students and instructor gathered with DJ equipment" loading="lazy" /><figcaption>Group instruction and creative exploration</figcaption></figure>
      </div>
    </section>

    <section className={styles.hosting}>
      <header><p>For schools + community partners</p><h2>Bring the program<br />to your school.</h2></header>
      <div><article><span>Workshops</span><p>Introduce students to DJ equipment, music technology, and the foundations of a mix.</p></article><article><span>Extended programs</span><p>Build an after-school, summer, or partner series with deeper practice and creative projects.</p></article><article><span>Showcase support</span><p>Prepare students to share music, build stage presence, and celebrate their growth.</p></article><a href="mailto:aereon@fomusic.org?subject=DJ%20Program%20Partnership" className={styles.hostingLink}>Start a conversation</a></div>
    </section>

    <section className={styles.registration} id="registration">
      <div className={styles.registrationSignal} aria-hidden="true"><SoundBars /></div>
      <div className={styles.registrationIntro}><p>Open community class</p><h2>Free <em>DJ class</em></h2><span>Beginner-friendly instruction hosted directly by Future of Music. No previous experience or equipment is needed.</span><dl><div><dt>Who</dt><dd>Youth ages 8–18</dd></div><div><dt>Cost</dt><dd>Free for students</dd></div><div><dt>When</dt><dd>Class details shared after confirmation</dd></div></dl></div>
      <div className={styles.registrationForm}><p>Share your interest and we’ll follow up with the date, location, and next steps. A parent or guardian may complete the form for a child.</p><details><summary>Open the registration form</summary><iframe src={formUrl + "?embedded=true"} title="Free DJ class interest form" loading="lazy">Loading…</iframe></details><p className={styles.formFallback}>Prefer a new tab? <a href={formUrl} {...external}>Open the registration form</a>.</p></div>
    </section>
  </PageShell>;
}
