export const isTextType = (type: string) => ["text", "centered-text", "heading", "caption", "code"].includes(type);
export function textFontSize(type: string, label: string, width: number, height: number, scale = 1) {
  if (type === "cost-chart@1") return Math.min(width * .09, height * .12);
  if (type === "kinetic-phrase@1") {
    const words = label.trim().split(/\s+/), keyword = words.pop() ?? "", lead = words.join(" ");
    return Math.min(height * .2, width / Math.max(1, Math.max(lead.length, keyword.length) * .65));
  }
  if (type === "text") return Math.min(72 * scale, height, width / Math.max(1, label.length * .6));
  return Math.min((type === "heading" ? 110 : type === "caption" ? 54 : 64) * scale, height, width / Math.max(1, label.length * .64));
}
