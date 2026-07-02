import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("braille-translator");

export default function Page() {
  return (
    <ToolShell slug="braille-translator">
      <Client />
    </ToolShell>
  );
}
