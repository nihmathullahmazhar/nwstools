"use client";

import { useCallback, useEffect, useState } from "react";
import { Segmented, Check, Input } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// UUID v7: time-ordered (48-bit ms timestamp + random)
function uuidv7() {
  const ts = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[0] = (ts / 2 ** 40) & 0xff;
  bytes[1] = (ts / 2 ** 32) & 0xff;
  bytes[2] = (ts / 2 ** 24) & 0xff;
  bytes[3] = (ts / 2 ** 16) & 0xff;
  bytes[4] = (ts / 2 ** 8) & 0xff;
  bytes[5] = ts & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function Uuid() {
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [dashes, setDashes] = useState(true);
  const [ids, setIds] = useState<string[]>([]);

  const generate = useCallback(() => {
    const n = Math.min(Math.max(count || 1, 1), 1000);
    const out = Array.from({ length: n }, () =>
      version === "v4" ? crypto.randomUUID() : uuidv7(),
    );
    setIds(out);
  }, [count, version]);

  useEffect(() => {
    generate();
  }, [generate]);

  const format = (id: string) => {
    let s = dashes ? id : id.replace(/-/g, "");
    return upper ? s.toUpperCase() : s;
  };
  const formatted = ids.map(format);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={version}
          onChange={setVersion}
          options={[
            { value: "v4", label: "v4 random" },
            { value: "v7", label: "v7 time-based" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          Count
          <Input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-9 w-20"
          />
        </label>
        <Check checked={upper} onChange={setUpper}>Uppercase</Check>
        <Check checked={dashes} onChange={setDashes}>Dashes</Check>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={generate}>
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
          <CopyButton value={formatted.join("\n")} label="Copy all" size="sm" />
        </div>
      </div>

      <div className="panel divide-y divide-border">
        {formatted.map((id, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <code className="truncate font-mono text-sm text-fg">{id}</code>
            <CopyButton value={id} size="sm" label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
