import { createHash, randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { openStudio, ConflictError } from "./studio.ts";
import { inspectWav } from "./wav.ts";
import { scriptLines } from "../workflow/visuals.ts";
import { planningTimingInputSchema, planningTimingSchema, validatePlanningTiming } from "../workflow/timing.ts";

const hash = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const rowSchema = z.strictObject({ id: z.uuid(), project_id: z.uuid(), script_id: z.uuid(), script_hash: z.string(), parent_id: z.uuid().nullable(), sha256: z.string().regex(/^[a-f0-9]{64}$/), created_at: z.iso.datetime() });

export function openTiming(directory: string, videos: string) {
  const database = openDatabase(directory), studio = openStudio(directory, videos);
  const rows = (projectId: string) => database.prepare("SELECT * FROM planning_timing WHERE project_id = ? ORDER BY rowid DESC").all(z.uuid().parse(projectId)).map((row) => rowSchema.parse(row));
  const pathFor = (projectId: string, id: string, extension: string) => join(videos, z.uuid().parse(projectId), "timing", `${z.uuid().parse(id)}.${extension}`);
  function read(projectId: string, id: string) {
    const row = rows(projectId).find((row) => row.id === z.uuid().parse(id)); if (!row) return null;
    const bytes = readFileSync(pathFor(projectId, id, "json"), "utf8");
    if (hash(bytes) !== row.sha256) throw new Error("Planning timing integrity failed.");
    const artifact = planningTimingSchema.parse(JSON.parse(bytes));
    if (artifact.id !== id || artifact.projectId !== projectId || artifact.parentId !== row.parent_id || artifact.scriptId !== row.script_id || artifact.scriptHash !== row.script_hash || artifact.createdAt !== row.created_at) throw new Error("Planning timing index mismatch.");
    const script = studio.readRevision(projectId, artifact.scriptId);
    if (!script || studio.listRevisions(projectId).find((revision) => revision.id === script.id)?.sha256 !== artifact.scriptHash || hash(readFileSync(pathFor(projectId, id, "wav"))) !== artifact.audioHash) throw new Error("Planning timing source integrity failed.");
    validatePlanningTiming({ scriptId: artifact.scriptId, baseId: artifact.parentId, timing: artifact.timing, anchors: artifact.anchors, provenance: artifact.provenance }, artifact.measured.durationFrames, scriptLines(script.content));
    return { artifact, sha256: row.sha256 };
  }
  function current(projectId: string, id: string) {
    const item = read(projectId, id), accepted = studio.acceptance(projectId);
    return rows(projectId)[0]?.id === id && !!item && !!accepted && !accepted.stale && accepted.revisionId === item.artifact.scriptId && accepted.sha256 === item.artifact.scriptHash;
  }
  return {
    close() { studio.close(); database.close(); }, read, current,
    latest(projectId: string) { const row = rows(projectId)[0]; return row ? { ...read(projectId, row.id)!, stale: !current(projectId, row.id) } : null; },
    audio(projectId: string, id: string) { if (!read(projectId, id)) throw new Error("Planning narration unavailable."); return readFileSync(pathFor(projectId, id, "wav")); },
    import(projectId: string, input: unknown, audio: Buffer) {
      const request = planningTimingInputSchema.parse(input), id = randomUUID(), jsonPath = pathFor(projectId, id, "json"), wavPath = pathFor(projectId, id, "wav");
      let jsonOwned = false, wavOwned = false;
      database.exec("BEGIN IMMEDIATE");
      try {
        const accepted = studio.acceptance(projectId);
        if (!accepted || accepted.stale || accepted.revisionId !== request.scriptId || (rows(projectId)[0]?.id ?? null) !== request.baseId) throw new ConflictError("Script or planning timing changed. Reload before importing.");
        if (request.baseId) read(projectId, request.baseId);
        const measured = inspectWav(audio), script = studio.readRevision(projectId, request.scriptId)!;
        if (request.provenance === "verified-aligner" && !request.alignmentEvidence || request.anchors.some((anchor) => anchor.provenance === "verified-aligner") && !request.alignmentEvidence) throw new Error("Verified alignment requires human-reviewed aligner evidence.");
        if (request.alignmentEvidence && (request.alignmentEvidence.audioHash !== hash(audio) || request.alignmentEvidence.transcriptHash !== accepted.sha256)) throw new Error("Alignment evidence does not match the imported audio and accepted script.");
        validatePlanningTiming(request, measured.durationFrames, scriptLines(script.content));
        const artifact = planningTimingSchema.parse({ alignmentEvidence: request.alignmentEvidence, schemaVersion: 1, id, projectId, parentId: request.baseId, scriptId: request.scriptId, scriptHash: accepted.sha256, createdAt: new Date().toISOString(), audioHash: hash(audio), timing: request.timing, anchors: request.anchors, provenance: request.provenance, measured });
        const bytes = JSON.stringify(artifact, null, 2) + "\n";
        mkdirSync(join(videos, projectId, "timing"), { recursive: true });
        writeFileSync(wavPath, audio, { flag: "wx", flush: true }); wavOwned = true;
        writeFileSync(jsonPath, bytes, { flag: "wx", flush: true }); jsonOwned = true;
        database.prepare("INSERT INTO planning_timing VALUES (?, ?, ?, ?, ?, ?, ?)").run(id, projectId, request.scriptId, accepted.sha256, request.baseId, hash(bytes), artifact.createdAt);
        database.exec("COMMIT"); return id;
      } catch (error) {
        database.exec("ROLLBACK"); if (jsonOwned) rmSync(jsonPath); if (wavOwned) rmSync(wavPath); throw error;
      }
    },
  };
}
