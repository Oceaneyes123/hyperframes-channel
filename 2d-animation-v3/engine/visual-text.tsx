import { textFontSize } from "./text-metrics.ts";
export { isTextType as isText } from "./text-metrics.ts";
export function VisualText({ type, label, color, width, height, scale = 1 }: { type: string; label: string; color: string; width: number; height: number; scale?: number }) {
  const fontSize = textFontSize(type, label, width, height, scale);
  return <text data-shape x={type === "centered-text" ? width / 2 : undefined} textAnchor={type === "centered-text" ? "middle" : undefined} y={fontSize * .85} fill={color} fontSize={fontSize} fontWeight={type === "heading" ? 700 : 500} fontFamily={type === "code" ? "monospace" : "Arial"}>{label}</text>;
}
