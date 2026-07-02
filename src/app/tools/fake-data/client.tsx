"use client";

import { useCallback, useEffect, useState } from "react";
import { Input, Segmented, Check } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { download } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

const FIRST = ["Ada", "Liam", "Noah", "Mia", "Zoe", "Kai", "Ivy", "Leo", "Ada", "Ravi", "Sana", "Omar", "Nina", "Theo", "Elena", "Hugo"];
const LAST = ["Lovelace", "Chen", "Patel", "Okafor", "Silva", "Kim", "Nguyen", "Rossi", "Haddad", "Novak", "Meyer", "Costa", "Ford", "Blum"];
const DOMAINS = ["example.com", "mail.test", "demo.io", "inbox.dev"];
const CITIES = ["Austin", "Lisbon", "Berlin", "Osaka", "Nairobi", "Bogotá", "Oslo", "Pune"];
const COMPANIES = ["Northwind", "Acme", "Globex", "Umbra", "Initech", "Hooli", "Stark", "Wayne"];

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const num = (n: number) => Math.floor(Math.random() * n);

const FIELDS = {
  id: () => crypto.randomUUID(),
  firstName: () => rand(FIRST),
  lastName: () => rand(LAST),
  email: () => `${rand(FIRST).toLowerCase()}.${rand(LAST).toLowerCase()}@${rand(DOMAINS)}`,
  phone: () => `+1 (${200 + num(700)}) ${100 + num(900)}-${1000 + num(9000)}`,
  city: () => rand(CITIES),
  company: () => rand(COMPANIES),
  age: () => 18 + num(60),
  joined: () => new Date(Date.now() - num(1e10)).toISOString().slice(0, 10),
} as const;

type FieldKey = keyof typeof FIELDS;
const ALL_FIELDS = Object.keys(FIELDS) as FieldKey[];

export default function FakeData() {
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [enabled, setEnabled] = useState<Set<FieldKey>>(
    new Set<FieldKey>(["id", "firstName", "lastName", "email", "city"]),
  );
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    const n = Math.min(Math.max(count || 1, 1), 1000);
    const keys = ALL_FIELDS.filter((k) => enabled.has(k));
    const rows = Array.from({ length: n }, () =>
      Object.fromEntries(keys.map((k) => [k, FIELDS[k]()])),
    );
    if (format === "json") {
      setOutput(JSON.stringify(rows, null, 2));
    } else {
      const head = keys.join(",");
      const body = rows.map((r) =>
        keys.map((k) => {
          const v = String(r[k]);
          return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        }).join(","),
      );
      setOutput([head, ...body].join("\n"));
    }
  }, [count, format, enabled]);

  useEffect(() => {
    generate();
  }, [generate]);

  function toggle(k: FieldKey) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={format}
          onChange={setFormat}
          options={[
            { value: "json", label: "JSON" },
            { value: "csv", label: "CSV" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          Rows
          <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="h-9 w-24" />
        </label>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={generate}>
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
          <CopyButton value={output} size="sm" />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => download(new Blob([output]), `fake-data.${format}`)}
          >
            Download
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {ALL_FIELDS.map((k) => (
          <Check key={k} checked={enabled.has(k)} onChange={() => toggle(k)}>
            {k}
          </Check>
        ))}
      </div>

      <pre className="panel max-h-[420px] overflow-auto p-4 font-mono text-xs leading-relaxed text-fg-muted">
        {output}
      </pre>
    </div>
  );
}
