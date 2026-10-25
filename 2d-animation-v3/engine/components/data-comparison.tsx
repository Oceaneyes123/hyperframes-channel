import { useId } from "react";
import { comparisonData, formatComparisonValue, type ComparisonReference } from "../../workflow/comparison.ts";
import type { PartState } from "../../workflow/components.ts";

export function DataComparison({ reference, width, height, states, actorId }: { reference: ComparisonReference; width: number; height: number; states: Record<string, PartState>; actorId?: string }) {
  const uid = useId(), { source, records } = comparisonData(reference);
  const plotX = width * .08, plotWidth = width * .84, range = source.maximum - source.minimum;
  const x = (value: number) => plotX + (value - source.minimum) / range * plotWidth, zero = x(0);
  return <g data-shape>
    <text x={plotX} y={height * .1} fontFamily="Arial" fontSize={width * .045} fill="#244E42">{source.unit.kind === "currency" ? source.unit.currency : source.unit.label}</text>
    {records.map((record, index) => {
      const id = index ? "bar-two" : "bar-one", state = states[id], mask = `${uid}-${id}`, y = height * (.29 + index * .3), length = Math.abs(x(record.value) - zero);
      return <g key={id} data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={state.opacity} color={state.color}>
        <text x={plotX} y={y - height * .1} fontFamily="Arial" fontSize={Math.min(width * .06, width * .78 / (record.label.length * .65))} fill="#244E42">{record.label}</text>
        <text data-value={record.id} x={plotX} y={y - height * .03} fontFamily="Arial" fontSize={width * .06} fill="#244E42">{formatComparisonValue(record.value, source.unit)}</text>
        <line x1={zero} y1={y + height * .02} x2={zero} y2={y + height * .12} stroke="#829C91" strokeWidth="2" />
        <g transform={`translate(${zero} ${y + height * .02}) scale(${(record.value < 0 ? -1 : 1) * length / width} 1)`}>
          <defs><clipPath id={mask}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (state.reveal ?? 1)} height={height * .1} /></clipPath></defs>
          <rect width={width} height={height * .1} fill="currentColor" clipPath={`url(#${mask})`} />
        </g>
      </g>;
    })}
    <text x={plotX} y={height * .92} fontFamily="Arial" fontSize={width * .045} fill="#244E42">{formatComparisonValue(source.minimum, source.unit)}</text>
    <text x={plotX + plotWidth} y={height * .92} textAnchor="end" fontFamily="Arial" fontSize={width * .045} fill="#244E42">{formatComparisonValue(source.maximum, source.unit)}</text>
  </g>;
}
