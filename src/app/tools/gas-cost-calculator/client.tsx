"use client";

import { useState } from "react";
import { Input, Segmented, Stat, Check } from "@/components/ui/field";

const money = (n: number) =>
  isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "—";

export default function GasCostCalculator() {
  const [units, setUnits] = useState<"us" | "metric">("us");
  const [distance, setDistance] = useState("300");
  const [eff, setEff] = useState("30");
  const [price, setPrice] = useState("3.50");
  const [roundTrip, setRoundTrip] = useState(false);

  const d = (parseFloat(distance) || 0) * (roundTrip ? 2 : 1);
  const e = parseFloat(eff) || 0;
  const p = parseFloat(price) || 0;

  // us: miles, mpg, $/gal → gallons = d/mpg. metric: km, L/100km, $/L → liters = d/100*L100
  const fuel = units === "us" ? (e ? d / e : 0) : (d / 100) * e;
  const cost = fuel * p;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Segmented
        value={units}
        onChange={setUnits}
        options={[
          { value: "us", label: "Miles / MPG / gallon" },
          { value: "metric", label: "km / L·100km / litre" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <F label={units === "us" ? "Distance (mi)" : "Distance (km)"} value={distance} onChange={setDistance} />
        <F label={units === "us" ? "Efficiency (MPG)" : "Use (L/100km)"} value={eff} onChange={setEff} />
        <F label={units === "us" ? "Price ($/gal)" : "Price ($/L)"} value={price} onChange={setPrice} prefix="$" />
      </div>
      <Check checked={roundTrip} onChange={setRoundTrip}>Round trip (double the distance)</Check>

      <div className="grid grid-cols-2 gap-3">
        <div className="panel bg-accent-soft p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Fuel cost</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">{money(cost)}</div>
        </div>
        <Stat label={units === "us" ? "Gallons used" : "Litres used"} value={fuel.toFixed(1)} />
      </div>
    </div>
  );
}

function F({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 ${prefix ? "pl-7" : ""}`} />
      </div>
    </div>
  );
}
