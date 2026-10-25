import { useId } from "react";
import { semanticPair, type MorphChain as Chain } from "../../workflow/semantic-morphs.ts";
import type { PartState } from "../../workflow/components.ts";

export function MorphChain({ chain, width, height, state, actorId, stage = state.morphStage ?? 0 }: { chain: Chain; width: number; height: number; state: PartState; actorId?: string; stage?: number }) {
  const uid = useId(), pairs = chain.pairs.map(semanticPair), index = Math.min(pairs.length - 1, Math.floor(stage)), progress = stage - index;
  const current = pairs[index], sourceOpacity = Math.max(0, 1 - progress / .35), targetOpacity = Math.max(0, Math.min(1, (progress - .65) / .35));
  const part = actorId ? `${actorId}.outline` : undefined;
  return <g data-shape data-morph-stage={stage} role="img" aria-label={`Schematic ${current.id.replace("@1", "").replaceAll("-", " ")}; step ${index + 1} of ${pairs.length}`}>
    <defs><clipPath id={uid}><rect data-reveal={part} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
    <g data-actor={part} data-part="outline" color={state.color} opacity={state.opacity} clipPath={`url(#${uid})`}>
      <svg width={width} height={height} viewBox={`0 0 ${current.width} ${current.height}`}>
        {pairs.map((pair, i) => <path key={i} data-chain-path={part ? `${part}:${i}` : undefined} visibility={index === i ? "visible" : "hidden"} d={(state.morphStage ?? 0) > i ? pair.to : pair.from} fill="#C6DED3" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />)}
        <g data-morph-marks="source" opacity={sourceOpacity}>{current.fromMarks.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />)}</g>
        <g data-morph-marks="target" opacity={targetOpacity}>{current.toMarks.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />)}</g>
      </svg>
    </g>
  </g>;
}
