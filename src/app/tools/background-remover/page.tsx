import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("background-remover");

export default function Page() {
  return (
    <ToolShell slug="background-remover">
      <Client />
    </ToolShell>
  );
}
