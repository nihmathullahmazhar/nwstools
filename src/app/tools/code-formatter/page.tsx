import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("code-formatter");

export default function Page() {
  return (
    <ToolShell slug="code-formatter">
      <Client />
    </ToolShell>
  );
}
