"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { scheduleMotion } from "../../workflow/motion.ts";
import { Player, type PlayerRef } from "@remotion/player";
import MotionComposition from "../../engine/motion-composition.tsx";
import { kineticExample, kineticExamples, type KineticExampleId } from "../../workflow/examples/kinetic.ts";

export default function MotionLibrary({projectId,shotIndex=0}: {projectId?: string;shotIndex?: number}) {
  const [id, setId] = useState<KineticExampleId>("typography"), [frame, setFrame] = useState(0);
  const [rollFrames, setRollFrames] = useState(54);
  const numeric = ["rolling-value", "value-transition", "percent"].includes(id);
  const props = useMemo(() => {
    const example = kineticExample(id);
    if (["rolling-value", "value-transition", "percent"].includes(id)) example.plan.shots[0].beats![0].endFrame = 12 + rollFrames;
    return example;
  }, [id, rollFrames]);
  const durationFrames = useMemo(() => scheduleMotion(props.plan).durationFrames, [props]);
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
        {["Typography", "Data", "UI", "Illustration", "Transformation", "Camera"].map((group) => <optgroup key={group} label={group}>{kineticExamples.filter((item) => (item.id === "perspective" ? "Camera" : ["variable-type", "typography", "text-layout", "keyword-focus", "type-match"].includes(item.id) ? "Typography" : ["comparison", "rolling-value", "value-transition", "percent"].includes(item.id) ? "Data" : ["handoff", "word-to-ui", "ui-workflow"].includes(item.id) ? "UI" : ["depth", "character-rig", "collage"].includes(item.id) ? "Illustration" : "Transformation") === group).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}
      </select>
      {projectId && <Link className="mt-4 block" href={`/projects/${projectId}/visuals?capability=${id}&shot=${shotIndex}`}>Use in shot {shotIndex + 1}</Link>}
      <p className="mt-5">{kineticExamples.find((item) => item.id === id)!.purpose}</p>
      {id === "variable-type" && <p className="mt-4 text-sm text-[var(--muted)]">Five authored phrases use actual Inter and OFL Roboto Flex axes. The font-expression preset takes no parameters; use its exact registered label/reference and visible glyphs part for 18–90 frames. Each evaluated axis state has measured outlines and reserved bounds. Example narration: “Weight draws attention; real width compression makes room.” New copy requires a reviewed expression entry.</p>}
      {id === "comparison" && <p className="mt-4 text-sm text-[var(--muted)]">The cost figures are hypothetical supplied fixture values. They are not quotes, actual savings or earnings.</p>}
      {["rolling-value", "value-transition", "percent"].includes(id) && <p className="mt-4 text-sm text-[var(--muted)]">Synthetic source fixture. Rolling characters are decoration. Supported parameters: exact source/record references, optional related previous record, and 18–90 frames. Example narration: “Suppose this is the supplied value.”</p>}
      {["text-layout", "word-to-ui", "keyword-focus", "type-match"].includes(id) && <p className="mt-4 text-sm text-[var(--muted)]">Measured fixed words use authored routes. Layouts require 2–8 visible text actors, 18–90 frames and no overlapping inner entrance or camera move. Example narration: “The same information moves into the next layout.”</p>}
      {id === "ui-workflow" && <p className="mt-4 text-sm text-[var(--muted)]">Hypothetical fields, fixed identities and four explicit triggers. This eight-second reconstruction never submits a form, calls a model or approves a response. Example narration: “The same question becomes a record, a request and a draft for the owner to review.”</p>}
      {id === "character-rig" && <p className="mt-4 text-sm text-[var(--muted)]">Original cutout adapted from the existing owner artwork. Each 48–120-frame action uses reviewed joints and prop contacts. Example narration: “The owner notices an inquiry, prepares a response and passes the document to review.” The tray does not imply approval.</p>}
      {id === "perspective" && <p className="mt-4 text-sm text-[var(--muted)]">Three original schematic planes use a real focal-distance projection, fixed near plane, deliberate foreground occlusion and viewport clipping. Five camera actions share Remotion frames and GSAP easing. One inquiry token crosses depths; no technical connectors or small labels are distorted. Example narration: “The camera reveals the inquiry, then follows it into processing.”</p>}
      {id === "collage" && <p className="mt-4 text-sm text-[var(--muted)]">Fictional AI-generated desk photo, with recorded provenance; no third-party stock license is asserted. Original vector and alpha grain are CC0. Five local, hash-verified layers remain editable; crop and normal blend are pinned. No remote media or animated images.</p>}
      {numeric && <div className="mt-4"><label htmlFor="roll-duration">Roll duration: {rollFrames} frames</label><input id="roll-duration" type="range" min={18} max={54} value={rollFrames} onChange={(event) => { setRollFrames(Number(event.target.value)); setFrame(0); player.current?.pause(); player.current?.seekTo(0); }} /><p className="text-xs">This four-second example allows 18–54 frames to preserve its reading hold.</p></div>}
    </section>
    <section className="mx-auto w-full max-w-sm" aria-label="Capability preview">
      <Player key={id} ref={player} component={MotionComposition} inputProps={props} compositionWidth={1080} compositionHeight={1920} durationInFrames={durationFrames} fps={30} autoPlay={false} controls style={{ width: "100%", aspectRatio: "9/16" }} />
      <label htmlFor="capability-frame" className="mt-4 block">Inspect frame</label>
      <input id="capability-frame" type="range" min={0} max={durationFrames - 1} step={1} value={frame} className="w-full" onChange={(event) => { const value = Number(event.target.value); setFrame(value); player.current?.pause(); player.current?.seekTo(value); }} />
      <p className="text-xs text-[var(--muted)]">Frame {frame} / {durationFrames - 1}. Play or inspect forward and backward.</p>
      <div className="mt-3 flex gap-4">{[{ label: "Start state", value: 0 }, { label: "End state", value: durationFrames - 1 }].map((state) => <button key={state.value} type="button" onClick={() => { setFrame(state.value); player.current?.pause(); player.current?.seekTo(state.value); }}>{state.label}</button>)}</div>
    </section>
  </div>;
}
