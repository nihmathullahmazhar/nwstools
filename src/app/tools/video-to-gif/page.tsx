import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("video-to-gif");

export default function Page() {
  return (
    <ToolShell slug="video-to-gif">
      <Client />
    </ToolShell>
  );
}
