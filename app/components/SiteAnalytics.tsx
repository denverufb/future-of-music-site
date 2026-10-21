"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function SiteAnalytics() {
  const pathname = usePathname();
  // Do not load analytics or advertising scripts in the private workspace.
  if (pathname?.startsWith("/grant-tracker")) return null;
  return <><Script async src="https://www.googletagmanager.com/gtag/js?id=G-Q9CN5F5MQ6" /><Script id="future-of-music-analytics" strategy="afterInteractive">{`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Q9CN5F5MQ6');
    gtag('config', 'AW-17533011276');
  `}</Script></>;
}
