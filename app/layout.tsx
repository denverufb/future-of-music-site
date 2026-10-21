import type { Metadata, Viewport } from "next";
import SiteAnalytics from "./components/SiteAnalytics";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fomusic.org"),
  title: "Future of Music | Music Education & Youth Opportunity",
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

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#242331" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
