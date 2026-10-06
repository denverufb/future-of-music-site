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
  return <PageShell active="programs" mainClassName="editorial-page">
    <section className="editorial-container editorial-feature"><div><p className="editorial-kicker">Open beta · Free · Ages 10–18</p><h1>Artist Development Academy</h1><p className="editorial-lede">A self-paced online program for young singers, rappers, songwriters, producers, and performers. Learn through readings, narration, creative activities, and quizzes.</p><div className="button-row"><a className="button" href="/programs/artist-development/course">Start the open course</a><a className="text-link" href="#curriculum">View the curriculum</a></div></div><aside className="cohort-summary"><p className="editorial-kicker">Learn at your own pace</p><h2>Course information</h2><dl><div><dt>Format</dt><dd>100% online · Self-paced</dd></div><div><dt>Lessons</dt><dd>27 narrated lessons</dd></div><div><dt>Estimated time</dt><dd>4.5 hours</dd></div><div><dt>Access</dt><dd>Phone, tablet, or computer</dd></div></dl><p>No scheduled classes or weekly deadlines. Progress saves on the device you use.</p></aside></section>
    <section className="editorial-band" id="curriculum"><div className="editorial-container editorial-columns"><div><p className="editorial-kicker">Curriculum</p><h2>Creative practice and industry knowledge.</h2><p>Each module adds work to your Artist Development Portfolio. Start with identity and sound, then explore branding, media, rights, and release planning.</p></div><div className="editorial-list">{modules.map(([number,title,copy])=><article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
    <section className="editorial-container editorial-section"><div className="editorial-section-heading"><p className="editorial-kicker">Lesson format</p><h2>Read, listen, practice, and reflect.</h2></div><div className="editorial-grid-three">{lessonSteps.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="editorial-container editorial-section editorial-columns"><div><p className="editorial-kicker">Final project</p><h2>Your Artist Development Portfolio</h2><p>Build materials to use in future applications, meetings, releases, and recording sessions.</p></div><ul className="portfolio-editorial">{portfolio.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="editorial-container editorial-cta"><div><h2>Complete the course.</h2><p>Finish the modules, meet the quiz requirement, and complete your portfolio and closing survey to earn a certificate. Download your workbook and personal 90-day action plan.</p></div><a className="button" href="/programs/artist-development/course">Start learning</a></section>
  </PageShell>;
}
