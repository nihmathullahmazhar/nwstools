"use client";

import { useMemo, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const BANDS = [
  { max: 18.5, label: "Underweight", color: "text-sky-500" },
  { max: 25, label: "Normal", color: "text-success" },
  { max: 30, label: "Overweight", color: "text-warning" },
  { max: Infinity, label: "Obese", color: "text-danger" },
];

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("70");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("9");
  const [lb, setLb] = useState("154");

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const h = parseFloat(cm) / 100;
      const w = parseFloat(kg);
      if (!h || !w) return null;
      return w / (h * h);
    }
    const h = parseFloat(ft) * 12 + parseFloat(inch || "0");
    const w = parseFloat(lb);
    if (!h || !w) return null;
    return (w / (h * h)) * 703;
  }, [unit, cm, kg, ft, inch, lb]);

  const band = bmi ? BANDS.find((b) => bmi < b.max)! : null;
  // position on a 15–35 scale
  const pct = bmi ? Math.max(0, Math.min(100, ((bmi - 15) / 20) * 100)) : 0;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Segmented
        value={unit}
        onChange={setUnit}
        options={[
          { value: "metric", label: "Metric" },
          { value: "us", label: "US / Imperial" },
        ]}
      />

      {unit === "metric" ? (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Height (cm)" value={cm} onChange={setCm} />
          <Field label="Weight (kg)" value={kg} onChange={setKg} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <Field label="Height (ft)" value={ft} onChange={setFt} />
          <Field label="(in)" value={inch} onChange={setInch} />
          <Field label="Weight (lb)" value={lb} onChange={setLb} />
        </div>
      )}

      {bmi && band && (
        <div className="panel p-6 text-center">
          <div className="text-5xl font-semibold tracking-tight">{bmi.toFixed(1)}</div>
          <div className={cn("mt-1 text-lg font-medium", band.color)}>{band.label}</div>
          <div className="relative mt-5 h-2 rounded-full bg-gradient-to-r from-sky-400 via-green-400 to-red-500">
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-fg shadow"
              style={{ left: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-fg-faint">
            <span>15</span>
            <span>25</span>
            <span>35</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="h-11" />
    </div>
  );
}
