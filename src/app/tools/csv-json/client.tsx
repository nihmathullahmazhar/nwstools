"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c !== ""));
}

function toCsvValue(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function CsvJson() {
  const [mode, setMode] = useState<"c2j" | "j2c">("c2j");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "c2j") {
        const rows = parseCsv(input);
        if (!rows.length) return { output: "[]", error: "" };
        const [header, ...body] = rows;
        const data = body.map((r) =>
          Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])),
        );
        return { output: JSON.stringify(data, null, 2), error: "" };
      }
      const arr = JSON.parse(input);
      if (!Array.isArray(arr)) return { output: "", error: "Expected a JSON array of objects." };
      const keys = [...new Set(arr.flatMap((o) => Object.keys(o ?? {})))];
      const lines = [keys.map(toCsvValue).join(",")];
      for (const o of arr) lines.push(keys.map((k) => toCsvValue(o?.[k])).join(","));
      return { output: lines.join("\n"), error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "c2j", label: "CSV → JSON" },
          { value: "j2c", label: "JSON → CSV" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">
            {mode === "c2j" ? "CSV" : "JSON"}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "c2j" ? "name,age\nAda,36" : '[{"name":"Ada","age":36}]'}
            className="min-h-[320px] font-mono text-sm"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">{mode === "c2j" ? "JSON" : "CSV"}</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[320px] bg-panel-raised font-mono text-sm"
            spellCheck={false}
          />
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
