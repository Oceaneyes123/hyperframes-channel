"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import MotionComposition from "../../engine/motion-composition.tsx";
import { kineticExample, kineticExamples, type KineticExampleId } from "../../workflow/examples/kinetic.ts";

export default function MotionLibrary() {
  const [id, setId] = useState<KineticExampleId>("typography"), [frame, setFrame] = useState(0);
  const props = useMemo(() => kineticExample(id), [id]);
  const player = useRef<PlayerRef>(null);
  useEffect(() => {
    const instance = player.current, changed = () => setFrame(instance?.getCurrentFrame() ?? 0);
    instance?.addEventListener("frameupdate", changed);
    return () => instance?.removeEventListener("frameupdate", changed);
  }, [id]);
  return <div className="grid gap-8 md:grid-cols-[260px_1fr]">
    <section aria-label="Choose a capability">
      <label htmlFor="capability">Capability</label>
      <select id="capability" value={id} onChange={(event) => { const item = kineticExamples.find((item) => item.id === event.target.value); if (item) { setId(item.id); setFrame(0); } }}>
        {kineticExamples.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <p className="mt-5">{kineticExamples.find((item) => item.id === id)!.purpose}</p>
      {id === "comparison" && <p className="mt-4 text-sm text-[var(--muted)]">The cost figures are hypothetical supplied fixture values. They are not quotes, actual savings or earnings.</p>}
    </section>
    <section className="mx-auto w-full max-w-sm" aria-label="Capability preview">
      <Player key={id} ref={player} component={MotionComposition} inputProps={props} compositionWidth={1080} compositionHeight={1920} durationInFrames={120} fps={30} autoPlay={false} controls style={{ width: "100%", aspectRatio: "9/16" }} />
      <label htmlFor="capability-frame" className="mt-4 block">Inspect frame</label>
      <input id="capability-frame" type="range" min={0} max={119} step={1} value={frame} className="w-full" onChange={(event) => { const value = Number(event.target.value); setFrame(value); player.current?.pause(); player.current?.seekTo(value); }} />
      <p className="text-xs text-[var(--muted)]">Frame {frame} / 119. Play or inspect forward and backward.</p>
    </section>
  </div>;
}
