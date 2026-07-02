import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("currency-converter");

export default function Page() {
  return (
    <ToolShell slug="currency-converter">
      <Client />
    </ToolShell>
  );
}
