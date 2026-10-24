import { useId, type ReactNode } from "react";
import { componentParts, type PartState } from "../../workflow/components.ts";
import { graphicTheme as theme } from "../../workflow/graphic-assets.ts";

// Original CC0 artwork. Keep @1 immutable once approved; publish revised artwork under a new asset version.
export function ComplaintWorkflow({ width, height, color, parts, actorId, coordinateScale = 1 }: {
  width: number; height: number; color: string; parts?: Record<string, PartState>; actorId?: string; coordinateScale?: number;
}) {
  const uid = useId(); const states = componentParts("complaint-workflow@1", color, parts);
  const layer = (id: string, children: ReactNode) => {
    const state = states[id], clip = `${uid}-${id}`;
    return <g key={id}>
      <defs><clipPath id={clip}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
      <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} color={state.color} opacity={state.opacity}
        transform={`translate(${state.x * 10.8 * coordinateScale} ${state.y * 19.2 * coordinateScale}) scale(${state.scale})`} clipPath={`url(#${clip})`}>
        <g transform={`scale(${width / 900})`}>{children}</g>
      </g>
    </g>;
  };
  return <svg data-shape data-graphic="complaint-workflow@1" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <defs>
      <linearGradient id={`${uid}-wash`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={theme.mint} /><stop offset="1" stopColor={theme.paper} /></linearGradient>
      <pattern id={`${uid}-grid`} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke={theme.line} strokeWidth="1" /></pattern>
    </defs>
    <g transform={`scale(${width / 900})`}>
      <ellipse cx="490" cy="510" rx="390" ry="440" fill={`url(#${uid}-wash)`} />
      <path d="M40 1030Q380 920 864 1018L864 1150H40Z" fill={`url(#${uid}-grid)`} />
      <ellipse cx="424" cy="1078" rx="325" ry="29" fill={theme.ink} opacity=".08" />
      <path d="M175 568C115 755 754 485 716 723S336 692 318 857" fill="none" stroke={theme.line} strokeWidth="22" strokeLinecap="round" />
    </g>
    {layer("complaints", <>
      <rect x="60" y="120" width="590" height="450" rx={theme.radius} fill={theme.ink} opacity=".1" transform="translate(12 16)" />
      <rect x="60" y="120" width="590" height="450" rx={theme.radius} fill={theme.light} stroke={theme.ink} strokeWidth={theme.stroke} />
      <path d="M60 180H650" stroke={theme.ink} strokeWidth={theme.stroke} />
      {[92, 116, 140].map((x) => <circle key={x} cx={x} cy="150" r="6" fill={theme.muted} />)}
      <rect x="204" y="141" width="275" height="18" rx="9" fill={theme.line} />
      <path d="M110 230H292" stroke={theme.ink} strokeWidth="14" strokeLinecap="round" />
      {[286, 376, 466].map((y, i) => <g key={y}>
        <circle cx="115" cy={y + 12} r="21" fill={i === 1 ? theme.mint : theme.line} />
        <path d={`M151 ${y}H${i === 1 ? 324 : 284}`} stroke={theme.muted} strokeWidth="9" strokeLinecap="round" />
        <rect x="151" y={y + 20} width={i === 1 ? 313 : 266} height="18" rx="9" fill="currentColor" opacity=".8" />
        <path d={`M151 ${y + 53}H${i === 1 ? 510 : 460}`} stroke={theme.line} strokeWidth="7" strokeLinecap="round" />
        <path d={`M557 ${y + 10}l12 -12 12 12m-12 -12v32`} stroke={theme.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>)}
      <path d="M535 496l-8 65 19 -16 14 29 16 -8 -14 -29 25 -1Z" fill={theme.ink} stroke={theme.light} strokeWidth="3" />
    </>)}
    {layer("cluster", <>
      <circle cx="720" cy="648" r="124" fill={theme.mint} />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${610 + i * 16} ${558 + i * 34}) rotate(${i === 0 ? -8 : i === 1 ? 6 : 0} 100 55)`}>
        <rect width="180" height="94" rx="15" fill={theme.light} stroke={theme.ink} strokeWidth="4" />
        <circle cx="29" cy="30" r="10" fill={theme.mint} />
        <path d="M53 30H142" stroke={theme.line} strokeWidth="8" strokeLinecap="round" />
        <rect x="20" y="53" width="135" height="15" rx="7" fill="currentColor" />
      </g>)}
      <path d="M793 733l36 36" stroke={theme.ink} strokeWidth="15" strokeLinecap="round" />
      <circle cx="760" cy="699" r="46" fill={theme.light} fillOpacity=".6" stroke={theme.ink} strokeWidth="6" />
      <path d="M736 699H784" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
    </>)}
    {layer("packet", <>
      <circle cx="716" cy="809" r="22" fill={theme.light} />
      <rect x="702" y="800" width="28" height="18" rx="8" fill="currentColor" />
    </>)}
    {layer("opportunity", <>
      <path d="M120 1053H666L702 1080H84Z" fill={theme.mint} stroke={theme.ink} strokeWidth="4" strokeLinejoin="round" />
      <rect x="137" y="817" width="511" height="236" rx="18" fill={theme.ink} />
      <rect x="153" y="835" width="479" height="196" rx="10" fill={theme.light} />
      <path d="M174 869H608" stroke={theme.line} strokeWidth="3" />
      <circle cx="178" cy="852" r="4" fill="currentColor" />
      <rect x="183" y="901" width="171" height="97" rx="13" fill={theme.paper} stroke={theme.line} strokeWidth="2" />
      <path d="M204 924H327M204 945H304M204 966H318" stroke={theme.muted} strokeWidth="7" strokeLinecap="round" />
      <path d="M373 948H414m-12 -12 12 12 -12 12" fill="none" stroke={theme.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="435" y="901" width="162" height="97" rx="13" fill={theme.mint} />
      <rect x="460" y="935" width="112" height="23" rx="11" fill="currentColor" />
      <path d="M452 979H576" stroke={theme.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M713 908c-36 -46 -10 -95 30 -95s66 49 30 95l-9 18h-42Z" fill={theme.light} stroke={theme.ink} strokeWidth="4" />
      <path d="M725 938H762M731 950H756M743 873V924m-16 -62 16 11 16 -11M743 785V767M797 805l13 -13M689 805l-13 -13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>)}
  </svg>;
}
