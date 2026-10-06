import type { Metadata } from "next";
import { PageShell } from "../components/SiteChrome";
export const metadata: Metadata = { title: "Free DJ Class Registration | Future of Music", alternates: { canonical: "https://fomusic.org/programs/dj/" } };
export default function DjClassesPage() {
  return <PageShell active="programs" mainClassName="editorial-page"><section className="editorial-container editorial-section"><h1>Free DJ class registration</h1><p>Class details and the interest form are now part of our Youth DJ Program page.</p><a className="button" href="/programs/dj/#registration">Continue to registration</a><script dangerouslySetInnerHTML={{__html: 'window.location.replace("/programs/dj/#registration");'}} /></section></PageShell>;
}
