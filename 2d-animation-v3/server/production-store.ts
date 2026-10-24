import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { openDatabase } from "./database.ts";
import { openMotion } from "./motion-store.ts";
import { openVisuals } from "./visual-store.ts";
import { openStudio, ConflictError } from "./studio.ts";
import { scriptLines } from "../workflow/visuals.ts";
import { inspectMotion, validateTiming, type LineTiming } from "../workflow/production.ts";
import { inspectWav } from "./wav.ts";
import { openTiming } from "./timing-store.ts";

const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const engineFiles = ["engine/register-planning.tsx", "app/projects/[id]/visuals/frame.tsx", "engine/quality/inspect-graphics.ts", "workflow/vector-assets.ts", "workflow/graphic-library.ts", "workflow/graphic-pack.json", "workflow/diagram.ts", "workflow/art-direction.ts", "engine/graphics/layered-graphic.tsx", "engine/graphics/background.tsx", "workflow/graphic-assets.ts", "engine/graphics/complaint-workflow.tsx", "engine/text-metrics.ts", "engine/quality/inspect-motion.ts", "workflow/timing.ts", "engine/components/visual-component.tsx", "workflow/components.ts", "engine/motion-presets/index.ts", "engine/register.tsx", "engine/motion-composition.tsx", "engine/compile-motion.ts", "engine/visual-symbol.tsx", "engine/visual-text.tsx", "engine/split-screen.tsx", "workflow/motion.ts", "workflow/visuals.ts", "workflow/production.ts", "server/render.ts", "server/wav.ts", "next.config.ts", "package-lock.json"];
const narrationSchema = z.object({ motionId: z.uuid(), motionHash: z.string(), audioHash: z.string(), timing: z.array(z.object({ number: z.number(), startFrame: z.number(), endFrame: z.number() })), measured: z.object({ durationSeconds: z.number(), durationFrames: z.number(), sampleRate: z.number(), channels: z.number(), waveform: z.array(z.number()) }) });
export function hashEngine(root = process.cwd()) {
  return hash(engineFiles.map((file) => hash(readFileSync(/* turbopackIgnore: true */ resolve(/* turbopackIgnore: true */ root, file)))).join(""));
}
type Kind = "narration" | "gate1" | "gate2" | "rendering" | "rendered" | "failed";

