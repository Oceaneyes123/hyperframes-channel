import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { openVisuals } from "./visual-store.ts";
import { ConflictError } from "./studio.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { motionShotSchema, motionSourceSchema as sourceSchema, motionRequestSchema, motionArtifactSchema as artifactSchema, validateMotion, type MotionArtifact } from "../workflow/motion.ts";

const sha = (bytes: string) => createHash("sha256").update(bytes).digest("hex");
export const hashMotionSource = (value: unknown) => sha(JSON.stringify(value));
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const rowSchema = z.object({ id: z.uuid(), project_id: z.uuid(), request_json: z.string(), source_json: z.string(), model: z.string(),
  created_at: z.iso.datetime(), deadline: z.iso.datetime(), status: z.enum(["running", "complete", "failed"]),
  decision: z.enum(["pending", "accepted", "rejected"]).nullable(), sha256: hashSchema.nullable(), error: z.string().nullable() });

export function openMotion(directory: string, videosDirectory: string) {
  const database = openDatabase(directory); const visuals = openVisuals(directory, videosDirectory);
  database.prepare("UPDATE motion_runs SET status = 'failed', error = 'Request interrupted or timed out. Retry explicitly.' WHERE status = 'running' AND deadline < ?").run(new Date().toISOString());
  const pathFor = (projectId: string, id: string) => join(videosDirectory, z.uuid().parse(projectId), "motion", `${z.uuid().parse(id)}.json`);
  const rows = (projectId: string) => database.prepare("SELECT * FROM motion_runs WHERE project_id = ? ORDER BY rowid DESC").all(z.uuid().parse(projectId)).map((row) => rowSchema.parse(row));
  const latest = (projectId: string) => rows(projectId).find((row) => row.status === "complete" && row.decision !== "rejected")?.id ?? null;
  function source(projectId: string, storyboardId: string) {
    const receipt = visuals.acceptance(projectId); const board = visuals.read(projectId, storyboardId);
    if (!receipt || receipt.stale || receipt.runId !== storyboardId || board?.output.kind !== "storyboard" || !board.selectionId) throw new ConflictError("Accept the exact current storyboard, script and research before motion planning.");
    return sourceSchema.parse({ storyboardId, storyboardHash: receipt.sha256, scriptId: board.scriptId, scriptHash: board.scriptHash, selectionId: board.selectionId });
  }
  function read(projectId: string, id: string): MotionArtifact | null {
    const row = rows(projectId).find((row) => row.id === z.uuid().parse(id) && row.status === "complete"); if (!row) return null;
    const bytes = readFileSync(pathFor(projectId, id), "utf8"); if (sha(bytes) !== row.sha256) throw new Error("Motion artifact integrity failed.");
    const artifact = artifactSchema.parse(JSON.parse(bytes)); const request = motionRequestSchema.parse(JSON.parse(row.request_json));
    if (artifact.id !== id || artifact.projectId !== projectId || artifact.createdAt !== row.created_at || artifact.parentId !== request.baseId || JSON.stringify(artifact.source) !== row.source_json || artifact.source.storyboardId !== request.storyboardId) throw new Error("Motion artifact index mismatch.");
    const board = visuals.read(projectId, artifact.source.storyboardId); if (!board) throw new Error("Missing motion storyboard dependency.");
    // The visual store verifies bytes against its own index before we bind this hash.
    const boardPath = join(videosDirectory, projectId, "visuals", `${board.id}.json`);
    if (sha(readFileSync(boardPath, "utf8")) !== artifact.source.storyboardHash || board.scriptId !== artifact.source.scriptId || board.scriptHash !== artifact.source.scriptHash || board.selectionId !== artifact.source.selectionId) throw new Error("Motion storyboard dependency mismatch.");
    validateMotion(artifact.plan, board, hashMotionSource); compileMotion(artifact.plan, board); return artifact;
  }
  function current(projectId: string, id: string) {
    const artifact = read(projectId, id); if (!artifact || rows(projectId).find((row) => row.id === id)?.decision === "rejected") return false;
    try { return JSON.stringify(source(projectId, artifact.source.storyboardId)) === JSON.stringify(artifact.source); }
    catch (error) { if (error instanceof ConflictError) return false; throw error; }
  }
  function transaction<T>(run: () => T) {
    database.exec("BEGIN IMMEDIATE"); try { const result = run(); database.exec("COMMIT"); return result; }
    catch (error) { database.exec("ROLLBACK"); throw error; }
  }
  return {
    close() { visuals.close(); database.close(); }, read, latest, current,
    list: (projectId: string) => rows(projectId).map((row) => ({ id: row.id, status: row.status, decision: row.decision, createdAt: row.created_at, model: row.model, error: row.error })),
    context(projectId: string, input: unknown) {
      const request = motionRequestSchema.parse(input); source(projectId, request.storyboardId);
      return { board: visuals.read(projectId, request.storyboardId)!, base: request.baseId ? read(projectId, request.baseId) : null };
    },
    begin(projectId: string, input: unknown, model = "manual-fixture") {
      const request = motionRequestSchema.parse(input);
      return transaction(() => {
        const dependency = source(projectId, request.storyboardId);
        if (latest(projectId) !== request.baseId) throw new ConflictError("Motion proposals changed. Reload before continuing.");
        if (request.shotId) {
          const base = request.baseId ? read(projectId, request.baseId) : null;
          if (!base || !current(projectId, base.id) || base.source.storyboardId !== request.storyboardId || !base.plan.shots.some((shot) => shot.id === request.shotId)) throw new ConflictError("Selected motion shot is unavailable or stale.");
        }
        if (rows(projectId).some((row) => row.status === "running")) throw new ConflictError("A motion request is already running.");
        const id = randomUUID(); const now = new Date().toISOString();
        database.prepare("INSERT INTO motion_runs (id, project_id, request_json, source_json, model, created_at, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'running')")
          .run(id, projectId, JSON.stringify(request), JSON.stringify(dependency), model, now, new Date(Date.now() + 180_000).toISOString()); return id;
      });
    },
    complete(projectId: string, id: string, input: unknown) {
      const destination = pathFor(projectId, id), temporary = destination + ".tmp"; let temporaryOwned = false, finalOwned = false;
      try {
        return transaction(() => {
          const row = rows(projectId).find((row) => row.id === id);
          if (!row || row.status !== "running" || row.deadline < new Date().toISOString()) throw new ConflictError("Motion request no longer active.");
          const request = motionRequestSchema.parse(JSON.parse(row.request_json)); const dependency = source(projectId, request.storyboardId);
          if (JSON.stringify(dependency) !== row.source_json || latest(projectId) !== request.baseId) throw new ConflictError("Motion context changed during generation.");
          let plan;
          if (request.shotId) {
            const base = read(projectId, request.baseId!)!; const shot = motionShotSchema.parse(input);
            const original = base.plan.shots.find((item) => item.id === request.shotId);
            if (!original || shot.id !== original.id || shot.sourceHash !== original.sourceHash || shot.sourceIndex !== original.sourceIndex || JSON.stringify(shot.lineNumbers) !== JSON.stringify(original.lineNumbers)) throw new Error("Selected shot identity must remain unchanged.");
            if (JSON.stringify(shot.objects) !== JSON.stringify(original.objects)) throw new Error("Scoped motion edits must preserve object identity and source correspondence.");
            plan = { ...base.plan, shots: base.plan.shots.map((item) => item.id === request.shotId ? shot : item) };
          } else plan = input;
          const board = visuals.read(projectId, request.storyboardId)!;
          const artifact = artifactSchema.parse({ schemaVersion: 1, id, projectId, createdAt: row.created_at, parentId: request.baseId, source: dependency, plan: validateMotion(plan, board, hashMotionSource) });
          const bytes = JSON.stringify(artifact, null, 2) + "\n";
          if (existsSync(destination)) throw new Error("Existing motion artifact preserved for recovery.");
          mkdirSync(join(videosDirectory, projectId, "motion"), { recursive: true });
          writeFileSync(temporary, bytes, { flag: "wx", flush: true }); temporaryOwned = true; renameSync(temporary, destination); finalOwned = true;
          database.prepare("UPDATE motion_runs SET status = 'complete', decision = 'pending', sha256 = ? WHERE id = ?").run(sha(bytes), id);
          read(projectId, id); return id;
        });
      } catch (error) { if (temporaryOwned) rmSync(temporary, { force: true }); if (finalOwned) rmSync(destination, { force: true }); throw error; }
    },
    fail(projectId: string, id: string, detail?: string) {
      const message = `Motion request failed or context changed.${detail ? ` ${detail}` : ""} Prior artifacts preserved; retry explicitly.`;
      database.prepare("UPDATE motion_runs SET status = 'failed', error = ? WHERE project_id = ? AND id = ? AND status = 'running'").run(message, z.uuid().parse(projectId), z.uuid().parse(id));
    },
    decide(projectId: string, id: string, decision: "accept" | "reject") {
      z.enum(["accept", "reject"]).parse(decision);
      transaction(() => {
        const row = rows(projectId).find((row) => row.id === z.uuid().parse(id));
        if (!row || row.status !== "complete" || row.decision !== "pending") throw new ConflictError("Motion proposal has already been decided or is unavailable.");
        if (decision === "accept" && (latest(projectId) !== id || !current(projectId, id))) throw new ConflictError("Motion proposal is stale.");
        read(projectId, id);
        database.prepare("UPDATE motion_runs SET decision = ? WHERE id = ?").run(decision === "accept" ? "accepted" : "rejected", id);
        if (decision === "accept") database.prepare(`INSERT INTO motion_acceptances VALUES (?, ?, ?, ?) ON CONFLICT(project_id) DO UPDATE SET run_id = excluded.run_id, sha256 = excluded.sha256, accepted_at = excluded.accepted_at`)
          .run(projectId, id, row.sha256, new Date().toISOString());
      });
    },
    acceptance(projectId: string) {
      const row = database.prepare("SELECT run_id, sha256, accepted_at FROM motion_acceptances WHERE project_id = ?").get(z.uuid().parse(projectId)); if (!row) return null;
      const id = z.uuid().parse(row.run_id); const artifact = read(projectId, id); const index = rows(projectId).find((item) => item.id === id);
      if (!artifact || index?.decision !== "accepted" || index.sha256 !== row.sha256) throw new Error("Motion acceptance integrity failed.");
      return { runId: id, sha256: hashSchema.parse(row.sha256), acceptedAt: z.iso.datetime().parse(row.accepted_at), stale: !current(projectId, id) };
    },
  };
}
