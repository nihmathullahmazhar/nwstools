"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

function words(input: string): string[] {
  return (
    input
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-.]+/g, " ")
      .match(/[A-Za-z0-9]+/g) ?? []
  );
}

const CASES: { name: string; fn: (s: string) => string }[] = [
  { name: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { name: "lowercase", fn: (s) => s.toLowerCase() },
  {
    name: "Title Case",
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  {
    name: "Sentence case",
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    name: "camelCase",
    fn: (s) =>
      words(s)
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w[0].toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join(""),
  },
  {
    name: "PascalCase",
    fn: (s) =>
      words(s)
        .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(""),
  },
  { name: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { name: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
  {
    name: "CONSTANT_CASE",
    fn: (s) => words(s).map((w) => w.toUpperCase()).join("_"),
  },
  { name: "dot.case", fn: (s) => words(s).map((w) => w.toLowerCase()).join(".") },
  {
    name: "aLtErNaTiNg",
    fn: (s) =>
      [...s]
        .map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase()))
        .join(""),
  },
  {
    name: "InVeRsE cAsE",
    fn: (s) =>
      [...s]
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
];

export function CaseConverter() {
  const [text, setText] = useState("");

  const outputs = useMemo(
    () => CASES.map((c) => ({ name: c.name, value: text ? c.fn(text) : "" })),
    [text],
  );

  return (
    <div className="space-y-5">
      <div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to convert…"
          className="min-h-[120px] text-[15px]"
          autoFocus
        />
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" onClick={() => setText("")}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {outputs.map((o) => (
          <div key={o.name} className="panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">
                {o.name}
              </span>
              <CopyButton value={o.value} size="sm" />
            </div>
            <p className="break-words font-mono text-sm text-fg">
              {o.value || <span className="text-fg-faint">—</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
