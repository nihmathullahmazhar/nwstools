import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("tip-calculator");

export default function Page() {
  return (
    <ToolShell slug="tip-calculator">
      <Client />
    </ToolShell>
  );
}
