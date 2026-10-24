import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { readFileSync, mkdtempSync, rmSync, cpSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { graphicAssetRegistry, graphicReference } from "../workflow/graphic-assets.ts";
import { frameSchema, visualArtifactSchema } from "../workflow/visuals.ts";
import { validateMotion, motionPlanSchema } from "../workflow/motion.ts";
import { compileMotion } from "../engine/compile-motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { hashEngine } from "../server/production-store.ts";
import { conceptFixture } from "./fixtures/visuals.ts";
import { graphicWorkflowFixture } from "./fixtures/graphic-workflow.ts";
import { motionEngineFixture } from "./fixtures/motion-engine.ts";

test("registered artwork source hash and layer metadata match the reviewed asset", () => {
  const asset = graphicAssetRegistry["complaint-workflow@1"];
  const source = readFileSync(asset.source, "utf8").replace(/\r\n/g, "\n");
  assert.equal(createHash("sha256").update(source).digest("hex"), asset.contentHash, "Publish a new version when approved artwork changes.");
  assert.equal(asset.license, "CC0-1.0"); assert.equal(asset.viewBox, "0 0 900 1200");
  assert.deepEqual(asset.layers, ["complaints", "cluster", "packet", "opportunity"]);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML|<script|<foreignObject|\bhref=|\bonLoad=/);
});

test("production dependencies change when the artwork source or its registry changes", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-graphic-binding-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ["engine", "workflow", "server", "next.config.ts", "package-lock.json"]) cpSync(path, join(root, path), { recursive: true });
  let before = hashEngine(root); assert.equal(before, hashEngine());
  for (const source of ["engine/graphics/complaint-workflow.tsx", "workflow/graphic-assets.ts"]) {
    appendFileSync(join(root, source), "\n// Synthetic isolated dependency change.\n");
    const after = hashEngine(root); assert.notEqual(after, before); before = after;
  }
});

test("graphic references fail closed on unregistered assets, hashes, markup and incompatible geometry", () => {
  const { board, plan } = graphicWorkflowFixture();
  if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
  const frame = board.output.shots[0].startFrame;
  for (const asset of [undefined, { ...graphicReference("complaint-workflow@1"), contentHash: "0".repeat(64) },
    { id: "https://example.test/a.svg", contentHash: "0".repeat(64) }, { ...graphicReference("complaint-workflow@1"), svg: "<script/>" }]) {
    assert.throws(() => frameSchema.parse({ ...frame, shapes: [{ ...frame.shapes[0], asset }] }));
  }
  assert.throws(() => frameSchema.parse({ ...frame, shapes: [{ ...frame.shapes[0], height: 10 }] }));
  assert.throws(() => frameSchema.parse({ ...frame, shapes: [{ ...frame.shapes[0], type: "rect" }] }));
  assert.throws(() => visualArtifactSchema.parse({ ...board, schemaVersion: 1 }));
  const badMotion = structuredClone(plan); badMotion.shots[0].objects[0].asset!.contentHash = "0".repeat(64);
  assert.throws(() => motionPlanSchema.parse(badMotion));
  const unknown = structuredClone(plan); unknown.shots[0].beats![0].targetIds = ["object-1.unknown"];
  assert.throws(() => validateMotion(unknown, board, hashMotionSource), /Unknown/);
});

test("artwork uses one root and four stable part actors through hydration, validation and compilation", () => {
  const { board, plan } = graphicWorkflowFixture(); validateMotion(plan, board, hashMotionSource);
  const group = compileMotion(plan, board).groups[0];
  assert.equal(group.actors.length, 1);
  assert.equal(group.shots[0].targets["object-1.packet"], "actor-0.packet");
  assert.equal(group.actors[0].object.asset?.contentHash, graphicAssetRegistry["complaint-workflow@1"].contentHash);
  const legacy = motionEngineFixture(); visualArtifactSchema.parse(legacy.board);
  assert.equal(legacy.board.schemaVersion, 1); compileMotion(legacy.plan, legacy.board);
  const changed = structuredClone(plan); changed.shots[0].objects[0].initialParts!.complaints.opacity = 0;
  assert.throws(() => validateMotion(changed, board, hashMotionSource), /Initial component/);
});

test("Studio persists graphic proposals as v2 and preserves legacy v1 artifacts and explicit acceptance", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-graphics-")), data = join(root, "db"), videos = join(root, "videos");
  const studio = openStudio(data, videos), visuals = openVisuals(data, videos);
  t.after(() => { visuals.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  const project = studio.createProject("Synthetic graphic workflow"), script = studio.saveScript(project.id, "Group repeated work complaints into a candidate tool. Validate demand before building.", null);
  studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts" as const, scriptId: script.id, selectionId: null, baseId: null, shotIndex: null, instruction: "" };
  const concepts = visuals.begin(project.id, request, "fixture"); visuals.complete(project.id, concepts, conceptFixture);
  assert.equal(visuals.read(project.id, concepts)!.schemaVersion, 1);
  const legacyBytes = readFileSync(join(videos, project.id, "visuals", `${concepts}.json`));
  const selectionId = visuals.choose(project.id, concepts, 0, null);
  const { board } = graphicWorkflowFixture();
  const id = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture"); visuals.complete(project.id, id, board.output);
  assert.equal(visuals.read(project.id, id)!.schemaVersion, 2);
  assert.equal(visuals.acceptance(project.id), null); visuals.accept(project.id, id);
  const reopened = openVisuals(data, videos);
  try { assert.equal(reopened.read(project.id, id)!.schemaVersion, 2); assert.equal(reopened.acceptance(project.id)!.runId, id); } finally { reopened.close(); }
  assert.deepEqual(readFileSync(join(videos, project.id, "visuals", `${concepts}.json`)), legacyBytes);
});
