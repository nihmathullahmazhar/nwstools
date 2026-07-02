"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

export default function UrlEncode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState<"component" | "full">("component");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return { output: "", error: false };
    try {
      if (mode === "encode") {
        return {
          output:
            component === "component"
              ? encodeURIComponent(input)
              : encodeURI(input),
          error: false,
        };
      }
      return {
        output:
          component === "component"
            ? decodeURIComponent(input)
            : decodeURI(input),
        error: false,
      };
    } catch {
      return { output: "", error: true };
    }
  }, [mode, component, input]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "Encode" },
            { value: "decode", label: "Decode" },
          ]}
        />
        <Segmented
          value={component}
          onChange={setComponent}
          options={[
            { value: "component", label: "Component" },
            { value: "full", label: "Full URL" },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Text or URL…"
            className="min-h-[220px] font-mono text-sm"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Output</span>
            <CopyButton value={result.output} size="sm" />
          </div>
          <Textarea
            value={result.error ? "" : result.output}
            readOnly
            className="min-h-[220px] bg-panel-raised font-mono text-sm"
            spellCheck={false}
          />
          {result.error && (
            <p className="mt-2 text-sm text-danger">Malformed input — can’t decode.</p>
          )}
        </div>
      </div>
    </div>
  );
}
