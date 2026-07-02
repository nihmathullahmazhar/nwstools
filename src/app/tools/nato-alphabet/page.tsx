import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("nato-alphabet");

export default function Page() {
  return (
    <ToolShell slug="nato-alphabet">
      <Client />
    </ToolShell>
  );
}
