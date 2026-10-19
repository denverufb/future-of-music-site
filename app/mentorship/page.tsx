import type { Metadata } from "next";
import Script from "next/script";
import { PageShell } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Mentorship Program | Future of Music",
  description: "Explore Future of Music mentorship at mentoring.fomusic.org.",
  alternates: { canonical: "https://mentoring.fomusic.org/" },
  robots: { index: false, follow: true },
};

export default function MentorshipPage() {
  return <PageShell active="programs" mainClassName="editorial-page">
    <Script id="mentorship-redirect" strategy="beforeInteractive">{`window.location.replace('https://mentoring.fomusic.org/');`}</Script>
    <section className="editorial-container mentorship-redirect">
      <p className="editorial-kicker">Future of Music</p>
      <h1>Mentorship has a new home.</h1>
      <p>Visit our dedicated Mentorship Program website for program information, applications, and participant access.</p>
      <a className="button" href="https://mentoring.fomusic.org/">Continue to mentorship ↗</a>
    </section>
  </PageShell>;
}
