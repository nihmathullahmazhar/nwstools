"use client";

import { useMemo, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const BASES = [
  { base: 2, name: "Binary" },
  { base: 8, name: "Octal" },
  { base: 10, name: "Decimal" },
  { base: 16, name: "Hexadecimal" },
];

export default function BaseConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState(10);

  const { decimal, error } = useMemo(() => {
    const v = value.trim().toLowerCase().replace(/^0[xbo]/, "");
    if (!v) return { decimal: null as bigint | null, error: false };
    const valid = new RegExp(`^[0-9a-z]+$`).test(v);
    if (!valid) return { decimal: null, error: true };
    try {
      let acc = 0n;
      const b = BigInt(from);
      for (const ch of v) {
        const digit = parseInt(ch, 36);
        if (isNaN(digit) || digit >= from) return { decimal: null, error: true };
        acc = acc * b + BigInt(digit);
      }
      return { decimal: acc, error: false };
    } catch {
      return { decimal: null, error: true };
    }
  }, [value, from]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="mb-1.5 text-sm font-medium">Value</div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number…"
            className="h-11 font-mono text-base"
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">From base</div>
          <Segmented
            value={String(from)}
            onChange={(v) => setFrom(Number(v))}
            options={BASES.map((b) => ({ value: String(b.base), label: b.base }))}
          />
        </div>
      </div>

      {error && <p className="text-sm text-danger">Invalid digits for base {from}.</p>}

      <div className="space-y-3">
        {BASES.map((b) => {
          const out = decimal !== null ? decimal.toString(b.base) : "";
          return (
            <div key={b.base} className="panel flex items-center gap-4 p-4">
              <div className="w-28 shrink-0">
                <div className="text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-fg-faint">base {b.base}</div>
              </div>
              <code className="flex-1 break-all font-mono text-sm text-fg">
                {out || <span className="text-fg-faint">—</span>}
              </code>
              <CopyButton value={out} size="sm" label="" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
