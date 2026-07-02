"use client";

import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { download } from "@/lib/utils";
import { Download, Trash2, Check } from "lucide-react";

export default function Notepad() {
  const [text, setText, loaded] = useLocalStorage("notepad", "");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing… everything autosaves to this device."
        className="min-h-[440px] text-[15px] leading-relaxed"
        autoFocus
      />
      <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
        <span className="inline-flex items-center gap-1.5 text-success">
          <Check className="h-4 w-4" /> {loaded ? "Saved on this device" : "Loading…"}
        </span>
        <span className="text-fg-faint">·</span>
        <span>{words} words</span>
        <span>·</span>
        <span>{text.length} characters</span>
        <div className="ml-auto flex gap-2">
          <CopyButton value={text} />
          <Button variant="secondary" onClick={() => download(new Blob([text], { type: "text/plain" }), "note.txt")}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="secondary" onClick={() => setText("")}>
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
