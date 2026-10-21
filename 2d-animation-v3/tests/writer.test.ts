import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { openStudio } from "../server/studio.ts";
import { openWritingJobs } from "../server/writing-jobs.ts";
import { readConfig } from "../server/config.ts";
import { reviseScript } from "../server/writer.ts";
import { requestReplacement } from "../server/gateway.ts";
import { narrationGuidance } from "../server/writing-guidance.ts";
import { fakeGateway } from "./fixtures/gateway.ts";

const context = { script: "Opening.\nKeep ending.", start: 0, end: 8, instruction: "Clarify", history: [] };

test("gateway adapter handles split SSE and rejects unsupported/unsafe/incomplete output", async () => {
  for (const mode of ["ok", "missing-model", "http-error", "invalid", "oversized", "tools", "length", "truncated", "hang"]) {
    const gateway = await fakeGateway(mode);
    try {
      const promise = requestReplacement({ baseUrl: gateway.baseUrl, model: "fixture-model", apiKey: "fixture-secret" }, context, AbortSignal.timeout(mode === "hang" ? 150 : 5_000), () => {});
      if (mode === "ok") assert.equal((await promise).replacement, "A clearer opening.");
      else await assert.rejects(promise, Error, mode);
      if (mode === "missing-model") assert.equal(gateway.requests.length, 0);
      if (mode === "ok") {
        assert.ok(gateway.requests[0].messages[0].content.includes(narrationGuidance));
        assert.match(gateway.requests[0].messages[0].content, /only within that section/);
        const supplied = JSON.parse(gateway.requests[0].messages[1].content);
        assert.equal(supplied.selection, "Opening.");
        assert.equal(supplied.script, context.script);
      }
    } finally { await gateway.close(); }
  }
});

