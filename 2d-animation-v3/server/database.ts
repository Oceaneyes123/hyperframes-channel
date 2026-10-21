import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

export const DATABASE_VERSION = 5;

export function openDatabase(dataDirectory: string) {
  mkdirSync(dataDirectory, { recursive: true });
  const database = new DatabaseSync(join(dataDirectory, "studio.sqlite"));
  try {
    database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
    database.exec("BEGIN IMMEDIATE");
    const version = database.prepare("PRAGMA user_version").get()?.user_version;
    if (typeof version !== "number" || version < 0 || version > DATABASE_VERSION) {
      throw new Error(`Unsupported database version: ${version}`);
    }
    if (version === 0) {
      database.exec(`
        CREATE TABLE projects (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 200),
          created_at TEXT NOT NULL
        ) STRICT;
      `);
    }
    if (version < 2) {
      database.exec(`
        CREATE TABLE script_revisions (
          id TEXT PRIMARY KEY NOT NULL,
          project_id TEXT NOT NULL REFERENCES projects(id),
          revision INTEGER NOT NULL CHECK(revision > 0),
          parent_id TEXT REFERENCES script_revisions(id),
          created_at TEXT NOT NULL,
          sha256 TEXT NOT NULL CHECK(length(sha256) = 64),
          UNIQUE(project_id, revision)
        ) STRICT;
        PRAGMA user_version = 2;
      `);
    }
    if (version < 3) {
      database.exec(`
        CREATE TABLE script_proposals (
          id TEXT PRIMARY KEY NOT NULL,
          project_id TEXT NOT NULL REFERENCES projects(id),
          base_id TEXT NOT NULL REFERENCES script_revisions(id),
          created_at TEXT NOT NULL,
          sha256 TEXT NOT NULL CHECK(length(sha256) = 64),
          status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
          result_id TEXT REFERENCES script_revisions(id),
          CHECK((status = 'accepted' AND result_id IS NOT NULL) OR (status != 'accepted' AND result_id IS NULL))
        ) STRICT;
        CREATE TABLE script_acceptances (
          project_id TEXT PRIMARY KEY NOT NULL REFERENCES projects(id),
          revision_id TEXT NOT NULL REFERENCES script_revisions(id),
          sha256 TEXT NOT NULL CHECK(length(sha256) = 64),
          accepted_at TEXT NOT NULL
        ) STRICT;
        CREATE TABLE writing_sessions (
          id TEXT PRIMARY KEY NOT NULL,
          project_id TEXT NOT NULL UNIQUE REFERENCES projects(id),
          created_at TEXT NOT NULL
        ) STRICT;
        CREATE TABLE writing_jobs (
          id TEXT PRIMARY KEY NOT NULL,
          session_id TEXT NOT NULL REFERENCES writing_sessions(id),
          project_id TEXT NOT NULL REFERENCES projects(id),
          request_json TEXT NOT NULL,
          model TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('running', 'succeeded', 'failed')),
          created_at TEXT NOT NULL,
          deadline TEXT NOT NULL,
          proposal_id TEXT REFERENCES script_proposals(id),
          error TEXT,
          CHECK((status = 'succeeded' AND proposal_id IS NOT NULL) OR (status != 'succeeded' AND proposal_id IS NULL))
        ) STRICT;
        CREATE UNIQUE INDEX one_active_writing_job ON writing_jobs(project_id) WHERE status = 'running';
        PRAGMA user_version = 3;
      `);
    }
    if (version < 4) {
      database.exec(`
        CREATE TABLE scriptwriting_runs (
          id TEXT PRIMARY KEY NOT NULL,
          project_id TEXT NOT NULL REFERENCES projects(id),
          kind TEXT NOT NULL CHECK(kind IN ('brief', 'hooks', 'draft')),
          parent_id TEXT REFERENCES scriptwriting_runs(id),
          base_revision_id TEXT REFERENCES script_revisions(id),
          created_at TEXT NOT NULL,
          deadline TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('running', 'complete', 'failed')),
          instruction TEXT NOT NULL,
          hook_id TEXT,
          model TEXT,
          sha256 TEXT,
          error TEXT,
          CHECK((status = 'complete' AND sha256 IS NOT NULL) OR (status != 'complete' AND sha256 IS NULL))
        ) STRICT;
        CREATE UNIQUE INDEX one_active_scriptwriting_run ON scriptwriting_runs(project_id) WHERE status = 'running' AND kind != 'brief';
        ALTER TABLE script_revisions ADD COLUMN writing_run_id TEXT REFERENCES scriptwriting_runs(id);
        CREATE UNIQUE INDEX one_import_per_writing_run ON script_revisions(writing_run_id) WHERE writing_run_id IS NOT NULL;
        PRAGMA user_version = 4;
      `);
    }
    if (version < 5) {
      database.exec(`
        CREATE TABLE visual_runs (
          id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id),
          request_json TEXT NOT NULL, script_hash TEXT NOT NULL, model TEXT NOT NULL,
          created_at TEXT NOT NULL, deadline TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('running', 'complete', 'failed')),
          sha256 TEXT, error TEXT,
          CHECK((status = 'complete' AND sha256 IS NOT NULL) OR (status != 'complete' AND sha256 IS NULL))
        ) STRICT;
        CREATE UNIQUE INDEX one_active_visual_run ON visual_runs(project_id) WHERE status = 'running';
        CREATE TABLE concept_selections (
          id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL REFERENCES projects(id),
          run_id TEXT NOT NULL REFERENCES visual_runs(id), option_index INTEGER NOT NULL CHECK(option_index BETWEEN 0 AND 2), created_at TEXT NOT NULL
        ) STRICT;
        CREATE TABLE storyboard_acceptances (
          project_id TEXT PRIMARY KEY NOT NULL REFERENCES projects(id), run_id TEXT NOT NULL REFERENCES visual_runs(id),
          sha256 TEXT NOT NULL, accepted_at TEXT NOT NULL
        ) STRICT;
        PRAGMA user_version = 5;
      `);
    }
    database.exec("COMMIT");
    return database;
  } catch (error) {
    database.close();
    throw error;
  }
}
