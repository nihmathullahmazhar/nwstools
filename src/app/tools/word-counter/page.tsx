import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import { WordCounter } from "./word-counter";

export const metadata = toolMetadata("word-counter");

export default function Page() {
  return (
    <ToolShell slug="word-counter">
      <WordCounter />
    </ToolShell>
  );
}
