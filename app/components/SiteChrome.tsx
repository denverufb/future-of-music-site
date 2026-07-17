import type { ReactNode } from "react";

type NavKey = "home" | "about" | "programs" | "team" | "donate";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Arrow({ direction = "right" }: { direction?: "right" | "down" | "up" }) {
  return <span aria-hidden="true">{direction === "down" ? "↓" : direction === "up" ? "↗" : "→"}</span>;
}

export function SiteHeader({ active }: { active: NavKey }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="announcement">
        <p><span>St. Louis made</span><span>•</span><span>Youth led</span><span>•</span><span>Programs are free</span></p>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Future of Music home" aria-current={active === "home" ? "page" : undefined}>
          <img src="/images/logo.png" alt="Future of Music" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/about" aria-current={active === "about" ? "page" : undefined}>About</a>
          <div className="nav-group">
            <a href="/programs" aria-current={active === "programs" ? "page" : undefined}>Programs <span aria-hidden="true">⌄</span></a>
            <div className="nav-dropdown">
              <a href="/programs">All Programs <span>Overview →</span></a>
              <a href="/programs/dj">Youth DJ Program <span>Music + technology →</span></a>
              <a href="/programs/mentorship">Mentorship Program <span>Growth + guidance →</span></a>
            </div>
          </div>
          <a href="/team" aria-current={active === "team" ? "page" : undefined}>Team</a>
          <a href="/about#partners">Partners</a>
        </nav>

        <a className="button button-small" href="/donate" aria-current={active === "donate" ? "page" : undefined}>Donate <Arrow direction="up" /></a>

        <details className="mobile-menu">
          <summary aria-label="Open navigation"><i></i><i></i><i></i></summary>
          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/programs">Programs Overview</a>
            <a href="/programs/dj">Youth DJ Program</a>
            <a href="/programs/mentorship">Mentorship Program</a>
            <a href="/team">Our Team</a>
            <a href="/about#partners">Partners</a>
            <a href="/donate">Donate</a>
          </nav>
        </details>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="Future of Music" />
          <p>Music, mentorship, leadership, technology, and entrepreneurship for the next generation.</p>
          <div className="footer-pills"><span>Youth-led</span><span>St. Louis</span><span>Free programs</span></div>
        </div>
        <div><h3>Explore</h3><a href="/about">About us</a><a href="/programs">Programs</a><a href="/programs/dj">DJ Program</a><a href="/programs/mentorship">Mentorship</a><a href="/team">Team</a></div>
        <div><h3>Take action</h3><a href="https://forms.gle/Gg7yigzM9zTQSEdF6" {...external}>Apply ↗</a><a href="/donate">Donate</a><a href="mailto:info@fomusic.org">Contact us</a><a href="https://fomusic.org/portal-v2/" {...external}>Member portal ↗</a></div>
        <div><h3>Contact</h3><a href="mailto:info@fomusic.org">info@fomusic.org</a><a href="mailto:qwentin@fomusic.org">qwentin@fomusic.org</a><a href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/" {...external}>View Candid profile ↗</a></div>
      </div>
      <div className="footer-bottom"><p>Nationally recognized 501(c)(3) nonprofit • EIN 33-4753021</p><p>© 2026 Future of Music</p></div>
    </footer>
  );
}

export function PageShell({ active, children }: { active: NavKey; children: ReactNode }) {
  return <><SiteHeader active={active} /><main id="main-content">{children}</main><SiteFooter /></>;
}

export { external };
