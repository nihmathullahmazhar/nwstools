"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { ThemeColor } from "@/components/theme-color";

export function ThemeColorMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Accent colour"
        className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-panel-raised hover:text-fg"
      >
        <Palette className="h-4.5 w-4.5" />
      </button>
      {open && (
        <div className="panel absolute right-0 z-50 mt-2 w-max p-3 shadow-xl">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
            Accent colour
          </div>
          <ThemeColor />
        </div>
      )}
    </div>
  );
}
