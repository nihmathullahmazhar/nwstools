import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("pig-latin");

export default function Page() {
  return (
    <ToolShell slug="pig-latin">
      <Client />
    </ToolShell>
  );
}
