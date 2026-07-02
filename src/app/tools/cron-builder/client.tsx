"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

const PRESETS: { label: string; expr: string }[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 15 min", expr: "*/15 * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily midnight", expr: "0 0 * * *" },
  { label: "Every weekday 9am", expr: "0 9 * * 1-5" },
  { label: "Weekly (Sun)", expr: "0 0 * * 0" },
  { label: "Monthly 1st", expr: "0 0 1 * *" },
];

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function describeField(v: string, unit: string, names?: string[]): string {
  if (v === "*") return `every ${unit}`;
  const step = v.match(/^\*\/(\d+)$/);
  if (step) return `every ${step[1]} ${unit}s`;
  const range = v.match(/^(\d+)-(\d+)$/);
  if (range) {
    const a = names ? names[+range[1]] : range[1];
    const b = names ? names[+range[2]] : range[2];
    return `${unit}s ${a} through ${b}`;
  }
  const list = v.split(",").map((x) => (names ? names[+x] ?? x : x));
  return `${unit} ${list.join(", ")}`;
}

function describe(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Enter 5 space-separated fields.";
  const [min, hour, dom, month, dow] = parts;
  try {
    const bits: string[] = ["Runs"];
    if (min === "*" && hour === "*") bits.push("every minute");
    else if (min !== "*" && hour !== "*" && !min.includes("/") && !hour.includes("/") && !min.includes(",") && !hour.includes(","))
      bits.push(`at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`);
    else {
      bits.push(`at ${describeField(min, "minute")}`);
      bits.push(`past ${describeField(hour, "hour")}`);
    }
    if (dom !== "*") bits.push(`on day-of-month ${describeField(dom, "")}`.replace("  ", " "));
    if (month !== "*") bits.push(`in ${describeField(month, "month", MONTHS)}`);
    if (dow !== "*") bits.push(`on ${describeField(dow, "", DOW)}`.replace("  ", " "));
    return bits.join(" ") + ".";
  } catch {
    return "Invalid expression.";
  }
}

export default function CronBuilder() {
  const [fields, setFields] = useState(["*", "*", "*", "*", "*"]);
  const expr = fields.join(" ");
  const labels = ["Minute", "Hour", "Day (month)", "Month", "Day (week)"];
  const hints = ["0-59", "0-23", "1-31", "1-12", "0-6"];

  const description = useMemo(() => describe(expr), [expr]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            onClick={() => setFields(p.expr.split(" "))}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition",
              expr === p.expr
                ? "border-accent bg-accent text-accent-fg"
                : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {fields.map((f, i) => (
          <div key={i}>
            <div className="mb-1.5 text-center text-xs font-medium text-fg-muted">{labels[i]}</div>
            <Input
              value={f}
              onChange={(e) => setFields((p) => p.map((x, xi) => (xi === i ? e.target.value : x)))}
              className="h-11 text-center font-mono"
            />
            <div className="mt-1 text-center text-[11px] text-fg-faint">{hints[i]}</div>
          </div>
        ))}
      </div>

      <div className="panel flex items-center justify-between gap-4 p-5">
        <code className="font-mono text-2xl font-semibold tracking-tight text-accent">{expr}</code>
        <CopyButton value={expr} />
      </div>

      <div className="rounded-lg border border-border bg-panel-raised px-4 py-3 text-sm text-fg">
        {description}
      </div>
    </div>
  );
}
