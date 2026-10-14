"use client";

import { useEffect, useState } from "react";

const sessionKey = "fom-jennings-story-seen";

export default function BlogAnnouncement() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem(sessionKey)) return; } catch { /* Storage is optional. */ }
    const timer = window.setTimeout(() => {
      setVisible(true);
      try { sessionStorage.setItem(sessionKey, "1"); } catch { /* Still show without storage. */ }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || hovered || focused) return;
    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [visible, hovered, focused]);

  useEffect(() => {
    if (!visible) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") setVisible(false); };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [visible]);

  if (!visible) return null;

  return <aside className="blog-announcement" aria-label="Latest program story"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <button className="announcement-close" type="button" aria-label="Dismiss story announcement" onClick={() => setVisible(false)}>×</button>
    <p className="editorial-kicker" role="status">New from Future of Music</p>
    <h2>Our Jennings DJ program has launched.</h2>
    <p>Six schools. Free to students. Learning that goes beyond music.</p>
    <a className="button" href="/blog/jennings-afterschool-dj-program/">Read the story</a>
  </aside>;
}
