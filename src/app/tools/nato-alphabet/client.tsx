"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const NATO: Record<string, string> = {
  a: "Alfa", b: "Bravo", c: "Charlie", d: "Delta", e: "Echo", f: "Foxtrot",
  g: "Golf", h: "Hotel", i: "India", j: "Juliett", k: "Kilo", l: "Lima",
  m: "Mike", n: "November", o: "Oscar", p: "Papa", q: "Quebec", r: "Romeo",
  s: "Sierra", t: "Tango", u: "Uniform", v: "Victor", w: "Whiskey",
  x: "X-ray", y: "Yankee", z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
};

export default function NatoAlphabet() {
  const [text, setText] = useState("");

  const tokens = useMemo(
    () =>
      text
        .toLowerCase()
        .split("")
        .map((c) => (c === " " ? { c: " ", word: "(space)" } : { c, word: NATO[c] }))
        .filter((t) => t.word),
    [text],
  );

  const line = tokens.map((t) => (t.c === " " ? "|" : t.word)).join(" ");

  return (
    <div className="space-y-5">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text to spell out…"
        className="min-h-[100px] text-[15px]"
        autoFocus
      />

      {tokens.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phonetic spelling</span>
            <CopyButton value={line} size="sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <div key={i} className="panel px-3 py-2 text-center">
                <div className="text-xs font-medium uppercase text-fg-faint">
                  {t.c === " " ? "␣" : t.c}
                </div>
                <div className="font-semibold">{t.word}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
