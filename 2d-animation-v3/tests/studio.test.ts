import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { test, type TestContext } from "node:test";
import { DATABASE_VERSION, openDatabase } from "../server/database.ts";
import { isLocalRequest } from "../server/local-request.ts";
import { ConflictError, MissingProjectError, openStudio } from "../server/studio.ts";

function fixture(context: TestContext) {
  const directory = mkdtempSync(join(tmpdir(), "hyperframes-v3-studio-"));
  const data = join(directory, "data");
  const videos = join(directory, "videos");
  const studio = openStudio(data, videos);
  context.after(() => { studio.close(); rmSync(directory, { recursive: true, force: true }); });
  return { studio, directory, data, videos };
}

test("schema v1 project data survives additive migration and reopen", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "hyperframes-v3-migration-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, "studio.sqlite");
  const old = new DatabaseSync(path);
  const id = randomUUID();
  old.exec("CREATE TABLE projects (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL) STRICT; PRAGMA user_version = 1;");
  old.prepare("INSERT INTO projects VALUES (?, ?, ?)").run(id, "Existing project", "2026-10-21T00:00:00Z");
  old.close();
  for (let attempt = 0; attempt < 2; attempt++) {
    const migrated = openDatabase(directory);
    try {
      assert.equal(migrated.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION);
      assert.equal(migrated.prepare("SELECT title FROM projects WHERE id = ?").get(id)?.title, "Existing project");
      assert.equal(migrated.prepare("SELECT count(*) AS count FROM script_revisions").get()?.count, 0);
    } finally { migrated.close(); }
  }
});

test("failed schema expansion rolls back without changing project data or version", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "hyperframes-v3-migration-fail-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, "studio.sqlite");
  const old = new DatabaseSync(path);
  old.exec("CREATE TABLE projects (id TEXT, title TEXT); INSERT INTO projects VALUES ('keep', 'Original'); CREATE TABLE script_revisions (unexpected TEXT); PRAGMA user_version = 1;");
  old.close();
  assert.throws(() => openDatabase(directory), /already exists/);
  const unchanged = new DatabaseSync(path);
  try {
    assert.equal(unchanged.prepare("PRAGMA user_version").get()?.user_version, 1);
    assert.equal(unchanged.prepare("SELECT title FROM projects").get()?.title, "Original");
  } finally { unchanged.close(); }
});

test("projects and exact script revisions survive independent connections", (context) => {
  const { studio, data, videos } = fixture(context);
  assert.deepEqual(studio.listProjects(), []);
  const project = studio.createProject("  A real project  ");
  assert.equal(project.title, "A real project");
  assert.equal(studio.listProjects()[0].id, project.id);
  const first = studio.saveScript(project.id, "First draft.\n\nKeep whitespace.  ", null);
  const firstBytes = readFileSync(join(videos, project.id, "scripts", `${first.id}.json`), "utf8");
  const second = studio.saveScript(project.id, "A revised opening.", first.id);
  assert.equal(second.parentId, first.id);
  assert.equal(second.revision, 2);
  assert.equal(readFileSync(join(videos, project.id, "scripts", `${first.id}.json`), "utf8"), firstBytes);
  const reopened = openStudio(data, videos);
  try {
    assert.deepEqual(reopened.getProject(project.id), project);
    assert.deepEqual(reopened.readRevision(project.id, first.id), first);
    assert.deepEqual(reopened.readRevision(project.id, second.id), second);
    assert.deepEqual(reopened.listRevisions(project.id).map((row) => row.id), [second.id, first.id]);
  } finally { reopened.close(); }
});

test("stale saves from another connection fail without extra files or lost revisions", (context) => {
  const { studio, data, videos } = fixture(context);
  const project = studio.createProject("Concurrent edits");
  const first = studio.saveScript(project.id, "Original", null);
  const other = openStudio(data, videos);
  try {
    const second = other.saveScript(project.id, "Other tab", first.id);
    assert.throws(() => studio.saveScript(project.id, "Stale draft", first.id), ConflictError);
    assert.equal(studio.readRevision(project.id, second.id)?.content, "Other tab");
    assert.equal(studio.listRevisions(project.id).length, 2);
    assert.equal(readdirSync(join(videos, project.id, "scripts")).length, 2);
  } finally { other.close(); }
});

