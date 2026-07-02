import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("secret-note");

export default function Page() {
  return (
    <ToolShell slug="secret-note">
      <Client />
    </ToolShell>
  );
}
