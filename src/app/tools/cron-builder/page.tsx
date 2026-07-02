import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("cron-builder");

export default function Page() {
  return (
    <ToolShell slug="cron-builder">
      <Client />
    </ToolShell>
  );
}
