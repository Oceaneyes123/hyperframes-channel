import { useId } from "react";
import { morphPair, type MorphReference } from "../../workflow/morphs.ts";
import type { PartState } from "../../workflow/components.ts";

export function MorphShape({ reference, width, height, state, actorId }: { reference: MorphReference; width: number; height: number; state: PartState; actorId?: string }) {
  const pair = morphPair(reference), mask = useId();
  return <g data-shape>
    <defs><clipPath id={mask}><rect data-reveal={actorId ? `${actorId}.outline` : undefined} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
    <g data-actor={actorId ? `${actorId}.outline` : undefined} data-part="outline" color={state.color} opacity={state.opacity} clipPath={`url(#${mask})`}>
      <svg width={width} height={height} viewBox={`0 0 ${pair.width} ${pair.height}`}>
        <path data-morph={actorId ? `${actorId}.outline` : undefined} d={state.morphProgress === 1 ? pair.to : pair.from} fill="#C6DED3" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      </svg>
    </g>
  </g>;
}
