import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { readConfig } from "../server/config.ts";
import { DATABASE_VERSION, openDatabase } from "../server/database.ts";
import { projectManifestSchema } from "../workflow/project.ts";

test("default configuration needs no credentials", () => {
  const config = readConfig({});
  assert.equal(config.dataDirectory, resolve(".data"));
  assert.equal(config.gateway.apiKey, undefined);
});

test("optional gateway configuration accepts HTTP without connecting", () => {
  const config = readConfig({ CLIPROXYAPI_BASE_URL: "http://127.0.0.1:8317/v1" });
  assert.equal(config.gateway.baseUrl, "http://127.0.0.1:8317/v1");
});

test("invalid configuration fails validation", () => {
  for (const environment of [
    { V3_DATA_DIR: " " },
    { CLIPROXYAPI_BASE_URL: "not-a-url" },
    { CLIPROXYAPI_BASE_URL: "file:///tmp/proxy" },
    { CLIPROXYAPI_BASE_URL: "https://user:secret@example.com/v1" },
    { CLIPROXYAPI_API_KEY: " " },
  ]) assert.throws(() => readConfig(environment));
});

const manifest = {
  schemaVersion: 1,
  id: "fa2c9221-b14c-4c8c-824a-5991a2025b21",
  title: "Foundation test",
  createdAt: "2026-10-21T00:00:00Z",
};

test("project interchange validates identity and rejects unsupported contracts", () => {
  assert.deepEqual(projectManifestSchema.parse(manifest), manifest);
  for (const invalid of [
    { ...manifest, schemaVersion: 2 },
    { ...manifest, id: "../outside" },
    { ...manifest, title: " " },
    { ...manifest, title: "a".repeat(201) },
    { ...manifest, createdAt: "yesterday" },
    { ...manifest, approved: true },
  ]) assert.equal(projectManifestSchema.safeParse(invalid).success, false);
});

test("SQLite initializes, enforces constraints, and preserves rows on reopen", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "hyperframes-v3-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  let database = openDatabase(directory);
  try {
    assert.equal(database.prepare("PRAGMA user_version").get()?.user_version, DATABASE_VERSION);
    assert.equal(database.prepare("PRAGMA foreign_keys").get()?.foreign_keys, 1);
    const insert = database.prepare("INSERT INTO projects (id, title, created_at) VALUES (?, ?, ?)");
    insert.run(manifest.id, manifest.title, manifest.createdAt);
    assert.throws(() => insert.run(manifest.id, "Duplicate", manifest.createdAt));
    assert.throws(() => insert.run("another-id", " ", manifest.createdAt));
    database.close();
    database = openDatabase(directory);
    assert.equal(database.prepare("SELECT title FROM projects WHERE id = ?").get(manifest.id)?.title, manifest.title);
    assert.equal(database.prepare("PRAGMA quick_check").get()?.quick_check, "ok");
  } finally {
    database.close();
  }
});

test("newer database schema is rejected without altering existing data", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "hyperframes-v3-newer-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, "studio.sqlite");
  const newer = new DatabaseSync(path);
  newer.exec("PRAGMA user_version = 99; CREATE TABLE future_data (value TEXT); INSERT INTO future_data VALUES ('keep');");
  newer.close();
  assert.throws(() => openDatabase(directory), /Unsupported database version: 99/);
  const unchanged = new DatabaseSync(path);
  try {
    assert.equal(unchanged.prepare("PRAGMA user_version").get()?.user_version, 99);
    assert.equal(unchanged.prepare("SELECT value FROM future_data").get()?.value, "keep");
  } finally {
    unchanged.close();
  }
});
