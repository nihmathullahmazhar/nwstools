"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import { ALL_TOOLS, CATEGORIES } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  title: string;
  subtitle: string;
  ready?: boolean;
  hay: string;
};

const ITEMS: Item[] = [
  ...CATEGORIES.map((c) => ({
    href: `/category/${c.slug}`,
    title: c.name,
    subtitle: `${c.tools.length} tools`,
    ready: true,
    hay: `${c.name} ${c.description}`.toLowerCase(),
  })),
  ...ALL_TOOLS.map((t) => ({
    href: `/tools/${t.slug}`,
    title: t.name,
    subtitle: t.category.name,
    ready: t.ready,
    hay: `${t.name} ${t.tagline} ${(t.keywords ?? []).join(" ")}`.toLowerCase(),
  })),
];

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS.slice(0, 8);
    // rank: title startsWith > title includes > hay includes
    return ITEMS.map((it) => {
      const title = it.title.toLowerCase();
      let score = -1;
      if (title.startsWith(q)) score = 0;
      else if (title.includes(q)) score = 1;
      else if (it.hay.includes(q)) score = 2;
      return { it, score };
    })
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((r) => r.it);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  function go(item?: Item) {
    const target = item ?? results[active];
    if (!target) return;
    onClose();
    router.push(target.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go();
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="panel relative w-full max-w-xl overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4.5 w-4.5 shrink-0 text-fg-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 100+ tools…"
            className="h-13 w-full bg-transparent text-[15px] outline-none placeholder:text-fg-faint"
          />
          <kbd className="hidden rounded border border-border bg-panel-raised px-1.5 py-0.5 text-[11px] text-fg-faint sm:block">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-10 text-center text-sm text-fg-muted">
              No tools match “{query}”.
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.href + i}
                data-idx={i}
                onMouseMove={() => setActive(i)}
                onClick={() => go(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === active ? "bg-accent-soft" : "hover:bg-panel-raised",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-fg">
                    {item.title}
                    {item.ready === false && (
                      <span className="rounded-full bg-panel-raised px-1.5 py-0.5 text-[10px] font-medium text-fg-faint">
                        soon
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-fg-muted">{item.subtitle}</div>
                </div>
                {i === active ? (
                  <CornerDownLeft className="h-4 w-4 text-accent" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-fg-faint opacity-0 group-hover:opacity-100" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
