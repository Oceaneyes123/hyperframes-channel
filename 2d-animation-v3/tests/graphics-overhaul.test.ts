import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { parseVectorAsset } from "../workflow/vector-assets.ts";
import { vectorLibrary } from "../workflow/graphic-library.ts";
import { diagramSchema, layoutDiagram } from "../workflow/diagram.ts";
import { graphicsGallery } from "./fixtures/graphics-gallery.ts";
import { validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { inspectGraphics, sceneDesignHistory } from "../engine/quality/inspect-graphics.ts";
import { visualArtifactSchema, replaceShot } from "../workflow/visuals.ts";

test("curated vectors have exact content hashes and reject executable/imported payloads and deep trees", () => {
  for (const { asset, contentHash } of Object.values(vectorLibrary)) assert.equal(createHash("sha256").update(JSON.stringify(asset)).digest("hex"), contentHash);
  const source = vectorLibrary["computer-editorial@1"].asset;
  for (const node of [{ kind: "script", text: "alert(1)" }, { ...source.layers[0].nodes[0], fill: "url(https://example.test)" }, { ...source.layers[0].nodes[0], onLoad: "alert(1)" }]) {
    assert.throws(() => parseVectorAsset({ ...source, layers: [{ ...source.layers[0], nodes: [node] }] }));
  }
  const deep: Record<string, unknown> = {}; let cursor = deep;
  for (let i = 0; i < 30; i++) { cursor.child = {}; cursor = cursor.child as Record<string, unknown>; }
  assert.throws(() => parseVectorAsset(deep), /structural budget/);
  assert.throws(() => parseVectorAsset({ ...source, layers: [source.layers[0], source.layers[0]] }));
});

test("semantic layout preserves branching, groups and feedback edges deterministically", () => {
  const graph = diagramSchema.parse({ direction: "down", nodes: [{ id: "input", icon: "message", label: "Input" }, { id: "worker", icon: "processor", label: "Worker" }, { id: "cache", icon: "database", label: "Cache", parent: "worker" }, { id: "output", icon: "document", label: "Output" }], edges: [{ id: "request", from: "input", to: "worker", label: "" }, { id: "store", from: "worker", to: "cache", label: "" }, { id: "send", from: "worker", to: "output", label: "" }, { id: "retry", from: "output", to: "input", label: "" }] });
  const layout = layoutDiagram(graph); assert.deepEqual(layoutDiagram(graph), layout);
  assert.deepEqual(layout.edges.map(({ id, from, to }) => ({ id, from, to })), graph.edges.map(({ id, from, to }) => ({ id, from, to })));
  assert.equal(new Set(layout.nodes.map((node) => `${node.x},${node.y}`)).size, 4);
  assert.throws(() => diagramSchema.parse({ ...graph, edges: [{ ...graph.edges[0], to: "missing" }] }));
  assert.throws(() => diagramSchema.parse({ ...graph, nodes: graph.nodes.map((node) => node.id === "worker" ? { ...node, parent: "cache" } : node) }));
  assert.throws(() => diagramSchema.parse({ ...graph, edges: [{ ...graph.edges[0], id: "input" }] }));
});

test("eight compositions hydrate exact assets, graph layers and backgrounds without mutating source", () => {
  const { board, plan } = graphicsGallery(), original = JSON.stringify(board);
  validateMotion(plan, board, hashMotionSource); assert.equal(JSON.stringify(board), original);
  const history = sceneDesignHistory(board); assert.equal(new Set(history.map((item) => item.design?.family)).size, 8);
  assert.throws(() => visualArtifactSchema.parse({ ...board, schemaVersion: 1 }));
  const moved = structuredClone(plan); const beat = moved.shots[1].beats![0];
  moved.shots[1].beats![0] = { ...beat, presetId: "snap-overshoot@1", parameters: { to: { x: 2 }, anticipation: .9, overshoot: 1.06 } };
  assert.throws(() => validateMotion(moved, board, hashMotionSource), /Diagram layer geometry/);
  const bad = structuredClone(plan); bad.shots[1].objects[0].diagram!.edges[0].to = "storage";
  assert.throws(() => validateMotion(bad, board, hashMotionSource), /Semantic diagrams/);
});

test("graphic quality reports mobile defects and intentional continuity exempts repeated layouts", () => {
  const { board } = graphicsGallery(); if (board.output.kind !== "storyboard") throw new Error();
  const shot = board.output.shots[0], label = { type: "text" as const, x: 10, y: 10, width: 10, height: 1, color: "#F7F3E9", label: "Unreadable" };
  shot.endFrame.shapes.push(label, { ...label });
  board.output.shots[1].design = structuredClone(shot.design); board.output.shots[2].design = structuredClone(shot.design);
  const rules = inspectGraphics(board).findings.map((finding) => finding.rule);
  for (const rule of ["text-size", "contrast", "text-overlap", "layout-repetition"]) assert.ok(rules.includes(rule));
  board.output.shots[2].design!.continuityReason = "Compare the same example across stages.";
  assert.ok(!inspectGraphics(board).findings.some((finding) => finding.rule === "layout-repetition"));
  const before = JSON.stringify(board.output.shots[1]);
  const replacement = { ...shot, action: "Focused artwork revision." };
  const revised = replaceShot(board.output, 0, replacement, Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`).join("\n"));
  assert.equal(JSON.stringify(revised.shots[1]), before);
});


test("asset import validates input and refuses an existing version without changing registry bytes", (t) => {
  const root = mkdtempSync(join(tmpdir(), "v3-vector-import-")); t.after(() => rmSync(root, { recursive: true, force: true }));
  const path = join(root, "asset.json"), script = resolve("scripts/import-graphic-asset.ts");
  writeFileSync(path, JSON.stringify(vectorLibrary["computer-editorial@1"].asset));
  const receipt = JSON.parse(execFileSync(process.execPath, [script, "--check", path], { encoding: "utf8" }));
  assert.equal(receipt.contentHash, vectorLibrary["computer-editorial@1"].contentHash);
  const before = readFileSync("workflow/graphic-pack.json");
  assert.throws(() => execFileSync(process.execPath, [script, "--install", path], { stdio: "pipe" }));
  assert.deepEqual(readFileSync("workflow/graphic-pack.json"), before);
  writeFileSync(path, '<svg onload="alert(1)"/>');
  assert.throws(() => execFileSync(process.execPath, [script, "--check", path], { stdio: "pipe" }));
});
