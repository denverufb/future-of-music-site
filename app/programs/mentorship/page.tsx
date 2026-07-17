import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../../components/SiteChrome";

export const metadata: Metadata = { title: "Mentorship Program | Future of Music", description: "A three-month peer mentorship program for students in grades 5–12." };

const pillars = [
  ["01", "Personal development", "Accountability, leadership, communication, confidence, and goal setting."],
  ["02", "Academics", "Homework support, academic planning, school progress, and stronger learning habits."],
  ["03", "Entrepreneurship", "Ideas, branding, professionalism, and guidance from teenage business owners."],
  ["04", "College + career", "Career exploration, college pathways, networking, and postsecondary decisions."],
];

export default function MentorshipPage() {
  return (
    <PageShell active="programs">
      <section className="program-page-hero mentor-page-hero">
        <div className="program-hero-copy"><p className="program-chip">FALL COHORT • GRADES 5–12</p><h1>Mentorship that feels<br /><em>real and useful.</em></h1><p>A one-of-a-kind three-month peer mentorship program guided by student business owners, community leaders, and college-and-career readiness partners.</p><div className="stipend"><strong>$50</strong><span>STIPEND FOR EVERY PARTICIPATING MENTEE</span></div><div className="button-row"><a className="button" href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply for mentorship <Arrow direction="up" /></a><a className="text-link" href="#portal">Member portal <Arrow direction="down" /></a></div></div>
        <div className="mentor-main-poster" aria-label="Mentorship program dates"><p>OCTOBER 01 — DECEMBER 31</p><strong>3<br />MONTHS</strong><div><span>MENTOR</span><i></i><span>MENTEE</span><i></i><span>FUTURE</span></div></div>
      </section>

      <section className="mentor-overview section-pad">
        <article className="cohort-card"><p className="section-label">Who can join</p><h2>Students ready to<br /><em>grow.</em></h2><p>The cohort is designed for students who want support with school, confidence, leadership, business ideas, career exploration, and planning what comes next.</p><div className="cohort-facts"><div><strong>Oct 1</strong><span>Start date</span></div><div><strong>Dec 31</strong><span>End date</span></div><div><strong>$50</strong><span>Stipend</span></div></div></article>
        <article className="partnership-card"><p className="section-label">Partnership spotlight</p><h2>Future of Music<br />× Next Prep</h2><p>Next Prep brings high-quality college-and-career readiness mentorship to the cohort. Through career exploration and college search support, students build stronger postsecondary knowledge and decision-making skills.</p></article>
      </section>

      <section className="pillar-section section-pad">
        <div className="compact-heading"><div><p className="section-label">Core pillars</p><h2>Four kinds of support.<br /><em>One stronger student.</em></h2></div><p>Each pillar gives students something practical they can use in school, business, leadership, and life.</p></div>
        <div className="pillar-grid">{pillars.map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="experiences section-pad">
        <div className="compact-heading"><div><p className="section-label light">Cohort experiences</p><h2>More than a<br /><em>weekly check-in.</em></h2></div></div>
        <div className="experience-grid"><article><span>01</span><h3>Mentee Day events</h3><p>Fun activities that build connection, confidence, and belonging.</p></article><article><span>02</span><h3>Community service</h3><p>Trips that help students practice leadership and understand local impact.</p></article><article><span>03</span><h3>Networking</h3><p>Meet community leaders, young business owners, mentors, and ambitious peers.</p></article></div>
      </section>

      <section className="portal-section section-pad" id="portal">
        <div className="portal-copy"><p className="section-label">Current members</p><h2>Your mentorship tools<br />are <em>right here.</em></h2><p>Mentorship details and portal access now live together. Current students, mentors, and staff can use the active dashboard, while older cohort resources remain available when needed.</p></div>
        <div className="portal-options"><article><span>CURRENT</span><h3>Active mentorship portal</h3><p>Tracking, cohort tools, and current-member access.</p><a className="button" href="https://fomusic.org/portal-v2/" {...external}>Open current portal <Arrow direction="up" /></a></article><article><span>ARCHIVE</span><h3>Legacy cohort portal</h3><p>Historical access for older cohort needs.</p><a className="text-link" href="https://mentee.fomusic.org/" {...external}>Open legacy portal <Arrow direction="up" /></a></article></div>
      </section>

      <section className="director-section"><div><p className="section-label">Program director</p><h2>Qwentin<br />Blassingame</h2><p>Contact Qwentin about school referrals, program partnerships, mentor support, or student opportunities.</p><a className="button button-light" href="mailto:qwentin@fomusic.org">Email Qwentin <Arrow /></a></div><figure><img src="/images/qwentin.webp" alt="Qwentin Blassingame, Mentorship Program Director" /></figure></section>

      <section className="program-final-cta mentor-final"><div><p className="section-label">Applications open</p><h2>Your next chapter<br />can start here.</h2></div><div><p>Apply for support focused on personal development, academics, entrepreneurship, and college-and-career readiness.</p><a className="button" href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply to the Mentorship Program <Arrow direction="up" /></a></div></section>
    </PageShell>
  );
}
