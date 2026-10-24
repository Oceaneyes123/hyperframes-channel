import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { test, type TestContext } from "node:test";
import { openDatabase, DATABASE_VERSION } from "../server/database.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion, hashMotionSource } from "../server/motion-store.ts";
import { scheduleMotion, validateMotion } from "../workflow/motion.ts";
import { conceptFixture, boardFixture } from "./fixtures/visuals.ts";
import { motionFixture } from "./fixtures/motion.ts";
import { fixtureMotion, fixtureBeatMotion } from "./fixtures/motion.ts";
import { fakeGateway } from "./fixtures/gateway.ts";
import { generateMotion } from "../server/motion.ts";
import { readConfig } from "../server/config.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { openTiming } from "../server/timing-store.ts";
import { wavFixture } from "./fixtures/wav.ts";

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "v3-motion-")); const directory = join(root, "database"), videos = join(root, "videos");
  const studio = openStudio(directory, videos); const visuals = openVisuals(directory, videos); const store = openMotion(directory, videos);
  t.after(() => { store.close(); visuals.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Synthetic motion fixture"); const script = studio.saveScript(project.id, "One\nTwo\nThree", null); studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts", scriptId: script.id, selectionId: null, baseId: null, shotIndex: null, instruction: "" };
  const concepts = visuals.begin(project.id, request, "fixture"); visuals.complete(project.id, concepts, conceptFixture);
  const selectionId = visuals.choose(project.id, concepts, 0, null);
  const boardId = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture");
  const drawing = boardFixture(); drawing.shots.forEach((shot, i) => { if (i) shot.transition = "hard-cut" as typeof shot.transition; });
  visuals.complete(project.id, boardId, drawing); const board = visuals.read(project.id, boardId)!; const plan = motionFixture(board);
  const input = { storyboardId: boardId, baseId: null, shotId: null, instruction: "" };
  function save() { visuals.accept(project.id, boardId); const id = store.begin(project.id, input); store.complete(project.id, id, plan); return id; }
  return { root, directory, videos, studio, visuals, store, project, script, concepts, selectionId, boardId, board, plan, input, save };
}

test("manual beat proposals persist immutably and scoped edits retain interpreter 3", (t) => {
  const f = fixture(t); f.visuals.accept(f.project.id, f.boardId);
  const plan = structuredClone(f.plan); plan.interpreterVersion = "3";
  const beats = motionBeatFixture().plan.shots[0].beats!;
  for (const shot of plan.shots) {
    shot.beats = structuredClone(beats); shot.beats[0].narrationAnchor = null; shot.beats[1].narrationAnchor = null;
    shot.beats[0].endFrame = 80; shot.beats[1].startFrame = 82; shot.beats[1].endFrame = 118;
    shot.actions = [];
  }
  const id = f.store.begin(f.project.id, f.input); f.store.complete(f.project.id, id, plan); f.store.decide(f.project.id, id, "accept");
  const original = f.store.read(f.project.id, id)!;
  const request = { ...f.input, baseId: id, shotId: original.plan.shots[1].id };
  const proposalId = f.store.begin(f.project.id, request); const shot = structuredClone(original.plan.shots[1]);
  const beat = shot.beats![0]; if (beat.presetId === "snap-overshoot@1") beat.parameters.overshoot = 1.08;
  f.store.complete(f.project.id, proposalId, shot);
  const proposed = f.store.read(f.project.id, proposalId)!;
  assert.equal(proposed.plan.interpreterVersion, "3");
  assert.deepEqual(proposed.plan.shots[0], original.plan.shots[0]);
  assert.deepEqual(proposed.plan.shots[2], original.plan.shots[2]);
  assert.deepEqual(f.store.read(f.project.id, id), original);
  f.store.decide(f.project.id, proposalId, "reject");
  assert.equal(f.store.acceptance(f.project.id)?.runId, id);
});

