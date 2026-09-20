import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/SiteChrome";
import { team } from "../people";
import styles from "../team.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return team.map(person => ({ slug: person.slug })); }

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = team.find(person => person.slug === slug);
  if (!person) return {};
  return { title: `${person.name} | Future of Music`, description: `${person.name}, ${person.role} at Future of Music. ${person.bio[0]}` };
}

export default async function TeamProfile({ params }: Props) {
  const { slug } = await params;
  const person = team.find(person => person.slug === slug);
  if (!person) notFound();
  return <PageShell active="team">
    <article className={styles.profile} aria-labelledby="profile-name">
      <a className={styles.back} href="/team/">← Meet the team</a>
      <div className={styles.profileGrid}>
        <figure className={`${styles.portrait} ${styles[person.color]}`}><img src={person.image} alt={person.name} /></figure>
        <div className={styles.profileCopy}>
          <h1 id="profile-name">{person.name}</h1>
          <p className={styles.role}>{person.role}</p>
          <div className={styles.bio}>{person.bio.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className={styles.actions}>
            <a href={`mailto:${person.email}`}>Contact {person.name.split(" ")[0]}</a>
            {person.slug === "aereon" && <a href="/about/#founder">Read the founding story</a>}
          </div>
        </div>
      </div>
    </article>
  </PageShell>;
}
