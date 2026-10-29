import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { readConfig, modelFor } from "../server/config.ts";
import { creativeDirection, registerCreativeExample } from "../server/creative-direction.ts";
import { generateWriting } from "../server/scriptwriting.ts";
import { generateMotion } from "../server/motion.ts";
import { generateVisuals } from "../server/visuals.ts";
import { openScriptwriting } from "../server/scriptwriting-store.ts";
import { preflight } from "../server/preflight.ts";
import { fakeGateway, fixtureWriting } from "./fixtures/gateway.ts";
import { researchFixture } from "./fixtures/research.ts";
import { fixtureMotion } from "./fixtures/motion.ts";
import { fixtureVisuals } from "./fixtures/visuals.ts";
import { motionProject } from "./fixtures/motion-project.ts";

test("role settings preserve fallback behavior and validate selected example IDs", () => {
  const config = readConfig({ CLIPROXYAPI_MODEL: "base", CLIPROXYAPI_VISUAL_MODEL: "visual", CLIPROXYAPI_DIRECTOR_MODEL: "director", CLIPROXYAPI_WRITER_MODEL: "writer", CLIPROXYAPI_MOTION_MODEL: "motion", CLIPROXYAPI_CRITIC_MODEL: "critic" });
  for (const role of ["director", "writer", "motion", "critic"] as const) assert.equal(modelFor(config, role), role);
  config.roleModels = undefined;
  assert.equal(modelFor(config, "director"), "visual"); assert.equal(modelFor(config, "critic"), "visual");
  assert.equal(modelFor(config, "writer"), "base"); assert.equal(modelFor(config, "motion"), "base");
  config.visualModel = undefined; assert.equal(modelFor(config, "critic"), "base");
  assert.throws(() => readConfig({ V3_CREATIVE_EXAMPLE_IDS: "../untrusted" }));
  assert.throws(() => readConfig({ V3_CREATIVE_EXAMPLE_IDS: Array.from({ length: 4 }, () => randomUUID()).join(",") }));
});

test("director and motion calls use role overrides and include style and rhythm guidance", async (t) => {
  const f = motionProject(t);
  const gateway = await fakeGateway("ok", 0, (body) => body.model === "director" ? fixtureVisuals(body) : fixtureMotion(body), ["director", "motion", "writer", "critic"]);
  t.after(() => gateway.close()); f.config.gateway = { baseUrl: gateway.baseUrl };
  f.config.roleModels = { director: "director", motion: "motion", writer: "writer", critic: "critic" };
  await preflight("gateway", new AbortController().signal, f.config);
  const id = await generateMotion(f.projectId, { storyboardId: f.boardId, baseId: f.artifactId, shotId: "shot-2", instruction: "Refine this shot." }, new AbortController().signal, () => {}, f.config);
  assert.equal(f.motion.list(f.projectId).find((row) => row.id === id)?.model, "motion");
  const board = f.visuals.read(f.projectId, f.boardId)!;
  const visualId = await generateVisuals(f.projectId, { kind: "shot", scriptId: f.scriptId, selectionId: board.selectionId, baseId: f.boardId, shotIndex: 1, instruction: "Refine only this shot." }, new AbortController().signal, () => {}, f.config);
  assert.equal(f.visuals.list(f.projectId).find((row) => row.id === visualId)?.model, "director");
  assert.deepEqual(gateway.requests.map((request) => request.model), ["motion", "director"]);
  for (const request of gateway.requests) {
    assert.match(request.messages.map((message) => message.content).join("\n"), /Style bible:/);
    assert.match(request.messages.map((message) => message.content).join("\n"), /no reference clips measured/);
  }
});

test("writing and editorial review route separately and record actual models without changing legacy artifacts", async (t) => {
  const f = motionProject(t), writing = openScriptwriting(f.config.dataDirectory, f.config.videosDirectory);
  try {
  const gateway = await fakeGateway("writing", 0, fixtureWriting, ["writer", "critic"]); t.after(() => gateway.close());
  f.config.gateway = { baseUrl: gateway.baseUrl }; f.config.roleModels = { writer: "writer", critic: "critic" };
  const skills = (name: "storytelling-hooks" | "humanizer") => ({ text: "Synthetic skill guidance.", records: [{ name, path: `/fixture/${name}`, sha256: "a".repeat(64) }] });
  const brief = writing.saveBrief(f.projectId, researchFixture, null);
  const hooksId = await generateWriting(f.projectId, { kind: "hooks", parentId: brief, instruction: "" }, new AbortController().signal, () => {}, f.config, skills);
  const hooks = writing.read(f.projectId, hooksId)!.output; assert.equal(hooks.kind, "hooks"); if (hooks.kind !== "hooks") return;
  const draftId = await generateWriting(f.projectId, { kind: "draft", parentId: hooksId, hookId: hooks.hooks[0].id, instruction: "" }, new AbortController().signal, () => {}, f.config, skills);
  assert.deepEqual(gateway.requests.map((request) => request.model), ["writer", "writer", "writer", "critic"]);
  const artifact = writing.read(f.projectId, draftId)!;
  assert.deepEqual(artifact.modelCalls?.map(({ role, model }) => ({ role, model })), [{ role: "writer", model: "writer" }, { role: "writer", model: "writer" }, { role: "critic", model: "critic" }]);
  assert.equal(writing.read(f.projectId, brief)?.modelCalls, undefined);
  } finally { writing.close(); }
});

test("accepted example registration renders real 360x640 production frames and injects verified images", { timeout: 180_000 }, async (t) => {
  const f = motionProject(t), signal = new AbortController().signal;
  const request = { artifactId: f.artifactId, shotIndex: 1, reason: "Synthetic fixture tests geometry changing across exact frame samples." };
  await assert.rejects(registerCreativeExample(f.projectId, request, signal, f.config), /explicitly accepted/);
  f.motion.decide(f.projectId, f.artifactId, "accept");
  const example = await registerCreativeExample(f.projectId, request, signal, f.config);
  const manifest = JSON.parse(readFileSync(join(example.output, "example.json"), "utf8"));
  for (const frame of manifest.frames) {
    const png = readFileSync(join(example.output, frame.file));
    assert.equal(png.readUInt32BE(16), 360); assert.equal(png.readUInt32BE(20), 640);
  }
  assert.ok(new Set(manifest.frames.map((frame: { sha256: string }) => frame.sha256)).size > 1);
  f.config.creativeExampleIds = [example.id];
  const direction = creativeDirection(f.config), message = direction.messages.at(-1)!;
  assert.ok(Array.isArray(message.content)); assert.equal(message.content.length, 4);
  assert.deepEqual(direction.snapshot.examples.map(({ id }) => id), [example.id]);
  writeFileSync(join(example.output, manifest.frames[0].file), "tampered image");
  assert.throws(() => creativeDirection(f.config), /image integrity/);
});
