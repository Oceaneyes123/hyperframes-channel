import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID, createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { creativeRules, creativeRuleSchema, creativeRulesMarkdown } from "../workflow/creative-rules.ts";
import { creativeFeedback } from "../server/creative-feedback.ts";
import { graphicsGallery } from "./fixtures/graphics-gallery.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { creativeQualityReport } from "../server/creative-quality.ts";
import { readConfig } from "../server/config.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion } from "../server/motion-store.ts";
import { generateVisuals } from "../server/visuals.ts";
import { generateMotion } from "../server/motion.ts";
import { fakeGateway } from "./fixtures/gateway.ts";
import { fixtureVisuals, boardFixture } from "./fixtures/visuals.ts";
import { fixtureMotion, motionFixture } from "./fixtures/motion.ts";
import { POST } from "../app/api/projects/[id]/creative-feedback/route.ts";
import { evaluateCreativePair, evaluateHumanReview } from "../server/creative-evaluation.ts";
import { motionArtifactSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { wavFixture } from "./fixtures/wav.ts";
import { frameActivity } from "../server/creative-frame-activity.ts";

test("sampled full-video inactivity is review evidence, not an automatic rejection", () => {
  const frames = Buffer.alloc(90 * 160 * 11);
  frames.fill(80, 90 * 160 * 8);
  assert.deepEqual(frameActivity(frames).quietIntervals, [{ startSeconds: 0, endSeconds: 3.5 }]);
  assert.equal(frameActivity(frames).requiresHumanReview, true);
  assert.throws(() => frameActivity(Buffer.alloc(5)));
});

test("canonical rule IDs, versions and generated documentation cannot diverge", () => {
  assert.equal(new Set(creativeRules.map((rule) => rule.id)).size, creativeRules.length);
  creativeRules.forEach((rule) => creativeRuleSchema.parse(rule));
  assert.equal(readFileSync("docs/AI-CREATIVE-MISTAKES.md", "utf8").replaceAll("\r\n", "\n"), creativeRulesMarkdown());
  const energy = creativeRules.find((rule) => rule.id === "CQ-ENERGY")!;
  assert.equal(energy.version, 2); assert.deepEqual(energy.stages, ["graphics", "motion"]);
  assert.match(energy.correction, /6–12-frame entrances/); assert.match(energy.evidence, /pass stillness checks/);
});

test("proposals stay inactive; confirmed regression review activates future snapshots only", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-feedback-")); t.after(() => rmSync(root, { recursive: true, force: true }));
  const store = creativeFeedback(root), project = randomUUID(), before = store.snapshot("graphics"), original = JSON.stringify(before);
  const proposal = store.propose(project, { artifactId: randomUUID(), shotIndex: 1, stage: "graphics", evidence: "Three repeated endpoint layouts in synthetic gallery.", correction: "Vary composition when the causal mechanism changes.", exceptions: "Persistent comparison.", detectorId: "geometry-repetition" }, "a".repeat(64));
  assert.deepEqual(store.snapshot("graphics"), before);
  assert.throws(() => store.decide(project, proposal.id, { decision: "activate", confirmedByHuman: false, regressionEvidence: "Reviewed synthetic gallery." }));
  assert.throws(() => store.decide(randomUUID(), proposal.id, { decision: "activate", confirmedByHuman: true, regressionEvidence: "Reviewed." }));
  assert.throws(() => store.decide(project, proposal.id, { decision: "activate", confirmedByHuman: true, regressionEvidence: "No report." }), /regression report/);
  assert.throws(() => store.recordRegression(project, proposal.id, [{ artifactId: proposal.artifactId, sourceHash: proposal.sourceHash, findings: [] }]), /did not identify/);
  const regression = store.recordRegression(project, proposal.id, [{ artifactId: proposal.artifactId, sourceHash: proposal.sourceHash, findings: ["geometry-repetition: repeated layout"] }]);
  store.decide(project, proposal.id, { decision: "activate", confirmedByHuman: true, regressionId: regression.id, regressionEvidence: "Reviewed synthetic findings and continuity exception." });
  assert.notEqual(store.snapshot("graphics").sha256, before.sha256); assert.equal(JSON.stringify(before), original);
  assert.ok(!store.snapshot("motion").rules.some((rule) => rule.id === proposal.rule.id));
  assert.throws(() => store.decide(project, proposal.id, { decision: "reject", confirmedByHuman: true, regressionEvidence: "Changed mind." }));
  assert.throws(() => store.withdraw(project, proposal.id, { confirmedByHuman: false, reason: "Too broad." }));
  const active = store.snapshot("graphics");
  const { board } = graphicsGallery(); if (board.output.kind !== "storyboard") throw new Error();
  for (const index of [1, 2]) { board.output.shots[index].endFrame = structuredClone(board.output.shots[0].endFrame); board.output.shots[index].design!.continuityReason = ""; }
  board.creativeRules = active;
  assert.ok(creativeQualityReport(board, null).issues.some((issue) => issue.ruleIds.includes(proposal.rule.id)));
  store.withdraw(project, proposal.id, { confirmedByHuman: true, reason: "Too broad for other projects." });
  assert.ok(!store.snapshot("graphics").rules.some((rule) => rule.id === proposal.rule.id));
  assert.ok(active.rules.some((rule) => rule.id === proposal.rule.id));
  assert.throws(() => store.withdraw(project, proposal.id, { confirmedByHuman: true, reason: "Already withdrawn." }));
  const file = join(root, "creative-feedback", `${proposal.id}.json`); const changed = JSON.parse(readFileSync(file, "utf8")); changed.rule.correction = "Tampered"; writeFileSync(file, JSON.stringify(changed));
  assert.throws(() => store.snapshot("graphics"), /integrity/);
});