test("writing session persists proposals and decisions as follow-up context without applying drafts", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-writer-")); const gateway = await fakeGateway();
  const config = readConfig({ V3_DATA_DIR: join(root, "db"), V3_VIDEOS_DIR: join(root, "videos"), CLIPROXYAPI_BASE_URL: gateway.baseUrl, CLIPROXYAPI_MODEL: "fixture-model" });
  const studio = openStudio(config.dataDirectory, config.videosDirectory); const jobs = openWritingJobs(config.dataDirectory);
  t.after(async () => { studio.close(); jobs.close(); await gateway.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Writer"); const base = studio.saveScript(project.id, context.script, null);
  const request = { baseId: base.id, start: 0, end: 8, instruction: "Clarify" }; const progress: string[] = [];
  const id = await reviseScript(project.id, request, new AbortController().signal, (message) => progress.push(message), config);
  assert.equal(studio.listRevisions(project.id).length, 1);
  assert.equal(jobs.list(project.id)[0].proposalId, id);
  const session = jobs.list(project.id)[0].sessionId;
  assert.equal(jobs.list(project.id)[0].status, "succeeded");
  studio.decideProposal(project.id, id, "reject");
  await reviseScript(project.id, { ...request, instruction: "Try again" }, new AbortController().signal, () => {}, config);
  assert.ok(jobs.list(project.id).every((job) => job.sessionId === session));
  assert.equal(JSON.parse(gateway.requests[1].messages[1].content).history[0].status, "rejected");
  assert.equal(progress.at(-1), "Proposal saved for review. The script has not changed.");
});

test("concurrent edits during generation fail with no proposal, duplicate active jobs are blocked, interrupted jobs expire", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-writer-fail-")); const gateway = await fakeGateway();
  const config = readConfig({ V3_DATA_DIR: join(root, "db"), V3_VIDEOS_DIR: join(root, "videos"), CLIPROXYAPI_BASE_URL: gateway.baseUrl, CLIPROXYAPI_MODEL: "fixture-model" });
  const studio = openStudio(config.dataDirectory, config.videosDirectory); const jobs = openWritingJobs(config.dataDirectory);
  t.after(async () => { studio.close(); jobs.close(); await gateway.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Concurrent"); const base = studio.saveScript(project.id, context.script, null);
  const request = { baseId: base.id, start: 0, end: 8, instruction: "Clarify" };
  await assert.rejects(reviseScript(project.id, request, new AbortController().signal, () => {
    studio.saveScript(project.id, "Newer edit", base.id);
  }, config), /newer revision/);
  assert.equal(jobs.list(project.id)[0].status, "failed");
  assert.deepEqual(studio.listProposals(project.id), []);
  const id = jobs.start(project.id, request, "fixture-model");
  assert.throws(() => jobs.start(project.id, request, "fixture-model"), /already running/);
  const database = new DatabaseSync(join(config.dataDirectory, "studio.sqlite"));
  database.prepare("UPDATE writing_jobs SET deadline = '2000-01-01T00:00:00Z' WHERE id = ?").run(id); database.close();
  const recovered = openWritingJobs(config.dataDirectory);
  try { assert.equal(recovered.list(project.id).find((job) => job.id === id)?.status, "failed"); } finally { recovered.close(); }
  assert.equal(studio.readRevision(project.id, base.id)?.content, context.script);
  assert.equal(readdirSync(join(config.videosDirectory, project.id, "scripts")).length, 2);
});

test("failed or cancelled writing persists safe errors without creating proposals or changing drafts", async () => {
  for (const mode of ["http-error", "invalid", "cancel"]) {
    const root = mkdtempSync(join(tmpdir(), "v3-writer-errors-")); const gateway = await fakeGateway(mode);
    const config = readConfig({ V3_DATA_DIR: join(root, "db"), V3_VIDEOS_DIR: join(root, "videos"), CLIPROXYAPI_BASE_URL: gateway.baseUrl, CLIPROXYAPI_MODEL: "fixture-model" });
    const studio = openStudio(config.dataDirectory, config.videosDirectory); const jobs = openWritingJobs(config.dataDirectory);
    try {
      const project = studio.createProject("Failure"); const base = studio.saveScript(project.id, context.script, null);
      const controller = new AbortController();
      await assert.rejects(reviseScript(project.id, { baseId: base.id, start: 0, end: 8, instruction: "Clarify" }, controller.signal,
        () => { if (mode === "cancel") controller.abort(); }, config), /No script changes were applied/);
      const job = jobs.list(project.id)[0];
      assert.equal(job.status, "failed");
      assert.ok(!job.error?.includes("private upstream detail"));
      assert.deepEqual(studio.listProposals(project.id), []);
      assert.equal(studio.listRevisions(project.id).length, 1);
      assert.equal(studio.readRevision(project.id, base.id)?.content, context.script);
    } finally { studio.close(); jobs.close(); await gateway.close(); rmSync(root, { recursive: true, force: true }); }
  }
});

test("failed job completion rolls back proposal visibility and files; explicit retry works", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-job-atomic-")); const gateway = await fakeGateway();
  const config = readConfig({ V3_DATA_DIR: join(root, "db"), V3_VIDEOS_DIR: join(root, "videos"), CLIPROXYAPI_BASE_URL: gateway.baseUrl, CLIPROXYAPI_MODEL: "fixture-model" });
  const studio = openStudio(config.dataDirectory, config.videosDirectory); const jobs = openWritingJobs(config.dataDirectory);
  const database = new DatabaseSync(join(config.dataDirectory, "studio.sqlite"));
  t.after(async () => { database.close(); studio.close(); jobs.close(); await gateway.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Atomic"); const base = studio.saveScript(project.id, context.script, null);
  const request = { baseId: base.id, start: 0, end: 8, instruction: "Clarify" };
  database.exec("CREATE TRIGGER fail_job BEFORE UPDATE ON writing_jobs WHEN NEW.status = 'succeeded' BEGIN SELECT RAISE(ABORT, 'injected completion failure'); END;");
  await assert.rejects(reviseScript(project.id, request, new AbortController().signal, () => {}, config));
  assert.deepEqual(studio.listProposals(project.id), []);
  assert.deepEqual(readdirSync(join(config.videosDirectory, project.id, "proposals")), []);
  assert.equal(jobs.list(project.id)[0].status, "failed");
  database.exec("DROP TRIGGER fail_job");
  const id = await reviseScript(project.id, request, new AbortController().signal, () => {}, config);
  assert.equal(studio.listProposals(project.id)[0].id, id);
  assert.equal(jobs.list(project.id).filter((job) => job.status === "succeeded").length, 1);
  assert.equal(studio.listRevisions(project.id).length, 1);
});
