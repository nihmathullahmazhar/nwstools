"use client";

import { useState } from "react";
import { Input, Check } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Dices } from "lucide-react";

export default function RandomNumber() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  function generate() {
    const lo = Math.ceil(parseFloat(min));
    const hi = Math.floor(parseFloat(max));
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 10000);
    if (isNaN(lo) || isNaN(hi) || hi < lo) return;
    const range = hi - lo + 1;
    let out: number[];
    if (unique && n <= range) {
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      out = pool.slice(0, n);
    } else {
      out = Array.from({ length: n }, () => lo + Math.floor(Math.random() * range));
    }
    if (sort) out.sort((a, b) => a - b);
    setResults(out);
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Min" value={min} onChange={setMin} />
        <Field label="Max" value={max} onChange={setMax} />
        <Field label="How many" value={count} onChange={setCount} />
      </div>
      <div className="flex gap-5">
        <Check checked={unique} onChange={setUnique}>Unique</Check>
        <Check checked={sort} onChange={setSort}>Sorted</Check>
      </div>

      <Button onClick={generate} size="lg" className="w-full">
        <Dices className="h-4 w-4" /> Generate
      </Button>

      {results.length > 0 && (
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              {results.length} number{results.length === 1 ? "" : "s"}
            </span>
            <CopyButton value={results.join(", ")} size="sm" />
          </div>
          {results.length === 1 ? (
            <div className="text-center text-6xl font-semibold tracking-tight text-accent">
              {results[0]}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-panel-raised px-3 py-1.5 font-mono text-sm tabular-nums"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="h-11" />
    </div>
  );
}
