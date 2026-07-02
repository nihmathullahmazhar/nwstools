"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

function encodeWord(w: string) {
  const m = w.match(/^([^aeiou]+)(.*)$/i);
  const cap = w[0] === w[0]?.toUpperCase();
  let res: string;
  if (/^[aeiou]/i.test(w)) res = w + "way";
  else if (m) res = m[2] + m[1].toLowerCase() + "ay";
  else res = w + "ay";
  if (cap) res = res[0].toUpperCase() + res.slice(1).toLowerCase();
  return res;
}

function decodeWord(w: string) {
  const cap = w[0] === w[0]?.toUpperCase();
  let res: string;
  if (/way$/i.test(w)) res = w.slice(0, -3);
  else {
    const m = w.match(/^(.*?)([^aeiou]+)ay$/i);
    res = m ? m[2] + m[1] : w;
  }
  if (cap) res = res[0].toUpperCase() + res.slice(1).toLowerCase();
  return res;
}

export default function PigLatin() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [text, setText] = useState("");

  const output = useMemo(() => {
    const fn = mode === "encode" ? encodeWord : decodeWord;
    return text.replace(/[A-Za-z]+/g, (w) => fn(w));
  }, [text, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "To Pig Latin" },
          { value: "decode", label: "From Pig Latin" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type text…" className="min-h-[220px]" autoFocus />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Result</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea value={output} readOnly className="min-h-[220px] bg-panel-raised" />
        </div>
      </div>
    </div>
  );
}
