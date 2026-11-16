import type { Metadata } from "next";
import { Arrow, PageShell, ProgramGallery } from "../../components/SiteChrome";
import { mentorshipGalleryImages } from "../../gallery";
import { MentorshipApplication } from "./MentorshipApplication";

export const metadata: Metadata = {
  title: "Mentorship Program | Future of Music",
  description: "A three-month, weekly mentorship experience for St. Louis youth in grades 5–12.",
};

const pillars = [
  ["01", "Personal development", "Build confidence, communication, leadership, and the habits that help you show up for yourself."],
  ["02", "Academics", "Stay aware of grades, missing work, goals, and the next steps that keep school moving forward."],
  ["03", "Entrepreneurship", "Explore ideas, professional skills, and the first real steps toward building something of your own."],
  ["04", "College + career", "Learn about options, ask stronger questions, and make a plan for what comes after high school."],
];

export default function ProgramMentorshipPage() {
  return <PageShell active="programs" mainClassName="program-theme program-theme-mentor">
    <section className="program-page-hero mentor-page-hero">
      <div className="program-hero-copy">
        <p className="program-chip">ST. LOUIS YOUTH • GRADES 5–12</p>
        <h1>Real support.<br /><em>Every week.</em></h1>
        <p>Future of Music Mentorship is a three-month commitment built around a 30-minute weekly meeting with a mentor. Students make a plan, keep moving, and leave with tangible next steps.</p>
        <div className="stipend"><strong>$50</strong><span>COMPLETION STIPEND FOR MENTEES WHO MEET THEIR WEEKLY COMMITMENT</span></div>
        <div className="button-row"><a className="button" href="#apply">Apply for mentorship <Arrow direction="down" /></a><a className="text-link" href="/mentorship/">Mentor & member sign in <Arrow direction="up" /></a></div>
      </div>
      <div className="mentor-main-poster" aria-label="Three-month weekly mentorship cycle"><p>WEEKLY COMMITMENT</p><strong>3<br />MONTHS</strong><div><span>30 MINUTES</span><i></i><span>MENTOR</span><i></i><span>MENTEE</span></div></div>
    </section>

    <div className="mentor-promise-strip" aria-label="Mentorship program commitments">
      <span><strong>01</strong> Meet weekly</span>
      <span><strong>02</strong> Set goals</span>
      <span><strong>03</strong> Try new things</span>
      <span><strong>04</strong> Leave with a plan</span>
    </div>

    <section className="mentor-overview section-pad">
      <article className="cohort-card"><p className="section-label">The commitment</p><h2>Thirty minutes.<br /><em>Every week.</em></h2><p>Each mentee meets with their mentor once a week throughout the three-month cycle. The work is steady, personal, and focused on useful progress.</p><div className="cohort-facts"><div><strong>12</strong><span>weekly meetings</span></div><div><strong>4</strong><span>growth areas</span></div><div><strong>$50</strong><span>on completion</span></div></div></article>
      <article className="partnership-card"><p className="section-label">What comes from it</p><h2>More clarity.<br />More <em>direction.</em></h2><p>Students leave with goals they can name, steps they can take, stronger communication, and support for the things that matter right now—at school, at home, and for the future.</p></article>
    </section>

    <section className="pillar-section section-pad">
      <div className="compact-heading"><div><p className="section-label">What we work on</p><h2>Four areas.<br /><em>One whole student.</em></h2></div><p>Mentorship starts with what a young person needs most and brings each area into the conversation when it is useful.</p></div>
      <div className="pillar-grid">{pillars.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="experiences section-pad">
      <div className="compact-heading"><div><p className="section-label light">Tangible outcomes</p><h2>Not just a<br /><em>conversation.</em></h2></div><p>Each meeting is a chance to name a goal, work through a decision, and keep a record of what changes over time.</p></div>
      <div className="experience-grid"><article><span>01</span><h3>A clearer plan</h3><p>Set a next step for school, a goal, an idea, or a future opportunity—and check back on it.</p></article><article><span>02</span><h3>Stronger habits</h3><p>Build the confidence to ask questions, follow through, and use support when it is needed.</p></article><article><span>03</span><h3>Progress you can see</h3><p>Track grades, goals, reflections, and meetings alongside a mentor who knows your story.</p></article></div>
    </section>

    <ProgramGallery title="Mentorship in action" images={mentorshipGalleryImages} />
    <MentorshipApplication />
  </PageShell>;
}
