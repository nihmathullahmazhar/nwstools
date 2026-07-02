"use client";

import { useMemo, useState } from "react";
import { Textarea, Input, Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [regex, setRegex] = useState(false);
  const [ci, setCi] = useState(false);
  const [word, setWord] = useState(false);

  const { output, count, error } = useMemo(() => {
    if (!find) return { output: text, count: 0, error: "" };
    try {
      let pattern = regex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (word) pattern = `\\b${pattern}\\b`;
      const flags = "g" + (ci ? "i" : "");
      const re = new RegExp(pattern, flags);
      const matches = text.match(re);
      return {
        output: text.replace(re, replace),
        count: matches ? matches.length : 0,
        error: "",
      };
    } catch (e) {
      return { output: text, count: 0, error: (e as Error).message };
    }
  }, [text, find, replace, regex, ci, word]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Find</div>
          <Input value={find} onChange={(e) => setFind(e.target.value)} className="font-mono" placeholder={regex ? "\\d+" : "text to find"} />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Replace with</div>
          <Input value={replace} onChange={(e) => setReplace(e.target.value)} className="font-mono" placeholder="replacement" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Check checked={regex} onChange={setRegex}>Regex</Check>
        <Check checked={ci} onChange={setCi}>Ignore case</Check>
        <Check checked={word} onChange={setWord}>Whole word</Check>
        <span className="ml-auto text-sm text-fg-muted">
          {error ? <span className="text-danger">{error}</span> : `${count} replacement${count === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[300px] font-mono text-sm" placeholder="Paste your text…" autoFocus />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea value={output} readOnly className="min-h-[300px] bg-panel-raised font-mono text-sm" />
        </div>
      </div>
    </div>
  );
}
