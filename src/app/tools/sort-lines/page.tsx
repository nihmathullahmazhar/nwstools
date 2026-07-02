import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("sort-lines");

export default function Page() {
  return (
    <ToolShell slug="sort-lines">
      <Client />
    </ToolShell>
  );
}
