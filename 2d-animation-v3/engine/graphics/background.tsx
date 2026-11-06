import { useId } from "react";
import type { Background } from "../../workflow/art-direction.ts";

export function GraphicBackground({ environment, width, height, progress = 0 }: { environment: Background; width: number; height: number; progress?: number }) {
  const id = useId(), { color, accent, depth, family } = environment;
  const shift = progress * depth * 12;
  const rough = environment.texture === "rough-paper@1";
  return <svg width={width} height={height} viewBox="0 0 1080 1920" data-background={family}>
    <defs>
      <radialGradient id={`${id}-light`}><stop stopColor={accent} stopOpacity={.2 * depth} /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
      <pattern id={`${id}-grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke={accent} strokeWidth="1" opacity={.12 * depth} /></pattern>
      {environment.texture && <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="7" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>}
      {rough && <filter id={`${id}-fibers`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".045 .19" numOctaves="3" seed="17" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="linear" slope="2.4" intercept="-.7" /><feFuncG type="linear" slope="2.4" intercept="-.7" /><feFuncB type="linear" slope="2.4" intercept="-.7" /></feComponentTransfer></filter>}
    </defs>
    <rect width="1080" height="1920" fill={color} />
    {["soft-gradient", "atmospheric", "environment"].includes(family) && <ellipse cx={700 + shift} cy="650" rx="700" ry="950" fill={`url(#${id}-light)`} />}
    {family === "technical-grid" && <><rect width="1080" height="1920" fill={`url(#${id}-grid)`} /><path d="M0 1390H220V1230H830V1500H1080" fill="none" stroke={accent} opacity={depth * .1} strokeWidth="4" /></>}
    {family === "geometric" && <g opacity={depth * .12} transform={`translate(${shift} 0)`}><circle cx="940" cy="420" r="300" fill={accent} /><path d="M0 1350L440 1830H0Z" fill={accent} /></g>}
    {family === "editorial" && <g opacity={depth * .12}><path d="M0 260Q400 420 1080 210V350Q400 570 0 390Z" fill={accent} /><path d="M90 1600H520" stroke={accent} strokeWidth="6" /></g>}
    {family === "environment" && <><path d="M0 1500Q500 1400 1080 1520V1920H0Z" fill={accent} opacity={depth * .1} /><ellipse cx="540" cy="1560" rx="410" ry="36" fill={accent} opacity={depth * .08} /></>}
    {environment.texture && <rect width="1080" height="1920" filter={`url(#${id}-grain)`} opacity=".08" data-texture={environment.texture} />}
    {rough && <g data-rough-paper="rough-paper@1">
      <rect width="1080" height="1920" filter={`url(#${id}-fibers)`} opacity=".28" style={{ mixBlendMode: "multiply" }} />
      <path d="M0 0H54L48 130L66 245L42 390L61 540L45 710L63 860L40 1040L57 1220L43 1390L62 1560L46 1740L59 1920H0Z" fill={accent} opacity=".16" />
      <path d="M0 1810L130 1790L270 1818L390 1799L540 1820L680 1795L820 1814L960 1793L1080 1810V1920H0Z" fill={accent} opacity=".12" />
      <g stroke="#594B3D" strokeLinecap="round" opacity=".19">{Array.from({ length: 280 }, (_, i) => {
        const x = (i * 173 + 31) % 1080, y = (i * 389 + 71) % 1920;
        return <path key={i} d={`M${x} ${y}l${2 + i % 5} ${i % 3 - 1}`} strokeWidth={1 + i % 2} />;
      })}</g>
    </g>}
  </svg>;
}
