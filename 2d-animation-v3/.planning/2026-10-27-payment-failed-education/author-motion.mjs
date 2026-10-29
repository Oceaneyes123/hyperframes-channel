import { hydrateMotion, motionBeatSchema, scheduleMotion } from "../../workflow/motion.ts";
import { readConfig } from "../../server/config.ts";
import { hashMotionSource, openMotion } from "../../server/motion-store.ts";
import { openVisuals } from "../../server/visual-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const visuals = openVisuals(config.dataDirectory, config.videosDirectory);
const storyboardId = visuals.acceptance(projectId)?.runId;
const board = storyboardId ? visuals.read(projectId, storyboardId) : null;
visuals.close();
if (!board || board.output.kind !== "storyboard") throw new Error("Accepted storyboard unavailable.");

const beat = (id, type, presetId, targetIds, startFrame, endFrame, parameters, importance = "primary") =>
  motionBeatSchema.parse({ id, purpose: `Explain the approved payment state through ${presetId}.`, type, presetId, targetIds, startFrame, endFrame, parameters, importance, narrationAnchor: null, continuity: null });
const hold = (id, targetIds, startFrame, endFrame) => beat(id, "hold", "hold@1", targetIds, startFrame, endFrame, {});
const incoming = (type) => ({
  start: { type, overlapFrames: 0, presentation: "cut", anchor: null },
  camera: { type, overlapFrames: 12, presentation: "slide", anchor: null },
  reveal: { type, overlapFrames: 15, presentation: "wipe", anchor: null },
  "hard-cut": { type, overlapFrames: 0, presentation: "cut", anchor: null },
})[type];

