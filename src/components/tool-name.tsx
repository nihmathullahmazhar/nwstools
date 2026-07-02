/**
 * Renders a tool name with its key term accented — e.g.
 * "Background Remover", "QR Code Generator", "Word & Character Counter".
 * The important term is the last significant word of the name.
 */
export function ToolName({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return <span className="text-accent">{name}</span>;
  }
  const last = words[words.length - 1];
  const head = words.slice(0, -1).join(" ");
  return (
    <>
      {head} <span className="text-accent">{last}</span>
    </>
  );
}
