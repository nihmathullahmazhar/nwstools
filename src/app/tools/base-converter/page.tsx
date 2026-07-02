import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("base-converter");

export default function Page() {
  return (
    <ToolShell slug="base-converter">
      <Client />
    </ToolShell>
  );
}
