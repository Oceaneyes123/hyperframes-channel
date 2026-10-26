import { useId } from "react";
import { numericData, numericColumns, type NumericReference } from "../../workflow/numeric.ts";
import type { PartState } from "../../workflow/components.ts";
import atlas from "../../workflow/numeric-glyphs.json";

const glyphs = atlas.glyphs as Record<string, { path: string; bounds: number[] }>;
const glyphWidth = Math.max(...Object.values(glyphs).map((glyph) => glyph.bounds[2] - Math.min(0, glyph.bounds[0]))) / atlas.unitsPerEm;
function Glyph({ character, x = 0, y, size, opacity = 1 }: { character: string; x?: number; y: number; size: number; opacity?: number }) {
  if (character === " ") return null;
  const glyph = glyphs[character];
  if (!glyph) throw new Error("Numeric glyph is not in the approved outline atlas.");
  return <path data-numeric-character={character} opacity={opacity} d={glyph.path} transform={`translate(${x - Math.min(0, glyph.bounds[0]) * size / atlas.unitsPerEm} ${y}) scale(${size / atlas.unitsPerEm} ${-size / atlas.unitsPerEm})`} />;
}

export function NumericDisplay({ reference, width, height, state, actorId, progress = state.numericProgress ?? 0 }: { reference: NumericReference; width: number; height: number; state: PartState; actorId?: string; progress?: number }) {
  const uid = useId(), data = numericData(reference), columns = numericColumns(data.initial, data.final);
  // Whole-pixel cells keep endpoint positions exact; only the visible digit window is rendered.
  const cell = Math.floor(width / columns.length), size = Math.floor(Math.min(height * .7, cell / glyphWidth)), row = Math.ceil(size * 1.3);
  const prefix = actorId ? `${actorId}.digits` : undefined;
  return <g data-shape role="img" aria-label={`Supplied target: ${data.final}`} color={state.color}>
    <defs><clipPath id={uid}><rect data-reveal={prefix} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
    <g data-actor={prefix} data-part="digits" opacity={state.opacity} clipPath={`url(#${uid})`}>
      {columns.map((column, index) => {
        const position = progress * column.distance, current = Math.floor(position);
        return <g key={index} transform={`translate(${index * cell} 0)`} fill="currentColor">
        {column.digits ? <g data-numeric={prefix} transform={`translate(0 ${-(position - current) * row})`}>
          {[...column.digits.slice(current, current + 2)].map((digit, i) => <Glyph key={i} character={digit} y={i * row + size} size={size} opacity={current + i === 0 && column.first === " " ? 0 : 1} />)}
        </g> : <>
          <Glyph character={column.first} y={size} size={size} opacity={1 - progress} />
          <Glyph character={column.last} y={size} size={size} opacity={progress} />
        </>}
      </g>; })}
    </g>
  </g>;
}
