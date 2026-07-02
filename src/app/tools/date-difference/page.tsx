import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("date-difference");

export default function Page() {
  return (
    <ToolShell slug="date-difference">
      <Client />
    </ToolShell>
  );
}
