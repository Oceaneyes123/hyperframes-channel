import assert from "node:assert/strict";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { motionProject } from "./fixtures/motion-project.ts";
import { fakeGateway } from "./fixtures/gateway.ts";
import { fixtureMotion } from "./fixtures/motion.ts";
import { iterateMotion, motionIterationRequestSchema } from "../server/motion-iteration.ts";
import { motionSamples, sha256, type motionFrameRenderer } from "../server/motion-frames.ts";
import { openTiming } from "../server/timing-store.ts";
import { wavFixture } from "./fixtures/wav.ts";

const signal = () => new AbortController().signal;
// Deterministic transport fixture; these bytes are never presented as rendered evidence.
const renderFixture: ReturnType<typeof motionFrameRenderer> = async (_artifact, _board, samples, output, abort) => {
  abort.throwIfAborted(); mkdirSync(output, { recursive: true });
  return samples.map((sample) => {
    const bytes = Buffer.from(`synthetic frame ${sample.frame}`), file = `frame-${sample.frame}.png`;
    writeFileSync(join(output, file), bytes);
    return { ...sample, file, sha256: sha256(bytes), dataUrl: `data:image/png;base64,${bytes.toString("base64")}` };
  });
};

test("visual loop critiques rendered samples, scopes changes and preserves accepted motion", async (t) => {
  const f = motionProject(t); f.motion.decide(f.projectId, f.artifactId, "accept");
  const original = f.motion.read(f.projectId, f.artifactId)!;
  let critiques = 0;
  const gateway = await fakeGateway("ok", 0, (body) => {
    if (typeof body.messages.at(-1)!.content === "string") return fixtureMotion(body);
    critiques++;
    const text = body.messages.map((message) => message.content).join("\n");
    assert.match(text, /Style bible/); assert.match(text, /experimental diagnostics/);
    return { findings: critiques === 1 ? [{ frame: 150, dimension: "timing", evidence: "Declared easing is smooth.", suggestion: "Use linear easing for this comparison." }] : [] };
  }, ["critic", "motion"]); t.after(() => gateway.close());
  f.config.gateway = { baseUrl: gateway.baseUrl }; f.config.roleModels = { critic: "critic", motion: "motion" };
  const result = await iterateMotion(f.projectId, { artifactId: f.artifactId, shotIndex: 1 }, signal(), () => {}, f.config, renderFixture);
  assert.equal(result.stop, "no-sampled-findings"); assert.equal(result.revisions, 1); assert.equal(critiques, 2);
  const revised = f.motion.read(f.projectId, result.artifactId)!;
  assert.deepEqual(revised.plan.shots[0], original.plan.shots[0]); assert.deepEqual(revised.plan.shots[2], original.plan.shots[2]);
  assert.equal(revised.plan.shots[1].actions[0].ease, "linear");
  assert.equal(f.motion.acceptance(f.projectId)?.runId, f.artifactId);
  assert.equal(f.motion.list(f.projectId)[0].decision, "pending");
  assert.deepEqual(f.motion.read(f.projectId, f.artifactId), original);
  const review = JSON.parse(readFileSync(join(result.output, "round-0/review.json"), "utf8"));
  assert.equal(review.frames.length, 7); assert.equal(review.context.timing.measured, false);
  assert.deepEqual(review.context.narration.map((line: { text: string }) => line.text), ["One", "Two", "Three"]);
  assert.equal(review.model, "critic"); assert.ok(review.guidance.bibleHash);
  assert.deepEqual(gateway.requests.map((request) => request.model), ["critic", "motion", "critic"]);
  assert.ok(!readFileSync(join(result.output, "round-0/review.json"), "utf8").includes("base64"));
});

test("loop enforces two revision maximum and reports unresolved findings", async (t) => {
  const f = motionProject(t); let critiques = 0, revisions = 0;
  const gateway = await fakeGateway("ok", 0, (body) => {
    if (typeof body.messages.at(-1)!.content !== "string") return { findings: [{ frame: 150, dimension: "timing", evidence: "Synthetic issue.", suggestion: `Synthetic revision ${++critiques}.` }] };
    const result = fixtureMotion(body); revisions++;
    result.actions[0].ease = revisions === 1 ? "linear" : "smooth"; return result;
  }); t.after(() => gateway.close()); f.config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model" };
  const result = await iterateMotion(f.projectId, { artifactId: f.artifactId, shotIndex: 1 }, signal(), () => {}, f.config, renderFixture);
  assert.equal(result.stop, "revision-budget-exhausted"); assert.equal(revisions, 2); assert.equal(critiques, 3);
  assert.equal(result.candidates.length, 3); assert.equal(f.motion.acceptance(f.projectId), null);
  assert.throws(() => motionIterationRequestSchema.parse({ artifactId: f.artifactId, shotIndex: 1, maxRounds: 3 }));
});

