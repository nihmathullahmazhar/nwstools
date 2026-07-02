"use client";

import { useMemo, useState } from "react";
import { Textarea, Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

export default function RemoveExtraSpaces() {
  const [text, setText] = useState("");
  const [collapse, setCollapse] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [dropBlank, setDropBlank] = useState(false);
  const [stripAll, setStripAll] = useState(false);

  const output = useMemo(() => {
    if (stripAll) return text.replace(/\s+/g, "");
    let lines = text.split("\n");
    if (collapse) lines = lines.map((l) => l.replace(/[ \t]+/g, " "));
    if (trimLines) lines = lines.map((l) => l.trim());
    if (dropBlank) lines = lines.filter((l) => l.trim().length > 0);
    return lines.join("\n");
  }, [text, collapse, trimLines, dropBlank, stripAll]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Check checked={collapse} onChange={setCollapse}>Collapse spaces</Check>
        <Check checked={trimLines} onChange={setTrimLines}>Trim each line</Check>
        <Check checked={dropBlank} onChange={setDropBlank}>Remove blank lines</Check>
        <Check checked={stripAll} onChange={setStripAll}>Remove all whitespace</Check>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Input</div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste messy text…"
            className="min-h-[300px] text-sm"
            autoFocus
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Cleaned</span>
            <CopyButton value={output} size="sm" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[300px] bg-panel-raised text-sm"
          />
        </div>
      </div>
    </div>
  );
}
