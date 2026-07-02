import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <ToolShell slug="json-formatter">
      <Client />
    </ToolShell>
  );
}