test("beat gateway uses measured timing and energy, preserves scoped shots and invalidates acceptance after timing corrections", async (t) => {
  const f = fixture(t); f.visuals.accept(f.project.id, f.boardId);
  const timing = openTiming(f.directory, f.videos);
  try {
    const input = { scriptId: f.script.id, baseId: null, provenance: "manual", anchors: [], timing: [{ number: 1, startFrame: 0, endFrame: 110 }, { number: 2, startFrame: 120, endFrame: 230 }, { number: 3, startFrame: 240, endFrame: 350 }] };
    const timingId = timing.import(f.project.id, input, wavFixture());
    const gateway = await fakeGateway("writing", 0, (body) => {
      const context = JSON.parse(body.messages.at(-1)!.content);
      assert.equal(context.interpreterVersion, "3"); assert.equal(context.energyProfile, "calm"); assert.equal(context.timing.id, timingId);
      assert.match(body.messages.map((message) => message.content).join("\n"), /never blanket speed multipliers/);
      return fixtureBeatMotion(body);
    }); t.after(() => gateway.close());
    const config = readConfig({ V3_DATA_DIR: f.directory, V3_VIDEOS_DIR: f.videos }); config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model", apiKey: undefined };
    const request = { ...f.input, interpreterVersion: "3", energyProfile: "calm" };
    const id = await generateMotion(f.project.id, request, new AbortController().signal, () => {}, config); const original = f.store.read(f.project.id, id)!;
    assert.equal(original.source.timingId, timingId); assert.equal(original.plan.energyProfile, "calm"); f.store.decide(f.project.id, id, "accept");
    const scoped = { ...request, baseId: id, shotId: original.plan.shots[1].id };
    const child = await generateMotion(f.project.id, scoped, new AbortController().signal, () => {}, config), candidate = f.store.read(f.project.id, child)!;
    assert.deepEqual(candidate.plan.shots[0], original.plan.shots[0]); assert.deepEqual(candidate.plan.shots[2], original.plan.shots[2]);
    assert.equal(candidate.plan.interpreterVersion, "3"); f.store.decide(f.project.id, child, "reject");
    timing.import(f.project.id, { ...input, baseId: timingId }, wavFixture());
    assert.equal(f.store.acceptance(f.project.id)!.stale, true); assert.deepEqual(f.store.read(f.project.id, id), original);
    await assert.rejects(generateMotion(f.project.id, scoped, new AbortController().signal, () => {}, config));
  } finally { timing.close(); }
});

test("motion gateway hydrates full proposals, scopes revisions and preserves acceptance on failure", async (t) => {
  const f = fixture(t); f.visuals.accept(f.project.id, f.boardId);
  let guidanceRequests = 0;
  const gateway = await fakeGateway("writing", 0, (body) => {
    const guidance = body.messages.slice(0, -1).map((message) => message.content).join("\n");
    assert.match(guidance, /Default to no on-canvas text/);
    assert.match(guidance, /native, seek-safe action sequences/);
    guidanceRequests++;
    return fixtureMotion(body);
  }); t.after(() => gateway.close());
  const config = readConfig({ V3_DATA_DIR: f.directory, V3_VIDEOS_DIR: f.videos });
  config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model", apiKey: "fixture-only" };
  const id = await generateMotion(f.project.id, f.input, new AbortController().signal, () => {}, config);
  assert.equal(f.store.acceptance(f.project.id), null); f.store.decide(f.project.id, id, "accept");
  const original = f.store.read(f.project.id, id)!;
  const request = { ...f.input, baseId: id, shotId: original.plan.shots[1].id, instruction: "Change only this easing." };
  const revised = await generateMotion(f.project.id, request, new AbortController().signal, () => {}, config);
  const proposal = f.store.read(f.project.id, revised)!;
  assert.deepEqual(proposal.plan.shots[0], original.plan.shots[0]); assert.deepEqual(proposal.plan.shots[2], original.plan.shots[2]);
  assert.equal(proposal.plan.shots[1].actions[0].ease, "linear");
  assert.equal(guidanceRequests, 2); // Full motion and scoped revisions share the default.
  f.store.decide(f.project.id, revised, "reject"); assert.equal(f.store.acceptance(f.project.id)?.runId, id);
  const invalid = await fakeGateway("invalid"); t.after(() => invalid.close()); config.gateway.baseUrl = invalid.baseUrl;
  await assert.rejects(generateMotion(f.project.id, request, new AbortController().signal, () => {}, config));
  assert.equal(f.store.list(f.project.id)[0].status, "failed"); assert.equal(f.store.acceptance(f.project.id)?.stale, false);
  config.gateway.baseUrl = gateway.baseUrl; const controller = new AbortController(); controller.abort();
  await assert.rejects(generateMotion(f.project.id, request, controller.signal, () => {}, config));
  assert.equal(f.store.latest(f.project.id), id);
});

