import type { Metadata } from "next";
import { PageShell } from "../components/SiteChrome";
import { team } from "./people";
import styles from "./team.module.css";

export const metadata: Metadata = { title: "Meet the Team | Future of Music", description: "Meet Aereon Robinson, Qwentin Blassingame, and Gabriel Walker—the team behind Future of Music." };

export default function TeamPage() {
  return <PageShell active="team">
    <section className={styles.directory} aria-labelledby="team-title">
      <header className={styles.heading}><p>Future of Music</p><h1 id="team-title">Meet the team.</h1></header>
      <div className={styles.grid}>
        {team.map(person => <a className={styles.card} href={`/team/${person.slug}/`} key={person.slug} aria-label={`Read ${person.name}’s biography`}>
          <div className={`${styles.portrait} ${styles[person.color]}`}><img src={person.image} alt={person.name} /></div>
          <div className={styles.cardCopy}><h2>{person.name}</h2><p>{person.role}</p><span className={styles.readBio}>Read bio <span aria-hidden="true">↗</span></span></div>
        </a>)}
      </div>
    </section>
  </PageShell>;
}
