import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("find-replace");

export default function Page() {
  return (
    <ToolShell slug="find-replace">
      <Client />
    </ToolShell>
  );
}
