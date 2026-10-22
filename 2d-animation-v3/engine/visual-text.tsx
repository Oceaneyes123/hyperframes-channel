export const isText = (type: string) => ["text", "heading", "caption", "code"].includes(type);
export function VisualText({ type, label, color, width, height, scale = 1 }: { type: string; label: string; color: string; width: number; height: number; scale?: number }) {
  const fontSize = Math.min((type === "heading" ? 110 : type === "caption" ? 54 : 64) * scale, height, width / Math.max(1, label.length * .64));
  return <text data-shape y={fontSize * .85} fill={color} fontSize={fontSize} fontWeight={type === "heading" ? 700 : 500} fontFamily={type === "code" ? "monospace" : "Arial"}>{label}</text>;
}
