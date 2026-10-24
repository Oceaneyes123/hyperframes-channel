import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { motionPlanSchema, motionBeatSchema, validateMotion, type MotionBeat } from "../workflow/motion.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";
import { verifyExport, verifyAudioSync } from "../server/render.ts";

// This isolated comparison never writes production storage or grants acceptance.
const frozen = JSON.parse(readFileSync("docs/motion-graphics/baseline/manifest.json", "utf8"));
const board = visualArtifactSchema.parse(frozen.storyboard), baseline = motionPlanSchema.parse(frozen.motion.plan);
assert.equal(board.output.kind, "storyboard");
if (board.output.kind !== "storyboard") throw new Error("Comparison requires the frozen storyboard.");
board.id = randomUUID(); board.output.shots = board.output.shots.slice(0, 1);
board.instruction = "Read-only first-shot excerpt for motion comparison; no new storyboard acceptance.";
baseline.shots = baseline.shots.slice(0, 1);
const candidate = structuredClone(baseline); candidate.interpreterVersion = "3";
const shot = candidate.shots[0], originalActions = structuredClone(shot.actions), all = shot.objects.map((object) => object.id);
const beats: MotionBeat[] = [];
const add = (startFrame: number, endFrame: number, targetIds: string[], purpose: string, options: object) => {
  beats.push(motionBeatSchema.parse({ id: `beat-${beats.length + 1}`, startFrame, endFrame, targetIds, purpose, type: "emphasis", importance: "primary", narrationAnchor: null, continuity: null, ...options }));
};
const hold = (start: number, end: number) => add(start, end, all, "Read the established complaint or selected result.", { type: "hold", presetId: "hold@1", parameters: {} });
const snap = (start: number, end: number, ids: string[], to: object, purpose: string) => add(start, end, ids, purpose, { presetId: "snap-overshoot@1", parameters: { to, anticipation: .92, overshoot: 1.08 } });
for (const id of ["object-2", "object-3", "object-4", "object-5", "object-6", "object-7", "object-8", "object-9", "object-10"]) assert.ok(shot.objects.some((object) => object.id === id), `Frozen comparison mapping changed: ${id}`);
hold(0, 12);
snap(12, 30, ["object-3"], {}, "Establish the Reddit/search surface while the opening introduces software ideas.");
snap(60, 78, ["object-5", "object-7", "object-9"], {}, "Introduce the second complaint with a separate emphasis.");
hold(78, 148);
snap(148, 154, ["object-2"], { opacity: 0 }, "Retire the earlier complaint label before introducing the next.");
snap(154, 160, ["object-10"], { opacity: 1 }, "Reveal the next complaint label without overlapping text.");
snap(148, 172, ["object-5", "object-7", "object-9"], { opacity: 0 }, "Remove one candidate when the narration rejects most ideas.");
for (const id of ["object-4", "object-6", "object-8"]) {
  const object = shot.objects.find((object) => object.id === id)!;
  snap(148, 172, [id], { x: object.initial.x + 16 }, "Keep one candidate and bring it toward the center.");
}
hold(174, 256);
for (const action of originalActions.filter((action) => action.behavior === "transform")) {
  snap(256, 278, action.targetIds, { ...action.to, opacity: 1 }, "Open the community options and settle into the approved final layout.");
}
add(278, 294, ["camera"], "Focus the search/browser surface as the narration introduces a working community.", { presetId: "punch-zoom@1", parameters: { focusId: "object-3", zoom: 1.08 } });
hold(294, shot.durationFrames - 1);
shot.actions = []; shot.beats = beats.sort((a, b) => a.startFrame - b.startFrame);
validateMotion(baseline, board, hashMotionSource); validateMotion(candidate, board, hashMotionSource);
assert.deepEqual(candidate.shots[0].objects, baseline.shots[0].objects);
const endFrame = frozen.narration.timing.find((line: { number: number }) => line.number === 7)?.startFrame;
assert.equal(endFrame, 488, "Re-select the measured complete-line comparison if frozen timing changes.");
const voice = readFileSync(frozen.narration.path);
assert.equal(createHash("sha256").update(voice).digest("hex"), frozen.narration.audioHash);
const output = resolve(`.data/motion-comparison-${randomUUID()}`); mkdirSync(output, { recursive: false });
writeFileSync(join(output, "inputs.json"), JSON.stringify({ board, baseline, candidate, startFrame: 0, endFrame, audioHash: frozen.narration.audioHash, note: "488 frames selects complete opening lines; supersedes the initial 600-frame selection to avoid cutting the next phrase. Same source drawing, narration and facts. No acceptance inferred." }, null, 2) + "\n");
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveUrl = await bundle({ entryPoint: resolve("engine/register.tsx") });
const results = [];
for (const [name, plan] of [["A", baseline], ["B", candidate]] as const) {
  const inputProps = { plan, board, narrationUrl: `data:audio/wav;base64,${voice.toString("base64")}` };
  const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable });
  const video = join(output, `${name}.mp4`);
  await renderMedia({ serveUrl, composition, inputProps, browserExecutable, frameRange: [0, endFrame - 1], codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: video });
  results.push({ variant: name, metadata: await verifyExport(video, endFrame), audioSync: await verifyAudioSync(frozen.narration.path, video) });
}
writeFileSync(join(output, "verification.json"), JSON.stringify({ reviewOnly: true, syntheticOnly: false, engineHash: hashEngine(), factsAndNarrationUnchanged: true, results, independentCreativeReview: "pending", productionApproval: false }, null, 2) + "\n");
console.log(`A/B comparison ready for creative review: ${output}`);
