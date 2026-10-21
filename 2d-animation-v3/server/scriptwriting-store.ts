import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { briefSchema, hooksSchema, validateDraft, writingArtifactSchema, writingOutputSchema, writingRequestSchema,
  type WritingArtifact, type WritingOutput } from "../workflow/scriptwriting.ts";

const hash = (bytes: string) => createHash("sha256").update(bytes).digest("hex");
export class WritingConflictError extends Error {}
const pathFor = (directory: string, projectId: string, id: string) => join(directory, z.uuid().parse(projectId), "writing", `${z.uuid().parse(id)}.json`);

export function latestWritingBrief(database: DatabaseSync, projectId: string) {
  z.uuid().parse(projectId);
  return database.prepare("SELECT id FROM scriptwriting_runs WHERE project_id = ? AND kind = 'brief' AND status = 'complete' ORDER BY rowid DESC LIMIT 1").get(projectId)?.id as string | undefined;
}

export function readWritingArtifact(database: DatabaseSync, directory: string, projectId: string, id: string, depth = 0): WritingArtifact | null {
  if (depth > 2) throw new Error("Invalid writing dependency chain.");
  z.uuid().parse(projectId); z.uuid().parse(id);
  const row = database.prepare("SELECT * FROM scriptwriting_runs WHERE id = ? AND project_id = ? AND status = 'complete'").get(id, projectId);
  if (!row) return null;
  const bytes = readFileSync(pathFor(directory, projectId, id), "utf8");
  if (hash(bytes) !== row.sha256) throw new Error("Writing artifact integrity check failed.");
  const artifact = writingArtifactSchema.parse(JSON.parse(bytes));
  if (artifact.id !== id || artifact.projectId !== projectId || artifact.output.kind !== row.kind || artifact.parentId !== row.parent_id
    || artifact.baseRevisionId !== row.base_revision_id || artifact.createdAt !== row.created_at) throw new Error("Writing artifact index mismatch.");
  if (artifact.output.kind === "brief") {
    if (artifact.parentId || artifact.parentHash) throw new Error("Invalid brief dependency.");
  } else {
    const parent = artifact.parentId ? readWritingArtifact(database, directory, projectId, artifact.parentId, depth + 1) : null;
    const parentRow = parent ? database.prepare("SELECT sha256 FROM scriptwriting_runs WHERE id = ?").get(parent.id) : null;
    if (!parent || parentRow?.sha256 !== artifact.parentHash) throw new Error("Writing dependency mismatch.");
    if (artifact.output.kind === "hooks") {
      if (parent.output.kind !== "brief") throw new Error("Hooks require a research brief.");
      hooksSchema.parse({ hooks: artifact.output.hooks });
      const brief = parent.output.brief;
      for (const hook of artifact.output.hooks) if (hook.claimIds.some((claimId) => !brief.claims.some((claim) => claim.id === claimId))) throw new Error("Unknown hook claim.");
    } else {
      if (parent.output.kind !== "hooks" || !parent.parentId) throw new Error("Draft requires hook options.");
      const brief = readWritingArtifact(database, directory, projectId, parent.parentId, depth + 1);
      const hook = parent.output.hooks.find((item) => item.id === (artifact.output.kind === "draft" ? artifact.output.hookId : ""));
      if (brief?.output.kind !== "brief" || !hook || row.hook_id !== artifact.output.hookId) throw new Error("Draft dependency mismatch.");
      validateDraft(artifact.output.original, artifact.output.refined, brief.output.brief, hook);
      const lineCount = artifact.output.refined.lines.length;
      if (artifact.output.review.findings.some((finding) => finding.line !== null && finding.line > lineCount)) throw new Error("Editorial finding references a missing line.");
    }
  }
  return artifact;
}

export function isCurrentWritingBrief(database: DatabaseSync, directory: string, projectId: string, artifact: WritingArtifact) {
  const briefId = artifact.output.kind === "brief" ? artifact.id : artifact.output.kind === "hooks" ? artifact.parentId
    : artifact.parentId ? readWritingArtifact(database, directory, projectId, artifact.parentId)?.parentId : null;
  return briefId === latestWritingBrief(database, projectId);
}

export function requireCurrentWritingBrief(database: DatabaseSync, directory: string, projectId: string, artifact: WritingArtifact) {
  if (!isCurrentWritingBrief(database, directory, projectId, artifact)) throw new WritingConflictError("Research brief changed. Generate from the current brief.");
}

