import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { inspectWav, pcm16Data } from "../../server/wav.ts";
import { inspectNarration } from "../../engine/quality/inspect-narration.ts";

const partialRoot = resolve(".data/narration-takes/af23719a-5fd8-468d-bfee-8780cc5a9050");
const finalLineRoot = resolve(".data/narration-takes/10974f6b-222b-4ba0-a904-3216f57a7520");
const sources = [
  { number: 1, path: join(partialRoot, "line-1", "normalized.wav") },
  { number: 3, path: join(partialRoot, "line-3", "normalized.wav") },
  { number: 5, path: join(partialRoot, "line-5", "normalized.wav") },
  { number: 7, path: join(partialRoot, "line-7", "normalized.wav") },
  { number: 9, path: join(finalLineRoot, "line-9", "normalized.wav") },
];
const output = resolve("output/playwright/payment-failed-narration-review");
mkdirSync(output, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const segments = [];
let sampleRate = 0;
let channels = 0;
let samples = 0;
const audio = [];
let header;

function trimSilence(data, channelCount, rate) {
  const frameBytes = channelCount * 2;
  const frames = data.length / frameBytes;
  const windowFrames = Math.max(1, Math.round(rate * .01));
  const threshold = Math.round(32767 * 10 ** (-45 / 20));
  let first = 0;
  let last = frames;
  for (let start = 0; start < frames; start += windowFrames) {
    let peak = 0;
    for (let frame = start; frame < Math.min(frames, start + windowFrames); frame++) {
      for (let channel = 0; channel < channelCount; channel++) peak = Math.max(peak, Math.abs(data.readInt16LE(frame * frameBytes + channel * 2)));
    }
    if (peak >= threshold) { first = start; break; }
  }
  for (let end = frames; end > 0; end -= windowFrames) {
    let peak = 0;
    for (let frame = Math.max(0, end - windowFrames); frame < end; frame++) {
      for (let channel = 0; channel < channelCount; channel++) peak = Math.max(peak, Math.abs(data.readInt16LE(frame * frameBytes + channel * 2)));
    }
    if (peak >= threshold) { last = end; break; }
  }
  const padding = Math.round(rate * .08);
  return data.subarray(Math.max(0, first - padding) * frameBytes, Math.min(frames, last + padding) * frameBytes);
}

for (const source of sources) {
  const bytes = readFileSync(source.path);
  const measured = inspectWav(bytes);
  if (sampleRate && (measured.sampleRate !== sampleRate || measured.channels !== channels)) throw new Error("Narration formats differ.");
  sampleRate = measured.sampleRate;
  channels = measured.channels;
  header ??= Buffer.from(bytes.subarray(0, 44));
  const data = trimSilence(pcm16Data(bytes), channels, sampleRate);
  const count = data.length / (channels * 2);
  const startFrame = Math.round(samples / sampleRate * 30);
  samples += count;
  const endFrame = Math.round(samples / sampleRate * 30);
  audio.push(data);
  segments.push({
    number: source.number,
    source: source.path.replaceAll("\\", "/"),
    audioSha256: hash(bytes),
    startSample: segments.reduce((sum, item) => sum + item.samples, 0),
    samples: count,
    startFrame,
    endFrame,
  });
}

const data = Buffer.concat(audio);
header.writeUInt32LE(data.length + 36, 4);
header.writeUInt32LE(data.length, 40);
const bytes = Buffer.concat([header, data]);
const wavPath = join(output, "qwen-ryan-composite-trimmed.wav");
writeFileSync(wavPath, bytes, { flag: "wx" });
const measured = inspectWav(bytes);
const quality = inspectNarration(bytes);
const manifest = {
  version: "assembled-narration-review@1",
  createdAt: new Date().toISOString(),
  provider: "qwen3-custom",
  modelRevision: "0c0e3051f131929182e2c023b9537f8b1c68adfe",
  voice: "ryan",
  device: "cpu",
  delivery: "Warm technology teacher; passage-specific hook, explanation and payoff directions.",
  sourceTakes: [partialRoot.replaceAll("\\", "/"), finalLineRoot.replaceAll("\\", "/")],
  segments,
  measured,
  durationSeconds: measured.durationSeconds,
  audioSha256: hash(bytes),
  quality,
  completeProviderTake: false,
  humanReview: "pending",
  silenceTrim: "Removed only leading and trailing audio below -45 dBFS, retaining 0.08 seconds of padding on each side of every passage.",
  notes: "Review composite assembled from one preserved incomplete full take and a separate final-line audition. It must not be treated as an approved or provider-complete take.",
};
writeFileSync(join(output, "manifest-trimmed.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });
console.log(`AUDIO=${wavPath}`);
console.log(`DURATION_SECONDS=${measured.durationSeconds.toFixed(3)}`);
console.log(`QUALITY=${JSON.stringify(quality.findings)}`);
