"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/field";
import { VideoTool } from "@/components/video/video-tool";

const OUT: Record<string, { ext: string; args: (i: string, o: string) => string[] }> = {
  mp3: { ext: "mp3", args: (i, o) => ["-i", i, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", o] },
  wav: { ext: "wav", args: (i, o) => ["-i", i, "-vn", o] },
  aac: { ext: "m4a", args: (i, o) => ["-i", i, "-vn", "-c:a", "aac", "-b:a", "192k", o] },
};

export default function VideoToAudio() {
  const [format, setFormat] = useState("mp3");
  const o = OUT[format];

  return (
    <VideoTool
      action={`Extract ${format.toUpperCase()}`}
      outName={`output.${o.ext}`}
      downloadName={(base) => `${base}.${o.ext}`}
      resultKind="audio"
      buildArgs={o.args}
    >
      <div>
        <div className="mb-1.5 text-sm font-medium">Audio format</div>
        <Segmented
          value={format}
          onChange={setFormat}
          options={[
            { value: "mp3", label: "MP3" },
            { value: "aac", label: "M4A" },
            { value: "wav", label: "WAV" },
          ]}
        />
        <p className="mt-2 text-xs text-fg-faint">Extracts the audio track from your video.</p>
      </div>
    </VideoTool>
  );
}
