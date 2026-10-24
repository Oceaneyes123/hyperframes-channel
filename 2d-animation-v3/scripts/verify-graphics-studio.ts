import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { readConfig } from "../server/config.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion, hashMotionSource } from "../server/motion-store.ts";
import { hydrateMotion } from "../workflow/motion.ts";
import { graphicsGallery, galleryNarration } from "../tests/fixtures/graphics-gallery.ts";
import { conceptFixture, boardFixture } from "../tests/fixtures/visuals.ts";
import { reviewGraphicShot } from "../server/graphic-review.ts";
import { generateVisuals } from "../server/visuals.ts";

const root = resolve(process.argv[2] ?? `.data/graphics-studio-proof-${Date.now()}`);
mkdirSync(root, { recursive: false });
const config = { ...readConfig(), dataDirectory: join(root, "database"), videosDirectory: join(root, "videos") };
const studio = openStudio(config.dataDirectory, config.videosDirectory), visuals = openVisuals(config.dataDirectory, config.videosDirectory), motions = openMotion(config.dataDirectory, config.videosDirectory);
try {
  const project = studio.createProject("Synthetic graphics overhaul review — not human approved"), script = studio.saveScript(project.id, galleryNarration.join("\n"), null);
  studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts" as const, scriptId: script.id, selectionId: null, baseId: null, shotIndex: null, instruction: "Synthetic integration test; no human approval." };
  const concepts = visuals.begin(project.id, request, "fixture"); visuals.complete(project.id, concepts, conceptFixture);
  const selectionId = visuals.choose(project.id, concepts, 0, null), boardRequest = { ...request, kind: "storyboard" as const, selectionId };
  const before = visuals.begin(project.id, boardRequest, "fixture"), old = boardFixture(Array.from({ length: 8 }, (_, i) => i + 1));
  const oldOutput = { shots: old.shots.map((shot, i) => ({ ...shot, transition: i ? "hard-cut" : "start" })) }; visuals.complete(project.id, before, oldOutput);
  const source = graphicsGallery(), boardId = visuals.begin(project.id, { ...boardRequest, baseId: before }, "fixture"); visuals.complete(project.id, boardId, source.board.output);
  visuals.accept(project.id, boardId);
  const board = visuals.read(project.id, boardId)!;
  const generated = { shots: source.plan.shots.map(({ durationFrames, incoming, camera, beats, objects }) => ({ durationFrames, incoming, camera, beats, objects: objects.map(({ id, startIndex, endIndex }) => ({ id, startIndex, endIndex })) })) };
  const plan = hydrateMotion(generated, board, hashMotionSource, undefined, "3"), motionId = motions.begin(project.id, { storyboardId: boardId, baseId: null, shotId: null, instruction: "Synthetic fixture, not human production approval.", interpreterVersion: "3" });
  motions.complete(project.id, motionId, plan);
  const receipt = { syntheticOnly: true, humanApproval: false, root, projectId: project.id, boardId, before, motionId, scriptId: script.id,
    url: `http://[::1]:3003/projects/${project.id}/visuals?run=${boardId}&motion=${motionId}` };
  writeFileSync(join(root, "studio.json"), JSON.stringify(receipt, null, 2)); console.log(JSON.stringify(receipt));
  if (process.argv.includes("--live")) {
    const report = await reviewGraphicShot(project.id, { runId: boardId, shotIndex: 1 }, new AbortController().signal, (message) => console.log(message), config);
    assert.equal(visuals.latest(project.id, "storyboard"), boardId); assert.equal(visuals.acceptance(project.id)!.runId, boardId);
    writeFileSync(join(root, "live-review.json"), JSON.stringify(report, null, 2));
    const beforeBytes = readFileSync(join(config.videosDirectory, project.id, "visuals", `${boardId}.json`));
    const revisionId = await generateVisuals(project.id, { ...boardRequest, kind: "shot", baseId: boardId, shotIndex: 1, instruction: "Revise only shot 2. Keep the exact semantic graph and all shapes, their coordinates and part states unchanged. Keep the environment unchanged. Add design metadata explaining the service focal point and refine only the action prose to explain request then storage. Do not change narration references." }, new AbortController().signal, (message) => console.log(message), config);
    const revised = visuals.read(project.id, revisionId)!;
    assert.equal(revised.output.kind, "storyboard");
    if (revised.output.kind !== "storyboard" || board.output.kind !== "storyboard") throw new Error();
    for (let i = 0; i < 8; i++) if (i !== 1) assert.deepEqual(revised.output.shots[i], board.output.shots[i]);
    assert.deepEqual(readFileSync(join(config.videosDirectory, project.id, "visuals", `${boardId}.json`)), beforeBytes);
    assert.equal(visuals.acceptance(project.id)!.stale, true); assert.equal(visuals.acceptance(project.id)!.runId, boardId);
    writeFileSync(join(root, "live-verification.json"), JSON.stringify({ syntheticOnly: true, humanApproval: false, reportId: report.id, revisionId, otherShotsPreserved: true, originalBytesPreserved: true, newRevisionAccepted: false }, null, 2));
    console.log("Live image review and focused model revision passed; revision remains unaccepted.");
  }
} finally { motions.close(); visuals.close(); studio.close(); }
