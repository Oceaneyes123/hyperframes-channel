import { useId } from "react";
import type { Background } from "../../workflow/art-direction.ts";

export function GraphicBackground({ environment, width, height, progress = 0 }: { environment: Background; width: number; height: number; progress?: number }) {
  const id = useId(), { color, accent, depth, family } = environment;
  const shift = progress * depth * 12;
  return <svg width={width} height={height} viewBox="0 0 1080 1920" data-background={family}>
    <defs>
      <radialGradient id={`${id}-light`}><stop stopColor={accent} stopOpacity={.2 * depth} /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
      <pattern id={`${id}-grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke={accent} strokeWidth="1" opacity={.12 * depth} /></pattern>
    </defs>
    <rect width="1080" height="1920" fill={color} />
    {["soft-gradient", "atmospheric", "environment"].includes(family) && <ellipse cx={700 + shift} cy="650" rx="700" ry="950" fill={`url(#${id}-light)`} />}
    {family === "technical-grid" && <><rect width="1080" height="1920" fill={`url(#${id}-grid)`} /><path d="M0 1390H220V1230H830V1500H1080" fill="none" stroke={accent} opacity={depth * .1} strokeWidth="4" /></>}
    {family === "geometric" && <g opacity={depth * .12} transform={`translate(${shift} 0)`}><circle cx="940" cy="420" r="300" fill={accent} /><path d="M0 1350L440 1830H0Z" fill={accent} /></g>}
    {family === "editorial" && <g opacity={depth * .12}><path d="M0 260Q400 420 1080 210V350Q400 570 0 390Z" fill={accent} /><path d="M90 1600H520" stroke={accent} strokeWidth="6" /></g>}
    {family === "environment" && <><path d="M0 1500Q500 1400 1080 1520V1920H0Z" fill={accent} opacity={depth * .1} /><ellipse cx="540" cy="1560" rx="410" ry="36" fill={accent} opacity={depth * .08} /></>}
  </svg>;
}
