import type { Metadata } from "next";
import Script from "next/script";
import { PageShell } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Programs | Future of Music",
  description: "Explore Future of Music programs.",
  alternates: { canonical: "https://fomusic.org/programs/" },
  robots: { index: false, follow: true },
};

export default function FormerArtistDevelopmentPage() {
  return (
    <PageShell active="programs" mainClassName="editorial-page">
      <Script id="former-artist-development-redirect" strategy="beforeInteractive">{`window.location.replace('/programs/');`}</Script>
      <section className="editorial-container mentorship-redirect">
        <p className="editorial-kicker">Future of Music</p>
        <h1>Explore our programs.</h1>
        <p>Find current opportunities for young people through Future of Music.</p>
        <a className="button" href="/programs/">View programs</a>
      </section>
    </PageShell>
  );
}
