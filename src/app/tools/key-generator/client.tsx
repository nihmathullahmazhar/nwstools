"use client";

import { useCallback, useEffect, useState } from "react";
import { Segmented, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { RefreshCw } from "lucide-react";

type Kind = "hex" | "base64" | "alnum" | "apikey";

function randomBytes(n: number) {
  return crypto.getRandomValues(new Uint8Array(n));
}

function generate(kind: Kind, bytes: number): string {
  const b = randomBytes(bytes);
  switch (kind) {
    case "hex":
      return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    case "base64":
      return btoa(String.fromCharCode(...b)).replace(/=+$/, "");
    case "alnum": {
      const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return [...b].map((x) => alpha[x % alpha.length]).join("");
    }
    case "apikey":
      return "sk_" + [...randomBytes(24)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
}

export default function KeyGenerator() {
  const [kind, setKind] = useState<Kind>("hex");
  const [bytes, setBytes] = useState(32);
  const [count, setCount] = useState(5);
  const [keys, setKeys] = useState<string[]>([]);

  const make = useCallback(() => {
    const n = Math.min(Math.max(count || 1, 1), 100);
    setKeys(Array.from({ length: n }, () => generate(kind, bytes)));
  }, [kind, bytes, count]);

  useEffect(() => {
    make();
  }, [make]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: "hex", label: "Hex" },
            { value: "base64", label: "Base64" },
            { value: "alnum", label: "Alphanumeric" },
            { value: "apikey", label: "API key" },
          ]}
        />
        {kind !== "apikey" && (
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Bytes
            <Input
              type="number"
              min={8}
              max={128}
              value={bytes}
              onChange={(e) => setBytes(Number(e.target.value))}
              className="h-9 w-20"
            />
          </label>
        )}
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          Count
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-9 w-20"
          />
        </label>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={make}>
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
          <CopyButton value={keys.join("\n")} label="Copy all" size="sm" />
        </div>
      </div>

      <div className="panel divide-y divide-border">
        {keys.map((k, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <code className="truncate font-mono text-sm text-fg">{k}</code>
            <CopyButton value={k} size="sm" label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
