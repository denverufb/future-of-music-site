const partners = [
  {name:"Jennings School District",href:"https://www.jenningsk12.org/",description:"Music and creative technology opportunities for Jennings students.",image:"/partners/jennings-school-district.png"},
  {name:"CreatorLaunch",href:"https://www.youthcreatorlaunch.org/",description:"Music, entrepreneurship, and support for young creators.",image:"/partners/creatorlaunch.png"},
  {name:"Next Prep",href:"https://theopportunitytrust.org/our-work/nextprep/",description:"College, career, and professional readiness.",image:"/partners/next-prep.png"},
];
export default function PartnerCarousel() {
  return <section className="editorial-container editorial-section" aria-labelledby="partner-heading">
    <div className="editorial-section-heading"><p className="editorial-kicker">Community partners</p><h2 id="partner-heading">Working with our community.</h2><p>Schools and youth-serving organizations help bring instruction, equipment, and mentorship to students.</p></div>
    <div className="editorial-partners">{partners.map(partner=><a href={partner.href} target="_blank" rel="noopener noreferrer" key={partner.name}><div className={`partner-logo${partner.name === "Next Prep" ? " next-prep" : ""}`}><img src={partner.image} alt={`${partner.name} logo`} loading="lazy" /></div><h3>{partner.name}</h3></a>)}</div>
    <a className="text-link" href="mailto:info@fomusic.org?subject=Future%20of%20Music%20Partnership">Ask about a partnership</a>
  </section>;
}
