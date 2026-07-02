"use client";

import { useMemo, useState } from "react";
import { Textarea, Stat } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

const STOP = new Set(
  "the a an and or but of to in on for with at by from is are was were be been being this that these those it its as if then than so".split(
    " ",
  ),
);

export function WordCounter() {
  const [text, setText] = useState("");

  const s = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const paragraphs = trimmed
      ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length
      : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingMin = words.length / 200;
    const speakingMin = words.length / 130;

    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase().replace(/[^a-z0-9']/g, "");
      if (k && !STOP.has(k)) freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    const top = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      words: words.length,
      chars,
      charsNoSpace,
      sentences,
      paragraphs,
      lines,
      readingMin,
      speakingMin,
      top,
      maxFreq: top[0]?.[1] ?? 1,
    };
  }, [text]);

  function fmtTime(min: number) {
    if (min < 1 / 60) return "0s";
    const totalSec = Math.round(min * 60);
    const m = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return m ? `${m}m ${sec}s` : `${sec}s`;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text…"
          className="min-h-[340px] text-[15px] leading-relaxed"
          autoFocus
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={text} label="Copy text" />
          <Button variant="secondary" size="md" onClick={() => setText("")}>
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Words" value={s.words.toLocaleString()} />
          <Stat label="Characters" value={s.chars.toLocaleString()} />
          <Stat
            label="No spaces"
            value={s.charsNoSpace.toLocaleString()}
          />
          <Stat label="Sentences" value={s.sentences.toLocaleString()} />
          <Stat label="Paragraphs" value={s.paragraphs.toLocaleString()} />
          <Stat label="Lines" value={s.lines.toLocaleString()} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Reading" value={fmtTime(s.readingMin)} hint="~200 wpm" />
          <Stat label="Speaking" value={fmtTime(s.speakingMin)} hint="~130 wpm" />
        </div>

        {s.top.length > 0 && (
          <div className="panel p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-fg-faint">
              Keyword density
            </div>
            <div className="space-y-2">
              {s.top.map(([word, count]) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="w-24 truncate text-sm text-fg">{word}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-raised">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(count / s.maxFreq) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs tabular-nums text-fg-muted">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
