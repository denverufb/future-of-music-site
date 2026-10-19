import type { ReactNode } from "react";
import NavDropdown from "./NavDropdown";

type NavKey = "home" | "about" | "programs" | "dj-classes" | "team" | "donate" | "blog";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Arrow({ direction = "right" }: { direction?: "right" | "down" | "up" }) {
  return <span aria-hidden="true">{direction === "down" ? "↓" : direction === "up" ? "↗" : "→"}</span>;
}

export function SiteHeader({ active }: { active: NavKey }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Future of Music home" aria-current={active === "home" ? "page" : undefined}>
          <img src="/images/logo.png" alt="Future of Music" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavDropdown label="Home" current={active === "home" || active === "donate"}><a href="/">Home</a><a href="/donate">Donate</a></NavDropdown>
          <NavDropdown label="About" current={active === "about" || active === "team"}>
              <a href="/about">Our Story</a>
              <a href="/team">Our Team</a>
          </NavDropdown>
          <NavDropdown label="Programs" current={active === "programs"}>
              <a href="/programs/dj">Youth DJ Program</a>
              <a href="https://mentoring.fomusic.org">Mentorship Program ↗</a>
              <a href="/programs/artist-development">Artist Development Academy</a>
          </NavDropdown>
          <a href="/blog" aria-current={active === "blog" ? "page" : undefined}>Blog</a>
        </nav>

        <a className="button button-small" href="/donate" aria-current={active === "donate" ? "page" : undefined}>Donate</a>

        <details className="mobile-menu">
          <summary aria-label="Open navigation"><i></i><i></i><i></i></summary>
          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            <a href="/donate">Donate</a>
            <span className="mobile-menu-label">About</span>
            <a href="/about">Our Story</a>
            <a href="/team">Our Team</a>
            <span className="mobile-menu-label">Programs</span>
            <a href="/programs/dj">Youth DJ Program</a>
            <a href="https://mentoring.fomusic.org">Mentorship Program ↗</a>
            <a href="/programs/artist-development">Artist Development Academy</a>
            <a href="/blog">Blog</a>
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
          <div className="footer-seal">
            <a aria-label="Future of Music Candid profile" href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/?pkId=0c01c96a-78e8-466a-b047-d1c28bc25639" {...external}>
              <img alt="Candid GuideStar transparency seal for Future of Music" src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16383723/svg" />
            </a>
          </div>
        </div>
        <div><h3>Explore</h3><a href="/about">Our Story</a><a href="/team">Our Team</a><a href="/programs/dj">Youth DJ Program</a><a href="https://mentoring.fomusic.org">Mentorship ↗</a><a href="/programs/artist-development">Artist Development Academy</a><a href="/blog">Blog</a></div>
        <div><h3>Get involved</h3><a href="/programs/dj/#registration">DJ class registration</a><a href="https://mentoring.fomusic.org">Mentorship application ↗</a><a href="/donate">Donate</a><a href="https://mentoring.fomusic.org">Mentorship portal ↗</a></div>
        <div><h3>Contact</h3><a href="mailto:info@fomusic.org">info@fomusic.org</a><a href="https://app.candid.org/profile/16383723/future-of-music-33-4753021/" {...external}>Candid transparency profile</a></div>
      </div>
      <div className="footer-bottom"><p>St. Louis, Missouri · 501(c)(3) nonprofit · EIN 33-4753021</p><p>© 2026 Future of Music</p></div>
    </footer>
  );
}

export function PageShell({ active, children, mainClassName }: { active: NavKey; children: ReactNode; mainClassName?: string }) {
  return <><SiteHeader active={active} /><main id="main-content" className={mainClassName}>{children}</main><SiteFooter /></>;
}

type GalleryImage = { src: string; alt: string };

export function ProgramGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  return (
    <section className="asset-gallery section-pad" aria-label={`${title} photo gallery`}>
      <div className="asset-gallery-heading">
        <p className="section-label">Photo gallery</p>
        <h2>{title}</h2>
      </div>
      <div className="asset-gallery-grid">
        {images.map((image, index) => image.src.endsWith("/blank.png") ? (
          <figure className="asset-gallery-item is-blank" data-gallery-slot="blank.png" key={`${image.src}-${index}`} aria-label="Empty gallery space" />
        ) : (
          <figure className="asset-gallery-item" key={`${image.src}-${index}`}>
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </div>
    </section>
  );
}

export { external };
