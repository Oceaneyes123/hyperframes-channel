import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function loadWritingSkill(name: "storytelling-hooks" | "humanizer", root = join(homedir(), ".codex", "skills")) {
  const files = name === "storytelling-hooks" ? ["SKILL.md", "patterns.md"] : ["SKILL.md"];
  const loaded = files.map((file) => {
    const path = join(root, name, file); const bytes = readFileSync(path);
    if (bytes.length > 80_000) throw new Error("Installed writing skill exceeds the context limit.");
    return { text: bytes.toString("utf8"), record: { name: `${name}/${file}`, path, sha256: createHash("sha256").update(bytes).digest("hex") } };
  });
  return { text: loaded.map((item) => item.text).join("\n\n"), records: loaded.map((item) => item.record) };
}
