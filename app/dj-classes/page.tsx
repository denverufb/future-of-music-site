import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";

const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdLz2Zg9kjSuQ-EWac49RiWBfvSS_Pz1LxSh4zH0I3Exp08Jg/viewform";
const embeddedFormUrl = `${formUrl}?embedded=true`;

export const metadata: Metadata = {
  title: "Free DJ Class | Future of Music",
  description: "Share your interest in a free, beginner-friendly DJ class hosted directly by Future of Music.",
};

const classHighlights = [
  ["01", "Learn the equipment", "Get comfortable with a DJ controller, headphones, music software, and the basic controls used to mix."],
  ["02", "Build a first mix", "Explore song selection, rhythm, tempo, cueing, transitions, and how DJs shape the energy in a room."],
  ["03", "Create with confidence", "Practice in a welcoming space where beginners can ask questions, experiment, and learn by doing."],
];

export default function DjClassesPage() {
  return (
    <PageShell active="dj-classes" mainClassName="independent-dj-page">
      <section className="independent-dj-hero">
        <div className="independent-dj-copy">
          <p className="independent-dj-status">FREE • BEGINNER-FRIENDLY • INTEREST FORM OPEN</p>
          <h1>A free DJ class.<br /><em>Your first mix starts here.</em></h1>
          <p className="independent-dj-lede">Young people, families, and community members can share their interest in an upcoming hands-on DJ class hosted directly by Future of Music.</p>
          <div className="button-row">
            <a className="button button-yellow" href="#interest-form">Complete the interest form <Arrow direction="down" /></a>
            <a className="independent-dj-text-link" href="#what-to-expect">See what to expect <Arrow direction="down" /></a>
          </div>
        </div>
        <div className="independent-dj-art" aria-label="A stylized DJ turntable representing the free class">
          <div className="independent-record"><span>FREE</span></div>
          <div className="independent-mix-card"><strong>MIX</strong><span>CREATE • LEARN • PLAY</span></div>
        </div>
      </section>

      <section className="independent-notice" aria-label="Independent class notice">
        <strong>Open community class</strong>
        <p>This opportunity is hosted directly by Future of Music. It is independent from, and not limited to, any current school or organization partner program.</p>
      </section>

      <section className="independent-class-overview section-pad" id="what-to-expect">
        <div className="independent-class-heading">
          <p className="section-label">What to expect</p>
          <h2>Start with the basics.<br /><em>Leave ready to keep creating.</em></h2>
          <p>No DJ experience is required. The class is designed to make the equipment and creative process feel approachable from the first session.</p>
        </div>
        <div className="independent-class-grid">
          {classHighlights.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="independent-details">
        <div>
          <p className="section-label light">Class details</p>
          <h2>Tell us you are interested.</h2>
        </div>
        <div className="independent-detail-list">
          <article><strong>Cost</strong><span>Free to attend</span></article>
          <article><strong>Experience</strong><span>Beginners welcome</span></article>
          <article><strong>Schedule</strong><span>Date, time, and location shared as the class is confirmed</span></article>
          <article><strong>For youth</strong><span>A parent or guardian may complete the form for a child</span></article>
        </div>
      </section>

      <section className="independent-form-section section-pad" id="interest-form">
        <div className="independent-form-heading">
          <div>
            <p className="section-label">Free DJ class</p>
            <h2>Apply or share<br /><em>your interest.</em></h2>
          </div>
          <div>
            <p>Complete the form below for yourself or for a young person. Future of Music will use your response to follow up with class details and next steps.</p>
            <p className="independent-form-note">Submitting this form shares your interest and does not guarantee a seat until the class date and capacity are confirmed.</p>
          </div>
        </div>
        <div className="independent-form-shell">
          <iframe
            src={embeddedFormUrl}
            title="Free DJ class interest form"
            width="640"
            height="1803"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        </div>
        <div className="independent-form-fallback">
          <p>If the form does not load on your device, open it in a new tab.</p>
          <a className="button" href={formUrl} {...external}>Open the interest form <Arrow direction="up" /></a>
        </div>
      </section>
    </PageShell>
  );
}
