import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("video-compressor");

export default function Page() {
  return (
    <ToolShell slug="video-compressor">
      <Client />
    </ToolShell>
  );
}
