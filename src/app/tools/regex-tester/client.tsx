"use client";

import { useMemo, useState } from "react";
import { Input, Textarea, Check } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const FLAGS = [
  { f: "g", label: "global" },
  { f: "i", label: "ignore case" },
  { f: "m", label: "multiline" },
  { f: "s", label: "dotall" },
  { f: "u", label: "unicode" },
] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [test, setTest] = useState("");

  const { error, matches, highlighted } = useMemo(() => {
    if (!pattern) return { error: null, matches: [], highlighted: null };
    let re: RegExp;
    try {
      const f = [...flags].join("");
      re = new RegExp(pattern, f.includes("g") ? f : f + "g");
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: null };
    }
    const found: { text: string; index: number; groups: string[] }[] = [];
    const parts: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(test)) && guard++ < 10000) {
      if (m.index >= last) {
        parts.push(test.slice(last, m.index));
        parts.push(
          <mark
            key={m.index + "-" + found.length}
            className="rounded bg-accent/25 text-fg"
          >
            {m[0]}
          </mark>,
        );
        last = m.index + m[0].length;
      }
      found.push({ text: m[0], index: m.index, groups: m.slice(1) });
      if (m[0] === "") re.lastIndex++;
    }
    parts.push(test.slice(last));
    return { error: null, matches: found, highlighted: parts };
  }, [pattern, flags, test]);

  function toggleFlag(f: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 text-sm font-medium">Pattern</div>
        <div className="flex items-center gap-2">
          <span className="text-fg-faint">/</span>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\d{3}-\d{4}"
            className="font-mono"
            spellCheck={false}
            autoFocus
          />
          <span className="text-fg-faint">/{[...flags].join("")}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          {FLAGS.map((fl) => (
            <Check
              key={fl.f}
              checked={flags.has(fl.f)}
              onChange={() => toggleFlag(fl.f)}
            >
              <span className="font-mono">{fl.f}</span> {fl.label}
            </Check>
          ))}
        </div>
        {error && (
          <p className="mt-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 text-sm font-medium">Test string</div>
        <Textarea
          value={test}
          onChange={(e) => setTest(e.target.value)}
          placeholder="Paste text to match against…"
          className="min-h-[140px] font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {pattern && !error && (
        <>
          <div className="panel p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
              Preview · {matches.length} match{matches.length === 1 ? "" : "es"}
            </div>
            <div className="whitespace-pre-wrap break-words font-mono text-sm text-fg-muted">
              {highlighted}
            </div>
          </div>

          {matches.length > 0 && (
            <div className="panel divide-y divide-border">
              {matches.slice(0, 100).map((m, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2 text-sm">
                  <span className="w-8 shrink-0 tabular-nums text-fg-faint">
                    {i + 1}
                  </span>
                  <code className="font-mono text-fg">{m.text}</code>
                  {m.groups.length > 0 && (
                    <span className="ml-auto truncate text-xs text-fg-muted">
                      groups: {m.groups.map((g) => g ?? "∅").join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
