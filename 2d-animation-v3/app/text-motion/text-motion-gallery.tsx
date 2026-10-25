"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { useCurrentFrame } from "remotion";
import { VisualText } from "../../engine/visual-text.tsx";
import { textMotionLibrary, type TextMotion } from "../../workflow/text-motion.ts";

function Sample({ presetId, label }: { presetId: TextMotion["presetId"]; label: string }) {
  const frame = useCurrentFrame();
  return <svg viewBox="0 0 1080 600" width="1080" height="600" style={{ background: "#18241F" }}>
    <text x="90" y="110" fontFamily="Arial" fontSize="24" fill="#ADC1B5">TEXT STUDY / 30 FPS</text>
    <g transform="translate(90 245)"><VisualText type="heading" label={label} color="#F5F3ED" width={900} height={140} motion={{ targetId: "sample", presetId, startFrame: 6, endFrame: 36 }} frame={frame} /></g>
    <text x="90" y="510" fontFamily="Arial" fontSize="24" fill="#ADC1B5">{frame < 6 ? "Ready" : frame < 36 ? "Motion" : "Reading hold"}</text>
  </svg>;
}

export default function TextMotionGallery() {
  const [presetId, setPresetId] = useState<TextMotion["presetId"]>("mask-rise@1");
  const [label, setLabel] = useState("Make the idea clear");
  return <div className="grid gap-8 md:grid-cols-[260px_1fr]">
    <ol className="grid gap-2" aria-label="Text motion presets">{textMotionLibrary.map((preset, index) => <li key={preset.id}>
      <button className="w-full text-left" aria-pressed={presetId === preset.id} onClick={() => setPresetId(preset.id)}>{String(index + 1).padStart(2, "0")} · {preset.name}</button>
    </li>)}</ol>
    <section className="min-w-0" aria-label="Selected motion preview">
      <p className="mb-4">{textMotionLibrary.find((preset) => preset.id === presetId)!.use}</p>
      <label htmlFor="sample-label">Preview text</label>
      <input id="sample-label" className="mb-4" maxLength={40} value={label} onChange={(event) => setLabel(event.target.value)} />
      <Player key={presetId} component={Sample} inputProps={{ presetId, label }} compositionWidth={1080} compositionHeight={600} durationInFrames={90} fps={30} controls loop style={{ width: "100%" }} />
      <p className="mt-3 text-xs text-[var(--muted)]">Press play or scrub. Preview starts paused. One second of motion, followed by a reading hold.</p>
      <pre className="mt-5 overflow-auto text-xs">{JSON.stringify({ textMotions: [{ targetId: "object-1", presetId, startFrame: 6, endFrame: 36 }] }, null, 2)}</pre>
    </section>
  </div>;
}
