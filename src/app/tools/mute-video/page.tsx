import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("mute-video");

export default function Page() {
  return (
    <ToolShell slug="mute-video">
      <Client />
    </ToolShell>
  );
}
