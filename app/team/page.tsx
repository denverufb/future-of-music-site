import type { Metadata } from "next";
import { Arrow, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Our Team | Future of Music", description: "Meet the youth-led team behind Future of Music." };

const team = [
  { name: "Aereon Robinson", role: "Founder & Executive Director", image: "/images/aereon.webp", color: "blue", bio: "Aereon Robinson is the visionary behind Future of Music. Starting his journey as a young musician and entrepreneur, he understands the challenges and opportunities facing today’s youth. He founded the organization to give young people a platform to turn creative passions into real-world success and is committed to building a community where every young creator can thrive.", email: "aereon@fomusic.org" },
  { name: "Qwentin Blassingame", role: "Managing Director & Program Coach", image: "/images/qwentin.webp", color: "coral", bio: "Qwentin Blassingame drives program operations, marketing, and outreach. As a young creator himself, he knows how to connect with the next generation of artists. He uses media production, digital strategy, coaching, and partnership development to grow the organization’s community and move its mission forward.", email: "qwentin@fomusic.org" },
  { name: "Gabriel Walker", role: "Program Coach", image: "/images/gabriel.webp", color: "yellow", bio: "Gabriel Walker is a dedicated Future of Music program coach. With hands-on experience and a passion for teaching, he works directly with students to help them master new skills. Gabriel creates a positive, practical, and supportive learning environment where students can build confidence through action.", email: "info@fomusic.org" },
];

export default function TeamPage() {
  return (
    <PageShell active="team">
      <section className="page-hero team-hero">
        <div><p className="eyebrow"><span></span> Meet the team</p><h1>Youth-led.<br /><em>Future-focused.</em></h1><p className="hero-lede">A small team with lived experience, big ideas, and an honest belief in what young people can build.</p></div>
        <div className="team-stack" aria-hidden="true"><img src="/images/aereon.webp" alt="" /><img src="/images/qwentin.webp" alt="" /><img src="/images/gabriel.webp" alt="" /></div>
      </section>

      <section className="team-page-grid section-pad">
        {team.map((person, index) => <article className={`profile-card ${person.color}`} key={person.name}>
          <div className="profile-number">0{index + 1}</div>
          <figure><img src={person.image} alt={person.name} /></figure>
          <div><p>{person.role}</p><h2>{person.name}</h2><span>{person.bio}</span><a className="text-link" href={`mailto:${person.email}`}>Contact {person.name.split(" ")[0]} <Arrow /></a></div>
        </article>)}
      </section>

      <section className="team-belief">
        <div><span>OUR BELIEF</span><h2>The people closest to the challenge should help design the solution.</h2></div>
        <div><p>Future of Music is led by people who understand young creators because they are young creators. That perspective shapes how we teach, communicate, partner, and grow.</p><a className="button button-yellow" href="mailto:info@fomusic.org">Contact the team <Arrow /></a></div>
      </section>
    </PageShell>
  );
}
