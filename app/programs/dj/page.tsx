import type { Metadata } from "next";
import { Arrow, PageShell, ProgramGallery } from "../../components/SiteChrome";
import { djGalleryImages } from "../../gallery";

export const metadata: Metadata = { title: "Youth DJ Program | Future of Music", description: "Free hands-on DJ education for youth ages 8–18 in St. Louis." };

const lessons = [
  ["01", "DJ fundamentals", "Students learn to use DJ controllers, headphones, software, and professional equipment safely and confidently."],
  ["02", "Music + mixing", "Song structure, rhythm, tempo, cueing, transitions, music selection, and the skills behind a smooth mix."],
  ["03", "Creative business", "Branding, creative identity, professionalism, entrepreneurship, and opportunities across the music industry."],
  ["04", "Leadership + performance", "Communication, teamwork, decision-making, stage presence, and preparation for a final performance."],
];

export default function DjProgramPage() {
  return (
    <PageShell active="programs" mainClassName="program-theme program-theme-dj">
      <section className="program-page-hero dj-page-hero">
        <div className="program-hero-copy"><p className="program-chip">FREE • AGES 8–18</p><h1>Learn to DJ.<br /><em>Create with confidence.</em><br />Lead with purpose.</h1><p>Hands-on DJ training that combines music, technology, entrepreneurship, and leadership in one unforgettable learning experience.</p><div className="button-row"><a className="button button-yellow" href="mailto:aereon@fomusic.org?subject=Bring%20the%20DJ%20Program">Bring this program <Arrow /></a><a className="text-link light-link" href="#curriculum">See what students learn <Arrow direction="down" /></a></div></div>
        <figure><img src="/gallery/dj/03-controller-closeup.png" alt="DJ controller ready for a Future of Music session" /><div>50+<span>YOUTH SERVED</span></div></figure>
      </section>

      <div className="dj-ticker" aria-label="Mix, create, lead, and perform">
        <span>MIX</span><i></i><span>CREATE</span><i></i><span>LEAD</span><i></i><span>PERFORM</span>
      </div>

      <section className="program-overview section-pad">
        <div className="overview-statement"><p className="section-label">Program overview</p><h2>Where music, technology, business, and leadership <em>meet.</em></h2></div>
        <div className="overview-copy"><p className="large-copy">Students do more than learn the controls.</p><p>Through guided instruction, collaborative activities, independent practice, and performance opportunities, young people learn to mix music, express themselves, solve problems, and work effectively with others.</p><p>By the end of the program, participants leave with practical DJ skills, a clearer understanding of the music industry, and the confidence to turn creative interests into real-world opportunities.</p></div>
      </section>

      <section className="curriculum section-pad" id="curriculum">
        <div className="compact-heading"><div><p className="section-label light">The curriculum</p><h2>Four parts.<br /><em>One complete mix.</em></h2></div><p>Beginner-friendly instruction builds skills step by step, with time to practice and create.</p></div>
        <div className="lesson-grid">{lessons.map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="program-formats section-pad">
        <div className="compact-heading"><div><p className="section-label">Program fit</p><h2>Flexible for different<br /><em>youth spaces.</em></h2></div><p>The DJ Program can be adapted for elementary, middle, and high school groups based on the setting and student needs.</p></div>
        <div className="format-grid">
          <article><span>01</span><h3>Workshops</h3><p>Short sessions introducing DJ equipment and foundational creative music skills.</p></article>
          <article><span>02</span><h3>Enrichment</h3><p>After-school, summer, or partner programming for deeper music technology learning.</p></article>
          <article><span>03</span><h3>Performance</h3><p>Practice communication, creative decisions, stage presence, and sharing a final mix.</p></article>
        </div>
      </section>

      <section className="program-gallery"><figure><img src="/gallery/dj/04-students-mixing.png" alt="Students practicing DJ skills together" /></figure><div><span>TURN</span><strong>IT</strong><em>UP.</em></div><figure><img src="/gallery/dj/05-student-laptop.png" alt="Student learning DJ software and music selection" /></figure></section>

      <ProgramGallery title="DJ moments" images={djGalleryImages} />

      <section className="program-partners section-pad">
        <div><p className="section-label">Program community</p><h2>Made possible<br />with <em>partners.</em></h2><p>Future of Music works with schools, youth organizations, community leaders, and businesses to place equipment and opportunity where students already are.</p></div>
        <div className="partner-pills"><span>Future of Music</span><span>Jennings School District</span><span>CreatorLaunch</span><span>Community Partners</span></div>
      </section>

      <section className="program-final-cta dj-final"><div><p className="section-label">Schools • nonprofits • businesses</p><h2>Bring the beat<br />to your community.</h2></div><div><p>Host, sponsor, or support a Future of Music DJ Program experience.</p><a className="button button-yellow" href="mailto:aereon@fomusic.org?subject=DJ%20Program%20Partnership">Become a DJ Program partner <Arrow /></a></div></section>
    </PageShell>
  );
}
