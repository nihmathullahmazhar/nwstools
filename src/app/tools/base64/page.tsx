import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("base64");

export default function Page() {
  return (
    <ToolShell slug="base64">
      <Client />
    </ToolShell>
  );
}
