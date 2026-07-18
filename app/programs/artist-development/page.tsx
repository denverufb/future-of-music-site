import type { Metadata } from "next";
import { Arrow, PageShell } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Artist Development Academy | Future of Music",
  description: "A free, self-paced online artist development program for young singers, rappers, songwriters, producers, and performers.",
};

const modules = [
  ["00", "Start here", "Set expectations, protect your privacy, and complete a starting assessment."],
  ["01", "Artist identity", "Define your purpose, message, values, audience experience, and 90-day goal."],
  ["02", "Find your sound", "Explore delivery, rhythm, production, themes, influences, and experimentation."],
  ["03", "Creative practice", "Develop songwriting, revision, collaboration, studio, and performance habits."],
  ["04", "Build your brand", "Shape an authentic visual system, photo direction, brand voice, and content pillars."],
  ["05", "PR + media", "Write a strong artist bio, prepare key messages, and practice interview responses."],
  ["06", "Industry + rights", "Understand teams, labels, distribution, music rights, contracts, and warning signs."],
  ["07", "Release planning", "Build a 30-day marketing plan, professional habits, budget, and next steps."],
  ["08", "Portfolio + certificate", "Bring the work together, pass the final assessment, and document your growth."],
];

const portfolio = [
  "Artist Identity Statement", "Personal Sound Map", "Original Song Draft or Concept",
  "Short + Full Artist Biography", "Artist Brand Board", "Mock Media Interview",
  "Industry Pathway Map", "30-Day Release Plan", "90-Day Artist Action Plan",
];

const lessonSteps = [
  ["Learn", "Read a focused lesson with clear examples."],
  ["Explore", "Study an artist example or real-world situation."],
  ["Practice", "Complete a guided creative activity."],
  ["Check", "Take a short quiz with immediate explanations."],
  ["Build", "Add finished work to your portfolio."],
  ["Reflect", "Record one lesson learned and one next step."],
];

export default function ArtistDevelopmentPage() {
  return (
    <PageShell active="programs" mainClassName="artist-academy">
      <section className="artist-hero">
        <div className="artist-hero-copy">
          <p className="artist-status">OPEN BETA • FREE • AGES 10–18</p>
          <p className="artist-kicker">Future of Music presents</p>
          <h1>Artist<br />Development<br /><em>Academy.</em></h1>
          <p>Find your sound. Build your brand. Prepare for the industry.</p>
          <div className="button-row">
            <a className="button artist-button" href="/programs/artist-development/course">Start the open course <Arrow /></a>
            <a className="artist-text-link" href="#curriculum">Explore the curriculum <Arrow direction="down" /></a>
          </div>
        </div>
        <figure className="artist-hero-photo">
          <img src="/gallery/dj/05-student-laptop.png" alt="Young artist developing music skills with a laptop and DJ controller" />
          <figcaption><span>100%</span> ONLINE<br />SELF-PACED</figcaption>
        </figure>
      </section>

      <section className="artist-manifesto">
        <p>Talent is only the beginning.</p>
        <h2>Become the artist<br />you were meant to be.</h2>
        <div className="artist-outcomes" aria-label="Program focus areas">
          <span>Find your sound</span><span>Develop your image</span><span>Learn the industry</span><span>Build your future</span>
        </div>
      </section>

      <section className="artist-overview section-pad">
        <div><p className="section-label">The program</p><h2>Creative growth.<br /><em>Industry knowledge.</em><br />A plan forward.</h2></div>
        <div className="artist-overview-copy">
          <p className="large-copy">A free online academy for young singers, rappers, songwriters, producers, and performers.</p>
          <p>Students work through readings, real-world examples, interactive activities, writing exercises, quizzes, and creative projects at their own pace. Every module adds useful work to a personal Artist Development Portfolio.</p>
          <div className="artist-facts">
            <article><strong>4.5</strong><span>estimated hours</span></article>
            <article><strong>27</strong><span>narrated lessons</span></article>
            <article><strong>Any</strong><span>phone, tablet, or computer</span></article>
            <article><strong>Free</strong><span>for participating youth</span></article>
          </div>
        </div>
      </section>

      <section className="artist-curriculum section-pad" id="curriculum">
        <div className="artist-section-heading"><p className="section-label light">The curriculum</p><h2>One complete<br /><em>artist toolkit.</em></h2></div>
        <div className="artist-module-list">
          {modules.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="artist-lesson section-pad">
        <div className="artist-section-heading">
          <p className="section-label">Every lesson</p><h2>Simple to follow.<br /><em>Built to create.</em></h2>
          <p>No scheduled class times and no weekly deadlines. Students can stop, save their progress, and return when they are ready.</p>
        </div>
        <div className="artist-step-grid">
          {lessonSteps.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="artist-portfolio section-pad">
        <div className="artist-portfolio-copy"><p className="section-label light">Final project</p><h2>Your Artist Development Portfolio.</h2><p>Students leave with practical materials they can use for future opportunities, applications, meetings, releases, and recording sessions.</p></div>
        <div className="artist-portfolio-list">
          {portfolio.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
        </div>
      </section>

      <section className="artist-certificate section-pad">
        <div className="artist-certificate-mark" aria-hidden="true"><span>FOM</span><strong>✓</strong></div>
        <div>
          <p className="section-label">Finish with proof</p><h2>Earn a certificate.<br /><em>Leave with a plan.</em></h2>
          <p>Participants who complete every module, meet the quiz requirement, submit their portfolio, and complete the closing survey can earn an official Future of Music Artist Development Certificate of Completion.</p>
          <ul><li>Downloadable completion certificate</li><li>Completed digital Artist Workbook</li><li>Personalized 90-day Artist Action Plan</li></ul>
        </div>
      </section>

      <section className="artist-final">
        <div><p>READY TO DEVELOP YOUR ARTISTRY?</p><h2>Find your sound.<br />Build your future.</h2></div>
        <a className="button artist-button" href="/programs/artist-development/course">Start the open course <Arrow /></a>
      </section>
    </PageShell>
  );
}
