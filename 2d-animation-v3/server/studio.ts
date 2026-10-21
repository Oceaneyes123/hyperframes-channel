import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { applyReplacement, proposalSchema, revisionRequestSchema } from "../workflow/review.ts";
import {
  projectManifestSchema, projectTitleSchema, scriptContentSchema, scriptRevisionSchema,
  type ProjectManifest, type ScriptRevision,
} from "../workflow/project.ts";

export class ConflictError extends Error {}
export class MissingProjectError extends Error {}

const revisionIndexSchema = scriptRevisionSchema.omit({ schemaVersion: true, content: true }).extend({
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});

const revisionColumns = "id, project_id AS projectId, revision, parent_id AS parentId, created_at AS createdAt, sha256";
const hash = (text: string) => createHash("sha256").update(text).digest("hex");

export function openStudio(dataDirectory: string, videosDirectory: string) {
  const database = openDatabase(dataDirectory);

  function getProject(id: string): ProjectManifest | null {
    z.uuid().parse(id);
    const row = database.prepare("SELECT 1 AS schemaVersion, id, title, created_at AS createdAt FROM projects WHERE id = ?").get(id);
    return row ? projectManifestSchema.parse(row) : null;
  }

  function revisionPath(projectId: string, id: string) {
    return join(videosDirectory, z.uuid().parse(projectId), "scripts", `${z.uuid().parse(id)}.json`);
  }

  function listRevisions(projectId: string) {
    z.uuid().parse(projectId);
    return database.prepare(`SELECT ${revisionColumns} FROM script_revisions WHERE project_id = ? ORDER BY revision DESC`)
      .all(projectId).map((row) => revisionIndexSchema.parse(row));
  }

  function readRevision(projectId: string, id: string): ScriptRevision | null {
    z.uuid().parse(projectId);
    z.uuid().parse(id);
    const row = database.prepare(`SELECT ${revisionColumns} FROM script_revisions WHERE project_id = ? AND id = ?`).get(projectId, id);
    if (!row) return null;
    const index = revisionIndexSchema.parse(row);
    const bytes = readFileSync(revisionPath(projectId, id), "utf8");
    if (hash(bytes) !== index.sha256) throw new Error("Script revision integrity check failed");
    const revision = scriptRevisionSchema.parse(JSON.parse(bytes));
    if (revision.id !== index.id || revision.projectId !== index.projectId || revision.revision !== index.revision
      || revision.parentId !== index.parentId || revision.createdAt !== index.createdAt) {
      throw new Error("Script revision does not match its index");
    }
    return revision;
  }

  function requireLatest(projectId: string, id: string | null) {
    if (!getProject(projectId)) throw new MissingProjectError("Project not found");
    const latest = listRevisions(projectId)[0];
    if ((latest?.id ?? null) !== id) throw new ConflictError("A newer revision was saved. Copy your draft before reloading the latest version.");
    return latest ? readRevision(projectId, latest.id)! : null;
  }

  function acceptance(projectId: string) {
    z.uuid().parse(projectId);
    const row = database.prepare("SELECT revision_id AS revisionId, sha256, accepted_at AS acceptedAt FROM script_acceptances WHERE project_id = ?").get(projectId);
    if (!row) return null;
    const receipt = z.strictObject({ revisionId: z.uuid(), sha256: z.string().regex(/^[a-f0-9]{64}$/), acceptedAt: z.iso.datetime() }).parse(row);
    const revision = readRevision(projectId, receipt.revisionId);
    const index = listRevisions(projectId).find((item) => item.id === receipt.revisionId);
    if (!revision || index?.sha256 !== receipt.sha256) throw new Error("Accepted script integrity check failed");
    return { ...receipt, stale: listRevisions(projectId)[0]?.id !== receipt.revisionId };
  }

  function recordAcceptance(projectId: string, revisionId: string) {
    const index = listRevisions(projectId).find((item) => item.id === revisionId)!;
    database.prepare(`INSERT INTO script_acceptances (project_id, revision_id, sha256, accepted_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(project_id) DO UPDATE SET revision_id = excluded.revision_id, sha256 = excluded.sha256, accepted_at = excluded.accepted_at`)
      .run(projectId, revisionId, index.sha256, new Date().toISOString());
  }

  function proposalPath(projectId: string, id: string) {
    return join(videosDirectory, z.uuid().parse(projectId), "proposals", `${z.uuid().parse(id)}.json`);
  }

  function listProposals(projectId: string) {
    z.uuid().parse(projectId);
    return database.prepare(`SELECT id, status, result_id AS resultId FROM script_proposals WHERE project_id = ? ORDER BY created_at DESC, id DESC`)
      .all(projectId).map((row) => z.strictObject({ id: z.uuid(), status: z.enum(["pending", "accepted", "rejected"]), resultId: z.uuid().nullable() }).parse(row));
  }

  function readProposal(projectId: string, id: string) {
    z.uuid().parse(projectId); z.uuid().parse(id);
    const row = database.prepare("SELECT sha256, base_id, created_at FROM script_proposals WHERE project_id = ? AND id = ?").get(projectId, id);
    if (!row) return null;
    const bytes = readFileSync(proposalPath(projectId, id), "utf8");
    if (hash(bytes) !== row.sha256) throw new Error("Proposal integrity check failed");
    const proposal = proposalSchema.parse(JSON.parse(bytes));
    if (proposal.id !== id || proposal.projectId !== projectId || proposal.request.baseId !== row.base_id || proposal.createdAt !== row.created_at) throw new Error("Proposal index mismatch");
    const base = readRevision(projectId, proposal.request.baseId);
    if (!base) throw new Error("Proposal base missing");
    applyReplacement(base.content, proposal.request.start, proposal.request.end, proposal.replacement);
    return proposal;
  }

  // A single transaction owns both filesystem cleanup and all index/state changes.
  function saveScript(projectId: string, content: unknown, expectedParentId: string | null, acceptProposalId?: string): ScriptRevision {
    z.uuid().parse(projectId);
    z.uuid().nullable().parse(expectedParentId);
    const text = scriptContentSchema.parse(content);
    database.exec("BEGIN IMMEDIATE");
    let temporaryPath: string | undefined;
    let savedPath: string | undefined;
    try {
      const latest = requireLatest(projectId, expectedParentId);
      if (acceptProposalId) {
        const proposal = readProposal(projectId, acceptProposalId);
        const state = listProposals(projectId).find((item) => item.id === acceptProposalId);
        if (!proposal || state?.status !== "pending" || proposal.request.baseId !== latest?.id) throw new ConflictError("Proposal is no longer available for acceptance.");
        if (text !== applyReplacement(latest.content, proposal.request.start, proposal.request.end, proposal.replacement)) throw new Error("Proposal content mismatch");
      }
      const revision = scriptRevisionSchema.parse({
        schemaVersion: 1, id: randomUUID(), projectId, revision: (latest?.revision ?? 0) + 1,
        parentId: expectedParentId, createdAt: new Date().toISOString(), content: text,
      });
      const bytes = `${JSON.stringify(revision, null, 2)}\n`;
      const destination = revisionPath(projectId, revision.id);
      mkdirSync(join(videosDirectory, projectId, "scripts"), { recursive: true });
      temporaryPath = `${destination}.tmp`;
      writeFileSync(temporaryPath, bytes, { flag: "wx", flush: true });
      renameSync(temporaryPath, destination);
      savedPath = destination;
      database.prepare("INSERT INTO script_revisions (id, project_id, revision, parent_id, created_at, sha256) VALUES (?, ?, ?, ?, ?, ?)")
        .run(revision.id, projectId, revision.revision, revision.parentId, revision.createdAt, hash(bytes));
      if (acceptProposalId) {
        database.prepare("UPDATE script_proposals SET status = 'accepted', result_id = ? WHERE id = ? AND project_id = ?").run(revision.id, acceptProposalId, projectId);
        recordAcceptance(projectId, revision.id);
      }
      database.exec("COMMIT");
      return revision;
    } catch (error) {
      database.exec("ROLLBACK");
      if (temporaryPath) rmSync(temporaryPath, { force: true });
      if (savedPath) rmSync(savedPath, { force: true });
      throw error;
    }
  }

  return {
    close: () => database.close(),
    getProject,
    listRevisions,
    readRevision,
    saveScript,
    acceptance,
    listProposals,
    readProposal,
    acceptScript(projectId: string, revisionId: string) {
      z.uuid().parse(revisionId);
      database.exec("BEGIN IMMEDIATE");
      try {
        requireLatest(projectId, revisionId);
        recordAcceptance(projectId, revisionId);
        database.exec("COMMIT");
      } catch (error) { database.exec("ROLLBACK"); throw error; }
    },
    createProposal(projectId: string, requestInput: unknown, replacement: unknown, notes: string, jobId?: string) {
      const request = revisionRequestSchema.parse(requestInput);
      const proposal = proposalSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId, createdAt: new Date().toISOString(), request, replacement, notes });
      database.exec("BEGIN IMMEDIATE");
      let temporary: string | undefined;
      let saved: string | undefined;
      try {
        const base = requireLatest(projectId, request.baseId)!;
        applyReplacement(base.content, request.start, request.end, proposal.replacement);
        const bytes = `${JSON.stringify(proposal, null, 2)}\n`;
        const destination = proposalPath(projectId, proposal.id);
        mkdirSync(join(videosDirectory, projectId, "proposals"), { recursive: true });
        temporary = `${destination}.tmp`;
        writeFileSync(temporary, bytes, { flag: "wx", flush: true });
        renameSync(temporary, destination); saved = destination;
        database.prepare("INSERT INTO script_proposals (id, project_id, base_id, created_at, sha256) VALUES (?, ?, ?, ?, ?)")
          .run(proposal.id, projectId, request.baseId, proposal.createdAt, hash(bytes));
        if (jobId) {
          const updated = database.prepare("UPDATE writing_jobs SET status = 'succeeded', proposal_id = ? WHERE id = ? AND project_id = ? AND request_json = ? AND status = 'running' AND deadline >= ?")
            .run(proposal.id, z.uuid().parse(jobId), projectId, JSON.stringify(request), new Date().toISOString());
          if (updated.changes !== 1) throw new ConflictError("Writing request is no longer active.");
        }
        database.exec("COMMIT");
        return proposal;
      } catch (error) {
        database.exec("ROLLBACK");
        if (temporary) rmSync(temporary, { force: true });
        if (saved) rmSync(saved, { force: true });
        throw error;
      }
    },
    decideProposal(projectId: string, proposalId: string, decision: "accept" | "reject") {
      z.enum(["accept", "reject"]).parse(decision);
      const proposal = readProposal(projectId, proposalId);
      if (!proposal) throw new ConflictError("Proposal not found.");
      if (decision === "reject") {
        const result = database.prepare("UPDATE script_proposals SET status = 'rejected' WHERE id = ? AND project_id = ? AND status = 'pending'").run(proposalId, projectId);
        if (result.changes !== 1) throw new ConflictError("Proposal has already been decided.");
        return null;
      }
      const base = readRevision(projectId, proposal.request.baseId)!;
      return saveScript(projectId, applyReplacement(base.content, proposal.request.start, proposal.request.end, proposal.replacement), base.id, proposalId);
    },
    listProjects(): ProjectManifest[] {
      return database.prepare("SELECT 1 AS schemaVersion, id, title, created_at AS createdAt FROM projects ORDER BY created_at DESC, id DESC")
        .all().map((row) => projectManifestSchema.parse(row));
    },
    createProject(title: unknown): ProjectManifest {
      const project = projectManifestSchema.parse({
        schemaVersion: 1, id: randomUUID(), title: projectTitleSchema.parse(title), createdAt: new Date().toISOString(),
      });
      database.prepare("INSERT INTO projects (id, title, created_at) VALUES (?, ?, ?)").run(project.id, project.title, project.createdAt);
      return project;
    },
  };
}
