import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("compound-interest");

export default function Page() {
  return (
    <ToolShell slug="compound-interest">
      <Client />
    </ToolShell>
  );
}
