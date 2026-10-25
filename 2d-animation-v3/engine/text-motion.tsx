import { useId } from "react";
import { textMotionProgress, textMotionSegments, type TextMotion } from "../workflow/text-motion.ts";

export function TextMotionContent({ label, fontSize, width, motion, frame, centered = false }: {
  label: string; fontSize: number; width: number; motion: TextMotion; frame: number; centered?: boolean;
}) {
  const id = `text-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const { progress: p, eased: e } = textMotionProgress(motion, frame);
  const baseline = fontSize * .85;
  const parts = textMotionSegments(label, motion.presetId);
  const alignment = { x: centered ? width / 2 : 0, textAnchor: centered ? "middle" as const : "start" as const };
  const text = <text data-shape {...alignment} y={baseline} xmlSpace="preserve">{label}</text>;
  if (["word-stagger@1", "character-rise@1", "typewriter@1"].includes(motion.presetId)) {
    return <text data-shape {...alignment} y={baseline} xmlSpace="preserve">{parts.map((part, index) => {
      const { eased } = textMotionProgress(motion, frame, index, parts.length);
      const typing = motion.presetId === "typewriter@1";
      const y = typing ? 0 : (1 - eased) * fontSize * .65;
      const previousY = typing || index === 0 ? 0 : (1 - textMotionProgress(motion, frame, index - 1, parts.length).eased) * fontSize * .65;
      const dy = y - previousY;
      return <tspan key={index} dy={dy} opacity={typing ? index < Math.floor(p * parts.length) ? 1 : 0 : eased}>{part}</tspan>;
    })}</text>;
  }
  if (motion.presetId === "mask-rise@1" || motion.presetId === "wipe-reveal@1") {
    const rise = motion.presetId === "mask-rise@1";
    return <><defs><clipPath id={id}><rect x="-2" y={-fontSize * .2} width={rise ? width + 4 : (width + 4) * e} height={fontSize * 1.5} /></clipPath></defs><g clipPath={`url(#${id})`}><g transform={`translate(0 ${(1 - e) * (rise ? fontSize * 1.4 : 0)})`}>{text}</g></g></>;
  }
  if (motion.presetId === "tracking-settle@1") {
    // shortcut: spacing contracts inward to fit the approved box; use shaped glyph metrics before adding outward tracking.
    return <text data-shape {...alignment} y={baseline} letterSpacing={-(1 - e) * fontSize * .12} opacity={e} xmlSpace="preserve">{label}</text>;
  }
  if (motion.presetId === "blur-resolve@1") return <><defs><filter id={id} x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation={(1 - e) * fontSize * .12} /></filter></defs><g opacity={e} filter={p >= 1 ? undefined : `url(#${id})`}>{text}</g></>;
  if (motion.presetId === "pop-settle@1") {
    const scale = p < .7 ? .82 + .22 * (1 - (1 - p / .7) ** 3) : 1.04 - .04 * (p - .7) / .3;
    return <g opacity={e} transform={`translate(${width / 2} ${fontSize / 2}) scale(${scale}) translate(${-width / 2} ${-fontSize / 2})`}>{text}</g>;
  }
  if (motion.presetId === "highlight-sweep@1") return <><rect x="0" y="0" width={width * e} height={fontSize * 1.12} fill="currentColor" opacity={.2} rx={fontSize * .06} />{text}</>;
  return <>{text}<line x1="0" y1={fontSize * 1.08} x2={width * e} y2={fontSize * 1.08} stroke="currentColor" strokeWidth={fontSize * .05} opacity={p > 0 ? 1 : 0} /></>;
}
