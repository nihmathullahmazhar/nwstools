"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented, Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

function encode(s: string, urlSafe: boolean) {
  try {
    const b = btoa(unescape(encodeURIComponent(s)));
    return urlSafe ? b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b;
  } catch {
    return "";
  }
}

function decode(s: string) {
  try {
    let t = s.replace(/-/g, "+").replace(/_/g, "/").trim();
    while (t.length % 4) t += "=";
    return { ok: true, value: decodeURIComponent(escape(atob(t))) };
  } catch {
    return { ok: false, value: "" };
  }
}

export default function Base64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const result = useMemo(() => {
    if (!input) return { output: "", error: false };
    if (mode === "encode") return { output: encode(input, urlSafe), error: false };
    const d = decode(input);
    return { output: d.value, error: !d.ok };
  }, [mode, input, urlSafe]);

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
        {mode === "encode" && (
          <Check checked={urlSafe} onChange={setUrlSafe}>URL-safe</Check>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">
            {mode === "encode" ? "Plain text" : "Base64"}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Text to encode…" : "Base64 to decode…"}
            className="min-h-[260px] font-mono text-sm"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">
              {mode === "encode" ? "Base64" : "Plain text"}
            </span>
            <CopyButton value={result.output} size="sm" />
          </div>
          <Textarea
            value={result.error ? "" : result.output}
            readOnly
            placeholder="Result…"
            className="min-h-[260px] bg-panel-raised font-mono text-sm"
            spellCheck={false}
          />
          {result.error && (
            <p className="mt-2 text-sm text-danger">Not valid Base64.</p>
          )}
        </div>
      </div>
    </div>
  );
}
