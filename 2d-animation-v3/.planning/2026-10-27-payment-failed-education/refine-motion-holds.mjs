import { motionBeatSchema } from "../../workflow/motion.ts";
import { readConfig } from "../../server/config.ts";
import { openMotion } from "../../server/motion-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const motion = openMotion(config.dataDirectory, config.videosDirectory);
const beat = (id, type, presetId, targetIds, startFrame, endFrame, parameters, importance = "primary") =>
  motionBeatSchema.parse({ id, purpose: "Keep the measured passage visually active while preserving the approved endpoint.", type, presetId, targetIds, startFrame, endFrame, parameters, importance, narrationAnchor: null, continuity: null });
try {
  let baseId = motion.latest(projectId);
  const base = baseId ? motion.read(projectId, baseId) : null;
  if (!base) throw new Error("Motion proposal unavailable.");

  const shot4 = structuredClone(base.plan.shots.find((shot) => shot.id === "shot-4"));
  if (!shot4?.beats) throw new Error("Shot 4 beats unavailable.");
  shot4.beats = shot4.beats.filter((item) => item.id !== "settle-paths").concat([
    { ...shot4.beats.find((item) => item.id === "settle-paths"), id: "settle-paths-a", startFrame: 412, endFrame: 466 },
    beat("focus-final-paths", "emphasis", "punch-zoom@1", ["camera"], 474, 496, { focusId: "object-1", zoom: 1.06 }, "supporting"),
    { ...shot4.beats.find((item) => item.id === "settle-paths"), id: "settle-paths-b", startFrame: 505, endFrame: 552 },
  ]).sort((a, b) => a.startFrame - b.startFrame);
  let id = motion.begin(projectId, {
    storyboardId: base.source.storyboardId, baseId, shotId: "shot-4",
    instruction: "Refine only shot 4 for measured pacing. Split the long final hold with one brief camera emphasis and preserve every approved endpoint.",
    interpreterVersion: "3", energyProfile: "balanced",
  }, "codex-authored");
  baseId = motion.complete(projectId, id, shot4);
  console.log(`REFINED_SHOT_4=${baseId}`);

  const revised = motion.read(projectId, baseId);
  const shot5 = structuredClone(revised.plan.shots.find((shot) => shot.id === "shot-5"));
  if (!shot5?.beats) throw new Error("Shot 5 beats unavailable.");
  shot5.beats = shot5.beats.filter((item) => item.id !== "settle-action").concat([
    { ...shot5.beats.find((item) => item.id === "settle-action"), id: "settle-action-a", startFrame: 534, endFrame: 596 },
    beat("focus-record-close", "emphasis", "punch-zoom@1", ["camera"], 604, 624, { focusId: "object-3", zoom: 1.06 }, "supporting"),
    { ...shot5.beats.find((item) => item.id === "settle-action"), id: "settle-action-b", startFrame: 634, endFrame: 671 },
  ]).sort((a, b) => a.startFrame - b.startFrame);
  id = motion.begin(projectId, {
    storyboardId: revised.source.storyboardId, baseId, shotId: "shot-5",
    instruction: "Refine only shot 5 for measured pacing. Split the long final hold with one brief record emphasis and preserve every approved endpoint.",
    interpreterVersion: "3", energyProfile: "balanced",
  }, "codex-authored");
  const complete = motion.complete(projectId, id, shot5);
  console.log(`REFINED_SHOT_5=${complete}`);
} finally {
  motion.close();
}
