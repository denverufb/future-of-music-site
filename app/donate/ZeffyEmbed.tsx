"use client";

import { useEffect, useRef } from "react";

const ZEFFY_SCRIPT = "https://www.zeffy.com/embed/v2/zeffy-embed.js";

export default function ZeffyEmbed() {
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showFallback = () => {
      const fallback = fallbackRef.current;
      if (!fallback) return;
      fallback.style.display = "block";
      fallback.querySelectorAll<HTMLIFrameElement>("iframe[data-zeffy-embed-src]").forEach((frame) => {
        frame.src = frame.dataset.zeffyEmbedSrc ?? "";
      });
    };

    const script = document.createElement("script");
    script.src = ZEFFY_SCRIPT;
    script.async = true;
    script.dataset.fomZeffy = "true";
    script.onerror = showFallback;
    document.body.appendChild(script);

    return () => {
      script.onerror = null;
      script.remove();
    };
  }, []);

  return (
    <div className="zeffy-embed-shell">
      <div data-zeffy-embed data-form-url="/embed/donation-form/future-of-music" />
      <div data-zeffy-embed-fallback ref={fallbackRef} style={{ display: "none" }}>
        <div className="zeffy-fallback-frame">
          <iframe
            title="Donation form powered by Zeffy"
            data-zeffy-embed-src="https://www.zeffy.com/embed/donation-form/future-of-music"
            allow="payment"
            allowTransparency
          />
        </div>
      </div>
    </div>
  );
}
