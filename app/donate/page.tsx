import type { Metadata } from "next";
import { external, PageShell } from "../components/SiteChrome";
import ProgramPhoto from "../components/ProgramPhoto";
import ZeffyEmbed from "./ZeffyEmbed";
export const metadata: Metadata = { title: "Donate | Future of Music", description: "Support free youth music education and mentorship at Future of Music. Donate securely through Zeffy." };
export default function DonatePage() {
  return <PageShell active="donate" mainClassName="editorial-page">
    <section className="editorial-container editorial-feature"><div><p className="editorial-kicker">Support Future of Music</p><h1>Make a donation.</h1><p className="editorial-lede">Your support helps keep music education and mentorship free for young people. Donations contribute to equipment, workshops, student resources, and program access.</p><div className="button-row"><a className="button" href="#give">Donate through Zeffy</a><a className="text-link" href="/about">About our organization</a></div></div><ProgramPhoto name="students-together" alt="Two young participants beside DJ equipment during a Future of Music class" eager /></section>
    <section className="editorial-container donation-editorial" id="give"><div><p className="editorial-kicker">Secure donation portal</p><h2>Give through Zeffy.</h2><p>Choose the contribution that is right for you. Donations are processed securely by Zeffy.</p><p>If the form does not load, <a href="https://www.zeffy.com/embed/donation-form/future-of-music" {...external}>open the Zeffy donation form</a>.</p><aside className="donation-about"><h3>About our organization</h3><p>Future of Music is a youth-led St. Louis nonprofit connecting music with mentorship, technology, leadership, and entrepreneurship.</p><p>501(c)(3) nonprofit<br />EIN: 33-4753021</p><a className="text-link" href="/about">Read our story</a></aside></div><ZeffyEmbed /></section>
    <section className="editorial-container editorial-cta"><div><h2>Questions about giving?</h2><p>Contact our team about donations, equipment support, or partnerships.</p></div><a className="button" href="mailto:info@fomusic.org?subject=Donation%20Question">Contact us</a></section>
  </PageShell>;
}
