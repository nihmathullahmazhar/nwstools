import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("ein-formatter");

export default function Page() {
  return (
    <ToolShell slug="ein-formatter">
      <Client />
    </ToolShell>
  );
}
