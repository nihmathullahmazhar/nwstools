"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/field";
import { VideoTool } from "@/components/video/video-tool";

export default function VideoToGif() {
  const [fps, setFps] = useState("12");
  const [width, setWidth] = useState("480");

  return (
    <VideoTool
      action="Create GIF"
      outName="output.gif"
      downloadName={(base) => `${base}.gif`}
      resultKind="image"
      buildArgs={(i, o) => [
        "-i", i,
        "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos`,
        o,
      ]}
    >
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 text-sm font-medium">Frame rate</div>
          <Segmented
            value={fps}
            onChange={setFps}
            options={[
              { value: "8", label: "8 fps" },
              { value: "12", label: "12 fps" },
              { value: "20", label: "20 fps" },
            ]}
          />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Width</div>
          <Segmented
            value={width}
            onChange={setWidth}
            options={[
              { value: "320", label: "320px" },
              { value: "480", label: "480px" },
              { value: "640", label: "640px" },
            ]}
          />
        </div>
        <p className="text-xs text-fg-faint">
          Higher frame rate and width make a smoother but larger GIF.
        </p>
      </div>
    </VideoTool>
  );
}
