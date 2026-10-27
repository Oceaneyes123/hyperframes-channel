import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { openStudio } from "../studio.ts";
import { openTiming } from "../timing-store.ts";
import { scriptLines } from "../../workflow/visuals.ts";
import { generateNarrationTake, narrationRequestSchema, type NarrationProvider } from "./generation.ts";
import { inspectWav } from "../wav.ts";

const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const manifestSchema = z.object({ version: z.literal("narration-take@1"), id: z.uuid(), createdAt: z.iso.datetime(),
  source: z.object({ projectId: z.uuid(), scriptId: z.uuid(), scriptHash: z.string().regex(/^[a-f0-9]{64}$/) }),
  provider: z.object({ id: z.string(), voice: z.string(), supportsDelivery: z.boolean() }), request: narrationRequestSchema,
  audioHash: z.string().regex(/^[a-f0-9]{64}$/), segments: z.array(z.object({ number: z.number().int().positive(), sourceText: z.string(), startFrame: z.number().int().nonnegative(), endFrame: z.number().int().positive() })).min(1).max(60) });
const active = new Set<string>();

export function openNarrationStudio(directory: string, videos: string) {
  const studio = openStudio(directory, videos), timing = openTiming(directory, videos);
  const root = (projectId: string) => join(directory, "studio-narration", z.uuid().parse(projectId));
  const takePath = (projectId: string, id: string) => join(root(projectId), "narration-takes", z.uuid().parse(id));
  function read(projectId: string, id: string) {
    const path = takePath(projectId, id), bytes = readFileSync(join(path, "take.json")), receipt = readFileSync(join(path, "take.sha256"), "utf8");
    if (hash(bytes) !== receipt) throw new Error("Narration take manifest integrity failed.");
    const manifest = manifestSchema.parse(JSON.parse(bytes.toString("utf8")));
    if (manifest.id !== id || manifest.source.projectId !== projectId) throw new Error("Narration take identity mismatch.");
    const script = studio.readRevision(projectId, manifest.source.scriptId), revision = studio.listRevisions(projectId).find((item) => item.id === manifest.source.scriptId);
    if (!script || !revision || revision.sha256 !== manifest.source.scriptHash) throw new Error("Narration script integrity failed.");
    const lines = scriptLines(script.content), audio = readFileSync(join(path, "narration.wav")), measured = inspectWav(audio);
    if (hash(audio) !== manifest.audioHash || manifest.segments.length !== manifest.request.lines.length || manifest.segments.some((segment, index) => {
      const line = lines.find((item) => item.number === segment.number), request = manifest.request.lines[index];
      return !line || line.text.trim() !== segment.sourceText || request.number !== line.number || request.text !== line.text.trim() || segment.endFrame <= segment.startFrame || segment.endFrame > measured.durationFrames || index > 0 && segment.startFrame < manifest.segments[index - 1].endFrame;
    })) throw new Error("Narration take integrity failed.");
    const accepted = studio.acceptance(projectId);
    return { manifest, audio, measured, stale: !accepted || accepted.stale || accepted.revisionId !== manifest.source.scriptId || accepted.sha256 !== manifest.source.scriptHash, complete: manifest.segments.length === lines.length && manifest.segments.every((segment, index) => segment.number === lines[index].number) };
  }
  return {
    close() { timing.close(); studio.close(); }, read,
    list(projectId: string) {
      const directory = join(root(projectId), "narration-takes"); if (!existsSync(directory)) return [];
      return readdirSync(directory).filter((id) => z.uuid().safeParse(id).success && existsSync(join(directory, id, "take.json"))).map((id) => {
        const take = read(projectId, id); return { id, createdAt: take.manifest.createdAt, provider: take.manifest.provider.id, voice: take.manifest.provider.voice, supportsDelivery: take.manifest.provider.supportsDelivery, durationSeconds: take.measured.durationSeconds, stale: take.stale, complete: take.complete, segments: take.manifest.segments };
      }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async generate(projectId: string, provider: NarrationProvider, input: { scriptId: string; lineNumber?: number; pronunciation: z.infer<typeof narrationRequestSchema>["pronunciation"]; rate: number; seed: number }, signal: AbortSignal) {
      if (active.has(projectId)) throw new Error("Narration generation already running.");
      const accepted = studio.acceptance(projectId); if (!accepted || accepted.stale || accepted.revisionId !== input.scriptId) throw new Error("Accept the current script first.");
      const script = studio.readRevision(projectId, accepted.revisionId)!, lines = scriptLines(script.content);
      const chosen = input.lineNumber === undefined ? lines : lines.filter((line) => line.number === input.lineNumber);
      if (!chosen.length) throw new Error("Narration line unavailable.");
      const request = { lines: chosen.map((line) => ({ ...line, delivery: line.number === lines[0].number ? "hook" : line.number === lines.at(-1)!.number ? "payoff" : "explanation" })), pronunciation: input.pronunciation, rate: input.rate, seed: input.seed };
      active.add(projectId);
      try {
        const result = await generateNarrationTake(root(projectId), provider, request, signal, { rulesDirectory: directory, source: { projectId, scriptId: accepted.revisionId, scriptHash: accepted.sha256 } });
        if (read(projectId, result.manifest.id).stale) throw new Error("Script changed during generation; take preserved as stale.");
        return result.manifest.id;
      } finally { active.delete(projectId); }
    },
    import(projectId: string, id: string, baseId: string | null, reviewed: boolean) {
      if (reviewed !== true) throw new Error("Listen and confirm the measured timing before import.");
      const take = read(projectId, id); if (take.stale || !take.complete) throw new Error("A complete take for the accepted script is required.");
      return timing.import(projectId, { scriptId: take.manifest.source.scriptId, baseId, timing: take.manifest.segments.map(({ number, startFrame, endFrame }) => ({ number, startFrame, endFrame })), anchors: [], provenance: "manual" }, take.audio);
    },
  };
}
