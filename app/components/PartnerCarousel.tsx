"use client";

import { useState } from "react";

type Partner = {
  name: string;
  href: string;
  description: string;
  mark: "jennings" | "creatorlaunch" | "nextprep";
};

const partners: Partner[] = [
  {
    name: "Jennings School District",
    href: "https://www.jenningsk12.org/",
    description: "Expanding access to music and creative technology for Jennings students.",
    mark: "jennings",
  },
  {
    name: "CreatorLaunch",
    href: "https://www.youthcreatorlaunch.org/",
    description: "Helping young creators connect music, entrepreneurship, and real-world ideas.",
    mark: "creatorlaunch",
  },
  {
    name: "Next Prep",
    href: "https://theopportunitytrust.org/our-work/nextprep/",
    description: "Building college, career, and professional readiness pathways for young people.",
    mark: "nextprep",
  },
];

function PartnerMark({ partner }: { partner: Partner }) {
  if (partner.mark === "creatorlaunch") {
    return <img src="/partners/creatorlaunch.png" alt="CreatorLaunch" />;
  }

  if (partner.mark === "jennings") {
    return (
      <span className="partner-wordmark partner-wordmark-jennings" aria-label="Jennings School District">
        <strong>JSD</strong><i>Jennings School District</i>
      </span>
    );
  }

  return (
    <span className="partner-wordmark partner-wordmark-nextprep" aria-label="Next Prep">
      <strong>NEXT</strong><i>PREP</i>
    </span>
  );
}

function PartnerCard({ partner, duplicate = false }: { partner: Partner; duplicate?: boolean }) {
  const content = (
    <>
      <div className="partner-mark"><PartnerMark partner={partner} /></div>
      <div className="partner-card-copy">
        <span>Community partner</span>
        <strong>{partner.name}</strong>
        <p>{partner.description}</p>
      </div>
      <b aria-hidden="true">↗</b>
    </>
  );

  if (duplicate) {
    return <div className="partner-carousel-card" aria-hidden="true">{content}</div>;
  }

  return (
    <a className="partner-carousel-card" href={partner.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}

export default function PartnerCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="home-partners" aria-labelledby="partner-heading">
      <div className="home-partners-heading">
        <div>
          <p className="section-label">Community partners</p>
          <h2 id="partner-heading">Opportunity moves<br />when we move <em>together.</em></h2>
        </div>
        <div>
          <p>Schools and youth-serving organizations help Future of Music bring equipment, mentors, creative learning, and new possibilities directly to young people.</p>
          <a href="mailto:info@fomusic.org?subject=Future%20of%20Music%20Partnership">Become a community partner <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <div className={`partner-carousel ${paused ? "is-paused" : ""}`}>
        <div className="partner-carousel-controls">
          <p><span aria-hidden="true">●</span> Our partner network</p>
          <button type="button" aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            {paused ? "Play logos" : "Pause logos"}
          </button>
        </div>
        <div className="partner-carousel-viewport">
          <div className="partner-carousel-track">
            <div className="partner-carousel-set">
              {partners.map((partner) => <PartnerCard partner={partner} key={partner.name} />)}
            </div>
            <div className="partner-carousel-set" aria-hidden="true">
              {partners.map((partner) => <PartnerCard partner={partner} duplicate key={`${partner.name}-duplicate`} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
