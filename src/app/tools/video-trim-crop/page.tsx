import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("video-trim-crop");

export default function Page() {
  return (
    <ToolShell slug="video-trim-crop">
      <Client />
    </ToolShell>
  );
}
