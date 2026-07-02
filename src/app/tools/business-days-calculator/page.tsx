import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("business-days-calculator");

export default function Page() {
  return (
    <ToolShell slug="business-days-calculator">
      <Client />
    </ToolShell>
  );
}
