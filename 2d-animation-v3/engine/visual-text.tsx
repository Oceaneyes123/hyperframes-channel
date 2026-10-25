import { textFontSize } from "./text-metrics.ts";
import { TextMotionContent } from "./text-motion.tsx";
import type { TextMotion } from "../workflow/text-motion.ts";
import { HeadingText } from "./heading-text.tsx";
export { isTextType as isText } from "./text-metrics.ts";
export function VisualText({ type, label, color, width, height, scale = 1, motion, frame = 0, typography }: { type: string; label: string; color: string; width: number; height: number; scale?: number; motion?: TextMotion; frame?: number; typography?: "inter-heading@1" }) {
  if (typography) return <HeadingText label={label} color={color} width={width} height={height} scale={scale} centered={type === "centered-text"} motion={motion} frame={frame} />;
  const fontSize = textFontSize(type, label, width, height, scale);
  if (motion) return <g data-shape role="img" aria-label={label} fill={color} color={color} fontSize={fontSize} fontWeight={type === "heading" ? 700 : 500} fontFamily={type === "code" ? "monospace" : "Arial"}><g aria-hidden="true"><TextMotionContent label={label} fontSize={fontSize} width={width} motion={motion} frame={frame} centered={type === "centered-text"} /></g></g>;
  return <text data-shape x={type === "centered-text" ? width / 2 : undefined} textAnchor={type === "centered-text" ? "middle" : undefined} y={fontSize * .85} fill={color} fontSize={fontSize} fontWeight={type === "heading" ? 700 : 500} fontFamily={type === "code" ? "monospace" : "Arial"}>{label}</text>;
}
