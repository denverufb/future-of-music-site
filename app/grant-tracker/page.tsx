import type { Metadata } from "next";
import GrantTracker from "./GrantTracker";

export const metadata: Metadata = {
  title: "Grant Tracker | Future of Music",
  description: "Private Future of Music grant workspace. Authorized access only.",
  robots: { index: false, follow: false, nocache: true },
};

export default function GrantTrackerPage() {
  return <GrantTracker />;
}
