"use client";

import { useMemo, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { ArrowRightLeft } from "lucide-react";

type Unit = { id: string; name: string; toBase: number };
type Group = {
  id: string;
  label: string;
  units: Unit[];
  // temperature needs custom conversion
  convert?: (v: number, from: string, to: string) => number;
};

const GROUPS: Group[] = [
  {
    id: "length",
    label: "Length",
    units: [
      { id: "mm", name: "Millimeter", toBase: 0.001 },
      { id: "cm", name: "Centimeter", toBase: 0.01 },
      { id: "m", name: "Meter", toBase: 1 },
      { id: "km", name: "Kilometer", toBase: 1000 },
      { id: "in", name: "Inch", toBase: 0.0254 },
      { id: "ft", name: "Foot", toBase: 0.3048 },
      { id: "yd", name: "Yard", toBase: 0.9144 },
      { id: "mi", name: "Mile", toBase: 1609.344 },
    ],
  },
  {
    id: "mass",
    label: "Weight",
    units: [
      { id: "mg", name: "Milligram", toBase: 0.001 },
      { id: "g", name: "Gram", toBase: 1 },
      { id: "kg", name: "Kilogram", toBase: 1000 },
      { id: "t", name: "Tonne", toBase: 1e6 },
      { id: "oz", name: "Ounce", toBase: 28.3495 },
      { id: "lb", name: "Pound", toBase: 453.592 },
      { id: "st", name: "Stone", toBase: 6350.29 },
    ],
  },
  {
    id: "temp",
    label: "Temperature",
    units: [
      { id: "c", name: "Celsius", toBase: 1 },
      { id: "f", name: "Fahrenheit", toBase: 1 },
      { id: "k", name: "Kelvin", toBase: 1 },
    ],
    convert: (v, from, to) => {
      let c = v;
      if (from === "f") c = ((v - 32) * 5) / 9;
      else if (from === "k") c = v - 273.15;
      if (to === "f") return (c * 9) / 5 + 32;
      if (to === "k") return c + 273.15;
      return c;
    },
  },
  {
    id: "area",
    label: "Area",
    units: [
      { id: "m2", name: "Sq meter", toBase: 1 },
      { id: "km2", name: "Sq kilometer", toBase: 1e6 },
      { id: "ft2", name: "Sq foot", toBase: 0.092903 },
      { id: "ac", name: "Acre", toBase: 4046.86 },
      { id: "ha", name: "Hectare", toBase: 10000 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    units: [
      { id: "ml", name: "Milliliter", toBase: 0.001 },
      { id: "l", name: "Liter", toBase: 1 },
      { id: "m3", name: "Cubic meter", toBase: 1000 },
      { id: "tsp", name: "Teaspoon", toBase: 0.00492892 },
      { id: "cup", name: "Cup (US)", toBase: 0.236588 },
      { id: "gal", name: "Gallon (US)", toBase: 3.78541 },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    units: [
      { id: "mps", name: "m/s", toBase: 1 },
      { id: "kmh", name: "km/h", toBase: 0.277778 },
      { id: "mph", name: "mph", toBase: 0.44704 },
      { id: "kn", name: "Knot", toBase: 0.514444 },
    ],
  },
  {
    id: "data",
    label: "Data",
    units: [
      { id: "b", name: "Byte", toBase: 1 },
      { id: "kb", name: "Kilobyte", toBase: 1024 },
      { id: "mb", name: "Megabyte", toBase: 1024 ** 2 },
      { id: "gb", name: "Gigabyte", toBase: 1024 ** 3 },
      { id: "tb", name: "Terabyte", toBase: 1024 ** 4 },
    ],
  },
];

export default function UnitConverter() {
  const [groupId, setGroupId] = useState("length");
  const group = GROUPS.find((g) => g.id === groupId)!;
  const [from, setFrom] = useState(group.units[0].id);
  const [to, setTo] = useState(group.units[2]?.id ?? group.units[1].id);
  const [value, setValue] = useState("1");

  function pickGroup(id: string) {
    const g = GROUPS.find((x) => x.id === id)!;
    setGroupId(id);
    setFrom(g.units[0].id);
    setTo(g.units[2]?.id ?? g.units[1].id);
  }

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    let out: number;
    if (group.convert) out = group.convert(v, from, to);
    else {
      const fu = group.units.find((u) => u.id === from);
      const tu = group.units.find((u) => u.id === to);
      // `from`/`to` can briefly belong to a previous category during a switch
      if (!fu || !tu) return "";
      out = (v * fu.toBase) / tu.toBase;
    }
    return Number(out.toPrecision(8)).toString();
  }, [value, from, to, group]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Segmented
          value={groupId}
          onChange={pickGroup}
          options={GROUPS.map((g) => ({ value: g.id, label: g.label }))}
        />
      </div>

      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="panel p-4">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mb-2 w-full bg-transparent text-sm font-medium outline-none"
          >
            {group.units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-11 border-0 bg-transparent px-0 text-2xl font-semibold focus:ring-0"
          />
        </div>

        <button
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-panel-raised text-fg-muted transition hover:text-fg"
          aria-label="Swap"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <div className="panel p-4">
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mb-2 w-full bg-transparent text-sm font-medium outline-none"
          >
            {group.units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <div className="flex h-11 items-center text-2xl font-semibold text-accent">
            {result || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
