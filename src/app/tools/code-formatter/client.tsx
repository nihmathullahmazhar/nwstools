"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { format, type Lang } from "@/lib/format";
import { AlertCircle } from "lucide-react";

const LANGS: { value: Lang; label: string; ext: string; sample: string }[] = [
  { value: "json", label: "JSON", ext: "json", sample: '{"name":"toolkit","tags":["fast","private"],"n":42}' },
  { value: "css", label: "CSS", ext: "css", sample: ".btn{color:red;padding:8px 12px}.btn:hover{color:blue}" },
  { value: "js", label: "JS", ext: "js", sample: "function add(a,b){return a+b;}const x={a:1,b:2};" },
  { value: "sql", label: "SQL", ext: "sql", sample: "select id, name from users where age > 18 and active = 1 order by name" },
  { value: "xml", label: "XML/HTML", ext: "xml", sample: "<div><h1>Hi</h1><p>Text</p><img src='a.png'/></div>" },
];

export default function CodeFormatter() {
  const [lang, setLang] = useState<Lang>("json");
  const [minify, setMinify] = useState(false);
  const [input, setInput] = useState("");

  const current = LANGS.find((l) => l.value === lang)!;
  const minifiable = lang === "json" || lang === "css" || lang === "js";

  const result = useMemo(() => {
    try {
      return { ok: true as const, out: format(lang, input, minify && minifiable) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [lang, input, minify, minifiable]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={lang}
          onChange={(v) => setLang(v)}
          options={LANGS.map((l) => ({ value: l.value, label: l.label }))}
        />
        {minifiable && (
          <Segmented
            value={minify ? "min" : "pretty"}
            onChange={(v) => setMinify(v === "min")}
            options={[
              { value: "pretty", label: "Beautify" },
              { value: "min", label: "Minify" },
            ]}
          />
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setInput(current.sample)}>
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
            placeholder={`Paste ${current.label} here…`}
            className="min-h-[380px] font-mono text-sm"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Output</span>
            {result.ok && result.out && (
              <div className="flex gap-2">
                <CopyButton value={result.out} size="sm" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => download(new Blob([result.out]), `formatted.${current.ext}`)}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
          <Textarea
            value={result.ok ? result.out : ""}
            readOnly
            placeholder="Formatted code appears here…"
            className="min-h-[380px] bg-panel-raised font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {!result.ok && input.trim() && (
        <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" /> {result.error}
        </div>
      )}
      <p className="text-xs text-fg-faint">
        A fast, built-in formatter — everything runs locally in your browser.
      </p>
    </div>
  );
}
