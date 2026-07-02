import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("to-do-list");

export default function Page() {
  return (
    <ToolShell slug="to-do-list">
      <Client />
    </ToolShell>
  );
}
