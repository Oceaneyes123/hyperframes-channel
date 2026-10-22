import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion } from "../server/motion-store.ts";
import { openProduction } from "../server/production-store.ts";
import { inspectWav } from "../server/wav.ts";
import { boardFixture, conceptFixture } from "./fixtures/visuals.ts";
import { motionFixture } from "./fixtures/motion.ts";
import { wavFixture } from "./fixtures/wav.ts";
import { mediaResponse } from "../server/media-response.ts";

test("media responses support precise range seeking, suffix ranges and HEAD", async () => {
  const bytes = new Uint8Array([1, 2, 3, 4]);
  for (const [range, expected] of [["bytes=1-2", [2, 3]], ["bytes=-2", [3, 4]], ["bytes=2-", [3, 4]]] as const) {
    const response = mediaResponse(new Request("http://localhost", { headers: { range } }), bytes, "audio/wav");
    assert.equal(response.status, 206); assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], expected);
    assert.equal(response.headers.get("accept-ranges"), "bytes");
  }
  for (const range of ["bytes=4-", "bytes=2-1", "bytes=-0", "bytes=0-1,2-3", "bytes=90071992547409999-"]) assert.equal(mediaResponse(new Request("http://localhost", { headers: { range } }), bytes, "audio/wav").status, 416);
  const head = mediaResponse(new Request("http://localhost", { method: "HEAD" }), bytes, "audio/wav"); assert.equal(head.headers.get("content-length"), "4"); assert.equal((await head.arrayBuffer()).byteLength, 0);
});

test("measured narration rejects malformed, silent, mismatched and unaligned inputs; exact gates guard rendering", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-production-")), directory = join(root, "db"), videos = join(root, "videos");
  const studio = openStudio(directory, videos), visuals = openVisuals(directory, videos), motion = openMotion(directory, videos), production = openProduction(directory, videos);
  t.after(() => { production.close(); motion.close(); visuals.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Synthetic production contract test"), script = studio.saveScript(project.id, "One\nTwo\nThree", null); studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts", scriptId: script.id, baseId: null, selectionId: null, shotIndex: null, instruction: "" };
  const concept = visuals.begin(project.id, request, "fixture-model"); visuals.complete(project.id, concept, conceptFixture); const selectionId = visuals.choose(project.id, concept, 0, null);
  const boardId = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture-model"); const drawing = boardFixture(); drawing.shots.forEach((shot, i) => { if (i) shot.transition = "hard-cut" as typeof shot.transition; });
  visuals.complete(project.id, boardId, drawing); visuals.accept(project.id, boardId);
  const motionRequest = { storyboardId: boardId, baseId: null, shotId: null, instruction: "" };
  const id = motion.begin(project.id, motionRequest); motion.complete(project.id, id, motionFixture(visuals.read(project.id, boardId)!)); motion.decide(project.id, id, "accept");
  const timing = [{ number: 1, startFrame: 0, endFrame: 110 }, { number: 2, startFrame: 120, endFrame: 230 }, { number: 3, startFrame: 240, endFrame: 350 }];
  const wav = wavFixture(); assert.equal(inspectWav(wav).durationFrames, 360);
  const silence = Buffer.from(wav); silence.fill(0, 44); assert.throws(() => inspectWav(silence), /silent/);
  assert.throws(() => inspectWav(wav.subarray(0, 100)), /complete/);
  assert.equal(production.status(project.id).ready, false);
  assert.throws(() => production.importNarration(project.id, id, wavFixture(11), timing), /duration/);
  assert.throws(() => production.importNarration(project.id, id, wav, [{ ...timing[0], endFrame: 130 }, ...timing.slice(1)]), /assigned/);
  production.importNarration(project.id, id, wav, timing); const status = production.status(project.id); assert.equal(status.ready, true);
  assert.throws(() => production.beginRender(project.id, status.binding!, true), /gates/);
  const review = { binding: status.binding!, reviewed: true, notes: "Synthetic fixture only; this is not human quality approval." };
  assert.throws(() => production.approve(project.id, { ...review, gate: "gate2" }), /Gate 1/);
  assert.throws(() => production.approve(project.id, { ...review, gate: "gate1", reviewed: false }));
  production.approve(project.id, { ...review, gate: "gate1" }); production.approve(project.id, { ...review, gate: "gate2" });
  assert.throws(() => production.beginRender(project.id, status.binding!, false), /authorization/);
  const reopened = openProduction(directory, videos); try { assert.ok(reopened.status(project.id).gate2); } finally { reopened.close(); }
  const job = production.beginRender(project.id, status.binding!, true); assert.throws(() => production.beginRender(project.id, status.binding!, true), /already running/);
  production.failRender(project.id, job.id); assert.equal(production.exportRecord(project.id, job.id), null);
  const interrupted = production.beginRender(project.id, status.binding!, true);
  production.importNarration(project.id, id, wav, timing); assert.equal(production.status(project.id).gate1, null); assert.equal(production.status(project.id).gate2, null);
  assert.throws(() => production.finishRender(project.id, interrupted.id, status.binding!, {}), /changed/); production.failRender(project.id, interrupted.id);
  assert.throws(() => production.approve(project.id, { ...review, gate: "gate1" }), /changed/);
  studio.saveScript(project.id, "Changed\nTwo\nThree", script.id); assert.equal(production.status(project.id).ready, false);
});
