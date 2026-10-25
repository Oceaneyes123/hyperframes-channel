import { useEffect, useId, useState } from "react";
import { getRemotionEnvironment, staticFile, useDelayRender } from "remotion";
import { variableExpression, variableAxisState, variableTypeLayout, variableFonts, verifyVariableFont, type VariableTypeReference } from "../../workflow/variable-type.ts";
import type { PartState } from "../../workflow/components.ts";

const ready = new Map<string, Promise<void>>();
function load(fontId: keyof typeof variableFonts) {
  if (!ready.has(fontId)) ready.set(fontId, (async () => {
    const meta = variableFonts[fontId], response = await fetch(getRemotionEnvironment().isRendering ? staticFile(meta.path) : `/${meta.path}`);
    if (!response.ok) throw new Error("Approved variable font could not be loaded.");
    const bytes = await response.arrayBuffer(); await verifyVariableFont(bytes, fontId);
    await new FontFace(`HF variable ${fontId}`, bytes).load();
  })());
  return ready.get(fontId)!;
}
export function VariableType({ reference, width, height, state, actorId, coordinateScale = 1, progress = state.axisProgress ?? 0 }: { reference: VariableTypeReference; width: number; height: number; state: PartState; actorId?: string; coordinateScale?: number; progress?: number }) {
  const entry = variableExpression(reference), layout = variableTypeLayout(reference, width, height, coordinateScale), uid = useId(), target = actorId ? `${actorId}.glyphs` : undefined;
  const maskId = actorId ? `${actorId}-variable-type-mask` : uid;
  const { delayRender, continueRender } = useDelayRender(), [handle] = useState(() => delayRender("Verify actual variable font bytes and decode"));
  const [loaded, setLoaded] = useState(false), [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true;
    load(entry.font as keyof typeof variableFonts).then(() => { if (active) setLoaded(true); continueRender(handle); }).catch((error: unknown) => { if (active) setError(error instanceof Error ? error : new Error("Font decoding failed.")); continueRender(handle); });
    return () => { active = false; continueRender(handle); };
  }, [entry.font, handle, continueRender]);
  if (error) throw error;
  let characterIndex = 0;
  const count = entry.label.replace(/\n/g, "").length;
  return <g data-shape data-variable-type={entry.id} data-font-ready={loaded} data-axis-progress={progress} role="img" aria-label={entry.label}>
    <defs><clipPath id={maskId}><rect data-reveal={target} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
    <g data-actor={target} data-part="glyphs" opacity={state.opacity} clipPath={`url(#${maskId})`} fill={state.color}>
      {loaded && entry.label.split("\n").map((line, row) => {
        let x = (width - layout.width) / 2;
        return <g key={row} aria-hidden="true">{Array.from(line).map((ch, index) => {
          const instance = variableAxisState(reference, progress, characterIndex++, count), glyph = (instance.glyphs as Record<string, { path: string; bounds: number[]; advance: number }>)[ch];
          const offset = x - Math.min(0, glyph.bounds[0]) * layout.unit;
          x += (entry.characters ? entry.envelope.cells[ch] : glyph.advance) * layout.unit;
          return <path key={index} data-variable-glyph={ch} data-axes={JSON.stringify(instance.axes)} d={glyph.path} transform={`translate(${offset} ${layout.baseline + row * layout.lineHeight}) scale(${layout.unit} ${-layout.unit})`} />;
        })}</g>;
      })}
    </g>
  </g>;
}