export function openProduction(directory: string, videos: string) {
  const database = openDatabase(directory), motion = openMotion(directory, videos), visuals = openVisuals(directory, videos), studio = openStudio(directory, videos), timings = openTiming(directory, videos);
  function rows(projectId: string) {
    return database.prepare("SELECT * FROM production_records WHERE project_id = ? ORDER BY rowid DESC").all(z.uuid().parse(projectId)).map((row) => {
      if (hash(String(row.payload)) !== row.sha256) throw new Error("Production record integrity failed.");
      return { id: z.uuid().parse(row.id), kind: row.kind as Kind, createdAt: String(row.created_at), payload: JSON.parse(String(row.payload)) };
    });
  }
  function append(projectId: string, kind: Kind, payload: object, id = randomUUID()) {
    const bytes = JSON.stringify(payload);
    database.prepare("INSERT INTO production_records VALUES (?, ?, ?, ?, ?, ?)").run(id, z.uuid().parse(projectId), kind, bytes, hash(bytes), new Date().toISOString()); return id;
  }
  function transaction<T>(run: () => T) {
    database.exec("BEGIN IMMEDIATE"); try { const result = run(); database.exec("COMMIT"); return result; } catch (error) { database.exec("ROLLBACK"); throw error; }
  }
  function audio(projectId: string, id: string) {
    const row = rows(projectId).find((row) => row.id === z.uuid().parse(id) && row.kind === "narration");
    if (!row) throw new Error("Narration unavailable."); const value = narrationSchema.parse(row.payload);
    const bytes = readFileSync(join(videos, projectId, "production", `${id}.wav`));
    if (hash(bytes) !== value.audioHash) throw new Error("Narration audio integrity failed."); return { id, ...value, bytes };
  }
  function snapshot(projectId: string) {
    const receipt = motion.acceptance(projectId); if (!receipt || receipt.stale) throw new ConflictError("Accept current motion before production review.");
    const artifact = motion.read(projectId, receipt.runId)!; const board = visuals.read(projectId, artifact.source.storyboardId)!;
    const latest = rows(projectId).find((row) => row.kind === "narration"); if (!latest) throw new ConflictError("Import measured narration before production review.");
    const voice = audio(projectId, latest.id);
    if (voice.motionId !== artifact.id || voice.motionHash !== receipt.sha256) throw new ConflictError("Narration is stale. Re-align it to the accepted motion.");
    validateTiming(voice.timing, artifact.plan, scriptLines(studio.readRevision(projectId, artifact.source.scriptId)!.content));
    // Local export requires the source checkout; never trace generated media into the Next build.
    const quality = inspectMotion(artifact.plan, board), engineHash = hashEngine();
    const binding = hash(JSON.stringify({ motion: receipt.sha256, source: artifact.source, voice: voice.id, audio: voice.audioHash, timing: voice.timing, engineHash, quality, width: 1080, height: 1920, fps: 30 }));
    return { binding, artifact, board, voice, quality, engineHash };
  }
  function gates(projectId: string, binding: string) {
    const history = rows(projectId), gate1 = history.find((row) => row.kind === "gate1"), gate2 = history.find((row) => row.kind === "gate2");
    const first = gate1?.payload.binding === binding ? gate1 : null;
    return { gate1: first?.id ?? null, gate2: first && gate2?.payload.binding === binding && gate2.payload.gate1 === first.id ? gate2.id : null };
  }
  return {
    close() { timings.close(); motion.close(); visuals.close(); studio.close(); database.close(); }, audio, snapshot,
    status(projectId: string) {
      const history = rows(projectId); let current;
      try { current = snapshot(projectId); } catch (error) { if (!(error instanceof ConflictError)) throw error; return { ready: false as const, reason: error.message, binding: null, narration: null, quality: null, gate1: null, gate2: null, history: history.filter((row) => ["rendering", "rendered", "failed"].includes(row.kind)) }; }
      return { ready: true as const, reason: "", binding: current.binding, narration: { id: current.voice.id, timing: current.voice.timing, measured: current.voice.measured, motionId: current.artifact.id }, quality: current.quality, ...gates(projectId, current.binding), history: history.filter((row) => ["rendering", "rendered", "failed"].includes(row.kind)) };
    },
    importNarration(projectId: string, motionId: string, bytes: Buffer, timing: LineTiming) {
      const id = randomUUID(), path = join(videos, z.uuid().parse(projectId), "production", `${id}.wav`); let owned = false;
      try { return transaction(() => {
        const receipt = motion.acceptance(projectId); if (!receipt || receipt.stale || receipt.runId !== z.uuid().parse(motionId)) throw new ConflictError("Narration must reference exact accepted current motion.");
        const artifact = motion.read(projectId, motionId)!, measured = inspectWav(bytes), quality = inspectMotion(artifact.plan);
        if (Math.abs(measured.durationSeconds * 30 - quality.durationFrames) > 1) throw new Error("Audio duration must match accepted motion within one frame. Revise motion timing first.");
        const aligned = validateTiming(timing, artifact.plan, scriptLines(studio.readRevision(projectId, artifact.source.scriptId)!.content));
        if (artifact.source.timingId) {
          const planned = timings.read(projectId, artifact.source.timingId);
          if (!planned || planned.artifact.audioHash !== hash(bytes) || JSON.stringify(planned.artifact.timing) !== JSON.stringify(aligned)) throw new Error("Final narration must match the planning audio and measured timing. Import a correction and revise motion first.");
        }
        mkdirSync(join(videos, projectId, "production"), { recursive: true }); writeFileSync(path, bytes, { flag: "wx", flush: true }); owned = true;
        append(projectId, "narration", { motionId, motionHash: receipt.sha256, audioHash: hash(bytes), timing: aligned, measured }, id); return id;
      }); } catch (error) { if (owned) rmSync(path); throw error; }
    },
    approve(projectId: string, input: unknown) {
      const request = z.strictObject({ binding: z.string().regex(/^[a-f0-9]{64}$/), gate: z.enum(["gate1", "gate2"]), reviewed: z.literal(true), notes: z.string().trim().min(10).max(2000) }).parse(input);
      return transaction(() => {
        const current = snapshot(projectId); if (request.binding !== current.binding) throw new ConflictError("Production inputs changed. Review again.");
        const prior = gates(projectId, current.binding); if (request.gate === "gate2" && !prior.gate1) throw new ConflictError("Gate 1 is required before independent moving/audio approval.");
        return append(projectId, request.gate, { binding: current.binding, gate1: request.gate === "gate2" ? prior.gate1 : null, notes: request.notes, reviewed: true });
      });
    },
    beginRender(projectId: string, binding: string, authorize: boolean) {
      return transaction(() => {
        if (authorize !== true) throw new ConflictError("Explicit local production render authorization is required.");
        const current = snapshot(projectId); if (current.binding !== binding || !gates(projectId, binding).gate2) throw new ConflictError("Both exact current production gates are required.");
        if (current.quality.durationFrames > 5400) throw new Error("Local export is limited to 180 seconds.");
        const history = rows(projectId);
        for (const job of history.filter((row) => row.kind === "rendering" && !history.some((item) => item.payload.jobId === row.id))) {
          if (Date.now() - Date.parse(job.createdAt) < 30 * 60_000) throw new ConflictError("A render is already running.");
          append(projectId, "failed", { jobId: job.id, binding: job.payload.binding, error: "Interrupted render expired. Retry explicitly." });
        }
        const id = append(projectId, "rendering", { binding, gate2: gates(projectId, binding).gate2 }); return { id, ...current };
      });
    },
    finishRender(projectId: string, jobId: string, binding: string, verification: object) {
      return transaction(() => {
        const history = rows(projectId); if (!history.some((row) => row.id === jobId && row.kind === "rendering" && row.payload.binding === binding) || history.some((row) => row.payload.jobId === jobId)) throw new ConflictError("Render is not active.");
        if (snapshot(projectId).binding !== binding || !gates(projectId, binding).gate2) throw new ConflictError("Production inputs changed during rendering.");
        return append(projectId, "rendered", { jobId, binding, verification });
      });
    },
    failRender(projectId: string, jobId: string) { if (!rows(projectId).some((row) => row.payload.jobId === jobId)) append(projectId, "failed", { jobId, error: "Render failed or was cancelled. Earlier exports preserved; retry explicitly." }); },
    exportRecord(projectId: string, jobId: string) { return rows(projectId).find((row) => row.kind === "rendered" && row.payload.jobId === z.uuid().parse(jobId)) ?? null; },
  };
}
