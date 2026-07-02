import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("text-to-speech");

export default function Page() {
  return (
    <ToolShell slug="text-to-speech">
      <Client />
    </ToolShell>
  );
}
