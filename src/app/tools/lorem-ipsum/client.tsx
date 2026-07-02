"use client";

import { useEffect, useState } from "react";
import { Input, Segmented, Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

type Mode = "paragraphs" | "sentences" | "words";

function rand(max: number) {
  return Math.floor(Math.random() * max);
}
function makeSentence() {
  const len = 8 + rand(8);
  const s = Array.from({ length: len }, () => WORDS[rand(WORDS.length)]);
  s[0] = s[0][0].toUpperCase() + s[0].slice(1);
  return s.join(" ") + ".";
}
function makeParagraph() {
  const len = 3 + rand(4);
  return Array.from({ length: len }, makeSentence).join(" ");
}

export default function LoremIpsum() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [seed, setSeed] = useState(0);

  const [output, setOutput] = useState("");

  // Generated after mount only — Math.random during SSR would cause a
  // hydration mismatch.
  useEffect(() => {
    const n = Math.min(Math.max(count || 1, 1), 100);
    const CLASSIC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    let result: string;
    if (mode === "words") {
      const words = Array.from({ length: n }, () => WORDS[rand(WORDS.length)]);
      if (startClassic) words.splice(0, 2, "lorem", "ipsum");
      result = words.join(" ");
    } else if (mode === "sentences") {
      const sentences = Array.from({ length: n }, makeSentence);
      if (startClassic) sentences[0] = CLASSIC.trim();
      result = sentences.join(" ");
    } else {
      const paras = Array.from({ length: n }, makeParagraph);
      if (startClassic) paras[0] = CLASSIC + paras[0];
      result = paras.join("\n\n");
    }
    setOutput(result);
  }, [mode, count, startClassic, seed]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "paragraphs", label: "Paragraphs" },
            { value: "sentences", label: "Sentences" },
            { value: "words", label: "Words" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          Count
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-9 w-20"
          />
        </label>
        <Check checked={startClassic} onChange={setStartClassic}>
          Start with “Lorem ipsum”
        </Check>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="h-9 rounded-lg border border-border px-3 text-sm text-fg-muted hover:text-fg"
          >
            Shuffle
          </button>
          <CopyButton value={output} />
        </div>
      </div>

      <div className="panel space-y-4 p-5 text-[15px] leading-relaxed text-fg-muted">
        {output.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
