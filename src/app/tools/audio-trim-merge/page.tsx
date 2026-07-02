import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("audio-trim-merge");

export default function Page() {
  return (
    <ToolShell slug="audio-trim-merge">
      <Client />
    </ToolShell>
  );
}
