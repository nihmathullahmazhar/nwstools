import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("percentage-calculator");

export default function Page() {
  return (
    <ToolShell slug="percentage-calculator">
      <Client />
    </ToolShell>
  );
}
