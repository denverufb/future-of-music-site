export default function ProgramPhoto({ name, alt, caption, eager = false }: { name: string; alt: string; caption?: string; eager?: boolean }) {
  return <figure className="editorial-photo"><img src={`/images/programs/${name}-1600.webp`} srcSet={`/images/programs/${name}-800.webp 800w, /images/programs/${name}-1600.webp 1600w`} sizes="(max-width: 760px) 94vw, (max-width: 1200px) 50vw, 600px" alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />{caption && <figcaption>{caption}</figcaption>}</figure>;
}
