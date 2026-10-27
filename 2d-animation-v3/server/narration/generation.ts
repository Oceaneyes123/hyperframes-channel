import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { inspectWav, pcm16Data } from "../wav.ts";
import { inspectNarration } from "../../engine/quality/inspect-narration.ts";
import { creativeFeedback } from "../creative-feedback.ts";

export interface NarrationProvider {
  identity: { id: string; model: string; version: string; voice: string; license: string; licenseUrl: string; supportsDelivery: boolean; referenceHash?: string };
  generate(input: { text: string; delivery: string; rate: number; seed: number }, workDirectory: string, signal: AbortSignal): Promise<Buffer>;
}
export const narrationRequestSchema = z.strictObject({
  lines: z.array(z.strictObject({ number: z.number().int().positive(), text: z.string().trim().min(1).max(4000), delivery: z.enum(["hook", "explanation", "payoff"]) })).min(1).max(60),
  pronunciation: z.array(z.strictObject({ term: z.string().trim().min(1).max(80), spoken: z.string().trim().min(1).max(120) })).max(100),
  seed: z.number().int().nonnegative().max(2147483647), rate: z.number().int().min(-3).max(3),
});
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const delivery = { hook: "Upbeat and curious; make the opening concrete.", explanation: "Conversational, varied emphasis; pause for causal steps.", payoff: "Slightly slower, confident and concise." };

export function normalizePcm16(bytes: Buffer) {
  const measured = inspectWav(bytes), data = pcm16Data(bytes), result = Buffer.alloc(44 + data.length);
  let peak = 0; for (let offset = 0; offset < data.length; offset += 2) peak = Math.max(peak, Math.abs(data.readInt16LE(offset)));
  // Peak normalization only; no fabricated dynamics or pronunciation assessment.
  const gain = .89 * 32767 / peak;
  result.write("RIFF"); result.writeUInt32LE(result.length - 8, 4); result.write("WAVEfmt ", 8); result.writeUInt32LE(16, 16);
  result.writeUInt16LE(1, 20); result.writeUInt16LE(measured.channels, 22); result.writeUInt32LE(measured.sampleRate, 24);
  result.writeUInt32LE(measured.sampleRate * measured.channels * 2, 28); result.writeUInt16LE(measured.channels * 2, 32); result.writeUInt16LE(16, 34);
  result.write("data", 36); result.writeUInt32LE(data.length, 40);
  for (let offset = 0; offset < data.length; offset += 2) result.writeInt16LE(Math.round(data.readInt16LE(offset) * gain), 44 + offset);
  return result;
}

export async function generateNarrationTake(directory: string, provider: NarrationProvider, input: unknown, signal: AbortSignal, options?: { rulesDirectory?: string; source?: { projectId: string; scriptId: string; scriptHash: string } }) {
  const request = narrationRequestSchema.parse(input);
  if (new Set(request.lines.map((line) => line.number)).size !== request.lines.length || request.lines.some((line, index) => index > 0 && line.number <= request.lines[index - 1].number)) throw new Error("Unique ordered narration line numbers required.");
  if (new Set(request.pronunciation.map((entry) => entry.term)).size !== request.pronunciation.length) throw new Error("Duplicate pronunciation terms are ambiguous.");
  const rules = creativeFeedback(options?.rulesDirectory ?? directory).snapshot("narration"), id = randomUUID(), root = join(directory, "narration-takes", id), started = performance.now();
  mkdirSync(root, { recursive: true });
  // Record the request before inference so failures remain diagnosable and retries never overwrite takes.
  writeFileSync(join(root, "request.json"), JSON.stringify({ request, provider: provider.identity, rules }), { flag: "wx", flush: true });
  const segments = [], audio: Buffer[] = []; let samples = 0, rate = 0, channels = 0;
  for (const line of request.lines) {
    signal.throwIfAborted(); const work = join(root, `line-${line.number}`); mkdirSync(work);
    const replacements = new Map(request.pronunciation.map((entry) => [entry.term, entry.spoken]));
    const escaped = [...replacements.keys()].sort((a, b) => b.length - a.length).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const spoken = escaped.length ? line.text.replace(new RegExp(`(?<![\\p{L}\\p{N}_])(?:${escaped.join("|")})(?![\\p{L}\\p{N}_])`, "gu"), (term) => replacements.get(term)!) : line.text;
    if (spoken.length > 4000) throw new Error("Pronunciation-expanded line exceeds the provider limit.");
    const segmentStarted = performance.now();
    const voiceGuidance = rules.rules.filter((rule) => rule.id === "CQ-VOICE" || rule.id.startsWith("CQ-USER-")).map((rule) => rule.correction).join(" ");
    const raw = await provider.generate({ text: spoken, delivery: `${delivery[line.delivery]} ${voiceGuidance}`, rate: request.rate, seed: request.seed }, work, signal);
    signal.throwIfAborted(); const rawQuality = inspectNarration(raw), bytes = normalizePcm16(raw), measured = inspectWav(bytes);
    if (rate && (rate !== measured.sampleRate || channels !== measured.channels)) throw new Error("Provider changed audio format between segments.");
    rate = measured.sampleRate; channels = measured.channels; const data = pcm16Data(bytes), count = data.length / (channels * 2);
    if (count / rate * 30 < 1 || (samples + count) / rate > 180 || (samples + count) * channels * 2 > 15_999_956) throw new Error("Narration segments must span a frame and the complete take must fit 180 seconds and 16 MB.");
    const runtimeFile = join(work, "runtime.json"); let runtime = null;
    if (existsSync(runtimeFile)) {
      const text = readFileSync(runtimeFile, "utf8").replace(/^\uFEFF/, ""); if (text.length > 16000) throw new Error("Provider runtime report exceeds its limit.");
      runtime = z.record(z.string(), z.string().max(1000)).parse(JSON.parse(text));
    }
    segments.push({ number: line.number, sourceText: line.text, spokenText: spoken, delivery: line.delivery, runtime, audioHash: hash(bytes), startSample: samples, endSample: samples + count,
      startFrame: Math.round(samples / rate * 30), endFrame: Math.round((samples + count) / rate * 30), latencyMs: Math.round(performance.now() - segmentStarted), rawQuality });
    samples += count; audio.push(data); writeFileSync(join(work, "normalized.wav"), bytes, { flag: "wx", flush: true });
  }
  const header = Buffer.from(readFileSync(join(root, `line-${request.lines[0].number}`, "normalized.wav")).subarray(0, 44));
  const data = Buffer.concat(audio); header.writeUInt32LE(data.length + 36, 4); header.writeUInt32LE(data.length, 40);
  const bytes = Buffer.concat([header, data]), quality = inspectNarration(bytes);
  const manifest = { version: "narration-take@1", id, createdAt: new Date().toISOString(), source: options?.source, provider: provider.identity, request, scriptHash: hash(JSON.stringify(request.lines)), audioHash: hash(bytes), rules, segments,
    latencyMs: Math.round(performance.now() - started), quality, alignment: "measured-segment-boundaries", wordAlignment: null, humanReview: "pending", defaultSelected: false };
  const manifestBytes = JSON.stringify(manifest, null, 2);
  writeFileSync(join(root, "narration.wav"), bytes, { flag: "wx", flush: true }); writeFileSync(join(root, "take.json"), manifestBytes, { flag: "wx", flush: true });
  writeFileSync(join(root, "take.sha256"), hash(manifestBytes), { flag: "wx", flush: true });
  return { manifest, root };
}
