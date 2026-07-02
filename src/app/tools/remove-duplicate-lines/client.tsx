"use client";

import { useMemo, useState } from "react";
import { Textarea, Check, Stat } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [ci, setCi] = useState(false);
  const [trim, setTrim] = useState(true);
  const [sort, setSort] = useState(false);

  const { output, removed, kept } = useMemo(() => {
    const src = text.split("\n");
    const seen = new Set<string>();
    let out: string[] = [];
    for (const raw of src) {
      const line = trim ? raw.trim() : raw;
      const key = ci ? line.toLowerCase() : line;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(line);
    }
    if (sort) out = out.sort((a, b) => a.localeCompare(b));
    return {
      output: out.join("\n"),
      removed: src.length - out.length,
      kept: out.length,
    };
  }, [text, ci, trim, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Check checked={ci} onChange={setCi}>Ignore case</Check>
        <Check checked={trim} onChange={setTrim}>Trim whitespace</Check>
        <Check checked={sort} onChange={setSort}>Sort result</Check>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lines with duplicates…"
            className="min-h-[300px] font-mono text-sm"
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Unique lines</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[300px] bg-panel-raised font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Stat label="Kept" value={kept.toLocaleString()} />
        <Stat label="Removed" value={removed.toLocaleString()} />
      </div>
    </div>
  );
}
