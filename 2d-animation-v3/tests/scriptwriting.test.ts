import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { test, type TestContext } from "node:test";
import { readConfig } from "../server/config.ts";
import { openStudio } from "../server/studio.ts";
import { openScriptwriting } from "../server/scriptwriting-store.ts";
import { generateWriting } from "../server/scriptwriting.ts";
import { loadWritingSkill } from "../server/writing-skills.ts";
import { streamWriting } from "../server/writing-response.ts";
import { narrationGuidance } from "../server/writing-guidance.ts";
import { briefSchema, validateDraft, hooksSchema, parseGeneratedHooks } from "../workflow/scriptwriting.ts";
import { fakeGateway, fixtureWriting } from "./fixtures/gateway.ts";
import { researchFixture } from "./fixtures/research.ts";

const skills = (name: "storytelling-hooks" | "humanizer") => ({ text: `${name} fixture guidance`, records: [{ name, path: `/fixture/${name}`, sha256: "a".repeat(64) }] });

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "v3-scriptwriting-"));
  const config = readConfig({ V3_DATA_DIR: join(root, "database"), V3_VIDEOS_DIR: join(root, "videos") });
  const studio = openStudio(config.dataDirectory, config.videosDirectory);
  const store = openScriptwriting(config.dataDirectory, config.videosDirectory);
  const project = studio.createProject("Research fixture");
  t.after(() => { store.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  return { root, config, studio, store, project };
}

function hookFixture(brief = researchFixture) {
  return hooksSchema.parse(fixtureWriting({ messages: [{ content: "" }, { content: JSON.stringify({ brief }) }] }));
}

test("research validation rejects ungrounded references, duplicate IDs and credential-bearing URLs", () => {
  for (const changed of [
    { ...researchFixture, claims: [{ ...researchFixture.claims[0], sourceIds: ["missing"] }] },
    { ...researchFixture, sources: [...researchFixture.sources, researchFixture.sources[0]] },
    { ...researchFixture, sources: [{ ...researchFixture.sources[0], url: "https://user:secret@example.test/" }] },
    { ...researchFixture, sources: [] },
  ]) assert.throws(() => briefSchema.parse(changed));
  const hooks = hookFixture();
  assert.throws(() => hooksSchema.parse({ hooks: [hooks.hooks[0], hooks.hooks[0], hooks.hooks[0]] }));
  for (const id of ["304-no-image", "h".repeat(41)]) {
    assert.throws(() => hooksSchema.parse({ hooks: hooks.hooks.map((hook, index) => index ? hook : { ...hook, id }) }));
  }
  const assigned = parseGeneratedHooks({ hooks: hooks.hooks.map((hook) => ({ ...hook, id: "304-no-image" })) });
  assert.deepEqual(assigned.hooks.map((hook) => hook.id), ["hook-1", "hook-2", "hook-3", "hook-4", "hook-5"]);
  assert.deepEqual(assigned.hooks.map((hook) => hook.spoken), hooks.hooks.map((hook) => hook.spoken));
  assert.throws(() => parseGeneratedHooks({ hooks: [hooks.hooks[0], hooks.hooks[0], hooks.hooks[0]] }));
  assert.throws(() => parseGeneratedHooks({ hooks: hooks.hooks.map((hook) => ({ ...hook, unexpected: true })) }));
  const original = { lines: [{ text: hooks.hooks[0].spoken, claimIds: ["claim-1"] }, { text: "A line", claimIds: [] }, { text: "Ending", claimIds: [] }] };
  assert.throws(() => validateDraft(original, { lines: original.lines.map((line) => ({ ...line, claimIds: [] })) }, researchFixture, hooks.hooks[0]));
});

test("full pipeline isolates roles, preserves history and imports once without acceptance", async (t) => {
  const { config, studio, store, project } = fixture(t); const gateway = await fakeGateway("writing", 0, (body, index) => index
    ? fixtureWriting(body) : { hooks: hookFixture().hooks.map((hook) => ({ ...hook, id: "304-no-image" })) });
  t.after(() => gateway.close()); config.gateway = { baseUrl: gateway.baseUrl, apiKey: "fixture-only", model: "fixture-model" };
  const base = studio.saveScript(project.id, "Existing draft", null); studio.acceptScript(project.id, base.id);
  const briefId = store.saveBrief(project.id, researchFixture, null);
  const progress: string[] = [];
  const hooksId = await generateWriting(project.id, { kind: "hooks", parentId: briefId, instruction: "" }, new AbortController().signal, (message) => progress.push(message), config, skills);
  assert.match(gateway.requests[0].messages[0].content, /server assigns option IDs/);
  const hooks = store.read(project.id, hooksId)!.output;
  assert.equal(hooks.kind, "hooks"); if (hooks.kind !== "hooks") return;
  const draftId = await generateWriting(project.id, { kind: "draft", parentId: hooksId, hookId: hooks.hooks[0].id, instruction: "Keep it concrete" }, new AbortController().signal, (message) => progress.push(message), config, skills);
  assert.equal(gateway.requests.length, 4);
  for (const request of gateway.requests) assert.ok(request.messages[0].content.includes(narrationGuidance));
  assert.ok(gateway.requests[2].messages[0].content.includes("humanizer fixture guidance"));
  assert.equal(JSON.parse(gateway.requests[2].messages[1].content).instruction, "Keep it concrete");
  const editor = JSON.parse(gateway.requests[3].messages[1].content);
  assert.deepEqual(Object.keys(editor).sort(), ["brief", "hook", "instruction", "script"]);
  assert.equal(editor.instruction, "Keep it concrete");
  assert.equal(editor.original, undefined);
  assert.ok(!gateway.requests[3].messages[0].content.includes("humanizer fixture guidance"));
  assert.equal(studio.listRevisions(project.id).length, 1);
  const database = new DatabaseSync(join(config.dataDirectory, "studio.sqlite"));
  try {
    database.exec("CREATE TRIGGER fail_import BEFORE INSERT ON script_revisions WHEN NEW.writing_run_id IS NOT NULL BEGIN SELECT RAISE(ABORT, 'injected import failure'); END;");
    assert.throws(() => studio.importReviewedDraft(project.id, draftId), /injected import failure/);
    assert.equal(store.list(project.id)[0].importedRevisionId, null);
    assert.deepEqual(readdirSync(join(config.videosDirectory, project.id, "scripts")), [`${base.id}.json`]);
    database.exec("DROP TRIGGER fail_import");
  } finally { database.close(); }
  const imported = studio.importReviewedDraft(project.id, draftId);
  assert.equal(imported.revision, 2); assert.equal(studio.acceptance(project.id)?.stale, true);
  assert.equal(studio.importReviewedDraft(project.id, draftId).id, imported.id);
  assert.equal(studio.listRevisions(project.id).length, 2);
  studio.acceptScript(project.id, imported.id);
  assert.equal(studio.acceptance(project.id)?.stale, false);
  const descendant = studio.saveScript(project.id, imported.content + "\nA manual follow-up.", imported.id);
  studio.acceptScript(project.id, descendant.id);
  assert.equal(studio.acceptance(project.id)?.stale, false);
  const other = openScriptwriting(config.dataDirectory, config.videosDirectory);
  try { assert.equal(other.read(project.id, draftId)?.output.kind, "draft"); } finally { other.close(); }
  store.saveBrief(project.id, { ...researchFixture, payoff: "A newer researched payoff." }, briefId);
  assert.equal(studio.acceptance(project.id)?.stale, true);
  assert.throws(() => studio.acceptScript(project.id, imported.id), /newer revision/);
  assert.throws(() => studio.acceptScript(project.id, descendant.id), /Research brief changed/);
  assert.ok(progress.some((message) => message.includes("Reviewing evidence")));
});

test("editor rejection is persisted as successful work but cannot be imported", async (t) => {
  const { config, studio, store, project } = fixture(t);
  const gateway = await fakeGateway("writing", 0, (body) => JSON.parse(body.messages[1].content).script
    ? { verdict: "revise", summary: "The premise needs work.", findings: [{ line: 1, reason: "The opening is generic.", change: "Use the concrete example." }] } : fixtureWriting(body));
  t.after(() => gateway.close()); config.gateway = { baseUrl: gateway.baseUrl, apiKey: undefined, model: "fixture-model" };
  const briefId = store.saveBrief(project.id, researchFixture, null);
  const hooksId = await generateWriting(project.id, { kind: "hooks", parentId: briefId, instruction: "" }, new AbortController().signal, () => {}, config, skills);
  const id = await generateWriting(project.id, { kind: "draft", parentId: hooksId, hookId: "hook-1", instruction: "" }, new AbortController().signal, () => {}, config, skills);
  const draft = store.read(project.id, id)!;
  assert.equal(draft.output.kind === "draft" && draft.output.review.verdict, "revise");
  assert.equal(store.list(project.id)[0].status, "complete");
  assert.throws(() => studio.importReviewedDraft(project.id, id), /unavailable or stale/);
  assert.equal(studio.listRevisions(project.id).length, 0);
  assert.equal(studio.acceptance(project.id), null);
});

test("stale briefs, concurrent scripts and cross-project dependencies cannot overwrite work", (t) => {
  const { config, studio, store, project } = fixture(t);
  const base = studio.saveScript(project.id, "Keep this draft", null);
  const briefId = store.saveBrief(project.id, researchFixture, null);
  const hooksId = store.begin(project.id, { kind: "hooks", parentId: briefId, instruction: "" }, "fixture");
  store.complete(project.id, hooksId, { kind: "hooks", ...hookFixture(), skills: skills("storytelling-hooks").records });
  const draftId = store.begin(project.id, { kind: "draft", parentId: hooksId, hookId: "hook-1", instruction: "" }, "fixture");
  const hooks = hookFixture(); const original = { lines: [{ text: hooks.hooks[0].spoken, claimIds: ["claim-1"] }, { text: researchFixture.claims[0].statement, claimIds: ["claim-1"] }, { text: researchFixture.payoff, claimIds: [] }] };
  store.complete(project.id, draftId, { kind: "draft", hookId: "hook-1", original, refined: original, review: { verdict: "ready", summary: "Fixture", findings: [] }, skills: skills("humanizer").records });
  const foreign = studio.createProject("Foreign"); assert.equal(store.read(foreign.id, draftId), null);
  assert.throws(() => studio.importReviewedDraft(foreign.id, draftId));
  const next = studio.saveScript(project.id, "Newer manual draft", base.id);
  assert.throws(() => studio.importReviewedDraft(project.id, draftId), /newer revision/);
  assert.equal(studio.listRevisions(project.id)[0].id, next.id);
  const active = store.begin(project.id, { kind: "hooks", parentId: briefId, instruction: "" }, "fixture");
  store.saveBrief(project.id, { ...researchFixture, topic: "Changed topic" }, briefId);
  assert.throws(() => store.complete(project.id, active, { kind: "hooks", ...hooks, skills: skills("storytelling-hooks").records }), /brief changed/);
  store.fail(project.id, active);
  assert.throws(() => store.saveBrief(project.id, researchFixture, briefId), /newer brief/);
  const db = new DatabaseSync(join(config.dataDirectory, "studio.sqlite"));
  try { assert.equal(db.prepare("SELECT count(*) AS count FROM script_revisions").get()?.count, 2); } finally { db.close(); }
});

test("corrupt files and failed completion preserve existing artifacts and rollback indexes", (t) => {
  const { config, store, project } = fixture(t);
  const briefId = store.saveBrief(project.id, researchFixture, null);
  const path = join(config.videosDirectory, project.id, "writing", `${briefId}.json`);
  const bytes = readFileSync(path); writeFileSync(path, "Tampered");
  assert.throws(() => store.read(project.id, briefId), /integrity/); writeFileSync(path, bytes);
  const id = store.begin(project.id, { kind: "hooks", parentId: briefId, instruction: "" }, "fixture");
  const db = new DatabaseSync(join(config.dataDirectory, "studio.sqlite"));
  try {
    db.exec("CREATE TRIGGER fail_writing BEFORE UPDATE ON scriptwriting_runs WHEN NEW.status = 'complete' BEGIN SELECT RAISE(ABORT, 'injected writing failure'); END;");
    assert.throws(() => store.complete(project.id, id, { kind: "hooks", ...hookFixture(), skills: skills("storytelling-hooks").records }), /injected writing failure/);
    assert.deepEqual(readdirSync(join(config.videosDirectory, project.id, "writing")), [`${briefId}.json`]);
    assert.equal(store.read(project.id, id), null); store.fail(project.id, id);
  } finally { db.close(); }
});

test("interrupted requests expire without replay and foreign references fail closed", (t) => {
  const { config, studio, store, project } = fixture(t); const brief = store.saveBrief(project.id, researchFixture, null);
  const id = store.begin(project.id, { kind: "hooks", parentId: brief, instruction: "" }, "fixture");
  assert.throws(() => store.begin(project.id, { kind: "hooks", parentId: brief, instruction: "" }, "fixture"), /already running/);
  assert.throws(() => store.begin(studio.createProject("Other").id, { kind: "hooks", parentId: brief, instruction: "" }, "fixture"));
  const db = new DatabaseSync(join(config.dataDirectory, "studio.sqlite")); db.prepare("UPDATE scriptwriting_runs SET deadline = '2000-01-01T00:00:00Z' WHERE id = ?").run(id); db.close();
  const recovered = openScriptwriting(config.dataDirectory, config.videosDirectory);
  try { assert.equal(recovered.list(project.id)[0].status, "failed"); } finally { recovered.close(); }
  assert.equal(store.read(project.id, id), null);
});

test("unindexed orphan artifacts are preserved rather than overwritten or deleted", (t) => {
  const { config, store, project } = fixture(t); const brief = store.saveBrief(project.id, researchFixture, null);
  const id = store.begin(project.id, { kind: "hooks", parentId: brief, instruction: "" }, "fixture");
  const path = join(config.videosDirectory, project.id, "writing", `${id}.json`);
  writeFileSync(path, "Preserve interrupted output");
  assert.throws(() => store.complete(project.id, id, { kind: "hooks", ...hookFixture(), skills: skills("storytelling-hooks").records }), /preserve it for recovery/);
  assert.equal(readFileSync(path, "utf8"), "Preserve interrupted output");
  assert.equal(store.read(project.id, id), null); store.fail(project.id, id);
});

test("installed skill loader preserves actual file content and records hashes; missing references fail", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-skills-")); t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "storytelling-hooks"));
  for (const name of ["SKILL.md", "patterns.md"]) writeFileSync(join(root, "storytelling-hooks", name), `Original ${name}`);
  const skill = loadWritingSkill("storytelling-hooks", root);
  assert.equal(skill.text, "Original SKILL.md\n\nOriginal patterns.md");
  assert.equal(skill.records[0].sha256, createHash("sha256").update("Original SKILL.md").digest("hex"));
  assert.throws(() => loadWritingSkill("humanizer", root), /ENOENT/);
});

test("shared HTTP writing boundary preserves scope endpoint behavior and limits untrusted input", async () => {
  const projectId = randomUUID(); let calls = 0;
  const execute = async () => { calls++; return { proposalId: randomUUID() }; };
  for (const [origin, body, expected] of [["http://evil.test", "{}", 403], ["http://127.0.0.1:3003", "{", 400], ["http://127.0.0.1:3003", "x".repeat(12_001), 400]] as const) {
    const response = await streamWriting(new Request("http://127.0.0.1:3003", { method: "POST", headers: { host: "127.0.0.1:3003", origin, "content-type": "application/json" }, body }), projectId, (value) => value, execute);
    assert.equal(response.status, expected);
  }
  assert.equal(calls, 0);
  const response = await streamWriting(new Request("http://127.0.0.1:3003", { method: "POST", headers: { host: "127.0.0.1:3003", origin: "http://127.0.0.1:3003", "content-type": "application/json" }, body: "{}" }), projectId, (value) => value, execute);
  assert.equal(response.status, 200); assert.ok(JSON.parse((await response.text()).trim()).proposalId); assert.equal(calls, 1);
});
