import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("keyword-density");

export default function Page() {
  return (
    <ToolShell slug="keyword-density">
      <Client />
    </ToolShell>
  );
}
