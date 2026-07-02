"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ACCENTS, applyAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

export function ThemeColor({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<string>(ACCENTS[0].hsl);

  useEffect(() => {
    const saved = localStorage.getItem("accent");
    if (saved) setActive(saved);
  }, []);

  function pick(hsl: string) {
    setActive(hsl);
    applyAccent(hsl);
    try {
      localStorage.setItem("accent", hsl);
    } catch {}
  }

  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          onClick={() => pick(a.hsl)}
          aria-label={a.label}
          title={a.label}
          className={cn(
            "grid place-items-center rounded-full ring-offset-2 ring-offset-panel transition",
            compact ? "h-6 w-6" : "h-7 w-7",
            active === a.hsl && "ring-2 ring-border-strong",
          )}
          style={{ backgroundColor: `hsl(${a.hsl})` }}
        >
          {active === a.hsl && <Check className="h-3.5 w-3.5 text-white" />}
        </button>
      ))}
    </div>
  );
}
