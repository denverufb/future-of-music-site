import { readdirSync } from "node:fs";
import { join } from "node:path";

type GalleryImage = { src: string; alt: string };

const imagePattern = /\.(png|jpe?g|webp|avif)$/i;

function makeGallery(program: "dj" | "mentorship"): GalleryImage[] {
  const directory = join(process.cwd(), "app", "assets", "gallery", program);
  const images = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      src: `/gallery/${program}/${name}`,
      alt: name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    }));

  return images.length
    ? images
    : Array.from({ length: 6 }, () => ({ src: "/images/blank.png", alt: "" }));
}

export const djGalleryImages = makeGallery("dj");
export const mentorshipGalleryImages = makeGallery("mentorship");