test("browser form line endings normalize before validation and persistence", (context) => {
  const { studio } = fixture(context);
  const project = studio.createProject("Line endings");
  const revision = studio.saveScript(project.id, "Opening.\r\n\r\nKeep spacing.  \rNext line.", null);
  assert.equal(revision.content, "Opening.\n\nKeep spacing.  \nNext line.");
  assert.equal(studio.readRevision(project.id, revision.id)?.content, revision.content);
});

test("invalid, cross-project, and missing-project inputs do not alter saved data", (context) => {
  const { studio } = fixture(context);
  assert.throws(() => studio.createProject(" "));
  const first = studio.createProject("First");
  const second = studio.createProject("Second");
  const revision = studio.saveScript(first.id, "Original", null);
  assert.equal(studio.readRevision(second.id, revision.id), null);
  assert.throws(() => studio.saveScript(second.id, "Cross-project parent", revision.id), ConflictError);
  assert.throws(() => studio.saveScript(randomUUID(), "Missing", null), MissingProjectError);
  for (const content of [" ", "x".repeat(50_001), 123]) {
    assert.throws(() => studio.saveScript(first.id, content, revision.id));
  }
  assert.throws(() => studio.getProject("../escape"));
  assert.throws(() => studio.saveScript("../escape", "Unsafe", null));
  assert.equal(studio.listRevisions(first.id).length, 1);
});

test("corrupted or missing indexed manifests fail closed; unindexed files stay invisible", (context) => {
  const { studio, videos } = fixture(context);
  const project = studio.createProject("Integrity");
  const revision = studio.saveScript(project.id, "Original", null);
  const directory = join(videos, project.id, "scripts");
  const path = join(directory, `${revision.id}.json`);
  writeFileSync(join(directory, `${randomUUID()}.json`), "Unindexed interrupted save");
  assert.equal(studio.listRevisions(project.id).length, 1);
  writeFileSync(path, "Tampered");
  assert.throws(() => studio.readRevision(project.id, revision.id), /integrity/);
  assert.throws(() => studio.saveScript(project.id, "Replacement", revision.id), /integrity/);
  rmSync(path);
  assert.throws(() => studio.readRevision(project.id, revision.id), /ENOENT/);
  assert.equal(studio.listRevisions(project.id).length, 1);
});

test("filesystem write failure leaves no revision index and permits retry", (context) => {
  const { studio, data, directory } = fixture(context);
  const project = studio.createProject("Storage failure");
  const blocked = join(directory, "blocked");
  writeFileSync(blocked, "A file, not a directory");
  const writer = openStudio(data, blocked);
  try {
    assert.throws(() => writer.saveScript(project.id, "Draft", null));
    assert.deepEqual(writer.listRevisions(project.id), []);
  } finally { writer.close(); }
  assert.equal(studio.saveScript(project.id, "Retry", null).revision, 1);
});

test("mutation requests require exact loopback host and matching origin", () => {
  assert.equal(isLocalRequest("127.0.0.1:3003", "http://127.0.0.1:3003"), true);
  assert.equal(isLocalRequest("localhost:3003", "http://localhost:3003"), true);
  for (const [host, origin] of [
    [null, null], ["127.0.0.1:3003", null], ["evil.example:3003", "http://evil.example:3003"],
    ["127.0.0.1:3003", "http://evil.example"], ["127.0.0.1:3003", "broken"],
  ]) assert.equal(isLocalRequest(host, origin), false);
});

test("failed index insertion removes the new manifest and preserves the previous revision", (context) => {
  const { studio, data, videos } = fixture(context);
  const project = studio.createProject("Index failure");
  const first = studio.saveScript(project.id, "Original", null);
  const database = new DatabaseSync(join(data, "studio.sqlite"));
  try {
    database.exec("CREATE TRIGGER fail_revision BEFORE INSERT ON script_revisions BEGIN SELECT RAISE(ABORT, 'injected index failure'); END;");
    assert.throws(() => studio.saveScript(project.id, "Failed revision", first.id), /injected index failure/);
    assert.deepEqual(readdirSync(join(videos, project.id, "scripts")), [`${first.id}.json`]);
    assert.equal(studio.readRevision(project.id, first.id)?.content, "Original");
    database.exec("DROP TRIGGER fail_revision");
    assert.equal(studio.saveScript(project.id, "Retry", first.id).revision, 2);
  } finally { database.close(); }
});
