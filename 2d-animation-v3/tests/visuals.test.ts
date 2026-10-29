import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { test, type TestContext } from "node:test";
import { openDatabase, DATABASE_VERSION } from "../server/database.ts";
import { readConfig } from "../server/config.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { generateVisuals } from "../server/visuals.ts";
import { frameSchema, conceptsSchema, validateStoryboard, replaceShot, visualRequestSchema } from "../workflow/visuals.ts";
import { boardFixture, conceptFixture, planningFrame, fixtureVisuals } from "./fixtures/visuals.ts";
import { fakeGateway } from "./fixtures/gateway.ts";
import { requestJson } from "../server/gateway.ts";
import { openScriptwriting } from "../server/scriptwriting-store.ts";
import { researchFixture } from "./fixtures/research.ts";
import { openTiming } from "../server/timing-store.ts";
import { wavFixture } from "./fixtures/wav.ts";

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "v3-visuals-"));
  const config = readConfig({ V3_DATA_DIR: join(root, "database"), V3_VIDEOS_DIR: join(root, "videos") });
  const studio = openStudio(config.dataDirectory, config.videosDirectory); const store = openVisuals(config.dataDirectory, config.videosDirectory);
  const project = studio.createProject("Synthetic visual planning fixture"); const script = studio.saveScript(project.id, "Start at one hundred.\nNow halve the amount.\nCompare the new amount with the original.", null);
  const request = { kind: "concepts" as const, scriptId: script.id, selectionId: null, baseId: null, shotIndex: null, instruction: "" };
  t.after(() => { store.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  function concepts() { studio.acceptScript(project.id, script.id); const id = store.begin(project.id, request, "fixture-model"); store.complete(project.id, id, conceptFixture); return id; }
  function board() {
    const conceptId = concepts(); const selectionId = store.choose(project.id, conceptId, 0, null);
    const input = { ...request, kind: "storyboard" as const, selectionId }; const id = store.begin(project.id, input, "fixture-model"); store.complete(project.id, id, boardFixture());
    return { id, input, conceptId, selectionId };
  }
  return { root, config, studio, store, project, script, request, concepts, board };
}

test("fragmented SSE accepts small JSON despite framing overhead while content remains bounded", async (t) => {
  const expected = { label: "量".repeat(4000) }; const gateway = await fakeGateway("fragmented", 0, () => expected); t.after(() => gateway.close());
  const config = { baseUrl: gateway.baseUrl, model: "fixture-model" };
  assert.deepEqual(await requestJson(config, [{ role: "user", content: "Synthetic fragmentation check" }], new AbortController().signal, () => {}), expected);
});

test("visual contracts reject unsafe shapes, duplicate concepts, missing/reordered narration and invalid transitions", () => {
  for (const bad of [ { ...planningFrame, background: "url(https://example.test)" }, { ...planningFrame, script: "alert(1)" },
    { ...planningFrame, shapes: [{ ...planningFrame.shapes[0], x: 99 }] }, { ...planningFrame, shapes: [{ ...planningFrame.shapes[0], type: "image" }] } ]) assert.throws(() => frameSchema.parse(bad));
  assert.throws(() => conceptsSchema.parse({ concepts: [conceptFixture.concepts[0], conceptFixture.concepts[0], conceptFixture.concepts[1]] }));
  const content = "One\n\nTwo\nThree";
  assert.deepEqual(validateStoryboard(boardFixture([1, 3, 4]), content), boardFixture([1, 3, 4]));
  for (const lines of [[1, 2, 3], [1, 4, 3], [1, 3], [1, 3, 3, 4]]) assert.throws(() => validateStoryboard(boardFixture(lines), content));
  const invalid = boardFixture([1, 3, 4]); invalid.shots[1].transition = "start"; assert.throws(() => validateStoryboard(invalid, content));
  assert.throws(() => replaceShot(boardFixture([1, 3, 4]), 0, boardFixture().shots[1], content));
  assert.throws(() => visualRequestSchema.parse({ kind: "concepts", scriptId: randomUUID(), selectionId: randomUUID(), baseId: null, shotIndex: null, instruction: "" }));
});

test("explicit accepted script and concept choice unlock boards; scoped revisions preserve every other shot and survive reopen", (t) => {
  const f = fixture(t); const { store, project, script, request } = f;
  assert.throws(() => store.begin(project.id, request, "fixture-model"), /Accept the current script/);
  const { id, input } = f.board(); assert.equal(store.acceptance(project.id), null);
  store.accept(project.id, id); const original = store.read(project.id, id)!;
  const revision = store.begin(project.id, { ...input, kind: "shot", baseId: id, shotIndex: 1, instruction: "Keep the marker visible" }, "fixture-model");
  const replacement = { ...boardFixture().shots[1], action: "Keep the reference marker visible." };
  store.complete(project.id, revision, replacement); const result = store.read(project.id, revision)!;
  assert.equal(result.output.kind, "storyboard"); if (result.output.kind !== "storyboard" || original.output.kind !== "storyboard") throw new Error();
  assert.deepEqual(result.output.shots[0], original.output.shots[0]); assert.deepEqual(result.output.shots[2], original.output.shots[2]); assert.deepEqual(result.output.shots[1], replacement);
  assert.equal(store.acceptance(project.id)?.stale, true); assert.throws(() => store.accept(project.id, id), /stale/);
  store.accept(project.id, revision); const reopened = openVisuals(f.config.dataDirectory, f.config.videosDirectory);
  try { assert.deepEqual(reopened.read(project.id, revision), result); assert.equal(reopened.acceptance(project.id)?.stale, false); }
  finally { reopened.close(); }
  assert.equal(f.studio.readRevision(project.id, script.id)?.content, script.content);
});

test("storyboard acceptance stops excessive canvas copy before motion planning", (t) => {
  const f = fixture(t), { id, input } = f.board();
  const revision = f.store.begin(f.project.id, { ...input, kind: "shot", baseId: id, shotIndex: 0 }, "fixture-model");
  const shot = boardFixture().shots[0];
  shot.endFrame.shapes.push({ type: "text", x: 8, y: 75, width: 35, height: 6, color: "#FFFFFF", label: "Extra text" },
    { type: "text", x: 55, y: 75, width: 35, height: 6, color: "#FFFFFF", label: "Another label" });
  f.store.complete(f.project.id, revision, shot);
  assert.throws(() => f.store.accept(f.project.id, revision), /copy-density/);
  assert.equal(f.store.acceptance(f.project.id), null);
  f.store.accept(f.project.id, revision, true);
  assert.equal(f.store.acceptance(f.project.id)!.runId, revision);
});

test("selection changes, ABA choices, new scripts and cross-project requests fail closed", (t) => {
  const f = fixture(t); const { id, input, conceptId, selectionId } = f.board();
  const active = f.store.begin(f.project.id, { ...input, baseId: id }, "fixture-model");
  assert.throws(() => f.store.begin(f.project.id, { ...input, baseId: id }, "fixture-model"), /already running/);
  const next = f.store.choose(f.project.id, conceptId, 1, selectionId);
  f.store.choose(f.project.id, conceptId, 0, next);
  assert.equal(f.store.current(f.project.id, id), false);
  assert.throws(() => f.store.complete(f.project.id, active, boardFixture()), /selection changed/); f.store.fail(f.project.id, active);
  assert.throws(() => f.store.choose(f.project.id, conceptId, 2, selectionId), /changed/);
  const other = f.studio.createProject("Other project"); assert.equal(f.store.read(other.id, id), null);
  assert.throws(() => f.store.accept(other.id, id)); assert.throws(() => f.store.begin(other.id, f.request, "fixture-model"));
  const revised = f.studio.saveScript(f.project.id, "Changed narration", f.script.id);
  assert.throws(() => f.store.choose(f.project.id, conceptId, 2, f.store.selection(f.project.id)!.id), /changed/);
  f.studio.acceptScript(f.project.id, revised.id); assert.equal(f.store.current(f.project.id, conceptId), false);
});

test("research changes during generation prevent completion, including inherited manual scripts", (t) => {
  const f = fixture(t); const writing = openScriptwriting(f.config.dataDirectory, f.config.videosDirectory);
  try {
    const briefId = writing.saveBrief(f.project.id, researchFixture, null);
    // A synthetic imported revision establishes the same inherited dependency as the writing workflow.
    const db = openDatabase(f.config.dataDirectory);
    db.prepare("UPDATE script_revisions SET writing_run_id = ? WHERE id = ?").run(briefId, f.script.id); db.close();
    const manual = f.studio.saveScript(f.project.id, f.script.content, f.script.id); f.studio.acceptScript(f.project.id, manual.id);
    const id = f.store.begin(f.project.id, { ...f.request, scriptId: manual.id }, "fixture-model");
    writing.saveBrief(f.project.id, { ...researchFixture, payoff: "Changed research boundary." }, briefId);
    assert.throws(() => f.store.complete(f.project.id, id, conceptFixture), /Accept the current script/); f.store.fail(f.project.id, id);
  } finally { writing.close(); }
});

test("write failures, preexisting orphans, corruption and expired jobs preserve earlier artifacts", (t) => {
  const f = fixture(t); const { id, input } = f.board(); const original = f.store.read(f.project.id, id);
  const request = { ...input, baseId: id }; let pending = f.store.begin(f.project.id, request, "fixture-model");
  const path = (id: string) => join(f.config.videosDirectory, f.project.id, "visuals", `${id}.json`);
  writeFileSync(path(pending), "recovery orphan");
  assert.throws(() => f.store.complete(f.project.id, pending, boardFixture()), /preserved/); assert.equal(readFileSync(path(pending), "utf8"), "recovery orphan"); f.store.fail(f.project.id, pending);
  pending = f.store.begin(f.project.id, request, "fixture-model"); mkdirSync(path(pending) + ".tmp");
  assert.throws(() => f.store.complete(f.project.id, pending, boardFixture())); f.store.fail(f.project.id, pending);
  assert.deepEqual(f.store.read(f.project.id, id), original);
  const db = openDatabase(f.config.dataDirectory);
  db.exec("CREATE TRIGGER visual_index_failure BEFORE UPDATE OF sha256 ON visual_runs BEGIN SELECT RAISE(ABORT, 'fixture index failure'); END;");
  pending = f.store.begin(f.project.id, request, "fixture-model"); assert.throws(() => f.store.complete(f.project.id, pending, boardFixture()));
  assert.throws(() => readFileSync(path(pending))); f.store.fail(f.project.id, pending);
  pending = f.store.begin(f.project.id, request, "fixture-model"); db.prepare("UPDATE visual_runs SET deadline = '2000-01-01T00:00:00.000Z' WHERE id = ?").run(pending); db.close();
  const reopened = openVisuals(f.config.dataDirectory, f.config.videosDirectory);
  try { assert.equal(reopened.list(f.project.id).find((row) => row.id === pending)?.status, "failed"); } finally { reopened.close(); }
  writeFileSync(path(id), "corrupt"); assert.throws(() => f.store.read(f.project.id, id), /integrity/);
});

test("schema 4 migration preserves all prior tables and project files", (t) => {
  const f = fixture(t); f.studio.acceptScript(f.project.id, f.script.id);
  // Rebuild the prior schema from its exact original DDL, excluding only the new visual tables/index.
  const source = openDatabase(f.config.dataDirectory); const oldDirectory = join(f.root, "schema4"); mkdirSync(oldDirectory);
  const old = new DatabaseSync(join(oldDirectory, "studio.sqlite"));
  const tables = source.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT IN ('visual_runs', 'concept_selections', 'storyboard_acceptances', 'motion_runs', 'motion_acceptances', 'production_records', 'planning_timing') ORDER BY rowid").all();
  const snapshots = new Map<string, unknown>();
  for (const table of tables) old.exec(String(table.sql));
  for (const table of tables) {
    const name = String(table.name); const rows = source.prepare(`SELECT * FROM ${name}`).all(); snapshots.set(name, rows);
    for (const row of rows) { const values = Object.values(row); old.prepare(`INSERT INTO ${name} VALUES (${values.map(() => "?").join(",")})`).run(...values); }
  }
  for (const index of source.prepare("SELECT sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL AND tbl_name NOT IN ('visual_runs', 'motion_runs')").all()) old.exec(String(index.sql));
  old.exec("PRAGMA user_version = 4"); old.close(); source.close();
  const upgraded = openDatabase(oldDirectory);
  try { assert.equal(upgraded.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION); for (const [name, rows] of snapshots) assert.deepEqual(upgraded.prepare(`SELECT * FROM ${name}`).all(), rows); }
  finally { upgraded.close(); }
  const reopened = openStudio(oldDirectory, f.config.videosDirectory);
  try { assert.deepEqual(reopened.readRevision(f.project.id, f.script.id), f.script); assert.equal(reopened.acceptance(f.project.id)?.stale, false); }
  finally { reopened.close(); }
});

test("gateway path saves proposals without accepting, rejects invalid outputs and supports cancellation", async (t) => {
  const f = fixture(t); const guidanceRequests: string[] = [];
  const gateway = await fakeGateway("writing", 0, (body) => {
    const guidance = body.messages.slice(0, -1).map((message) => message.content).join("\n");
    assert.match(guidance, /Default to no on-canvas text/);
    assert.match(guidance, /large animated diagrams/);
    assert.match(guidance, /GIF-like moments/);
    guidanceRequests.push(guidance);
    return fixtureVisuals(body);
  }); t.after(() => gateway.close());
  f.config.gateway = { baseUrl: gateway.baseUrl, apiKey: "fixture-only", model: "other-workflow-model" };
  f.config.visualModel = "fixture-model"; f.studio.acceptScript(f.project.id, f.script.id);
  const id = await generateVisuals(f.project.id, f.request, new AbortController().signal, () => {}, f.config);
  assert.equal(f.store.read(f.project.id, id)?.output.kind, "concepts"); assert.equal(f.store.selection(f.project.id), null);
  const selectionId = f.store.choose(f.project.id, id, 1, null); const request = { ...f.request, kind: "storyboard", selectionId };
  const boardId = await generateVisuals(f.project.id, request, new AbortController().signal, () => {}, f.config);
  assert.equal(f.store.acceptance(f.project.id), null);
  const shotId = await generateVisuals(f.project.id, { ...request, kind: "shot", baseId: boardId, shotIndex: 1 }, new AbortController().signal, () => {}, f.config);
  assert.equal(f.store.read(f.project.id, shotId)?.output.kind, "storyboard");
  assert.equal(guidanceRequests.length, 3); // Concepts, full board and scoped shot revisions.
  const missingDirection = await fakeGateway("writing", 0, () => boardFixture()); t.after(() => missingDirection.close());
  f.config.gateway.baseUrl = missingDirection.baseUrl;
  await assert.rejects(generateVisuals(f.project.id, { ...request, baseId: shotId }, new AbortController().signal, () => {}, f.config));
  assert.match(f.store.list(f.project.id)[0].error!, /shots\.0\.design/);
  assert.equal(f.store.latest(f.project.id, "storyboard"), shotId);
  f.config.gateway.baseUrl = gateway.baseUrl;
  assert.ok(f.store.list(f.project.id).every((run) => run.model === "fixture-model"));
  assert.equal(f.config.gateway.model, "other-workflow-model");
  const invalid = await fakeGateway("invalid"); t.after(() => invalid.close()); f.config.gateway.baseUrl = invalid.baseUrl;
  await assert.rejects(generateVisuals(f.project.id, { ...f.request, baseId: id }, new AbortController().signal, () => {}, f.config));
  assert.equal(f.store.list(f.project.id)[0].status, "failed");
  const malformed = await fakeGateway("writing", 0, () => ({ concepts: conceptFixture.concepts.map((concept) => ({ ...concept, frame: { ...concept.frame, background: "private upstream value" } })) }));
  t.after(() => malformed.close()); f.config.gateway.baseUrl = malformed.baseUrl;
  await assert.rejects(generateVisuals(f.project.id, { ...f.request, baseId: id }, new AbortController().signal, () => {}, f.config));
  const failure = f.store.list(f.project.id)[0].error!;
  assert.match(failure, /concepts\.0\.frame\.background/); assert.doesNotMatch(failure, /private upstream value/);
  f.config.gateway.baseUrl = gateway.baseUrl; const controller = new AbortController(); controller.abort();
  await assert.rejects(generateVisuals(f.project.id, { ...f.request, baseId: id }, controller.signal, () => {}, f.config));
  assert.equal(f.store.latest(f.project.id, "concepts"), id);
  f.config.visualModel = undefined; f.config.gateway.model = "fixture-model";
  const fallbackId = await generateVisuals(f.project.id, { ...f.request, baseId: id }, new AbortController().signal, () => {}, f.config);
  assert.equal(f.store.list(f.project.id).find((run) => run.id === fallbackId)?.model, "fixture-model");
});

test("visual generation uses reviewed narration for full and scoped durations and rejects timing changed in flight", async (t) => {
  const f = fixture(t), initial = f.board(), timings = openTiming(f.config.dataDirectory, f.config.videosDirectory);
  try {
  const input = { scriptId: f.script.id, baseId: null, timing: [{ number: 1, startFrame: 0, endFrame: 50 }, { number: 2, startFrame: 60, endFrame: 140 }, { number: 3, startFrame: 150, endFrame: 175 }], anchors: [], provenance: "manual" };
  const timingId = timings.import(f.project.id, input, wavFixture(6)); let changeTiming = false;
  const gateway = await fakeGateway("writing", 0, (body) => {
    const context = JSON.parse(body.messages.at(-1)!.content); assert.equal(context.measuredTiming.durationFrames, 180);
    if (changeTiming) timings.import(f.project.id, { ...input, baseId: timingId }, wavFixture(6));
    return fixtureVisuals(body);
  }); t.after(() => gateway.close());
  f.config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model", apiKey: "fixture" };
  const id = await generateVisuals(f.project.id, { ...initial.input, baseId: initial.id }, new AbortController().signal, () => {}, f.config);
  const full = f.store.read(f.project.id, id)!; assert.equal(full.output.kind, "storyboard");
  if (full.output.kind === "storyboard") assert.deepEqual(full.output.shots.map((shot) => shot.seconds), [2, 3, 1]);
  const scoped = await generateVisuals(f.project.id, { ...initial.input, kind: "shot", baseId: id, shotIndex: 1 }, new AbortController().signal, () => {}, f.config);
  const result = f.store.read(f.project.id, scoped)!;
  if (result.output.kind === "storyboard") assert.equal(result.output.shots[1].seconds, 3);
  changeTiming = true;
  await assert.rejects(generateVisuals(f.project.id, { ...initial.input, baseId: scoped }, new AbortController().signal, () => {}, f.config));
  assert.equal(f.store.latest(f.project.id, "storyboard"), scoped);
  } finally { timings.close(); }
});
