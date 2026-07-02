"use client";

import { Search } from "lucide-react";

export function HomeSearch() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("toolkit:search"))}
      className="mx-auto flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-panel px-5 text-left text-fg-faint shadow-sm transition hover:border-border-strong hover:shadow-md"
    >
      <Search className="h-5 w-5 shrink-0" />
      <span className="flex-1 text-[15px]">Search 100+ tools…</span>
      <kbd className="hidden shrink-0 rounded border border-border bg-panel-raised px-1.5 py-0.5 text-xs sm:block">
        ⌘K
      </kbd>
    </button>
  );
}