test("geometry repetition survives changed design prose; continuity remains an explicit exception", () => {
  const { board, plan } = graphicsGallery(); if (board.output.kind !== "storyboard") throw new Error();
  for (const index of [1, 2]) { board.output.shots[index].endFrame = structuredClone(board.output.shots[0].endFrame); board.output.shots[index].design!.layout = `Prose ${index}`; board.output.shots[index].design!.continuityReason = ""; }
  assert.ok(inspectGraphics(board).findings.some((item) => item.rule === "geometry-repetition"));
  board.output.shots[2].design!.continuityReason = "Track the same mechanism.";
  assert.ok(!inspectGraphics(board).findings.some((item) => item.rule === "geometry-repetition" && item.shotIndex === 2));
  const parsed = visualArtifactSchema.parse(board); assert.equal(parsed.creativeRules, undefined);
  const report = creativeQualityReport(board, null); assert.equal(report.requiresHumanReview, true); assert.equal(report.motionId, null); assert.ok(plan.shots.length);
});

test("generation supplies stage rules, freezes their snapshots and preserves accepted sources after activation", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-quality-flow-"));
  const gateway = await fakeGateway("ok", 0, (body) => {
    if (body.messages[0].content.includes("Motion proposal contract")) return fixtureMotion(body);
    const output = fixtureVisuals(body);
    if ("shots" in output) output.shots.forEach((shot: { transition: string }, index: number) => { shot.transition = index ? "hard-cut" as typeof shot.transition : "start"; });
    return output;
  });
  const config = readConfig({ V3_DATA_DIR: join(root, "database"), V3_VIDEOS_DIR: join(root, "videos"), CLIPROXYAPI_BASE_URL: gateway.baseUrl, CLIPROXYAPI_MODEL: "fixture-model" });
  const studio = openStudio(config.dataDirectory, config.videosDirectory), visuals = openVisuals(config.dataDirectory, config.videosDirectory), motions = openMotion(config.dataDirectory, config.videosDirectory);
  t.after(async () => { motions.close(); visuals.close(); studio.close(); await gateway.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Synthetic quality regression"), script = studio.saveScript(project.id, "Start at one hundred.\nNow halve it.\nCompare the result.", null); studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts", scriptId: script.id, baseId: null, selectionId: null, shotIndex: null, instruction: "Synthetic integration fixture." };
  const concepts = await generateVisuals(project.id, request, new AbortController().signal, () => {}, config);
  const selectionId = visuals.choose(project.id, concepts, 0, null);
  const boardId = await generateVisuals(project.id, { ...request, kind: "storyboard", selectionId }, new AbortController().signal, () => {}, config);
  visuals.accept(project.id, boardId); const before = visuals.read(project.id, boardId)!;
  const motionId = await generateMotion(project.id, { storyboardId: boardId, baseId: null, shotId: null, instruction: "Synthetic fixture." }, new AbortController().signal, () => {}, config);
  const motion = motions.read(project.id, motionId)!;
  assert.equal(motion.plan.energyProfile, "intense");
  assert.equal(before.creativeRules?.stage, "graphics"); assert.equal(motion.creativeRules?.stage, "motion");
  assert.ok(before.creativeRules!.rules.some((rule) => rule.id === "CQ-ENERGY" && rule.version === 2));
  assert.ok(gateway.requests.some((request) => request.messages.some((message) => message.content.includes("Profile intense: punchy, dynamic choreography"))));
  assert.ok(gateway.requests.every((request) => request.messages[0].content.includes("creative-quality@1")));
  assert.ok(!motion.creativeRules!.rules.some((rule) => rule.id === "CQ-VOICE"));
  const feedback = creativeFeedback(config.dataDirectory), sourceHash = createHash("sha256").update(JSON.stringify(before)).digest("hex");
  const proposal = feedback.propose(project.id, { artifactId: boardId, shotIndex: 0, stage: "graphics", evidence: "Synthetic repeated layout.", correction: "Review the persistent container.", exceptions: "Intentional continuity." }, sourceHash);
  const previousData = process.env.V3_DATA_DIR, previousVideos = process.env.V3_VIDEOS_DIR;
  process.env.V3_DATA_DIR = config.dataDirectory; process.env.V3_VIDEOS_DIR = config.videosDirectory;
  t.after(() => { if (previousData === undefined) delete process.env.V3_DATA_DIR; else process.env.V3_DATA_DIR = previousData; if (previousVideos === undefined) delete process.env.V3_VIDEOS_DIR; else process.env.V3_VIDEOS_DIR = previousVideos; });
  const response = await POST(new Request(`http://127.0.0.1:3003/api/projects/${project.id}/creative-feedback`, { method: "POST", headers: { host: "127.0.0.1:3003", origin: "http://127.0.0.1:3003", "content-type": "application/json" }, body: JSON.stringify({ action: "regress", id: proposal.id, artifactIds: [boardId] }) }), { params: Promise.resolve({ id: project.id }) });
  const event = JSON.parse((await response.text()).trim()), regression = JSON.parse(event.regression);
  assert.equal(regression.examples[0].sourceHash, sourceHash); assert.equal(regression.examples[0].findings.length, inspectGraphics(before).findings.length);
  feedback.decide(project.id, proposal.id, { decision: "activate", confirmedByHuman: true, regressionId: regression.id, regressionEvidence: "Synthetic compatibility and continuity fixtures reviewed." });
  assert.deepEqual(visuals.read(project.id, boardId), before); assert.equal(visuals.acceptance(project.id)!.stale, false);
  const report = creativeQualityReport(before, motion); assert.ok(report.durationFrames! > 0); assert.equal(report.ruleSnapshots.graphics?.sha256, before.creativeRules?.sha256);
});

