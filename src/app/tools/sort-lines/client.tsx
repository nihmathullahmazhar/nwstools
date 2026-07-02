"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

type Mode = "az" | "za" | "num" | "len" | "reverse" | "shuffle";

export default function SortLines() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("az");
  const [ci, setCi] = useState(true);
  const [trim, setTrim] = useState(true);
  const [dropEmpty, setDropEmpty] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    let lines = text.split("\n");
    if (trim) lines = lines.map((l) => l.trim());
    if (dropEmpty) lines = lines.filter((l) => l.length > 0);
    const cmp = (a: string, b: string) =>
      (ci ? a.toLowerCase() : a).localeCompare(ci ? b.toLowerCase() : b);
    switch (mode) {
      case "az":
        lines.sort(cmp);
        break;
      case "za":
        lines.sort((a, b) => cmp(b, a));
        break;
      case "num":
        lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
        break;
      case "len":
        lines.sort((a, b) => a.length - b.length);
        break;
      case "reverse":
        lines.reverse();
        break;
      case "shuffle":
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }
    return lines.join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode, ci, trim, dropEmpty, seed]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "az", label: "A→Z" },
            { value: "za", label: "Z→A" },
            { value: "num", label: "123" },
            { value: "len", label: "Length" },
            { value: "reverse", label: "Reverse" },
            { value: "shuffle", label: "Shuffle" },
          ]}
        />
        {mode === "shuffle" && (
          <Button variant="secondary" size="sm" onClick={() => setSeed((s) => s + 1)}>
            Re-shuffle
          </Button>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-fg-muted">
          <Toggle checked={ci} onChange={setCi}>Ignore case</Toggle>
          <Toggle checked={trim} onChange={setTrim}>Trim</Toggle>
          <Toggle checked={dropEmpty} onChange={setDropEmpty}>Drop empty</Toggle>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lines here…"
            className="min-h-[320px] font-mono text-sm"
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">
              Output · {output ? output.split("\n").length : 0} lines
            </span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[320px] bg-panel-raised font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[hsl(var(--accent))]"
      />
      {children}
    </label>
  );
}