const plans = [
  {
    durationFrames: 120,
    beats: [
      beat("hide-processing", "transformation", "mask-reveal@1", ["object-1.processing"], 8, 18, { reveal: 0 }),
      beat("show-declined", "transformation", "mask-reveal@1", ["object-1.declined"], 20, 30, { reveal: 1 }),
      beat("shorten-meter", "transformation", "snap-overshoot@1", ["object-9"], 32, 50, { to: { x: 70, width: 14 }, anticipation: .9, overshoot: 1.08 }),
      beat("move-token", "transformation", "snap-overshoot@1", ["object-10"], 52, 70, { to: { x: 73 }, anticipation: .9, overshoot: 1.08 }),
      hold("read-failure", ["object-1", "object-8", "object-9", "object-10"], 76, 118),
    ],
  },
  {
    durationFrames: 330,
    beats: [
      beat("draw-request", "transformation", "edge-draw@1", ["object-1.request"], 15, 35, {}),
      beat("draw-authorize", "transformation", "edge-draw@1", ["object-1.authorize"], 40, 60, {}),
      beat("move-token", "transformation", "snap-overshoot@1", ["object-2"], 64, 100, { to: { x: 79 }, anticipation: .9, overshoot: 1.08 }),
      beat("trace-request", "transformation", "edge-trace@1", ["object-1.request"], 105, 130, {}),
      beat("trace-authorize", "transformation", "edge-trace@1", ["object-1.authorize"], 135, 160, {}),
      beat("focus-token", "emphasis", "punch-zoom@1", ["camera"], 165, 185, { focusId: "object-2", zoom: 1.12 }, "supporting"),
      hold("read-route", ["object-1", "object-2"], 200, 240),
      beat("focus-status", "emphasis", "punch-zoom@1", ["camera"], 245, 265, { focusId: "object-3", zoom: 1.08 }, "supporting"),
      hold("read-status", ["object-1", "object-3"], 270, 328),
    ],
  },
  {
    durationFrames: 420,
    beats: [
      beat("reveal-hold", "transformation", "mask-reveal@1", ["object-1.hold"], 20, 50, { reveal: 1 }),
      beat("move-coin", "transformation", "snap-overshoot@1", ["object-2"], 55, 100, { to: { y: 61 }, anticipation: .9, overshoot: 1.08 }),
      beat("focus-bank", "emphasis", "punch-zoom@1", ["camera"], 115, 135, { focusId: "object-1", zoom: 1.12 }, "supporting"),
      hold("read-hold", ["object-1", "object-2"], 145, 240),
      beat("focus-coin", "emphasis", "punch-zoom@1", ["camera"], 250, 270, { focusId: "object-2", zoom: 1.08 }, "supporting"),
      hold("read-reservation", ["object-1", "object-2"], 280, 340),
      hold("settle-hold", ["object-1", "object-3"], 350, 418),
    ],
  },
  {
    durationFrames: 450,
    beats: [
      beat("draw-release", "transformation", "edge-draw@1", ["object-1.release-edge"], 20, 45, {}),
      beat("draw-check", "transformation", "edge-draw@1", ["object-1.check-edge"], 50, 75, {}),
      beat("draw-refund", "transformation", "edge-draw@1", ["object-1.refund-edge"], 80, 105, {}),
      beat("trace-release", "transformation", "edge-trace@1", ["object-1.release-edge"], 115, 140, {}),
      beat("trace-check", "transformation", "edge-trace@1", ["object-1.check-edge"], 145, 170, {}),
      beat("trace-refund", "transformation", "edge-trace@1", ["object-1.refund-edge"], 175, 200, {}),
      beat("focus-paths", "emphasis", "punch-zoom@1", ["camera"], 215, 235, { focusId: "object-1", zoom: 1.1 }, "supporting"),
      hold("read-paths", ["object-1", "object-2"], 245, 320),
      hold("settle-paths", ["object-1", "object-2"], 335, 448),
    ],
  },
  {
    durationFrames: 480,
    beats: [
      beat("focus-phone", "emphasis", "punch-zoom@1", ["camera"], 20, 40, { focusId: "object-1", zoom: 1.1 }, "supporting"),
      hold("read-phone", ["object-1", "object-7"], 50, 100),
      beat("focus-bank", "emphasis", "punch-zoom@1", ["camera"], 110, 130, { focusId: "object-2", zoom: 1.1 }, "supporting"),
      hold("read-bank", ["object-2", "object-7"], 140, 200),
      beat("highlight-contact", "transformation", "snap-overshoot@1", ["object-8", "object-9", "object-10"], 210, 240, { to: { color: "#D9633F" }, anticipation: .9, overshoot: 1.08 }),
      beat("focus-record", "emphasis", "punch-zoom@1", ["camera"], 250, 270, { focusId: "object-3", zoom: 1.1 }, "supporting"),
      hold("read-record", ["object-3", "object-7"], 280, 340),
      beat("focus-contact", "emphasis", "punch-zoom@1", ["camera"], 350, 370, { focusId: "object-8", zoom: 1.08 }, "supporting"),
      hold("settle-action", ["object-8", "object-9", "object-10", "object-7"], 380, 478),
    ],
  },
];

const generated = {
  shots: board.output.shots.map((shot, index) => ({
    durationFrames: plans[index].durationFrames,
    camera: { x: 0, y: 0, scale: 1, rotation: 0 },
    incoming: incoming(shot.transition),
    objects: shot.startFrame.shapes.map((_, shapeIndex) => ({
      id: `object-${shapeIndex + 1}`,
      startIndex: shapeIndex,
      endIndex: shapeIndex,
    })),
    beats: plans[index].beats,
  })),
};
const plan = hydrateMotion(generated, board, hashMotionSource, undefined, "3", "balanced");
console.log(`DURATION_FRAMES=${scheduleMotion(plan).durationFrames}`);

const motion = openMotion(config.dataDirectory, config.videosDirectory);
try {
  const request = {
    storyboardId: board.id,
    baseId: null,
    shotId: null,
    instruction: "Codex-authored motion fallback while the visual gateway is cooling down. Use only approved actors and endpoint states.",
    interpreterVersion: "3",
    energyProfile: "balanced",
  };
  const id = motion.begin(projectId, request, "codex-authored");
  console.log(`MOTION_RUN=${id}`);
  const complete = motion.complete(projectId, id, plan);
  console.log(`MOTION_ID=${complete}`);
} finally {
  motion.close();
}
