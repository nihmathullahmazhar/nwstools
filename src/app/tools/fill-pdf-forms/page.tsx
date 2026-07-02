import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("fill-pdf-forms");

export default function Page() {
  return (
    <ToolShell slug="fill-pdf-forms">
      <Client />
    </ToolShell>
  );
}
