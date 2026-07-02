"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const MAP: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
  h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
  o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
  v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "@": ".--.-.", " ": "/",
};
const REV = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]));

export default function MorseCode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    if (mode === "encode")
      return input
        .toLowerCase()
        .split("")
        .map((c) => MAP[c] ?? "")
        .filter(Boolean)
        .join(" ");
    return input
      .trim()
      .split(/\s+/)
      .map((code) => (code === "/" ? " " : REV[code] ?? ""))
      .join("");
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "Text → Morse" },
          { value: "decode", label: "Morse → Text" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Type text…" : "Type morse (.- -...) …"}
          className="min-h-[220px] font-mono text-sm"
          autoFocus
        />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea value={output} readOnly className="min-h-[220px] bg-panel-raised font-mono text-lg" />
        </div>
      </div>
      <p className="text-xs text-fg-faint">Word gaps use “/”. Unknown characters are skipped.</p>
    </div>
  );
}
