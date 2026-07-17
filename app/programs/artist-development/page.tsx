import type { Metadata } from "next";
import { Arrow, PageShell } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Artist Development Academy | Future of Music",
  description: "A free, self-paced online artist development program for young singers, rappers, songwriters, producers, and performers.",
};

const modules = [
  ["01", "Your artist journey", "Set goals, understand artist development, and assess where you are starting."],
  ["02", "Artist identity", "Define your purpose, message, values, personality, strengths, and audience."],
  ["03", "Find your sound", "Explore genre, influences, delivery, production choices, themes, and emotion."],
  ["04", "Songwriting practice", "Develop structure, hooks, verses, storytelling, originality, and revision habits."],
  ["05", "Studio + stage readiness", "Prepare to rehearse, record, perform, receive feedback, and work with producers."],
  ["06", "Build your brand", "Shape your name, story, colors, photos, fashion direction, and visual consistency."],
  ["07", "PR + media training", "Write a strong artist bio, introduce yourself, and answer interview questions."],
  ["08", "Industry fundamentals", "Understand labels, A&R, management, publishing, royalties, masters, and contracts."],
  ["09", "Marketing + releases", "Plan content, promotion, fan engagement, safe social media use, and your next release."],
  ["10", "Career planning", "Build professional habits, avoid scams, manage a budget, network, and set real goals."],
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
          <p className="artist-status">COMING SOON • FREE • AGES 10–18</p>
          <p className="artist-kicker">Future of Music presents</p>
          <h1>Artist<br />Development<br /><em>Academy.</em></h1>
          <p>Find your sound. Build your brand. Prepare for the industry.</p>
          <div className="button-row">
            <a className="button artist-button" href="mailto:info@fomusic.org?subject=Artist%20Development%20Academy%20Updates">Get launch updates <Arrow /></a>
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
            <article><strong>10–12</strong><span>estimated hours</span></article>
            <article><strong>10</strong><span>guided modules</span></article>
            <article><strong>Any</strong><span>phone, tablet, or computer</span></article>
            <article><strong>Free</strong><span>for participating youth</span></article>
          </div>
        </div>
      </section>

      <section className="artist-curriculum section-pad" id="curriculum">
        <div className="artist-section-heading"><p className="section-label light">The curriculum</p><h2>Ten modules.<br /><em>One complete artist toolkit.</em></h2></div>
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
        <a className="button artist-button" href="mailto:info@fomusic.org?subject=Artist%20Development%20Academy%20Updates">Join the interest list <Arrow /></a>
      </section>
    </PageShell>
  );
}
