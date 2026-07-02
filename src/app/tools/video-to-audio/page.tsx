import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("video-to-audio");

export default function Page() {
  return (
    <ToolShell slug="video-to-audio">
      <Client />
    </ToolShell>
  );
}