test("motion requires explicit accepted-board correspondence, finite safe values and complete end states", (t) => {
  const f = fixture(t); assert.equal(validateMotion(f.plan, f.board, hashMotionSource).shots.length, 3);
  const cases = [
    (p: typeof f.plan) => { p.shots[0].objects[0].startIndex = 1; },
    (p: typeof f.plan) => { p.shots[0].objects[0].id = "object-2"; },
    (p: typeof f.plan) => { p.shots[0].actions[0].to.width = Infinity; },
    (p: typeof f.plan) => { p.shots[0].actions[0].targetIds = ["unknown"]; },
    (p: typeof f.plan) => { p.shots[0].actions[0].endFrame = 120; },
    (p: typeof f.plan) => { p.shots[0].actions[0].to.width = 60; },
    (p: typeof f.plan) => { p.shots[0].actions.push(p.shots[0].actions[0]); },
    (p: typeof f.plan) => { p.shots[0].incoming.type = "match-cut"; },
    (p: typeof f.plan) => { p.shots[0].objects[0].initial.x = 99; },
    (p: typeof f.plan) => { p.shots[0].actions[0].to = { color: "url(javascript:bad)" }; },
  ];
  for (const mutate of cases) { const changed = structuredClone(f.plan); mutate(changed); assert.throws(() => validateMotion(changed, f.board, hashMotionSource)); }
  assert.throws(() => validateMotion({ ...f.plan, code: "alert(1)" }, f.board, hashMotionSource));
  const held = structuredClone(f.plan); held.shots[0].actions.unshift({ ...held.shots[0].actions[0], behavior: "hold", startFrame: 0, endFrame: 70, to: {} });
  assert.throws(() => validateMotion(held, f.board, hashMotionSource), /hold/);
});

test("frame schedule preserves integer duration and rejects invalid/triple overlaps", (t) => {
  const { plan } = fixture(t); assert.equal(scheduleMotion(plan).durationFrames, 360);
  plan.shots[1].incoming = { type: "reveal", presentation: "fade", overlapFrames: 20, anchor: null };
  assert.deepEqual(scheduleMotion(plan).shots.map((shot) => shot.startFrame), [0, 100, 220]); assert.equal(scheduleMotion(plan).durationFrames, 340);
  plan.shots[2].incoming = { type: "reveal", presentation: "fade", overlapFrames: 110, anchor: null };
  assert.throws(() => scheduleMotion(plan), /overlap/);
});

test("motion proposals require acceptance, preserve unselected shots and survive reload/rejection", (t) => {
  const f = fixture(t); assert.throws(() => f.store.begin(f.project.id, f.input), /Accept the exact/);
  const id = f.save(); assert.equal(f.store.acceptance(f.project.id), null); f.store.decide(f.project.id, id, "accept");
  const request = { ...f.input, baseId: id, shotId: "shot-2" }; const revision = f.store.begin(f.project.id, request);
  const shot = structuredClone(f.plan.shots[1]); shot.actions[0].ease = "power3.out"; f.store.complete(f.project.id, revision, shot);
  const proposed = f.store.read(f.project.id, revision)!;
  assert.equal(proposed.plan.interpreterVersion, "2"); assert.equal(f.store.read(f.project.id, id)!.plan.interpreterVersion, "1");
  assert.deepEqual(proposed.plan.shots[0], f.plan.shots[0]); assert.deepEqual(proposed.plan.shots[2], f.plan.shots[2]);
  assert.equal(f.store.acceptance(f.project.id)?.runId, id); assert.equal(f.store.acceptance(f.project.id)?.stale, false);
  f.store.decide(f.project.id, revision, "reject"); assert.equal(f.store.latest(f.project.id), id); assert.equal(f.store.acceptance(f.project.id)?.runId, id);
  const reopened = openMotion(f.directory, f.videos); try { assert.deepEqual(reopened.read(f.project.id, id), f.store.read(f.project.id, id)); assert.equal(reopened.acceptance(f.project.id)?.stale, false); } finally { reopened.close(); }
  assert.throws(() => f.store.decide(f.project.id, revision, "accept"));
});

