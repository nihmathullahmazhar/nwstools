"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented, Check } from "@/components/ui/field";

const STOP = new Set(
  "the a an and or but of to in on for with at by from is are was were be been being this that these those it its as if then than so we you they he she i our your their his her not no do does did has have had will would can could should".split(
    " ",
  ),
);

export default function KeywordDensity() {
  const [text, setText] = useState("");
  const [n, setN] = useState<"1" | "2" | "3">("1");
  const [ignoreStop, setIgnoreStop] = useState(true);

  const { rows, totalWords } = useMemo(() => {
    const words = (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(
      (w) => w.length > 1,
    );
    const size = Number(n);
    const freq = new Map<string, number>();
    for (let i = 0; i + size <= words.length; i++) {
      const gram = words.slice(i, i + size);
      if (ignoreStop && gram.some((w) => STOP.has(w))) continue;
      const key = gram.join(" ");
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
    const totalGrams = [...freq.values()].reduce((a, b) => a + b, 0) || 1;
    const rows = [...freq.entries()]
      .filter(([, c]) => c > 1 || words.length < 40)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([phrase, count]) => ({
        phrase,
        count,
        pct: (count / totalGrams) * 100,
      }));
    return { rows, totalWords: words.length };
  }, [text, n, ignoreStop]);

  const max = rows[0]?.count ?? 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your content to analyze…"
          className="min-h-[360px] text-sm"
          autoFocus
        />
        <div className="text-sm text-fg-muted">{totalWords.toLocaleString()} words analyzed</div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            value={n}
            onChange={setN}
            options={[
              { value: "1", label: "1 word" },
              { value: "2", label: "2 words" },
              { value: "3", label: "3 words" },
            ]}
          />
          <Check checked={ignoreStop} onChange={setIgnoreStop}>Ignore common words</Check>
        </div>

        {rows.length === 0 ? (
          <div className="panel py-12 text-center text-sm text-fg-muted">
            Enter text to see keyword frequencies.
          </div>
        ) : (
          <div className="panel divide-y divide-border">
            {rows.map((r) => (
              <div key={r.phrase} className="flex items-center gap-3 px-4 py-2">
                <span className="w-40 truncate text-sm text-fg">{r.phrase}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-raised">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-xs tabular-nums text-fg-muted">{r.count}</span>
                <span className="w-12 text-right text-xs tabular-nums text-fg-faint">
                  {r.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
