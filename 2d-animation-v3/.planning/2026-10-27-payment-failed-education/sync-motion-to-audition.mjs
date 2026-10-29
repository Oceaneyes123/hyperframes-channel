import { readFileSync } from "node:fs";
import { motionPlanSchema, scheduleMotion } from "../../workflow/motion.ts";
import { readConfig } from "../../server/config.ts";
import { openMotion } from "../../server/motion-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const manifest = JSON.parse(readFileSync("output/playwright/payment-failed-narration-review/manifest.json", "utf8"));
const boundaries = manifest.segments.map((segment) => segment.endFrame);
const overlaps = [0, 12, 0, 15, 0];
const durations = manifest.segments.map((segment, index) => segment.endFrame - segment.startFrame + (overlaps[index + 1] ?? 0));
const scheduledFrames = durations.reduce((sum, duration) => sum + duration, 0) - overlaps.reduce((sum, overlap) => sum + overlap, 0);
if (scheduledFrames !== boundaries.at(-1)) throw new Error("Measured timing arithmetic does not match the full narration duration.");

const motion = openMotion(config.dataDirectory, config.videosDirectory);
try {
  const baseId = motion.latest(projectId);
  const base = baseId ? motion.read(projectId, baseId) : null;
  if (!base || base.plan.shots.length !== durations.length) throw new Error("Base motion unavailable.");
  const plan = motionPlanSchema.parse({
    ...base.plan,
    shots: base.plan.shots.map((shot, index) => {
      const factor = durations[index] / shot.durationFrames;
      return {
        ...shot,
        durationFrames: durations[index],
        beats: shot.beats?.map((beat) => ({
          ...beat,
          startFrame: Math.min(durations[index] - 2, Math.round(beat.startFrame * factor)),
          endFrame: Math.min(durations[index] - 1, Math.round(beat.endFrame * factor)),
        })),
      };
    }),
  });
  const request = {
    storyboardId: base.source.storyboardId,
    baseId: base.id,
    shotId: null,
    instruction: "Codex-authored measured-duration revision for the unapproved local Qwen audition. Preserve every approved endpoint and action meaning.",
    interpreterVersion: "3",
    energyProfile: "balanced",
  };
  const id = motion.begin(projectId, request, "codex-authored");
  const complete = motion.complete(projectId, id, plan);
  console.log(`MOTION_ID=${complete}`);
  console.log(`DURATION_FRAMES=${scheduleMotion(plan).durationFrames}`);
  console.log(`LINE_BOUNDARIES=${boundaries.join(",")}`);
} finally {
  motion.close();
}
