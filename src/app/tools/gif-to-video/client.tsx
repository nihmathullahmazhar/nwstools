"use client";

import { VideoTool } from "@/components/video/video-tool";

export default function GifToVideo() {
  return (
    <VideoTool
      action="Convert to MP4"
      outName="output.mp4"
      downloadName={(base) => `${base}.mp4`}
      accept="image/gif"
      sourceKind="image"
      hint="Animated GIF"
      dropLabel="Drop a GIF to convert to MP4"
      buildArgs={(i, o) => [
        "-i", i,
        "-movflags", "faststart",
        "-pix_fmt", "yuv420p",
        // dimensions must be even for h264
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        o,
      ]}
    >
      <p className="text-sm text-fg-muted">
        Converts an animated GIF into an MP4 — far smaller and smoother, and it plays
        inline on social platforms that don&apos;t autoplay GIFs.
      </p>
    </VideoTool>
  );
}
