import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("bill-splitter");

export default function Page() {
  return (
    <ToolShell slug="bill-splitter">
      <Client />
    </ToolShell>
  );
}
