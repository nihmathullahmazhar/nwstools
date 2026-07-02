"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { BRAND_URL } from "@/lib/site";

export function TopBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem("nws-banner-dismissed") === "1");
  }, []);

  if (hidden) return null;

  return (
    <div className="relative bg-accent text-accent-fg">
      <a
        href={BRAND_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-sm font-medium hover:brightness-105"
      >
        <span className="hidden sm:inline">Loving these tools?</span>
        <span>nihmathullah.com builds premium sites, apps &amp; CRMs — let&apos;s build yours</span>
        <ArrowRight className="h-4 w-4" />
      </a>
      <button
        onClick={() => {
          localStorage.setItem("nws-banner-dismissed", "1");
          setHidden(true);
        }}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-accent-fg/80 hover:bg-black/10 hover:text-accent-fg"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
