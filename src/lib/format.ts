/* Lightweight, dependency-free code formatters. */

const IND = "  ";

/** Structural beautifier for brace languages (JS, CSS, SCSS). Respects
 * strings and comments so it won't mangle their contents. */
export function formatBrace(src: string): string {
  let out = "";
  let depth = 0;
  let i = 0;
  const n = src.length;
  const pad = () => IND.repeat(Math.max(0, depth));
  const nl = () => {
    out = out.replace(/[ \t]+$/, "");
    out += "\n" + pad();
  };
  const skipWs = () => {
    while (i < n && /\s/.test(src[i])) i++;
  };

  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      out += c;
      i++;
      while (i < n) {
        out += src[i];
        if (src[i] === "\\") {
          out += src[i + 1] ?? "";
          i += 2;
          continue;
        }
        if (src[i] === q) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < n && src[i] !== "\n") {
        out += src[i];
        i++;
      }
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      out += "/*";
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        out += src[i];
        i++;
      }
      out += "*/";
      i += 2;
      continue;
    }
    if (c === "{") {
      out = out.replace(/\s+$/, "");
      out += " {";
      depth++;
      i++;
      skipWs();
      nl();
      continue;
    }
    if (c === "}") {
      depth--;
      out = out.replace(/\s+$/, "");
      out += "\n" + pad() + "}";
      i++;
      skipWs();
      if (i < n && ![";", ",", ")"].includes(src[i])) nl();
      continue;
    }
    if (c === ";") {
      out += ";";
      i++;
      skipWs();
      if (i < n && src[i] !== "}") nl();
      continue;
    }
    if (/\s/.test(c)) {
      if (!/\s$/.test(out)) out += " ";
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return out.trim();
}

export function formatJson(src: string): string {
  return JSON.stringify(JSON.parse(src), null, 2);
}

export function minifyJson(src: string): string {
  return JSON.stringify(JSON.parse(src));
}

/** Indent XML / HTML by tag depth. */
export function formatXml(src: string): string {
  const collapsed = src.replace(/>\s+</g, "><").trim();
  const withBreaks = collapsed.replace(/></g, ">\n<");
  const voidTags = new Set(["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"]);
  let depth = 0;
  const lines = withBreaks.split("\n");
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const isClose = /^<\//.test(line);
    const isSelf = /\/>\s*$/.test(line) || /^<[!?]/.test(line) || voidTags.has((line.match(/^<([a-zA-Z0-9-]+)/)?.[1] ?? "").toLowerCase());
    const isOpen = /^<[^/!?]/.test(line) && !isSelf && !/^<[^>]+>.*<\/[^>]+>$/.test(line);
    if (isClose) depth = Math.max(0, depth - 1);
    out.push(IND.repeat(depth) + line);
    if (isOpen) depth++;
  }
  return out.join("\n");
}

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "INSERT INTO", "VALUES", "UPDATE",
  "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "INNER JOIN",
  "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN", "ON", "GROUP BY", "ORDER BY",
  "HAVING", "LIMIT", "OFFSET", "UNION ALL", "UNION", "AS", "IN", "IS NULL",
  "IS NOT NULL", "LIKE", "BETWEEN", "DISTINCT", "COUNT", "ASC", "DESC",
];
const SQL_NEWLINE = ["FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION", "UNION ALL", "VALUES", "SET", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN"];
const SQL_INDENT = ["AND", "OR", "ON"];

export function formatSql(src: string): string {
  let s = src.replace(/\s+/g, " ").trim();
  // uppercase keywords (longest first so multi-word match first)
  for (const kw of [...SQL_KEYWORDS].sort((a, b) => b.length - a.length)) {
    s = s.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
  }
  for (const kw of SQL_NEWLINE) s = s.replace(new RegExp(`\\s+${kw}\\b`, "g"), `\n${kw}`);
  for (const kw of SQL_INDENT) s = s.replace(new RegExp(`\\s+${kw}\\b`, "g"), `\n${IND}${kw}`);
  s = s.replace(/\s*,\s*/g, ",\n" + IND);
  s = s.replace(/;\s*/g, ";\n");
  return s.trim();
}

export type Lang = "json" | "css" | "js" | "sql" | "xml";

export function format(lang: Lang, src: string, minify: boolean): string {
  if (!src.trim()) return "";
  switch (lang) {
    case "json":
      return minify ? minifyJson(src) : formatJson(src);
    case "css":
    case "js":
      return minify
        ? src.replace(/\s*([{};:,])\s*/g, "$1").replace(/\s+/g, " ").trim()
        : formatBrace(src);
    case "sql":
      return formatSql(src);
    case "xml":
      return formatXml(src);
  }
}
