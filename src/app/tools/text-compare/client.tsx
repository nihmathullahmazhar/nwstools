"use client";

import { useMemo, useState } from "react";
import { Textarea, Check } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Row = { type: "eq" | "add" | "del"; left?: string; right?: string };

function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length;
  const m = b.length;
  // LCS table
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: "eq", left: a[i], right: b[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "del", left: a[i] });
      i++;
    } else {
      rows.push({ type: "add", right: b[j] });
      j++;
    }
  }
  while (i < n) rows.push({ type: "del", left: a[i++] });
  while (j < m) rows.push({ type: "add", right: b[j++] });
  return rows;
}

export default function TextCompare() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const { rows, added, removed } = useMemo(() => {
    const norm = (s: string) => {
      let l = s;
      if (ignoreWs) l = l.trim().replace(/\s+/g, " ");
      if (ignoreCase) l = l.toLowerCase();
      return l;
    };
    const a = left.split("\n");
    const b = right.split("\n");
    const rows = diffLines(a.map(norm), b.map(norm));
    // map normalized rows back to original text for display
    let ai = 0;
    let bi = 0;
    const display: Row[] = rows.map((r) => {
      if (r.type === "eq") return { type: "eq", left: a[ai++], right: b[bi++] };
      if (r.type === "del") return { type: "del", left: a[ai++] };
      return { type: "add", right: b[bi++] };
    });
    return {
      rows: display,
      added: rows.filter((r) => r.type === "add").length,
      removed: rows.filter((r) => r.type === "del").length,
    };
  }, [left, right, ignoreWs, ignoreCase]);

  const hasInput = left !== "" || right !== "";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Original</div>
          <Textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste the original text…"
            className="min-h-[200px] font-mono text-sm"
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Changed</div>
          <Textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste the changed text…"
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Check checked={ignoreWs} onChange={setIgnoreWs}>Ignore whitespace</Check>
        <Check checked={ignoreCase} onChange={setIgnoreCase}>Ignore case</Check>
        {hasInput && (
          <div className="ml-auto flex gap-3 text-sm">
            <span className="text-success">+{added} added</span>
            <span className="text-danger">−{removed} removed</span>
          </div>
        )}
      </div>

      {hasInput && (
        <div className="panel overflow-hidden">
          <div className="max-h-[460px] overflow-auto font-mono text-sm">
            {rows.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 border-l-2 px-3 py-0.5",
                  r.type === "add" && "border-success bg-success/10",
                  r.type === "del" && "border-danger bg-danger/10",
                  r.type === "eq" && "border-transparent",
                )}
              >
                <span className="w-4 shrink-0 select-none text-fg-faint">
                  {r.type === "add" ? "+" : r.type === "del" ? "−" : ""}
                </span>
                <span className="whitespace-pre-wrap break-words">
                  {(r.type === "add" ? r.right : r.left) || " "}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
