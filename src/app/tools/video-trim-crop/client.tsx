"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import { VideoTool } from "@/components/video/video-tool";

// Accepts seconds or mm:ss / hh:mm:ss.
function toSeconds(v: string): number {
  const parts = v.split(":").map(Number);
  if (parts.some(isNaN)) return NaN;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

export default function VideoTrimCrop() {
  const [start, setStart] = useState("0:00");
  const [end, setEnd] = useState("0:10");

  const s = toSeconds(start);
  const e = toSeconds(end);
  const invalid = isNaN(s) || isNaN(e) || e <= s;

  return (
    <VideoTool
      action="Trim video"
      outName="output.mp4"
      downloadName={(base) => `${base}-trimmed.mp4`}
      disabled={invalid}
      buildArgs={(i, o) => [
        "-i", i,
        "-ss", String(s),
        "-to", String(e),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-c:a", "aac",
        o,
      ]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1.5 text-sm font-medium">Start</div>
            <Input value={start} onChange={(ev) => setStart(ev.target.value)} className="h-11 text-center font-mono" placeholder="0:00" />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">End</div>
            <Input value={end} onChange={(ev) => setEnd(ev.target.value)} className="h-11 text-center font-mono" placeholder="0:10" />
          </div>
        </div>
        <p className="text-xs text-fg-faint">
          Use <code>mm:ss</code> or seconds. {invalid ? <span className="text-danger">End must be after start.</span> : `Clip length: ${(e - s).toFixed(1)}s`}
        </p>
      </div>
    </VideoTool>
  );
}
