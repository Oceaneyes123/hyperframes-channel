import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inspectNarration } from "../engine/quality/inspect-narration.ts";
import { generateNarrationTake, normalizePcm16, type NarrationProvider } from "../server/narration/generation.ts";
import { inspectWav } from "../server/wav.ts";
import { wavFixture } from "./fixtures/wav.ts";
import { spawnSync } from "node:child_process";

test("Qwen custom voice forwards delivery and rejects a model that ignores it", (t) => {
  const result = spawnSync("python", ["tests/local-narration-check.py"], { encoding: "utf8" });
  if (result.error && "code" in result.error && result.error.code === "ENOENT") { t.skip("Python is not installed."); return; }
  assert.equal(result.status, 0, result.stderr || result.error?.message);
});

test("PCM16 quality rejects silence and malformed audio, reports clipping, normalizes measured samples", () => {
  const bytes = wavFixture(1), silence = Buffer.from(bytes); silence.fill(0, 44);
  assert.throws(() => inspectNarration(silence), /silent/); assert.throws(() => normalizePcm16(bytes.subarray(0, 80)), /complete/);
  const clipped = Buffer.from(bytes); for (let offset = 44; offset < clipped.length; offset += 2) clipped.writeInt16LE(32767, offset);
  assert.ok(inspectNarration(clipped).findings.some((item) => item.ruleId === "clipping"));
  const normalized = normalizePcm16(bytes); assert.equal(inspectWav(normalized).durationFrames, 30); assert.ok(Math.abs(inspectNarration(normalized).peak - .89) < .001);
});

test("local takes retain identity, pronunciations, measured segment boundaries and immutable retry history", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-narration-")); t.after(() => rmSync(root, { recursive: true, force: true }));
  const spoken: string[] = [];
  const provider: NarrationProvider = { identity: { id: "synthetic-tone", model: "test", version: "1", voice: "fixture", license: "test", licenseUrl: "https://example.test", supportsDelivery: false }, async generate(input) { spoken.push(input.text); return wavFixture(1); } };
  const request = { lines: [{ number: 1, text: "The API sends a request.", delivery: "hook" }, { number: 2, text: "Then the result returns.", delivery: "payoff" }], pronunciation: [{ term: "API", spoken: "A P I" }], seed: 12, rate: 0 };
  const first = await generateNarrationTake(root, provider, request, new AbortController().signal);
  assert.equal(spoken[0], "The A P I sends a request."); assert.equal(first.manifest.segments[1].startFrame, 30); assert.equal(first.manifest.segments[1].endFrame, 60);
  assert.equal(first.manifest.humanReview, "pending"); assert.equal(first.manifest.defaultSelected, false); assert.equal(first.manifest.wordAlignment, null);
  const audio = readFileSync(join(first.root, "narration.wav")); assert.equal(inspectWav(audio).durationFrames, 60);
  const second = await generateNarrationTake(root, provider, { ...request, lines: [request.lines[1]] }, new AbortController().signal);
  assert.notEqual(first.manifest.id, second.manifest.id); assert.deepEqual(readFileSync(join(first.root, "narration.wav")), audio);
  assert.equal(second.manifest.segments[0].number, 2);
  await assert.rejects(generateNarrationTake(root, provider, { ...request, lines: [request.lines[0], request.lines[0]] }, new AbortController().signal), /Unique/);
  await assert.rejects(generateNarrationTake(root, provider, request, AbortSignal.abort()));
});
