import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("audio-volume");

export default function Page() {
  return (
    <ToolShell slug="audio-volume">
      <Client />
    </ToolShell>
  );
}
