import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("fake-data");

export default function Page() {
  return (
    <ToolShell slug="fake-data">
      <Client />
    </ToolShell>
  );
}
