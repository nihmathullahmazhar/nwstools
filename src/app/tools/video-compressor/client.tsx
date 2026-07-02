"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/field";
import { VideoTool } from "@/components/video/video-tool";

// CRF: lower = better quality/bigger. 23 default, 28 smaller, 32 tiny.
const PRESETS: Record<string, { crf: string; scale: string; label: string }> = {
  high: { crf: "23", scale: "-2:720", label: "720p" },
  medium: { crf: "28", scale: "-2:540", label: "540p" },
  small: { crf: "32", scale: "-2:480", label: "480p" },
};

export default function VideoCompressor() {
  const [level, setLevel] = useState("medium");
  const p = PRESETS[level];

  return (
    <VideoTool
      action="Compress video"
      outName="output.mp4"
      downloadName={(base) => `${base}-compressed.mp4`}
      buildArgs={(i, o) => [
        "-i", i,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", p.crf,
        "-vf", `scale=${p.scale}`,
        "-c:a", "aac", "-b:a", "128k",
        o,
      ]}
    >
      <div>
        <div className="mb-1.5 text-sm font-medium">Compression level</div>
        <Segmented
          value={level}
          onChange={setLevel}
          options={[
            { value: "high", label: "Light" },
            { value: "medium", label: "Balanced" },
            { value: "small", label: "Max" },
          ]}
        />
        <p className="mt-2 text-xs text-fg-faint">
          Scales to {p.label} · CRF {p.crf}. Lower quality = smaller file.
        </p>
      </div>
    </VideoTool>
  );
}
