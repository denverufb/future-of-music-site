import { PageShell } from "./components/SiteChrome";
import ProgramPhoto from "./components/ProgramPhoto";
import PartnerCarousel from "./components/PartnerCarousel";

export default function Home() {
  return <PageShell active="home" mainClassName="editorial-page community-home">
    <section className="editorial-container home-opening">
      <div><p className="editorial-kicker">Future of Music · St. Louis</p><h1>Learn music.<br /><em>Create together.</em></h1><p className="editorial-lede">A place for young people to try the equipment, find a mentor, and turn their interests into something they can share. Explore our free DJ and mentorship programs.</p><div className="button-row"><a className="button" href="/programs/dj/#registration">Join a free DJ class</a><a className="text-link" href="/about">Get to know us</a></div></div>
      <ProgramPhoto name="student-headphones" alt="A young student using headphones at a DJ controller during a Future of Music class" caption="Youth DJ Program · Hands-on learning" eager />
    </section>
    <section className="editorial-container impact-summary" aria-label="Our work in brief"><div><strong>100+</strong><span>young people served</span></div><div><strong>Free</strong><span>programs for participating students</span></div><div><strong>St. Louis</strong><span>youth-led and community-based</span></div></section>
    <section className="editorial-container editorial-section" id="programs">
      <div className="editorial-section-heading"><p className="editorial-kicker">Find your starting point</p><h2>Try something new.<br />Have people in your corner.</h2></div>
      <div className="editorial-programs">
        <article><ProgramPhoto name="hands-on-instruction" alt="An instructor and young students exploring a DJ controller together" /><p className="editorial-kicker">Music & technology · Ages 8–18</p><h3>Youth DJ Program</h3><p>Hands-on instruction with DJ controllers and music software. Students practice mixing, collaborate with peers, and develop communication and leadership skills.</p><div className="editorial-links"><a href="/programs/dj">About the DJ program</a><a href="/programs/dj/#registration">Free class registration</a></div></article>
        <article className="mentorship-summary"><p className="editorial-kicker">Guidance & development · Grades 5–12</p><h3>Mentorship Program</h3><p>Bring your questions, goals, and ideas. Get support with school, starting a business, and planning what comes next.</p><ul><li>Set goals with a mentor</li><li>Build useful habits and professional skills</li><li>Connect with peers and community leaders</li></ul><a className="button" href="/mentorship">Find out about mentorship</a><div className="mentor-contact-preview"><img src="/images/qwentin.webp" alt="Qwentin Blassingame" /><div><strong>Qwentin Blassingame</strong><span>Managing Director</span><a href="/team/qwentin/">Meet Qwentin</a></div></div></article>
      </div>
    </section>
    <section className="editorial-band"><div className="editorial-container editorial-split"><ProgramPhoto name="class-community" alt="Future of Music students and their instructor gathered behind DJ equipment" /><div><p className="editorial-kicker">About Future of Music</p><h2>Started by a young creator.<br />Built for others.</h2><p>Aereon Robinson founded Future of Music after experiencing how hard it could be to find guidance as a young entrepreneur. Today, our team brings equipment, instruction, and mentorship to young people in St. Louis.</p><div className="editorial-links"><a href="/about">Read our story</a><a href="/team">Meet the team</a></div></div></div></section>
    <PartnerCarousel />
    <section className="editorial-container editorial-section home-support"><div><p className="editorial-kicker">Support our work</p><h2>Help keep these opportunities accessible.</h2><p>Donations support equipment, student resources, workshops, and mentorship. Future of Music is a 501(c)(3) nonprofit.</p><a className="button" href="/donate">Donate to Future of Music</a></div><div><p className="editorial-kicker">From our organization</p><h3>Stories & findings</h3><p>Read about our work, our approach to youth education, and what we learn along the way.</p><a className="text-link" href="/blog">Visit the blog</a></div></section>
  </PageShell>;
}
