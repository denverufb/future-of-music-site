type GalleryImage = { src: string; alt: string };

const djAssets = import.meta.glob<string>("./assets/gallery/dj/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const mentorshipAssets = import.meta.glob<string>("./assets/gallery/mentorship/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function makeGallery(assets: Record<string, string>): GalleryImage[] {
  const images = Object.entries(assets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => ({
      src,
      alt: path.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") ?? "Program photo",
    }));

  return images.length ? images : Array.from({ length: 3 }, () => ({ src: "/images/blank.png", alt: "" }));
}

export const djGalleryImages = makeGallery(djAssets);
export const mentorshipGalleryImages = makeGallery(mentorshipAssets);
