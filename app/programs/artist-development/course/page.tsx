import type { Metadata } from "next";
import { PageShell } from "../../../components/SiteChrome";
import CourseApp from "./CourseApp";

export const metadata: Metadata = {
  title: "Artist Development Academy Course | Future of Music",
  description: "A free, open, self-paced artist development course for young singers, rappers, songwriters, producers, and performers.",
};

export default function ArtistDevelopmentCoursePage() {
  return (
    <PageShell active="programs" mainClassName="academy-course-page">
      <CourseApp />
    </PageShell>
  );
}
