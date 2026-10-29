import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { motionPlanSchema, scheduleMotion, expandMotionShot, type MotionState } from "../workflow/motion.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { isTextType } from "../engine/text-metrics.ts";

type Event = { shotId: string; target: string; kind: string; startFrame: number; endFrame: number };
const histogram = (items: string[]) => items.reduce<Record<string, number>>((counts, id) => {
  counts[id] = (counts[id] ?? 0) + 1; return counts;
}, {});
const words = (label: string) => label.trim().match(/\S+/gu)?.length ?? 0;

/** Declarative diagnostics only: no video decoding, OCR or perceptual quality score. */
export function rhythmReport(input: unknown, source?: unknown) {
  const plan = motionPlanSchema.parse(input && typeof input === "object" && "plan" in input ? input.plan : input);
  const board = source === undefined ? undefined : visualArtifactSchema.parse(source);
  if (board && (board.output.kind !== "storyboard" || board.output.shots.length !== plan.shots.length)) throw new Error("Storyboard must cover the complete motion plan.");
  if (board?.output.kind === "storyboard") for (const [index, shot] of plan.shots.entries()) {
    if (shot.sourceIndex !== index || shot.sourceHash !== createHash("sha256").update(JSON.stringify(board.output.shots[index])).digest("hex")) throw new Error("Storyboard shot hash does not match the motion plan.");
  }
  const schedule = scheduleMotion(plan), events: Event[] = [];
  const frames = Array.from({ length: schedule.durationFrames }, () => ({ text: new Map<string, string>(), illustrations: new Set<string>() }));
  const presets: { frame: number; id: string; primary: boolean }[] = [];
  const illustrationShots: Record<string, string[]> = {};
  let previousBackground: string | undefined;
  for (const [index, original] of plan.shots.entries()) {
    const shot = expandMotionShot(original), span = schedule.shots[index];
    const add = (target: string, kind: string, start: number, end = start) => {
      events.push({ shotId: shot.id, target, kind, startFrame: span.startFrame + start, endFrame: span.startFrame + end });
    };
    const states = new Map<string, Partial<MotionState>>([["camera", { ...shot.camera }]]);
    for (const object of shot.objects) {
      states.set(object.id, { ...object.initial });
      for (const [part, state] of Object.entries(object.initialParts ?? {})) states.set(`${object.id}.${part}`, { ...state });
      const shared = shot.incoming.type === "continuous" && shot.incoming.anchor?.objectId === object.id;
      if (!shared && object.initial.opacity > 0) add(object.id, "enter", 0);
      const next = plan.shots[index + 1];
      if (!(next?.incoming.type === "continuous" && next.incoming.anchor?.previousObjectId === object.id) && span.endFrame < schedule.durationFrames) add(object.id, "exit", shot.durationFrames);
    }
    const tracks: { target: string; start: number; end: number; from: Partial<MotionState>; to: Partial<MotionState> }[] = [];
    const intervals: Event[] = [];
    for (const action of [...shot.actions].sort((a, b) => a.startFrame - b.startFrame)) {
      if (action.behavior === "hold") continue;
      for (const [order, target] of action.targetIds.entries()) {
        const state = states.get(target);
        if (!state) throw new Error(`Unknown motion target: ${target}`);
        const changed = Object.entries(action.to).filter(([key, value]) => state[key as keyof MotionState] !== value);
        if (!changed.length) continue;
        const start = action.startFrame + order * action.staggerFrames, end = action.endFrame + order * action.staggerFrames;
        tracks.push({ target, start, end, from: { ...state }, to: action.to });
        const kinds = new Set(changed.map(([key, value]) => target === "camera" || ["cameraX", "cameraY", "cameraZ"].includes(key) ? "camera-move"
          : ["opacity", "reveal"].includes(key) && typeof value === "number" && (value === 0 || state[key as keyof MotionState] === 0) ? value === 0 ? "exit" : "enter"
            : key === "numericProgress" ? "counter-transition" : "transformation"));
        for (const kind of kinds) intervals.push({ shotId: shot.id, target, kind, startFrame: start, endFrame: end });
        Object.assign(state, action.to);
      }
    }
    // Merge touching phases per target/category so anticipation and settling do not inflate counts.
    const merged: Event[] = [];
    for (const interval of intervals.sort((a, b) => a.startFrame - b.startFrame)) {
      const prior = merged.findLast((event) => event.target === interval.target && event.kind === interval.kind && event.endFrame >= interval.startFrame);
      if (prior) prior.endFrame = Math.max(prior.endFrame, interval.endFrame);
      else merged.push({ ...interval });
    }
    for (const event of merged) add(event.target, event.kind, event.startFrame, event.endFrame);
    for (const beat of original.beats ?? []) if (beat.presetId !== "hold@1") presets.push({ frame: span.startFrame + beat.startFrame, id: beat.presetId, primary: beat.importance === "primary" });
    for (const motion of shot.textMotions ?? []) {
      presets.push({ frame: span.startFrame + motion.startFrame, id: motion.presetId, primary: false });
      add(motion.targetId, "text-treatment", motion.startFrame, motion.endFrame);
    }
    const drawing = board?.output.kind === "storyboard" ? board.output.shots[index] : undefined;
    if (drawing) {
      if (previousBackground !== undefined && previousBackground !== drawing.startFrame.background) add("background", "background-change", 0);
      if (drawing.startFrame.background !== drawing.endFrame.background) add("background", "background-change", 0, shot.durationFrames - 1);
      previousBackground = drawing.endFrame.background;
    }
    for (let frame = 0; frame < shot.durationFrames; frame++) {
      const bucket = frames[span.startFrame + frame];
      for (const object of shot.objects) {
        let opacity = object.initial.opacity, reveal = object.initial.reveal ?? 1;
        for (const track of tracks.filter((track) => track.target === object.id && track.start <= frame)) {
          const progress = Math.min(1, (frame - track.start) / Math.max(1, track.end - track.start));
          if (track.to.opacity !== undefined) opacity = (track.from.opacity ?? 1) + (track.to.opacity - (track.from.opacity ?? 1)) * progress;
          if (track.to.reveal !== undefined) reveal = (track.from.reveal ?? 1) + (track.to.reveal - (track.from.reveal ?? 1)) * progress;
        }
        if (opacity <= 0 || reveal <= 0) continue;
        if (isTextType(object.type) || object.type === "variable-type@1" || object.type === "kinetic-phrase@1") bucket.text.set(`${shot.id}/${object.id}`, object.label);
        if (!isTextType(object.type) && !["rect", "ellipse", "line", "arrow", "variable-type@1", "kinetic-phrase@1"].includes(object.type)) {
          const reference = object.diagram ?? object.comparison ?? object.numeric ?? object.ui ?? object.rig ?? object.morphChain ?? object.collage ?? object.perspective ?? object.morph;
          const identity = object.asset ? `${object.asset.id}:${object.asset.contentHash}` : reference ? `${object.type}:${createHash("sha256").update(JSON.stringify(reference)).digest("hex")}` : object.type;
          bucket.illustrations.add(identity);
          const shots = illustrationShots[identity] ??= [];
          if (!shots.includes(shot.id)) shots.push(shot.id);
        }
      }
    }
  }
  // Timeline endpoint has no rendered frame; exclude exit events there.
  const distinct = events.filter((event, index) => event.startFrame < schedule.durationFrames && events.findIndex((other) => other.shotId === event.shotId && other.target === event.target && other.kind === event.kind && other.startFrame === event.startFrame) === index);
  const windows = [];
  for (let start = 0; start < schedule.durationFrames; start += plan.fps * 2) {
    const end = Math.min(start + plan.fps * 2, schedule.durationFrames), slice = frames.slice(start, end);
    const starts = distinct.filter((event) => event.startFrame >= start && event.startFrame < end);
    const text = new Map(slice.flatMap((frame) => [...frame.text])), illustrations = [...new Set(slice.flatMap((frame) => [...frame.illustrations]))];
    windows.push({ startSeconds: start / plan.fps, endSeconds: end / plan.fps, changeEvents: starts.length, eventKinds: histogram(starts.map((event) => event.kind)),
      activeEvents: distinct.filter((event) => event.startFrame < end && event.endFrame >= start).length,
      textElements: text.size, textWords: [...text.values()].reduce((sum, text) => sum + words(text), 0),
      peakConcurrentTextElements: Math.max(...slice.map((frame) => frame.text.size)), peakConcurrentWords: Math.max(...slice.map((frame) => [...frame.text.values()].reduce((sum, text) => sum + words(text), 0))),
      illustrations, presetHistogram: histogram(presets.filter((preset) => preset.frame >= start && preset.frame < end).map((preset) => preset.id)) });
  }
  return { schemaVersion: 1, basis: "motion-plan diagnostics; not decoded video or retention evidence", fps: plan.fps, durationFrames: schedule.durationFrames,
    limitations: ["Visibility uses positive root opacity/reveal with linear interpolation; no clipping, occlusion, transition masks or embedded illustration text analysis.", "Text words are full authored labels, including during partial text reveals. Windows report union and simultaneous peaks separately.", "Events are changed-action onsets merged across touching phases per target/category, plus actor lifetimes, text treatments and optional background changes. Invisible part actions may count.", "Counter transitions are counted once, not individual decorative digit ticks. Compound illustration internals and environment treatments are not independently counted.", "Without a storyboard background changes are unknown; without beats/textMotions preset identity is unknown."],
    backgroundMeasured: !!board, summary: { shots: plan.shots.length, changeEvents: distinct.length, zeroOnsetWindows: windows.filter((window) => !window.changeEvents).length,
      presetHistogram: histogram(presets.map((preset) => preset.id)), primaryPresetHistogram: histogram(presets.filter((preset) => preset.primary).map((preset) => preset.id)),
      illustrationShots }, windows, events: distinct };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [file, boardFile, ...extra] = process.argv.slice(2);
    if (!file || extra.length || !file.endsWith(".json")) throw new Error("Usage: node scripts/rhythm-report.ts <motion.json> [storyboard.json]. MP4 requires its motion plan.");
    const bytes = readFileSync(file), boardBytes = boardFile ? readFileSync(boardFile) : undefined;
    const report = rhythmReport(JSON.parse(bytes.toString()), boardBytes ? JSON.parse(boardBytes.toString()) : undefined);
    console.log(JSON.stringify({ ...report, sources: { motion: { file, sha256: createHash("sha256").update(bytes).digest("hex") }, ...(boardBytes ? { storyboard: { file: boardFile, sha256: createHash("sha256").update(boardBytes).digest("hex") } } : {}) } }, null, 2));
  } catch (error) { console.error(error instanceof Error ? error.message : "Rhythm report failed."); process.exitCode = 1; }
}
