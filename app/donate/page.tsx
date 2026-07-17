import type { Metadata } from "next";
import { Arrow, external, PageShell } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Donate | Future of Music", description: "Support free youth programs in DJ education, mentorship, leadership, and entrepreneurship." };

export default function DonatePage() {
  return (
    <PageShell active="donate">
      <section className="donate-hero">
        <div className="donate-art" aria-hidden="true"><div className="donate-record"></div><span>GIVE<br />THE<br />FUTURE<br />VOLUME.</span></div>
        <div className="donate-copy"><p className="eyebrow">Keep every program free</p><h1>Your gift puts the tools<br />in <em>their hands.</em></h1><p>Donations support DJ equipment, workshops, mentorship resources, student supplies, and creative opportunities for young people.</p><a className="button button-yellow" href="#give">Donate now <Arrow direction="down" /></a></div>
      </section>

      <section className="amount-section section-pad">
        <div className="compact-heading"><div><p className="section-label">Every gift matters</p><h2>Choose your<br /><em>impact.</em></h2></div><p>Give once or return whenever you can. Zeffy securely processes donations to Future of Music.</p></div>
        <div className="amount-grid">
          <article><strong>$25</strong><h3>Student essentials</h3><p>Helps provide headphones, notebooks, cables, and basic learning materials.</p></article>
          <article><strong>$100</strong><h3>Program support</h3><p>Supports workshops, mentor resources, transportation, and student experiences.</p></article>
          <article><strong>$500</strong><h3>Major program impact</h3><p>Helps expand equipment access and bring complete program experiences to more youth.</p></article>
        </div>
      </section>

      <section className="give-section section-pad" id="give">
        <div className="give-heading"><p className="section-label light">Secure donation</p><h2>Make your gift.</h2><p>Complete your donation below. If the form does not load, open the secure donation page directly.</p></div>
        <div className="donation-frame-wrap"><iframe className="donation-frame" src="https://www.zeffy.com/en-US/peer-to-peer/free-youth-dj-program" title="Donate to Future of Music youth programs" loading="lazy" allow="payment" /></div>
        <div className="button-row give-actions"><a className="button button-yellow" href="https://zeffy.com/en-US/peer-to-peer/free-youth-dj-program" {...external}>Open donation page <Arrow direction="up" /></a><a className="text-link light-link" href="mailto:info@fomusic.org?subject=Donation%20Question">Ask a donation question <Arrow /></a></div>
      </section>

      <section className="trust-strip"><div><strong>501(c)(3)</strong><span>Nationally recognized nonprofit</span></div><div><strong>33-4753021</strong><span>Federal EIN</span></div><a href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/" {...external}>View our Candid profile <Arrow direction="up" /></a></section>
    </PageShell>
  );
}
