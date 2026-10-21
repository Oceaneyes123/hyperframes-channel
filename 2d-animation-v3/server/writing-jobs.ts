import { randomUUID } from "node:crypto";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { ConflictError } from "./studio.ts";
import { revisionRequestSchema } from "../workflow/review.ts";

const columns = "id, session_id AS sessionId, request_json AS requestJson, status, created_at AS createdAt, deadline, proposal_id AS proposalId, error";
const jobSchema = z.strictObject({
  id: z.uuid(), sessionId: z.uuid(), requestJson: z.string(), status: z.enum(["running", "succeeded", "failed"]),
  createdAt: z.iso.datetime(), deadline: z.iso.datetime(), proposalId: z.uuid().nullable(), error: z.string().nullable(),
});

export function openWritingJobs(directory: string) {
  const database = openDatabase(directory);
  // A crashed request has no worker to resume it; expire it instead of silently resubmitting.
  database.prepare("UPDATE writing_jobs SET status = 'failed', error = 'Request interrupted or timed out. Review the latest script before retrying.' WHERE status = 'running' AND deadline < ?")
    .run(new Date().toISOString());
  return {
    close: () => database.close(),
    list(projectId: string) {
      z.uuid().parse(projectId);
      return database.prepare(`SELECT ${columns} FROM writing_jobs WHERE project_id = ? ORDER BY created_at DESC, id DESC LIMIT 20`)
        .all(projectId).map((row) => {
          const job = jobSchema.parse(row);
          return { ...job, request: revisionRequestSchema.parse(JSON.parse(job.requestJson)) };
        });
    },
    start(projectId: string, request: unknown, model: string) {
      z.uuid().parse(projectId);
      const parsed = revisionRequestSchema.parse(request);
      database.exec("BEGIN IMMEDIATE");
      try {
        if (database.prepare("SELECT id FROM writing_jobs WHERE project_id = ? AND status = 'running'").get(projectId)) throw new ConflictError("A writing request is already running for this project.");
        if (database.prepare("SELECT id FROM scriptwriting_runs WHERE project_id = ? AND status = 'running' AND deadline >= ?").get(projectId, new Date().toISOString())) throw new ConflictError("A writing request is already running for this project.");
        const now = new Date().toISOString();
        database.prepare("INSERT INTO writing_sessions (id, project_id, created_at) VALUES (?, ?, ?) ON CONFLICT(project_id) DO NOTHING").run(randomUUID(), projectId, now);
        const session = database.prepare("SELECT id FROM writing_sessions WHERE project_id = ?").get(projectId)!;
        const id = randomUUID();
        database.prepare("INSERT INTO writing_jobs (id, session_id, project_id, request_json, model, status, created_at, deadline) VALUES (?, ?, ?, ?, ?, 'running', ?, ?)")
          .run(id, session.id, projectId, JSON.stringify(parsed), model, now, new Date(Date.now() + 120_000).toISOString());
        database.exec("COMMIT");
        return id;
      } catch (error) { database.exec("ROLLBACK"); throw error; }
    },
    fail(id: string, message: string) {
      database.prepare("UPDATE writing_jobs SET status = 'failed', error = ? WHERE id = ? AND status = 'running'").run(message, z.uuid().parse(id));
    },
  };
}
