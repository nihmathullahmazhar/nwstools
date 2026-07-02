import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("gpa-calculator");

export default function Page() {
  return (
    <ToolShell slug="gpa-calculator">
      <Client />
    </ToolShell>
  );
}
