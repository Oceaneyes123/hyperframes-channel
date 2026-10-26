import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { ConflictError, openStudio } from "./studio.ts";
import { conceptsSchema, replaceShot, validateStoryboard, visualSchemaVersion, visualArtifactSchema, visualOutputSchema, visualRequestSchema, type VisualOutput } from "../workflow/visuals.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";

const digest = (bytes: string) => createHash("sha256").update(bytes).digest("hex");
const selectionSchema = z.strictObject({ id: z.uuid(), projectId: z.uuid(), runId: z.uuid(), optionIndex: z.number().int().min(0).max(2) });
const rowSchema = z.object({ id: z.uuid(), project_id: z.uuid(), request_json: z.string(), script_hash: z.string(),
  model: z.string(), created_at: z.iso.datetime(), deadline: z.iso.datetime(), status: z.enum(["running", "complete", "failed"]), sha256: z.string().nullable(), error: z.string().nullable() });

export function openVisuals(directory: string, videosDirectory: string) {
  const database = openDatabase(directory); const studio = openStudio(directory, videosDirectory);
  database.prepare("UPDATE visual_runs SET status = 'failed', error = 'Request interrupted or timed out. Retry explicitly.' WHERE status = 'running' AND deadline < ?").run(new Date().toISOString());
  const pathFor = (projectId: string, id: string) => join(videosDirectory, z.uuid().parse(projectId), "visuals", `${z.uuid().parse(id)}.json`);
  function rows(projectId: string) {
    return database.prepare("SELECT * FROM visual_runs WHERE project_id = ? ORDER BY rowid DESC").all(z.uuid().parse(projectId)).map((row) => rowSchema.parse(row));
  }
  function latest(projectId: string, kind: "concepts" | "storyboard") {
    return rows(projectId).find((row) => row.status === "complete" && (visualRequestSchema.parse(JSON.parse(row.request_json)).kind === "concepts" ? "concepts" : "storyboard") === kind)?.id ?? null;
  }
  function selection(projectId: string) {
    const row = database.prepare("SELECT id, project_id AS projectId, run_id AS runId, option_index AS optionIndex FROM concept_selections WHERE project_id = ? ORDER BY rowid DESC LIMIT 1").get(z.uuid().parse(projectId));
    return row ? selectionSchema.parse(row) : null;
  }
  function read(projectId: string, id: string) {
    const row = rows(projectId).find((item) => item.id === z.uuid().parse(id) && item.status === "complete");
    if (!row) return null;
    const bytes = readFileSync(pathFor(projectId, id), "utf8");
    if (digest(bytes) !== row.sha256) throw new Error("Visual artifact integrity check failed.");
    const artifact = visualArtifactSchema.parse(JSON.parse(bytes)); const request = visualRequestSchema.parse(JSON.parse(row.request_json));
    if (artifact.id !== id || artifact.projectId !== projectId || artifact.scriptId !== request.scriptId || artifact.scriptHash !== row.script_hash ||
      artifact.selectionId !== request.selectionId || artifact.baseId !== request.baseId || artifact.instruction !== request.instruction || artifact.createdAt !== row.created_at ||
      artifact.output.kind !== (request.kind === "concepts" ? "concepts" : "storyboard")) throw new Error("Visual artifact index mismatch.");
    const script = studio.readRevision(projectId, artifact.scriptId);
    if (!script || studio.listRevisions(projectId).find((item) => item.id === script.id)?.sha256 !== artifact.scriptHash) throw new Error("Visual script dependency mismatch.");
    if (artifact.output.kind === "storyboard") validateStoryboard(artifact.output, script.content);
    return artifact;
  }
  function requireScript(projectId: string, scriptId: string, hash?: string) {
    const accepted = studio.acceptance(projectId);
    if (!accepted || accepted.stale || accepted.revisionId !== scriptId || hash && accepted.sha256 !== hash) throw new ConflictError("Accept the current script and research before visual planning.");
    return accepted;
  }
  function requireSelection(projectId: string, selectionId: string) {
    const chosen = selection(projectId);
    if (!chosen || chosen.id !== selectionId || latest(projectId, "concepts") !== chosen.runId) throw new ConflictError("Concept selection changed. Reload before continuing.");
    const concepts = read(projectId, chosen.runId);
    if (!concepts || concepts.output.kind !== "concepts") throw new Error("Concept dependency missing.");
    requireScript(projectId, concepts.scriptId, concepts.scriptHash);
    return { chosen, concept: concepts.output.concepts[chosen.optionIndex] };
  }
  function current(projectId: string, id: string) {
    const artifact = read(projectId, id); if (!artifact) return false;
    try {
      requireScript(projectId, artifact.scriptId, artifact.scriptHash);
      if (artifact.selectionId) requireSelection(projectId, artifact.selectionId);
      return latest(projectId, artifact.output.kind) === id;
    } catch (error) { if (error instanceof ConflictError) return false; throw error; }
  }
  function transaction<T>(run: () => T) {
    database.exec("BEGIN IMMEDIATE");
    try { const result = run(); database.exec("COMMIT"); return result; }
    catch (error) { database.exec("ROLLBACK"); throw error; }
  }
  return {
    close() { studio.close(); database.close(); }, read, latest, selection, current,
    list: (projectId: string) => rows(projectId).map((row) => ({ id: row.id, kind: visualRequestSchema.parse(JSON.parse(row.request_json)).kind, status: row.status, model: row.model, createdAt: row.created_at, error: row.error })),
    context(projectId: string, input: unknown) {
      const request = visualRequestSchema.parse(input); requireScript(projectId, request.scriptId);
      return { lines: studio.readRevision(projectId, request.scriptId)!.content,
        concept: request.selectionId ? requireSelection(projectId, request.selectionId).concept : null,
        board: request.kind === "shot" && request.baseId ? read(projectId, request.baseId)?.output : null };
    },
    begin(projectId: string, input: unknown, model: string) {
      const request = visualRequestSchema.parse(input);
      return transaction(() => {
        const accepted = requireScript(projectId, request.scriptId);
        if (request.selectionId) requireSelection(projectId, request.selectionId);
        const kind = request.kind === "concepts" ? "concepts" : "storyboard";
        if (latest(projectId, kind) !== request.baseId) throw new ConflictError("A newer visual proposal exists. Reload before continuing.");
        if (request.kind === "shot") {
          const base = read(projectId, request.baseId!);
          if (!base || !current(projectId, base.id) || base.output.kind !== "storyboard" || !base.output.shots[request.shotIndex!]) throw new ConflictError("Shot is unavailable or stale.");
        }
        if (rows(projectId).some((row) => row.status === "running")) throw new ConflictError("A visual request is already running.");
        const id = randomUUID(); const now = new Date().toISOString();
        database.prepare("INSERT INTO visual_runs (id, project_id, request_json, script_hash, model, created_at, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'running')")
          .run(id, projectId, JSON.stringify(request), accepted.sha256, model, now, new Date(Date.now() + 180_000).toISOString());
        return id;
      });
    },
    complete(projectId: string, id: string, input: unknown) {
      let ownedTemporary = false; let ownedFinal = false; const destination = pathFor(projectId, id); const temporary = destination + ".tmp";
      try {
        return transaction(() => {
          const row = rows(projectId).find((item) => item.id === id);
          if (!row || row.status !== "running" || row.deadline < new Date().toISOString()) throw new ConflictError("Visual request is no longer active.");
          const request = visualRequestSchema.parse(JSON.parse(row.request_json)); requireScript(projectId, request.scriptId, row.script_hash);
          if (request.selectionId) requireSelection(projectId, request.selectionId);
          if (latest(projectId, request.kind === "concepts" ? "concepts" : "storyboard") !== request.baseId) throw new ConflictError("Visual proposal changed during generation.");
          const content = studio.readRevision(projectId, request.scriptId)!.content;
          let output: VisualOutput;
          if (request.kind === "concepts") output = { kind: "concepts", ...conceptsSchema.parse(input) };
          else if (request.kind === "shot") {
            const base = read(projectId, request.baseId!);
            if (!base || base.output.kind !== "storyboard" || base.selectionId !== request.selectionId || base.scriptId !== request.scriptId) throw new ConflictError("Shot base changed.");
            output = { kind: "storyboard", ...replaceShot(base.output, request.shotIndex!, input, content) };
          } else output = { kind: "storyboard", ...validateStoryboard(input, content) };
          const artifact = visualArtifactSchema.parse({ schemaVersion: visualSchemaVersion(output), id, projectId, createdAt: row.created_at, scriptId: request.scriptId, scriptHash: row.script_hash,
            selectionId: request.selectionId, baseId: request.baseId, instruction: request.instruction, output: visualOutputSchema.parse(output) });
          const bytes = JSON.stringify(artifact, null, 2) + "\n";
          if (existsSync(destination)) throw new Error("Existing artifact preserved for recovery.");
          mkdirSync(join(videosDirectory, projectId, "visuals"), { recursive: true });
          writeFileSync(temporary, bytes, { flag: "wx", flush: true }); ownedTemporary = true;
          renameSync(temporary, destination); ownedFinal = true;
          database.prepare("UPDATE visual_runs SET status = 'complete', sha256 = ? WHERE id = ?").run(digest(bytes), id);
          read(projectId, id); return id;
        });
      } catch (error) {
        if (ownedTemporary) rmSync(temporary, { force: true }); if (ownedFinal) rmSync(destination, { force: true }); throw error;
      }
    },
    fail(projectId: string, id: string, validation?: string) {
      const error = validation ? `Visual request could not complete: ${validation} Earlier artifacts preserved; retry explicitly.` : "Visual request failed or context changed. Earlier artifacts preserved; retry explicitly.";
      database.prepare("UPDATE visual_runs SET status = 'failed', error = ? WHERE project_id = ? AND id = ? AND status = 'running'")
        .run(error, z.uuid().parse(projectId), z.uuid().parse(id));
    },
    choose(projectId: string, runId: string, optionIndex: number, expectedSelectionId: string | null) {
      return transaction(() => {
        z.number().int().min(0).max(2).parse(optionIndex); z.uuid().nullable().parse(expectedSelectionId);
        const artifact = read(projectId, runId);
        if (!artifact || artifact.output.kind !== "concepts" || !current(projectId, runId) || (selection(projectId)?.id ?? null) !== expectedSelectionId) throw new ConflictError("Concept choices changed. Reload before choosing.");
        const id = randomUUID();
        database.prepare("INSERT INTO concept_selections VALUES (?, ?, ?, ?, ?)").run(id, projectId, runId, optionIndex, new Date().toISOString()); return id;
      });
    },
    accept(projectId: string, runId: string) {
      transaction(() => {
        const artifact = read(projectId, runId);
        if (!artifact || artifact.output.kind !== "storyboard" || !current(projectId, runId)) throw new ConflictError("Storyboard is unavailable or stale.");
        const defects = inspectGraphics(artifact).findings.filter((finding) => ["numeric-container", "comparison-alignment", "copy-density"].includes(finding.rule));
        if (defects.length) throw new ConflictError(`Storyboard has ${defects.length} unresolved layout defects: ${[...new Set(defects.map((finding) => finding.rule))].join(", ")}. Revise before accepting.`);
        const row = rows(projectId).find((row) => row.id === runId)!;
        database.prepare(`INSERT INTO storyboard_acceptances VALUES (?, ?, ?, ?) ON CONFLICT(project_id) DO UPDATE SET run_id = excluded.run_id, sha256 = excluded.sha256, accepted_at = excluded.accepted_at`)
          .run(projectId, runId, row.sha256, new Date().toISOString());
      });
    },
    acceptance(projectId: string) {
      const row = database.prepare("SELECT run_id, sha256, accepted_at FROM storyboard_acceptances WHERE project_id = ?").get(z.uuid().parse(projectId));
      if (!row) return null;
      const id = z.uuid().parse(row.run_id); const artifact = read(projectId, id);
      if (artifact?.output.kind !== "storyboard" || rows(projectId).find((item) => item.id === id)?.sha256 !== row.sha256) throw new Error("Storyboard acceptance integrity failed.");
      return { runId: id, sha256: z.string().regex(/^[a-f0-9]{64}$/).parse(row.sha256), acceptedAt: z.iso.datetime().parse(row.accepted_at), stale: !current(projectId, id) };
    },
  };
}
