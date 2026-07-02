"use client";

import { useCallback, useEffect, useState } from "react";
import { Input, Segmented, Check } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { RefreshCw } from "lucide-react";

const ADJ = ["swift", "silent", "cosmic", "neon", "lunar", "rapid", "hidden", "brave", "witty", "amber", "frost", "solar", "vivid", "quiet", "wild", "royal", "epic", "zen", "turbo", "pixel"];
const NOUN = ["falcon", "otter", "cipher", "comet", "raven", "delta", "maple", "quartz", "nomad", "ember", "vertex", "harbor", "circuit", "pulse", "willow", "atlas", "koda", "specter", "byte", "fox"];

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

type Style = "words" | "gamer" | "pro" | "snake";

function make(style: Style, withNumbers: boolean): string {
  const a = rand(ADJ);
  const n = rand(NOUN);
  const num = withNumbers ? String(Math.floor(Math.random() * 900) + 10) : "";
  switch (style) {
    case "words":
      return cap(a) + cap(n) + num;
    case "gamer":
      return `x${a}${n}x${num}`.replace(/x{2,}/g, "x");
    case "pro":
      return `${a}.${n}${num}`;
    case "snake":
      return `${a}_${n}${num ? "_" + num : ""}`;
  }
}

export default function UsernameGenerator() {
  const [style, setStyle] = useState<Style>("words");
  const [numbers, setNumbers] = useState(true);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    setList(Array.from({ length: 12 }, () => make(style, numbers)));
  }, [style, numbers]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={style}
          onChange={setStyle}
          options={[
            { value: "words", label: "CamelCase" },
            { value: "snake", label: "snake_case" },
            { value: "pro", label: "dotted" },
            { value: "gamer", label: "gamer" },
          ]}
        />
        <Check checked={numbers} onChange={setNumbers}>Add numbers</Check>
        <Button size="sm" onClick={gen} className="ml-auto">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((u, i) => (
          <div key={i} className="panel flex items-center justify-between gap-2 px-3 py-2.5">
            <code className="truncate text-sm font-medium">{u}</code>
            <CopyButton value={u} size="sm" label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
