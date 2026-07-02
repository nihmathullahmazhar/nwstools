import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("key-generator");

export default function Page() {
  return (
    <ToolShell slug="key-generator">
      <Client />
    </ToolShell>
  );
}
