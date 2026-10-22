import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion, hashMotionSource } from "../server/motion-store.ts";
import { openProduction } from "../server/production-store.ts";
import { readConfig } from "../server/config.ts";
import { renderProduction } from "../server/render.ts";
import { motionWorkflowFixture } from "../tests/fixtures/motion-workflow.ts";
import { conceptFixture } from "../tests/fixtures/visuals.ts";
import { wavFixture } from "../tests/fixtures/wav.ts";
import { scheduleMotion } from "../workflow/motion.ts";

const root = resolve(`.data/production-proof-${randomUUID()}`); mkdirSync(root, { recursive: false });
const config = readConfig({ V3_DATA_DIR: join(root, "database"), V3_VIDEOS_DIR: join(root, "videos") });
const studio = openStudio(config.dataDirectory, config.videosDirectory), visuals = openVisuals(config.dataDirectory, config.videosDirectory), motion = openMotion(config.dataDirectory, config.videosDirectory), production = openProduction(config.dataDirectory, config.videosDirectory);
let projectId;
try {
  const fixture = motionWorkflowFixture(); const project = studio.createProject("SYNTHETIC ONLY — production worker verification"); projectId = project.id;
  const script = studio.saveScript(project.id, Array.from({ length: 7 }, (_, i) => `Synthetic line ${i + 1}.`).join("\n"), null); studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts", scriptId: script.id, baseId: null, selectionId: null, shotIndex: null, instruction: "Synthetic diagnostics only" };
  const concept = visuals.begin(project.id, request, "fixture-model"); visuals.complete(project.id, concept, conceptFixture); const selectionId = visuals.choose(project.id, concept, 0, null);
  const boardId = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture-model"); visuals.complete(project.id, boardId, { shots: fixture.board.output.shots }); visuals.accept(project.id, boardId);
  fixture.plan.shots.forEach((shot, index) => { shot.sourceHash = hashMotionSource(fixture.board.output.shots[index]); });
  const motionId = motion.begin(project.id, { storyboardId: boardId, baseId: null, shotId: null, instruction: "Synthetic diagnostics only" }); motion.complete(project.id, motionId, fixture.plan); motion.decide(project.id, motionId, "accept");
  const schedule = scheduleMotion(fixture.plan), voice = wavFixture(schedule.durationFrames / 30);
  const timing = schedule.shots.map((shot, i) => ({ number: i + 1, startFrame: shot.startFrame + 1, endFrame: schedule.shots[i + 1]?.startFrame ?? shot.endFrame - 1 }));
  production.importNarration(project.id, motionId, voice, timing); const status = production.status(project.id);
  const review = { binding: status.binding, reviewed: true, notes: "Automated synthetic gate fixture. This is not human approval of real media." };
  production.approve(project.id, { ...review, gate: "gate1" }); production.approve(project.id, { ...review, gate: "gate2" });
  const jobId = await renderProduction(project.id, status.binding, true, new AbortController().signal, config);
  const receipt = production.exportRecord(project.id, jobId); assert.ok(receipt);
  const frames = join(config.videosDirectory, project.id, "production", jobId, "frames");
  assert.ok(readFileSync(join(frames, "element-000.png")).equals(readFileSync(join(frames, "element-001.png"))), "Settled opening must be visible identically at frames 0 and 1");
  writeFileSync(join(root, "verification.json"), JSON.stringify({ syntheticOnly: true, realProductionApproval: false, projectId, jobId, root, receipt }, null, 2) + "\n");
  console.log(JSON.stringify({ root, projectId, jobId, verification: receipt.payload.verification }));
} finally { production.close(); motion.close(); visuals.close(); studio.close(); }
