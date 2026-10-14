"use client";

import { useRef, type ReactNode } from "react";

export default function NavDropdown({ label, current, children }: { label: string; current?: boolean; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const mouseClick = useRef(false);

  return <details ref={details} className="nav-group"
    onPointerEnter={event => { if (event.pointerType === "mouse") event.currentTarget.open = true; }}
    onPointerLeave={event => { if (event.pointerType === "mouse") event.currentTarget.open = false; }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
    onKeyDown={event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }
    }}>
    <summary aria-current={current ? "page" : undefined}
      onPointerDown={event => { mouseClick.current = event.pointerType === "mouse"; }}
      onClick={event => {
        // Mouse users already opened the dropdown by hovering. Keep native
        // disclosure behavior for touch, Enter, and Space.
        if (event.detail > 0 && mouseClick.current) {
          event.preventDefault();
          if (details.current) details.current.open = true;
        }
      }}>{label} <span aria-hidden="true">⌄</span></summary>
    <div className="nav-dropdown">{children}</div>
  </details>;
}
