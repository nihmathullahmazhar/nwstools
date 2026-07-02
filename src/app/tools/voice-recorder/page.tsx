import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("voice-recorder");

export default function Page() {
  return (
    <ToolShell slug="voice-recorder">
      <Client />
    </ToolShell>
  );
}
