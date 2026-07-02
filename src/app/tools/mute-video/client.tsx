"use client";

import { VideoTool } from "@/components/video/video-tool";

export default function MuteVideo() {
  return (
    <VideoTool
      action="Remove audio"
      outName="output.mp4"
      downloadName={(base) => `${base}-muted.mp4`}
      buildArgs={(i, o) => ["-i", i, "-c:v", "copy", "-an", o]}
    >
      <p className="text-sm text-fg-muted">
        Strips the audio track and keeps the video exactly as-is (no re-encoding, so
        it&apos;s fast and lossless).
      </p>
    </VideoTool>
  );
}
