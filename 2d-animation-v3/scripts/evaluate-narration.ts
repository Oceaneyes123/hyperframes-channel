import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { arch, cpus, platform, release, totalmem } from "node:os";
import { z } from "zod";
import { generateNarrationTake, narrationRequestSchema } from "../server/narration/generation.ts";
import { pythonNarrationProvider, windowsSpeechProvider } from "../server/narration/providers/local.ts";

// Explicit evaluation only. No Studio import, approval, default selection or automatic downloads.
const configSchema = z.strictObject({
  outputDirectory: z.string().min(1), request: narrationRequestSchema,
  providers: z.array(z.discriminatedUnion("provider", [
    z.strictObject({ provider: z.literal("windows-speech"), voice: z.string().min(1) }),
    z.strictObject({ provider: z.enum(["chatterbox-turbo", "qwen3-tts"]), python: z.string().min(1), modelPath: z.string().min(1), version: z.string().min(1), voice: z.string().min(1), referenceWav: z.string().min(1), referenceText: z.string().min(1), device: z.enum(["cpu", "cuda"]) }),
    z.strictObject({ provider: z.literal("qwen3-custom"), python: z.string().min(1), modelPath: z.string().min(1), version: z.string().min(1), voice: z.string().min(1), device: z.enum(["cpu", "cuda"]) }),
  ])).min(1).max(4),
});
const config = configSchema.parse(JSON.parse(readFileSync(process.argv[2], "utf8")));
mkdirSync(config.outputDirectory, { recursive: true });
const results = [];
for (const entry of config.providers) {
  try {
    const provider = entry.provider === "windows-speech" ? windowsSpeechProvider(entry.voice) : pythonNarrationProvider(entry);
    const take = await generateNarrationTake(config.outputDirectory, provider, config.request, AbortSignal.timeout(1_800_000));
    results.push({ provider: entry.provider, status: "generated", takeId: take.manifest.id, path: take.root, latencyMs: take.manifest.latencyMs, durationSeconds: take.manifest.quality.measured.durationSeconds });
  } catch {
    results.push({ provider: entry.provider, status: "unavailable-or-failed", note: "Inspect local runtime, cached model and failed take request. No provider substitution occurred." });
  }
}
const report = { version: "narration-evaluation@1", createdAt: new Date().toISOString(), hardware: { platform: platform(), release: release(), arch: arch(), cpu: cpus()[0]?.model, memoryBytes: totalmem(), gpu: "Record GPU/VRAM separately from the actual host; not inferred." }, results, humanListening: "pending", defaultSelected: false };
writeFileSync(join(config.outputDirectory, `evaluation-${Date.now()}.json`), JSON.stringify(report, null, 2), { flag: "wx" });
console.log(JSON.stringify(report, null, 2));
if (!results.some((item) => item.status === "generated")) process.exitCode = 1;
