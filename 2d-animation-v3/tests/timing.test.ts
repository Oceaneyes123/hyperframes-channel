import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { randomUUID, createHash } from "node:crypto";
import { openTiming } from "../server/timing-store.ts";
import { openStudio } from "../server/studio.ts";
import { openDatabase, DATABASE_VERSION } from "../server/database.ts";
import { wavFixture } from "./fixtures/wav.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { planningTimingSchema, resolveBeatTiming } from "../workflow/timing.ts";
import { inspectWav } from "../server/wav.ts";
import { scheduleMotion, validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { POST } from "../app/api/projects/[id]/timing/route.ts";

test("planning timing binds script and audio before motion, preserves corrections and becomes stale after script edits", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-timing-")), directory = join(root, "db"), videos = join(root, "videos");
  const studio = openStudio(directory, videos), store = openTiming(directory, videos);
  t.after(() => { store.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Synthetic narration planning"), script = studio.saveScript(project.id, "One idea.\nTwo ideas.\nThree ideas.", null); studio.acceptScript(project.id, script.id);
  const request = { scriptId: script.id, baseId: null, timing: [{ number: 1, startFrame: 0, endFrame: 110 }, { number: 2, startFrame: 120, endFrame: 230 }, { number: 3, startFrame: 240, endFrame: 350 }], anchors: [{ id: "one", lineNumber: 1, kind: "word", text: "One", startFrame: 10, endFrame: 25, provenance: "manual" }], provenance: "manual" };
  assert.throws(() => store.import(project.id, { ...request, provenance: "verified-aligner" }, wavFixture()), /evidence/);
  const alignmentEvidence = { engine: "synthetic-aligner", version: "1", audioHash: createHash("sha256").update(wavFixture()).digest("hex"), transcriptHash: studio.acceptance(project.id)!.sha256, reviewedByHuman: true, reviewNotes: "Synthetic evidence fixture, not human production review." };
  assert.throws(() => store.import(project.id, { ...request, provenance: "verified-aligner", alignmentEvidence: { ...alignmentEvidence, audioHash: "0".repeat(64) } }, wavFixture()), /does not match/);
  const id = store.import(project.id, request, wavFixture()); const original = store.read(project.id, id)!;
  assert.equal(store.current(project.id, id), true); assert.equal(original.artifact.audioHash.length, 64);
  assert.throws(() => store.import(project.id, request, wavFixture()), /changed/);
  const child = store.import(project.id, { ...request, baseId: id, anchors: [], provenance: "verified-aligner", alignmentEvidence }, wavFixture());
  assert.deepEqual(store.read(project.id, child)!.artifact.alignmentEvidence, alignmentEvidence);
  assert.equal(store.current(project.id, id), false);
  assert.equal(store.read(project.id, child)!.artifact.parentId, id); assert.deepEqual(store.read(project.id, id), original);
  assert.throws(() => store.import(project.id, { ...request, baseId: child, anchors: [{ ...request.anchors[0], text: "Missing" }] }, wavFixture()), /Anchor/);
  assert.throws(() => store.import(project.id, { ...request, baseId: child, timing: request.timing.slice(1) }, wavFixture()), /every script line/);
  assert.equal(store.latest(project.id)!.artifact.id, child);
  studio.saveScript(project.id, "Changed\nTwo ideas.\nThree ideas.", script.id);
  assert.equal(store.latest(project.id)!.stale, true);
  writeFileSync(join(videos, project.id, "timing", `${child}.wav`), "corrupt");
  assert.throws(() => store.read(project.id, child), /integrity/);
});

test("schema 8 expansion preserves schema 7 records, retries safely and rolls back failed DDL", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-timing-migration-")); t.after(() => rmSync(root, { recursive: true, force: true }));
  const db = openDatabase(root), projectId = randomUUID();
  db.prepare("INSERT INTO projects VALUES (?, ?, ?)").run(projectId, "Preserve", new Date().toISOString());
  db.prepare("INSERT INTO production_records VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), projectId, "narration", '{"keep":"unchanged"}', "a".repeat(64), new Date().toISOString());
  const before = db.prepare("SELECT * FROM production_records").all();
  db.exec("DROP TABLE planning_timing; PRAGMA user_version = 7; CREATE TABLE planning_timing (conflict TEXT)"); db.close();
  assert.throws(() => openDatabase(root), /already exists/);
  const failed = new DatabaseSync(join(root, "studio.sqlite"));
  assert.equal(failed.prepare("PRAGMA user_version").get()?.user_version, 7); assert.deepEqual(failed.prepare("SELECT * FROM production_records").all(), before);
  failed.exec("DROP TABLE planning_timing"); failed.close();
  for (let attempt = 0; attempt < 2; attempt++) {
    const migrated = openDatabase(root); assert.equal(migrated.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION);
    assert.deepEqual(migrated.prepare("SELECT * FROM production_records").all(), before); migrated.close();
  }
});

test("measured anchors resolve with frame offsets, explicit line fallback and shot-boundary rejection", () => {
  const { plan, board } = motionBeatFixture(), schedule = scheduleMotion(plan);
  for (const shot of plan.shots) for (const beat of shot.beats!) beat.narrationAnchor = null;
  const beat = plan.shots[0].beats![0]; beat.endFrame = 22; beat.narrationAnchor = { kind: "word", lineNumber: 1, anchorId: "focus", offsetFrames: -3 };
  const timing = planningTimingSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId: board.projectId, scriptId: board.scriptId, scriptHash: "a".repeat(64), parentId: null, createdAt: new Date().toISOString(), audioHash: "b".repeat(64), provenance: "manual", measured: inspectWav(wavFixture()),
    timing: schedule.shots.map((shot, index) => ({ number: index + 1, startFrame: shot.startFrame + 5, endFrame: Math.min(shot.endFrame - 1, schedule.shots[index + 1]?.startFrame ?? shot.endFrame - 1) })),
    anchors: [{ id: "focus", lineNumber: 1, kind: "word", text: "One", startFrame: 20, endFrame: 25, provenance: "manual" }] });
  const original = structuredClone(plan), resolved = resolveBeatTiming(plan, timing);
  assert.equal(resolved.plan.shots[0].beats![0].startFrame, 17); assert.equal(resolved.plan.shots[0].beats![0].endFrame, 29);
  assert.deepEqual(resolved.warnings, []); assert.deepEqual(plan, original); validateMotion(resolved.plan, board, hashMotionSource);
  beat.narrationAnchor = { kind: "word", lineNumber: 1, anchorId: "missing" };
  const fallback = resolveBeatTiming(plan, timing); assert.equal(fallback.plan.shots[0].beats![0].startFrame, 5); assert.match(fallback.warnings[0], /using measured line/);
  beat.narrationAnchor = { kind: "line", lineNumber: 1, offsetFrames: -30 };
  assert.throws(() => resolveBeatTiming(plan, timing), /does not fit/);
});

test("timing upload rejects foreign origins and oversized bodies before opening project storage", async () => {
  const context = { params: Promise.resolve({ id: randomUUID() }) };
  const foreign = await POST(new Request("http://127.0.0.1:3003/api/projects/test/timing", { method: "POST", headers: { host: "127.0.0.1:3003", origin: "https://example.test" }, body: "{}" }), context);
  assert.equal(foreign.status, 403);
  const oversized = await POST(new Request("http://127.0.0.1:3003/api/projects/test/timing", { method: "POST", headers: { host: "127.0.0.1:3003", origin: "http://127.0.0.1:3003" }, body: new Uint8Array(17_000_001) }), context);
  assert.equal(oversized.status, 400); assert.match(await oversized.text(), /Prior inputs preserved/);
});