test("feedback route rejects foreign origin and missing explicit confirmation before storage access", async () => {
  for (const [origin, body, status] of [["https://example.test", {}, 403], ["http://127.0.0.1:3003", { action: "decide", id: randomUUID(), decision: "activate", confirmedByHuman: false, regressionEvidence: "Model says ready." }, 400]] as const) {
    const response = await POST(new Request("http://127.0.0.1:3003/api/projects/fixture/creative-feedback", { method: "POST", headers: { host: "127.0.0.1:3003", origin, "content-type": "application/json" }, body: JSON.stringify(body) }), { params: Promise.resolve({ id: randomUUID() }) });
    assert.equal(response.status, status);
  }
});

test("complete comparison enforces 50–75 seconds, identical script facts and measured audio; findings never approve release", () => {
  const output = boardFixture(); output.shots.forEach((shot, index) => { shot.transition = index ? "hard-cut" as typeof shot.transition : "start"; });
  const board = visualArtifactSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId: randomUUID(), createdAt: new Date().toISOString(), scriptId: randomUUID(), scriptHash: "a".repeat(64), selectionId: randomUUID(), baseId: null, instruction: "Synthetic comparison fixture.", output: { kind: "storyboard", ...output } });
  const plan = motionFixture(board); plan.shots.forEach((shot) => { shot.durationFrames = 600; });
  const storyboardHash = createHash("sha256").update(JSON.stringify(board, null, 2) + "\n").digest("hex");
  const motion = motionArtifactSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId: board.projectId, createdAt: new Date().toISOString(), parentId: null, source: { storyboardId: board.id, storyboardHash, scriptId: board.scriptId, scriptHash: board.scriptHash, selectionId: board.selectionId }, plan });
  const input = { board, storyboardHash: motion.source.storyboardHash, motion, narration: { id: randomUUID(), bytes: wavFixture(60) } };
  const report = evaluateCreativePair(input, { ...input, board: structuredClone(board), motion: structuredClone(motion) });
  assert.equal(report.releaseEligible, false); assert.equal(report.humanReview.listening, "pending"); assert.equal(report.baseline.durationFrames, 1800);
  assert.throws(() => evaluateCreativePair(input, { ...input, narration: { ...input.narration, bytes: wavFixture(58) } }), /match its complete timeline/);
  const changed = { ...input, board: structuredClone(board), motion: structuredClone(motion) }; changed.board.scriptHash = "b".repeat(64); changed.motion.source.scriptHash = changed.board.scriptHash; changed.motion.source.storyboardHash = hashMotionSource(changed.board); changed.storyboardHash = changed.motion.source.storyboardHash;
  assert.throws(() => evaluateCreativePair(input, changed), /identical facts/);
  const short = { ...input, motion: structuredClone(motion) }; short.motion.plan.shots.forEach((shot) => { shot.durationFrames = 120; });
  assert.throws(() => evaluateCreativePair(short, short), /50–75/);
});

test("human comparison requires explicit results without granting production approval", () => {
  const review = { reviewedByHuman: true, reviewer: "Synthetic reviewer", desktop: "pass", mobile: "pass", listening: "pass", comprehension: "pass", comparison: "improved", blinded: false, criticalIssuesOpen: false, notes: "Synthetic test record; not a real human review." };
  assert.equal(evaluateHumanReview(review).comparisonPassed, true); assert.equal(evaluateHumanReview(review).releaseEligible, false);
  assert.equal(evaluateHumanReview({ ...review, criticalIssuesOpen: true }).comparisonPassed, false);
  assert.equal(evaluateHumanReview({ ...review, mobile: "fail" }).comparisonPassed, false);
  assert.throws(() => evaluateHumanReview({ ...review, reviewedByHuman: false }));
});
