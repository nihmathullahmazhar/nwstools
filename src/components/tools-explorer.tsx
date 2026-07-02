"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, ALL_TOOLS } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { cn } from "@/lib/utils";

export function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TOOLS.filter((t) => {
      if (active !== "all" && t.category.slug !== active) return false;
      if (!q) return true;
      const hay = `${t.name} ${t.tagline} ${(t.keywords ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    }).filter(
      (t, i, arr) =>
        active !== "all" || arr.findIndex((x) => x.slug === t.slug) === i,
    );
  }, [query, active]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-6 bg-bg/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name or keyword…"
            className="panel h-12 w-full pl-11 pr-4 text-[15px] outline-none focus:border-accent"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <Chip active={active === "all"} onClick={() => setActive("all")}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.slug}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-fg-muted">
        {results.length} {results.length === 1 ? "tool" : "tools"}
      </p>

      {results.length === 0 ? (
        <div className="panel py-16 text-center text-fg-muted">
          No tools match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <ToolCard key={t.category.slug + t.slug} tool={t} category={t.category} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