test("repeated findings and unchanged plans terminate early", async (t) => {
  for (const unchanged of [false, true]) {
    const f = motionProject(t);
    const gateway = await fakeGateway("ok", 0, (body) => {
      if (typeof body.messages.at(-1)!.content !== "string") return { findings: [{ frame: 150, dimension: "timing", evidence: "Synthetic issue.", suggestion: "Use linear easing." }] };
      const result = fixtureMotion(body); if (unchanged) result.actions[0].ease = "smooth"; return result;
    }); t.after(() => gateway.close()); f.config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model" };
    const result = await iterateMotion(f.projectId, { artifactId: f.artifactId, shotIndex: 1 }, signal(), () => {}, f.config, renderFixture);
    assert.equal(result.stop, unchanged ? "unchanged-motion" : "repeated-findings"); assert.equal(result.revisions, 1);
  }
});

test("invalid critique, protected timing changes, stale inputs and cancellation fail without acceptance", async (t) => {
  for (const mode of ["invalid", "timing", "stale", "cancel"] as const) {
    const f = motionProject(t); const abort = new AbortController();
    const gateway = await fakeGateway("ok", 0, (body) => {
      if (typeof body.messages.at(-1)!.content !== "string") return { findings: [{ frame: mode === "invalid" ? 99999 : 150, dimension: "timing", evidence: "Synthetic issue.", suggestion: "Use linear easing." }] };
      const result = fixtureMotion(body); result.durationFrames++; return result;
    }); t.after(() => gateway.close()); f.config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model" };
    const render: typeof renderFixture = async (...args) => {
      const frames = await renderFixture(...args);
      if (mode === "stale") f.studio.saveScript(f.projectId, "Changed\nTwo\nThree", f.scriptId);
      if (mode === "cancel") abort.abort();
      return frames;
    };
    await assert.rejects(iterateMotion(f.projectId, { artifactId: f.artifactId, shotIndex: 1 }, abort.signal, () => {}, f.config, render), /Saved candidates/);
    assert.equal(f.motion.latest(f.projectId), f.artifactId); assert.equal(f.motion.acceptance(f.projectId), null);
    const sessions = readdirSync(join(f.config.dataDirectory, "motion-iterations"));
    assert.equal(sessions.length, 1); assert.ok(readFileSync(join(f.config.dataDirectory, "motion-iterations", sessions[0], "failure.json")));
    if (mode === "stale" || mode === "cancel") assert.equal(gateway.requests.length, 0);
  }
});

test("sampling includes selected shot development and adjacent boundaries with valid global frames", (t) => {
  const f = motionProject(t), artifact = f.motion.read(f.projectId, f.artifactId)!;
  assert.deepEqual(motionSamples(artifact, 1).map((sample) => sample.frame), [119, 120, 150, 180, 209, 239, 240]);
  assert.equal(motionSamples(artifact, 0).length, 6); assert.equal(motionSamples(artifact, 2).length, 6);
  assert.throws(() => motionSamples(artifact, -1)); assert.throws(() => motionSamples(artifact, 3));
});

test("critique receives measured narration timing and leaves artwork-only findings for human review", async (t) => {
  const f = motionProject(t), timings = openTiming(f.config.dataDirectory, f.config.videosDirectory);
  let artifactId;
  try {
    timings.import(f.projectId, { scriptId: f.scriptId, baseId: null, provenance: "manual", anchors: [], timing: [{ number: 1, startFrame: 0, endFrame: 110 }, { number: 2, startFrame: 120, endFrame: 230 }, { number: 3, startFrame: 240, endFrame: 350 }] }, wavFixture());
    artifactId = f.motion.begin(f.projectId, { storyboardId: f.boardId, baseId: f.artifactId, shotId: null, instruction: "" });
    f.motion.complete(f.projectId, artifactId, f.motion.read(f.projectId, f.artifactId)!.plan);
  } finally { timings.close(); }
  const gateway = await fakeGateway("ok", 0, (body) => {
    const content = body.messages.at(-1)!.content as unknown as { type: string; text: string }[];
    const context = JSON.parse(content[0].text);
    assert.equal(context.timing.measured, true); assert.equal(context.timing.lines.length, 3);
    return { findings: [{ frame: 150, dimension: "clarity", evidence: "Synthetic artwork needs a different diagram.", suggestion: "Requires storyboard or neighboring-shot review." }] };
  }); t.after(() => gateway.close()); f.config.gateway = { baseUrl: gateway.baseUrl, model: "fixture-model" };
  const result = await iterateMotion(f.projectId, { artifactId, shotIndex: 1 }, signal(), () => {}, f.config, renderFixture);
  assert.equal(result.stop, "needs-storyboard-or-neighbor-review"); assert.equal(result.revisions, 0); assert.equal(gateway.requests.length, 1);
});
