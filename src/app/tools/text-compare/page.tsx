import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("text-compare");

export default function Page() {
  return (
    <ToolShell slug="text-compare">
      <Client />
    </ToolShell>
  );
}
