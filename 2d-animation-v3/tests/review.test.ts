import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { test, type TestContext } from "node:test";
import { openStudio, ConflictError } from "../server/studio.ts";
import { openDatabase, DATABASE_VERSION } from "../server/database.ts";
import { applyReplacement } from "../workflow/review.ts";

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "v3-review-"));
  const data = join(root, "data"); const videos = join(root, "videos");
  const studio = openStudio(data, videos);
  t.after(() => { studio.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Review");
  const base = studio.saveScript(project.id, "Opening.\nKeep this ending.", null);
  const request = { baseId: base.id, start: 0, end: 8, instruction: "Make the opening clearer." };
  return { root, data, videos, studio, project, base, request };
}

test("scoped proposals preserve outside text and acceptance survives reopen; later edits become stale", (t) => {
  const { data, videos, studio, project, base, request } = fixture(t);
  const original = readFileSync(join(videos, project.id, "scripts", `${base.id}.json`));
  const proposal = studio.createProposal(project.id, request, "Clearer opening.", "More concrete.");
  assert.equal(studio.listRevisions(project.id).length, 1);
  assert.equal(studio.acceptance(project.id), null);
  assert.equal(studio.readProposal(project.id, proposal.id)?.replacement, "Clearer opening.");
  const revised = studio.decideProposal(project.id, proposal.id, "accept")!;
  assert.equal(revised.content, "Clearer opening.\nKeep this ending.");
  assert.deepEqual(readFileSync(join(videos, project.id, "scripts", `${base.id}.json`)), original);
  const other = openStudio(data, videos);
  try {
    assert.equal(other.acceptance(project.id)?.revisionId, revised.id);
    assert.equal(other.acceptance(project.id)?.stale, false);
    assert.equal(other.listProposals(project.id)[0].status, "accepted");
    assert.throws(() => other.decideProposal(project.id, proposal.id, "accept"), ConflictError);
    assert.throws(() => other.decideProposal(project.id, proposal.id, "reject"), ConflictError);
    const next = other.saveScript(project.id, "New draft", revised.id);
    assert.equal(studio.acceptance(project.id)?.stale, true);
    assert.throws(() => studio.acceptScript(project.id, revised.id), ConflictError);
    studio.acceptScript(project.id, next.id);
    assert.equal(studio.acceptance(project.id)?.stale, false);
  } finally { other.close(); }
});

test("stale and rejected proposals cannot change current draft; other project cannot decide", (t) => {
  const { studio, project, base, request } = fixture(t);
  const proposal = studio.createProposal(project.id, request, "Replacement.", "");
  const foreign = studio.createProject("Other project");
  assert.equal(studio.readProposal(foreign.id, proposal.id), null);
  assert.throws(() => studio.decideProposal(foreign.id, proposal.id, "accept"), ConflictError);
  const next = studio.saveScript(project.id, "Newer edit", base.id);
  assert.throws(() => studio.decideProposal(project.id, proposal.id, "accept"), ConflictError);
  assert.equal(studio.acceptance(project.id), null);
  studio.decideProposal(project.id, proposal.id, "reject");
  assert.equal(studio.listRevisions(project.id)[0].id, next.id);
  assert.throws(() => studio.decideProposal(project.id, proposal.id, "accept"), ConflictError);
  assert.throws(() => studio.createProposal(project.id, request, "Too late", ""), ConflictError);
});

test("selection validation rejects out of range, split Unicode, oversized and blank output", (t) => {
  const { studio, project, request } = fixture(t);
  assert.equal(applyReplacement("a😀b", 1, 3, "X"), "aXb");
  for (const [start, end] of [[-1, 1], [0, 10], [1, 2], [2, 3], [1, 1], [0.5, 1]]) {
    assert.throws(() => applyReplacement("a😀b", start, end, "X"));
  }
  assert.throws(() => studio.createProposal(project.id, { ...request, end: 500 }, "X", ""));
  assert.throws(() => studio.createProposal(project.id, request, " ", ""));
  assert.throws(() => studio.createProposal(project.id, request, "x".repeat(50_000), ""));
  assert.deepEqual(studio.listProposals(project.id), []);
});

test("proposal corruption fails closed and acceptance transaction rollback preserves files/state", (t) => {
  const { studio, project, base, request, data, videos } = fixture(t);
  const proposal = studio.createProposal(project.id, request, "Clearer.", "");
  const path = join(videos, project.id, "proposals", `${proposal.id}.json`);
  const bytes = readFileSync(path);
  writeFileSync(path, "Tampered");
  assert.throws(() => studio.decideProposal(project.id, proposal.id, "accept"), /integrity/);
  writeFileSync(path, bytes);
  const database = new DatabaseSync(join(data, "studio.sqlite"));
  try {
    database.exec("CREATE TRIGGER fail_acceptance BEFORE INSERT ON script_acceptances BEGIN SELECT RAISE(ABORT, 'injected acceptance failure'); END;");
    assert.throws(() => studio.decideProposal(project.id, proposal.id, "accept"), /injected acceptance failure/);
    assert.deepEqual(readdirSync(join(videos, project.id, "scripts")), [`${base.id}.json`]);
    assert.equal(studio.listProposals(project.id)[0].status, "pending");
    assert.equal(studio.acceptance(project.id), null);
    database.exec("DROP TRIGGER fail_acceptance");
    assert.ok(studio.decideProposal(project.id, proposal.id, "accept"));
  } finally { database.close(); }
});

test("schema 2 upgrade preserves exact revisions and is repeatable", (t) => {
  const { root, videos, project, base } = fixture(t);
  const data = join(root, "legacy"); mkdirSync(data);
  const database = new DatabaseSync(join(data, "studio.sqlite"));
  database.exec(`CREATE TABLE projects (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL) STRICT;
    CREATE TABLE script_revisions (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id), revision INTEGER NOT NULL,
      parent_id TEXT REFERENCES script_revisions(id), created_at TEXT NOT NULL, sha256 TEXT NOT NULL, UNIQUE(project_id, revision)) STRICT;
    PRAGMA user_version = 2;`);
  database.prepare("INSERT INTO projects VALUES (?, ?, ?)").run(project.id, project.title, project.createdAt);
  const payload = readFileSync(join(videos, project.id, "scripts", `${base.id}.json`));
  database.prepare("INSERT INTO script_revisions VALUES (?, ?, ?, ?, ?, ?)").run(base.id, project.id, base.revision, base.parentId, base.createdAt, createHash("sha256").update(payload).digest("hex"));
  database.close();
  for (let attempt = 0; attempt < 2; attempt++) {
    const migrated = openDatabase(data);
    assert.equal(migrated.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION);
    migrated.close();
  }
  const reopened = openStudio(data, videos);
  try { assert.deepEqual(reopened.readRevision(project.id, base.id), base); } finally { reopened.close(); }
  assert.ok(readFileSync(join(videos, project.id, "scripts", `${base.id}.json`)).length);
});
