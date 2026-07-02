"use client";

import { useCallback, useEffect, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { RefreshCw } from "lucide-react";

const PREFIX = ["Go", "Get", "Try", "My", "The", "Meta", "Neo", "Ever", "Prime", "Next", "True", "Pro"];
const SUFFIX = ["ly", "ify", "io", "hub", "labs", "works", "flow", "base", "spot", "wave", "kit", "hq"];
const WORDS = ["nova", "peak", "flux", "bloom", "forge", "spark", "north", "orbit", "clever", "brisk", "vertex", "lumen"];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Style = "brandable" | "compound" | "prefix" | "suffix";

function make(kw: string, style: Style): string {
  const k = kw.trim().toLowerCase() || rand(WORDS);
  switch (style) {
    case "brandable":
      return cap(k.slice(0, Math.max(3, k.length - 1))) + rand(SUFFIX);
    case "compound":
      return cap(k) + cap(rand(WORDS));
    case "prefix":
      return rand(PREFIX) + cap(k);
    case "suffix":
      return cap(k) + cap(rand(SUFFIX));
  }
}

export default function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState<Style>("brandable");
  const [names, setNames] = useState<string[]>([]);

  const gen = useCallback(() => {
    const set = new Set<string>();
    let guard = 0;
    while (set.size < 12 && guard++ < 200) set.add(make(keyword, style));
    setNames([...set]);
  }, [keyword, style]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a keyword (e.g. coffee, cloud, fitness)…"
          className="h-11"
          autoFocus
        />
        <Button onClick={gen}>
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>

      <div className="overflow-x-auto pb-1">
        <Segmented
          value={style}
          onChange={setStyle}
          options={[
            { value: "brandable", label: "Brandable" },
            { value: "compound", label: "Compound" },
            { value: "prefix", label: "Prefix" },
            { value: "suffix", label: "Suffix" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {names.map((n, i) => (
          <div key={i} className="panel flex items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate font-semibold">{n}</div>
              <div className="truncate text-xs text-fg-faint">{n.toLowerCase()}.com</div>
            </div>
            <CopyButton value={n} size="sm" label="" />
          </div>
        ))}
      </div>
      <p className="text-xs text-fg-faint">
        Ideas are generated locally. Always check trademark and domain availability before using a name.
      </p>
    </div>
  );
}
