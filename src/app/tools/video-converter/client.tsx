"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/field";
import { VideoTool } from "@/components/video/video-tool";

const FORMATS: Record<string, { ext: string; args: (i: string, o: string) => string[] }> = {
  mp4: {
    ext: "mp4",
    args: (i, o) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-c:a", "aac", o],
  },
  webm: {
    ext: "webm",
    args: (i, o) => ["-i", i, "-c:v", "libvpx", "-b:v", "1M", "-c:a", "libvorbis", o],
  },
  gif: {
    ext: "gif",
    args: (i, o) => ["-i", i, "-vf", "fps=12,scale=480:-1:flags=lanczos", o],
  },
};

export default function VideoConverter() {
  const [target, setTarget] = useState("mp4");
  const fmt = FORMATS[target];

  return (
    <div className="space-y-2">
      <VideoTool
        action={`Convert to ${target.toUpperCase()}`}
        outName={`output.${fmt.ext}`}
        downloadName={(base) => `${base}.${fmt.ext}`}
        buildArgs={fmt.args}
        resultKind={target === "gif" ? "image" : "video"}
      >
        <div>
          <div className="mb-1.5 text-sm font-medium">Convert to</div>
          <Segmented
            value={target}
            onChange={setTarget}
            options={[
              { value: "mp4", label: "MP4" },
              { value: "webm", label: "WebM" },
              { value: "gif", label: "GIF" },
            ]}
          />
          <p className="mt-2 text-xs text-fg-faint">
            {target === "mp4" && "H.264 — plays everywhere."}
            {target === "webm" && "VP8/Vorbis — open web format."}
            {target === "gif" && "Animated GIF at 12 fps, 480px wide."}
          </p>
        </div>
      </VideoTool>
    </div>
  );
}
