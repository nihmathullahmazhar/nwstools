import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("remove-duplicate-lines");

export default function Page() {
  return (
    <ToolShell slug="remove-duplicate-lines">
      <Client />
    </ToolShell>
  );
}
