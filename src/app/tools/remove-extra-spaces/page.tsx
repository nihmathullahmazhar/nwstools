import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("remove-extra-spaces");

export default function Page() {
  return (
    <ToolShell slug="remove-extra-spaces">
      <Client />
    </ToolShell>
  );
}
