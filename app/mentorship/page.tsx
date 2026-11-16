import type { Metadata } from "next";
import MentorshipPortal from "./MentorshipPortal";

export const metadata: Metadata = {
  title: "Mentorship Program | Future of Music",
  description: "Secure mentorship workspace for Future of Music mentors, mentees, and staff.",
  alternates: { canonical: "https://fomusic.org/mentorship/" },
  robots: { index: false, follow: false },
};

export default function MentorshipPage() {
  return <MentorshipPortal />;
}