export function openScriptwriting(directory: string, videosDirectory: string) {
  const database = openDatabase(directory);
  database.prepare("UPDATE scriptwriting_runs SET status = 'failed', error = 'Request interrupted or timed out. Retry explicitly.' WHERE status = 'running' AND deadline < ?").run(new Date().toISOString());
  function read(projectId: string, id: string) { return readWritingArtifact(database, videosDirectory, projectId, id); }
  function write(artifact: WritingArtifact) {
    const bytes = JSON.stringify(writingArtifactSchema.parse(artifact), null, 2) + "\n";
    const destination = pathFor(videosDirectory, artifact.projectId, artifact.id);
    const temporary = destination + ".tmp";
    let created = false; let renamed = false;
    try {
      if (existsSync(destination)) throw new Error("Writing artifact already exists; preserve it for recovery.");
      mkdirSync(join(videosDirectory, artifact.projectId, "writing"), { recursive: true });
      writeFileSync(temporary, bytes, { flag: "wx", flush: true }); created = true;
      renameSync(temporary, destination); renamed = true;
      database.prepare("UPDATE scriptwriting_runs SET status = 'complete', sha256 = ?, error = NULL WHERE id = ?").run(hash(bytes), artifact.id);
      read(artifact.projectId, artifact.id);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      if (created) rmSync(temporary, { force: true });
      if (renamed) rmSync(destination, { force: true });
      throw error;
    }
  }
  return {
    close: () => database.close(), read,
    latestBrief: (projectId: string) => latestWritingBrief(database, projectId),
    list(projectId: string) {
      z.uuid().parse(projectId);
      return database.prepare(`SELECT id, kind, status, created_at AS createdAt, error, model,
        (SELECT id FROM script_revisions WHERE writing_run_id = scriptwriting_runs.id) AS importedRevisionId
        FROM scriptwriting_runs WHERE project_id = ? ORDER BY rowid DESC`).all(projectId).map((row) => z.strictObject({
          id: z.uuid(), kind: z.enum(["brief", "hooks", "draft"]), status: z.enum(["running", "complete", "failed"]),
          createdAt: z.iso.datetime(), error: z.string().nullable(), model: z.string().nullable(), importedRevisionId: z.uuid().nullable(),
        }).parse(row));
    },
    saveBrief(projectId: string, input: unknown, expectedBriefId: string | null) {
      z.uuid().nullable().parse(expectedBriefId);
      const brief = briefSchema.parse(input); const now = new Date().toISOString(); const id = randomUUID();
      database.exec("BEGIN IMMEDIATE");
      try {
        if ((latestWritingBrief(database, projectId) ?? null) !== expectedBriefId) throw new WritingConflictError("A newer brief exists. Reload before saving.");
        database.prepare("INSERT INTO scriptwriting_runs (id, project_id, kind, created_at, deadline, status, instruction) VALUES (?, ?, 'brief', ?, ?, 'running', '')").run(id, projectId, now, now);
      } catch (error) { database.exec("ROLLBACK"); throw error; }
      write({ schemaVersion: 1, id, projectId, createdAt: now, parentId: null, parentHash: null, baseRevisionId: null, output: { kind: "brief", brief } });
      return id;
    },
    begin(projectId: string, input: unknown, model: string) {
      const request = writingRequestSchema.parse(input); const now = new Date().toISOString(); const id = randomUUID();
      database.exec("BEGIN IMMEDIATE");
      try {
        const parent = read(projectId, request.parentId);
        if (!parent || parent.output.kind !== (request.kind === "hooks" ? "brief" : "hooks")) throw new Error("Invalid writing context.");
        requireCurrentWritingBrief(database, videosDirectory, projectId, parent);
        if (database.prepare("SELECT id FROM scriptwriting_runs WHERE project_id = ? AND status = 'running'").get(projectId)
          || database.prepare("SELECT id FROM writing_jobs WHERE project_id = ? AND status = 'running' AND deadline >= ?").get(projectId, now)) throw new Error("A writing request is already running.");
        if (request.kind === "draft" && (parent.output.kind !== "hooks" || !parent.output.hooks.some((hook) => hook.id === request.hookId))) throw new Error("Choose an available hook.");
        const base = database.prepare("SELECT id FROM script_revisions WHERE project_id = ? ORDER BY revision DESC LIMIT 1").get(projectId)?.id ?? null;
        database.prepare("INSERT INTO scriptwriting_runs (id, project_id, kind, parent_id, base_revision_id, created_at, deadline, status, instruction, hook_id, model) VALUES (?, ?, ?, ?, ?, ?, ?, 'running', ?, ?, ?)")
          .run(id, projectId, request.kind, parent.id, base, now, new Date(Date.now() + 360_000).toISOString(), request.instruction, request.kind === "draft" ? request.hookId : null, model);
        database.exec("COMMIT"); return id;
      } catch (error) { database.exec("ROLLBACK"); throw error; }
    },
    complete(projectId: string, id: string, input: WritingOutput) {
      const output = writingOutputSchema.parse(input);
      database.exec("BEGIN IMMEDIATE");
      let artifact: WritingArtifact;
      try {
        const row = database.prepare("SELECT * FROM scriptwriting_runs WHERE id = ? AND project_id = ? AND status = 'running' AND deadline >= ?").get(z.uuid().parse(id), z.uuid().parse(projectId), new Date().toISOString());
        if (!row || row.kind !== output.kind) throw new Error("Writing request no longer active.");
        const parent = read(projectId, z.uuid().parse(row.parent_id));
        if (!parent) throw new Error("Missing writing dependency.");
        requireCurrentWritingBrief(database, videosDirectory, projectId, parent);
        artifact = writingArtifactSchema.parse({ schemaVersion: 1, id, projectId, createdAt: row.created_at, parentId: row.parent_id,
          parentHash: database.prepare("SELECT sha256 FROM scriptwriting_runs WHERE id = ?").get(parent.id)?.sha256, baseRevisionId: row.base_revision_id, output });
      } catch (error) { database.exec("ROLLBACK"); throw error; }
      write(artifact); return id;
    },
    fail(projectId: string, id: string) {
      database.prepare("UPDATE scriptwriting_runs SET status = 'failed', error = 'Writing failed or context changed. No script changes applied; inspect history and retry explicitly.' WHERE id = ? AND project_id = ? AND status = 'running'").run(z.uuid().parse(id), z.uuid().parse(projectId));
    },
  };
}
