"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented, Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Indent = "2" | "4" | "tab" | "min";

const SAMPLE = `{"name":"Toolkit","private":true,"tools":137,"tags":["fast","offline"],"meta":{"since":2026}}`;

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<Indent>("2");
  const [sortKeys, setSortKeys] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      const parsed = JSON.parse(input);
      const replacer = sortKeys
        ? (_k: string, v: unknown) =>
            v && typeof v === "object" && !Array.isArray(v)
              ? Object.fromEntries(
                  Object.entries(v as Record<string, unknown>).sort(([a], [b]) =>
                    a.localeCompare(b),
                  ),
                )
              : v
        : undefined;
      const space =
        indent === "min" ? undefined : indent === "tab" ? "\t" : Number(indent);
      return {
        ok: true as const,
        output: JSON.stringify(parsed, replacer, space),
      };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [input, indent, sortKeys]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={indent}
          onChange={setIndent}
          options={[
            { value: "2", label: "2 spaces" },
            { value: "4", label: "4 spaces" },
            { value: "tab", label: "Tab" },
            { value: "min", label: "Minify" },
          ]}
        />
        <Check checked={sortKeys} onChange={setSortKeys}>Sort keys</Check>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setInput(SAMPLE)}>
            Sample
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setInput("")}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here…"
            className="min-h-[360px] font-mono text-sm"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Output</span>
            {result.ok && result.output && (
              <div className="flex gap-2">
                <CopyButton value={result.output} size="sm" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    download(
                      new Blob([result.output], { type: "application/json" }),
                      "formatted.json",
                    )
                  }
                >
                  Download
                </Button>
              </div>
            )}
          </div>
          <Textarea
            value={result.ok ? result.output : ""}
            readOnly
            placeholder="Formatted JSON appears here…"
            className="min-h-[360px] bg-panel-raised font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {input.trim() !== "" &&
        (result.ok ? (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> Valid JSON
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {result.error}
          </div>
        ))}
    </div>
  );
}
