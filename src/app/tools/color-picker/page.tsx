import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("color-picker");

export default function Page() {
  return (
    <ToolShell slug="color-picker">
      <Client />
    </ToolShell>
  );
}
