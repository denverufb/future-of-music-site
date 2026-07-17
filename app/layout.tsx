import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fomusic.org"),
  title: "Future of Music | Young Creators. Real Futures.",
  description: "Future of Music is a youth-led St. Louis nonprofit offering free DJ education, mentorship, leadership, technology, and entrepreneurship programs.",
  icons: { icon: "/images/logo-square.png", shortcut: "/images/logo-square.png" },
  openGraph: {
    title: "Future of Music | Young Creators. Real Futures.",
    description: "Free music, mentorship, leadership, technology, and entrepreneurship programs for young people.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Future of Music — Young creators. Real futures." }],
  },
  twitter: { card: "summary_large_image", title: "Future of Music", description: "Young creators. Real futures.", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2146d0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Q9CN5F5MQ6" />
        <Script id="future-of-music-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q9CN5F5MQ6');
          gtag('config', 'AW-17533011276');
        `}</Script>
      </body>
    </html>
  );
}
