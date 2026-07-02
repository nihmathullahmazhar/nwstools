"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const n = parseInt(
    m.length === 3 ? m.split("").map((c) => c + c).join("") : m,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function shade(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) =>
    Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)
      .toString(16)
      .padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}

interface EyeDropperCtor {
  new (): { open(): Promise<{ sRGBHex: string }> };
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#6d5efc");
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: "CSS var", value: `${r} ${g} ${b}` },
  ];

  async function pick() {
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (!Ctor) return;
    try {
      const res = await new Ctor().open();
      setHex(res.sRGBHex);
    } catch {}
  }

  // Checked after mount to avoid an SSR/client hydration mismatch.
  const [hasEyeDropper, setHasEyeDropper] = useState(false);
  useEffect(() => setHasEyeDropper("EyeDropper" in window), []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <div
          className="panel h-48 w-full rounded-2xl border-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-transparent"
          />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-12 flex-1 rounded-lg border border-border bg-panel px-3 font-mono text-lg outline-none focus:border-accent"
          />
          {hasEyeDropper && (
            <Button variant="secondary" size="icon" onClick={pick} aria-label="Eyedropper">
              <Pipette className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
            Tints & shades
          </div>
          <div className="flex overflow-hidden rounded-lg">
            {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((amt) => {
              const c = amt === 0 ? hex : shade(hex, amt);
              return (
                <button
                  key={amt}
                  onClick={() => setHex(c)}
                  className="h-12 flex-1 transition hover:scale-y-110"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {formats.map((f) => (
          <div key={f.label} className="panel flex items-center gap-4 p-4">
            <span
              className={cn(
                "w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-fg-faint",
              )}
            >
              {f.label}
            </span>
            <code className="flex-1 font-mono text-sm text-fg">{f.value}</code>
            <CopyButton value={f.value} size="sm" label="" />
          </div>
        ))}
      </div>
    </div>
  );
}
