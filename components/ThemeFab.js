"use client";

import { useEffect, useRef, useState } from "react";
import { DropletIcon } from "@/components/icons";
import ThemeSwatches from "@/components/ThemeSwatches";

export default function ThemeFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref}>
      {open && (
        <div className="theme-pop">
          <h4>Background</h4>
          <ThemeSwatches />
        </div>
      )}
      <button
        type="button"
        className="theme-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change background colour"
        title="Background colour"
      >
        <DropletIcon size={22} />
      </button>
    </div>
  );
}
