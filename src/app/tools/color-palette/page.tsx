import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("color-palette");

export default function Page() {
  return (
    <ToolShell slug="color-palette">
      <Client />
    </ToolShell>
  );
}
