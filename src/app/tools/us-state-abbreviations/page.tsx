import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("us-state-abbreviations");

export default function Page() {
  return (
    <ToolShell slug="us-state-abbreviations">
      <Client />
    </ToolShell>
  );
}
