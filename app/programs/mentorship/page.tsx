import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mentorship Program | Future of Music",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mentorship/" },
};

export default function LegacyMentorshipRedirect() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", textAlign: "center" }}>
      <Script id="mentorship-redirect" strategy="beforeInteractive">{`window.location.replace('/mentorship/');`}</Script>
      <div>
        <h1>Mentorship has moved.</h1>
        <p><a href="/mentorship/">Continue to the Mentorship Program</a></p>
      </div>
    </main>
  );
}
