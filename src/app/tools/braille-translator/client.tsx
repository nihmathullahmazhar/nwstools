"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const LETTERS: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
};
const PUNCT: Record<string, string> = {
  " ": " ", ",": "⠂", ";": "⠆", ":": "⠒", ".": "⠲", "!": "⠖", "?": "⠦",
  "'": "⠄", "-": "⠤", "/": "⠌",
};
const DIGITS: Record<string, string> = {
  "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑", "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚",
};
const NUMBER_SIGN = "⠼";
const CAPITAL_SIGN = "⠠";

const REV_LETTER = Object.fromEntries(Object.entries(LETTERS).map(([k, v]) => [v, k]));
const REV_PUNCT = Object.fromEntries(Object.entries(PUNCT).map(([k, v]) => [v, k]));
const REV_DIGIT = Object.fromEntries(Object.entries(DIGITS).map(([k, v]) => [v, k]));

function encode(text: string): string {
  let out = "";
  let inNumber = false;
  for (const ch of text) {
    if (/[0-9]/.test(ch)) {
      if (!inNumber) {
        out += NUMBER_SIGN;
        inNumber = true;
      }
      out += DIGITS[ch];
      continue;
    }
    inNumber = false;
    if (/[A-Z]/.test(ch)) {
      out += CAPITAL_SIGN + LETTERS[ch.toLowerCase()];
    } else if (LETTERS[ch]) {
      out += LETTERS[ch];
    } else if (PUNCT[ch] !== undefined) {
      out += PUNCT[ch];
    } else if (ch === "\n") {
      out += "\n";
    } else {
      out += ch;
    }
  }
  return out;
}

function decode(braille: string): string {
  let out = "";
  let capital = false;
  let inNumber = false;
  for (const ch of braille) {
    if (ch === CAPITAL_SIGN) {
      capital = true;
      continue;
    }
    if (ch === NUMBER_SIGN) {
      inNumber = true;
      continue;
    }
    if (ch === " " || ch === "\n") {
      inNumber = false;
      out += ch;
      continue;
    }
    if (inNumber && REV_DIGIT[ch]) {
      out += REV_DIGIT[ch];
      continue;
    }
    if (REV_LETTER[ch]) {
      out += capital ? REV_LETTER[ch].toUpperCase() : REV_LETTER[ch];
      capital = false;
      inNumber = false;
    } else if (REV_PUNCT[ch]) {
      out += REV_PUNCT[ch];
      inNumber = false;
    } else {
      out += ch;
    }
  }
  return out;
}

export default function BrailleTranslator() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [text, setText] = useState("");
  const output = useMemo(() => (mode === "encode" ? encode(text) : decode(text)), [mode, text]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "Text → Braille" },
          { value: "decode", label: "Braille → Text" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === "encode" ? "Type text…" : "Paste braille…"}
          className="min-h-[220px] text-lg"
          autoFocus
        />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea value={output} readOnly className="min-h-[220px] bg-panel-raised text-2xl leading-relaxed" />
        </div>
      </div>
      <p className="text-xs text-fg-faint">
        Grade-1 (uncontracted) braille with capital (⠠) and number (⠼) indicators.
      </p>
    </div>
  );
}
