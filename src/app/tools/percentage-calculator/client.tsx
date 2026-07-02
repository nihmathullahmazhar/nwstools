"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";

function fmt(n: number) {
  if (!isFinite(n)) return "—";
  return Number(n.toPrecision(10)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

function Card({
  title,
  children,
  result,
}: {
  title: string;
  children: React.ReactNode;
  result: React.ReactNode;
}) {
  return (
    <div className="panel p-5">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
        {children}
      </div>
      <div className="mt-4 border-t border-border pt-3 text-2xl font-semibold text-accent">
        {result}
      </div>
    </div>
  );
}

const inputCls = "h-9 w-24 text-center";

export default function PercentageCalculator() {
  const [a1, setA1] = useState("15");
  const [b1, setB1] = useState("200");
  const [a2, setA2] = useState("30");
  const [b2, setB2] = useState("150");
  const [a3, setA3] = useState("120");
  const [b3, setB3] = useState("150");

  const n = (s: string) => parseFloat(s);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card
        title="Percent of a number"
        result={<>{fmt((n(a1) / 100) * n(b1))}</>}
      >
        What is
        <Input className={inputCls} value={a1} onChange={(e) => setA1(e.target.value)} />
        % of
        <Input className={inputCls} value={b1} onChange={(e) => setB1(e.target.value)} />
        ?
      </Card>

      <Card
        title="X is what percent of Y"
        result={<>{fmt((n(a2) / n(b2)) * 100)}%</>}
      >
        <Input className={inputCls} value={a2} onChange={(e) => setA2(e.target.value)} />
        is what % of
        <Input className={inputCls} value={b2} onChange={(e) => setB2(e.target.value)} />
        ?
      </Card>

      <Card
        title="Percent change"
        result={
          <>
            {n(b3) >= n(a3) ? "+" : ""}
            {fmt(((n(b3) - n(a3)) / Math.abs(n(a3))) * 100)}%
          </>
        }
      >
        From
        <Input className={inputCls} value={a3} onChange={(e) => setA3(e.target.value)} />
        to
        <Input className={inputCls} value={b3} onChange={(e) => setB3(e.target.value)} />
      </Card>
    </div>
  );
}
