import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("video-converter");

export default function Page() {
  return (
    <ToolShell slug="video-converter">
      <Client />
    </ToolShell>
  );
}
