import type { Metadata } from "next";
import { PageShell } from "../components/SiteChrome";
import { team } from "./people";
import { YouthDevelopmentMentorApplication } from "./YouthDevelopmentMentorApplication";
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
      <section className={styles.openRole} aria-labelledby="mentor-role-title">
        <header>
          <p>Open opportunity</p>
          <h2 id="mentor-role-title">Youth Development Mentor</h2>
          <span>A three-month contract supporting up to three mentees through consistent, youth-centered weekly mentorship.</span>
        </header>
        <div className={styles.roleFacts} aria-label="Youth Development Mentor role details">
          <div><strong>Up to $150</strong><span>per mentee</span></div>
          <div><strong>Up to 3</strong><span>mentees per cycle</span></div>
          <div><strong>10 meetings</strong><span>minimum per mentee</span></div>
          <div><strong>Up to $450</strong><span>maximum per cycle</span></div>
        </div>
        <div className={styles.roleDetails}>
          <div>
            <p>What you&apos;ll do</p>
            <ul>
              <li>Meet with each assigned mentee weekly, aiming for focused 30-minute conversations.</li>
              <li>Guide goal setting, progress check-ins, and the required mentorship curriculum.</li>
              <li>Document completed meetings and help mentees complete program surveys.</li>
            </ul>
          </div>
          <div>
            <p>What the program builds</p>
            <ul>
              <li>Academic habits, organization, and confidence.</li>
              <li>College and career readiness, communication, and future planning.</li>
              <li>Personal development, leadership, collaboration, and optional entrepreneurship exploration.</li>
            </ul>
          </div>
        </div>
        <YouthDevelopmentMentorApplication />
      </section>
    </section>
  </PageShell>;
}