test("script/concept changes and stale bases cannot complete or accept motion", (t) => {
  const f = fixture(t); const id = f.save(); f.store.decide(f.project.id, id, "accept");
  const request = { ...f.input, baseId: id }; const active = f.store.begin(f.project.id, request);
  assert.throws(() => f.store.begin(f.project.id, request), /already running/);
  const next = f.visuals.choose(f.project.id, f.concepts, 1, f.selectionId); f.visuals.choose(f.project.id, f.concepts, 0, next);
  assert.throws(() => f.store.complete(f.project.id, active, f.plan), /Accept the exact/); f.store.fail(f.project.id, active);
  assert.equal(f.store.acceptance(f.project.id)?.stale, true);
  const other = f.studio.createProject("Other project"); assert.equal(f.store.read(other.id, id), null); assert.throws(() => f.store.decide(other.id, id, "accept"));
  assert.throws(() => f.store.begin(f.project.id, { ...request, baseId: randomUUID() }));
  f.studio.saveScript(f.project.id, "Changed script", f.script.id); assert.equal(f.store.current(f.project.id, id), false);
});

test("motion integrity, orphan preservation, index rollback and deadline expiration fail closed", (t) => {
  const f = fixture(t); const original = f.save(); const request = { ...f.input, baseId: original };
  const path = (id: string) => join(f.videos, f.project.id, "motion", `${id}.json`);
  let id = f.store.begin(f.project.id, request); writeFileSync(path(id), "preserve orphan"); assert.throws(() => f.store.complete(f.project.id, id, f.plan), /preserved/); assert.equal(readFileSync(path(id), "utf8"), "preserve orphan"); f.store.fail(f.project.id, id);
  id = f.store.begin(f.project.id, request); mkdirSync(path(id) + ".tmp"); assert.throws(() => f.store.complete(f.project.id, id, f.plan)); f.store.fail(f.project.id, id);
  const db = openDatabase(f.directory); db.exec("CREATE TRIGGER motion_failure BEFORE UPDATE OF sha256 ON motion_runs BEGIN SELECT RAISE(ABORT, 'fixture failure'); END;");
  id = f.store.begin(f.project.id, request); assert.throws(() => f.store.complete(f.project.id, id, f.plan)); assert.throws(() => readFileSync(path(id))); f.store.fail(f.project.id, id);
  id = f.store.begin(f.project.id, request); db.prepare("UPDATE motion_runs SET deadline = '2000-01-01T00:00:00.000Z' WHERE id = ?").run(id); db.close();
  const reopened = openMotion(f.directory, f.videos); try { assert.equal(reopened.list(f.project.id)[0].status, "failed"); } finally { reopened.close(); }
  writeFileSync(path(original), "corrupt"); assert.throws(() => f.store.read(f.project.id, original), /integrity/);
});

test("additive schema 5 migration preserves every prior table and immutable artifact", (t) => {
  const f = fixture(t); f.visuals.accept(f.project.id, f.boardId);
  const source = openDatabase(f.directory); const oldDirectory = join(f.root, "schema5"); mkdirSync(oldDirectory); const old = new DatabaseSync(join(oldDirectory, "studio.sqlite"));
  const tables = source.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT IN ('motion_runs', 'motion_acceptances', 'production_records', 'planning_timing') ORDER BY rowid").all();
  for (const table of tables) old.exec(String(table.sql)); const snapshots = new Map();
  for (const table of tables) { const name = String(table.name); const rows = source.prepare(`SELECT * FROM ${name}`).all(); snapshots.set(name, rows);
    for (const row of rows) { const values = Object.values(row); old.prepare(`INSERT INTO ${name} VALUES (${values.map(() => "?").join(",")})`).run(...values); }
  }
  for (const index of source.prepare("SELECT sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL AND tbl_name != 'motion_runs'").all()) old.exec(String(index.sql));
  old.exec("PRAGMA user_version = 5"); old.close(); source.close();
  const upgraded = openDatabase(oldDirectory); try { assert.equal(upgraded.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION); for (const [name, rows] of snapshots) assert.deepEqual(upgraded.prepare(`SELECT * FROM ${name}`).all(), rows); } finally { upgraded.close(); }
  const store = openVisuals(oldDirectory, f.videos); try { assert.deepEqual(store.read(f.project.id, f.boardId), f.board); assert.equal(store.acceptance(f.project.id)?.stale, false); } finally { store.close(); }
});
