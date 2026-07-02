import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("csv-json");

export default function Page() {
  return (
    <ToolShell slug="csv-json">
      <Client />
    </ToolShell>
  );
}
