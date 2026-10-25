import { z } from "zod";

export const typographySchema = z.literal("inter-heading@1");
export const headingFont = {
  id: "inter-heading@1", family: "HF Inter Heading", path: "fonts/inter-heading/InterVariable.woff2",
  sha256: "693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3",
  license: "OFL-1.1", attribution: "Inter by Rasmus Andersson and contributors",
  source: "https://github.com/rsms/inter/tree/353b61b9f4430d5f420d56605a6e7993e0941470",
} as const;

export async function verifyHeadingFont(bytes: ArrayBuffer) {
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== headingFont.sha256) throw new Error("Approved heading font is missing or has changed.");
}

export function fitHeading(label: string, width: number, height: number, scale: number, measure: (text: string, size: number) => number) {
  const lines = label.split(/\r?\n/);
  if (!lines.length || lines.length > 2 || lines.some((line) => !line.trim())) throw new Error("Heading profile requires one or two nonempty authored lines.");
  const maximum = Math.max(...lines.map((line) => measure(line, 100)));
  const size = Math.min(110 * scale, height / (lines.length * 1.4), (width - 4 * scale) * 100 / Math.max(1, maximum));
  return { size, lines: lines.map((text) => ({ text, width: measure(text, size) })) };
}
