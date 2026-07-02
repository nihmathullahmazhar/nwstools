import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("federal-holidays");

export default function Page() {
  return (
    <ToolShell slug="federal-holidays">
      <Client />
    </ToolShell>
  );
}
