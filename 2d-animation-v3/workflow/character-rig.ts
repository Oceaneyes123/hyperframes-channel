import { z } from "zod";
import { vectorLibrary } from "./graphic-library.ts";
import type { VectorNode } from "./vector-assets.ts";

const owner = vectorLibrary["salon-working-studio@1"], group = owner?.asset.layers.find((layer) => layer.id === "owner")?.nodes[0];
if (group?.kind !== "group") throw new Error("Original owner artwork changed.");
const source = group.children;
const body: VectorNode = { kind: "path", d: "M60 236Q119 217 178 236L183 365H55Z", fill: "accent", stroke: "ink", strokeWidth: 3, opacity: 1 };

export const characterRig = {
  id: "owner-cutout@1", width: 460, height: 600, license: "CC0-1.0",
  attribution: "Original HyperFrames business owner, adapted from this project's original salon illustration.",
  sourceAsset: { id: owner.asset.id, contentHash: owner.contentHash },
  offset: [60, 100] as const, torsoPivot: [119, 350] as const, headPivot: [119, 203] as const,
  shoulders: { left: [64, 244] as const, right: [174, 244] as const },
  upperLength: 90, lowerLength: 84,
  restHands: { left: [45, 360] as const, right: [193, 360] as const },
  keys: { left: [114, 360] as const, right: [194, 360] as const },
  point: { wrist: [222, 322] as const, target: [204, 302] as const },
  document: { from: [280, 315] as const, to: [325, 275] as const, width: 50, height: 65, grip: [5, 35] as const },
  artwork: { body: [body, source[16], source[17], source[2]], head: [3, 4, 5, 6, 7, 8, 12, 14, 15].map((i) => source[i]) },
  poses: ["neutral", "look", "concern", "point-laptop", "type-laptop", "carry-document"] as const,
};
export const characterRigHash = "af653ca61f3613ccd7b8571a85233a2e6836d1b60ae202926fd47a649e50f3c3";
// shortcut: one reviewed rig/prop route; new anatomy or targets require a new rig version.
export const rigReferenceSchema = z.strictObject({ id: z.literal("owner-cutout@1"), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).refine((reference) => reference.contentHash === characterRigHash, "Unknown or changed character rig.");
export type RigReference = z.infer<typeof rigReferenceSchema>;
export const characterPresets = ["character-look@1", "character-react@1", "character-point@1", "character-type@1", "character-hand-off@1"] as const;
export type CharacterPreset = typeof characterPresets[number];
export function isCharacterPreset(id: string): id is CharacterPreset { return characterPresets.some((preset) => preset === id); }
export type CharacterCue = { presetId: CharacterPreset; startFrame: number; endFrame: number; direction?: "left" | "right" };
type Point = readonly [number, number];
const mix = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const smooth = (p: number) => { const t = Math.min(1, Math.max(0, p)); return t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2; };

export function solveArm(shoulder: Point, hand: Point, side: "left" | "right") {
  const dx = hand[0] - shoulder[0], dy = hand[1] - shoulder[1], distance = Math.hypot(dx, dy), { upperLength: a, lowerLength: b } = characterRig;
  if (distance >= a + b || distance <= Math.abs(a - b)) throw new Error("Character hand target is outside the reviewed joint reach.");
  const upper = Math.atan2(dy, dx) + (side === "left" ? 1 : -1) * Math.acos((a * a + distance * distance - b * b) / (2 * a * distance));
  const elbow: Point = [shoulder[0] + a * Math.cos(upper), shoulder[1] + a * Math.sin(upper)];
  const lower = Math.atan2(hand[1] - elbow[1], hand[0] - elbow[0]);
  return { shoulder, elbow, hand, upper: upper * 180 / Math.PI, lower: (lower - upper) * 180 / Math.PI };
}

function inverseTorso(point: Point, degrees: number, lift: number): Point {
  const [x, y] = characterRig.torsoPivot, angle = -degrees * Math.PI / 180, dx = point[0] - x, dy = point[1] - lift - y;
  return [x + dx * Math.cos(angle) - dy * Math.sin(angle), y + dx * Math.sin(angle) + dy * Math.cos(angle)];
}

export function characterPose(cues: CharacterCue[], frame: number, documentProgress: number) {
  if (!Number.isFinite(frame) || !Number.isFinite(documentProgress) || documentProgress < 0 || documentProgress > 1) throw new Error("Invalid character frame or document progress.");
  const cue = cues.find((cue) => frame >= cue.startFrame && frame <= cue.endFrame);
  const t = cue ? (frame - cue.startFrame) / (cue.endFrame - cue.startFrame) : 0;
  const envelope = smooth(Math.min(t / .25, (1 - t) / .25));
  let left: Point = characterRig.restHands.left, right: Point = characterRig.restHands.right;
  let lean = 0, lift = 0, head = 0, gaze = 0, concern = 0, typing = 0, pointing = 0, notify = 0;
  if (cue?.presetId === "character-look@1") { const direction = cue.direction === "left" ? -1 : 1; head = direction * 7 * envelope; gaze = direction * 6 * envelope; }
  if (cue?.presetId === "character-react@1") { lean = -3 * envelope; lift = -3 * envelope; head = -5 * envelope; concern = envelope; notify = envelope; }
  if (cue?.presetId === "character-point@1") { right = mix(right, characterRig.point.wrist, envelope); head = 4 * envelope; gaze = 5 * envelope; pointing = envelope; }
  if (cue?.presetId === "character-type@1") {
    left = mix(left, characterRig.keys.left, envelope); right = mix(right, characterRig.keys.right, envelope); lean = 2 * envelope; head = 3 * envelope;
    typing = t >= .25 && t <= .75 ? Math.sin((t - .25) * 16 * Math.PI) * 3 : 0;
    left = [left[0], left[1] + typing]; right = [right[0], right[1] - typing];
  }
  if (cue?.presetId === "character-hand-off@1") {
    const paper = characterRig.document, pickup: Point = [paper.from[0] + paper.grip[0], paper.from[1] + paper.grip[1]], destination: Point = [paper.to[0] + paper.grip[0], paper.to[1] + paper.grip[1]];
    right = t < .25 ? mix(right, pickup, smooth(t / .25)) : t < .8 ? mix(pickup, destination, documentProgress) : mix(destination, right, smooth((t - .8) / .2));
    lean = 3 * envelope; head = 6 * envelope; gaze = 5 * envelope;
  }
  const blink = cue && t > .42 && t < .5 ? 1 - .9 * Math.sin((t - .42) / .08 * Math.PI) : 1;
  return { action: cue?.presetId ?? "neutral", lean, lift, head, gaze, concern, blink, typing, pointing, notify,
    left: solveArm(characterRig.shoulders.left, inverseTorso(left, lean, lift), "left"),
    right: solveArm(characterRig.shoulders.right, inverseTorso(right, lean, lift), "right"),
    document: mix(characterRig.document.from, characterRig.document.to, documentProgress),
  };
}

export const characterMotionGuidance = JSON.stringify({rig:{id:characterRig.id,contentHash:characterRigHash}}) + " character-rig@1 uses only the exact registered rig reference above. Parts body and document need rigProgress:0 and handoffProgress:0|1 respectively; laptop is a registered prop. All internal geometry stays fixed; transform the root instead. Five presets target body: character-look@1 {direction:left|right}, character-react@1 {trigger:new-inquiry}, character-point@1 {prop:laptop}, character-type@1 {prop:laptop}, character-hand-off@1 {from:desk,to:review-tray}. Each returns to the exact neutral body pose; only hand-off moves the same document to its reviewed tray. Keep all parts visible and unmasked. Use 48..120 frames per action, a hold afterward, and no overlapping rig actions. Hand-off requires document handoffProgress:0 initially and 1 finally and supports only this reviewed prop route. Actions are explanatory animation, never an external action or human approval. Choose a meaningful cue from narration, not random facial motion.";
