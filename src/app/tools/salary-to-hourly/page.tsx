import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("salary-to-hourly");

export default function Page() {
  return (
    <ToolShell slug="salary-to-hourly">
      <Client />
    </ToolShell>
  );
}
