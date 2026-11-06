import assert from "node:assert/strict";
import { test } from "node:test";
import { backgroundSchema } from "../workflow/art-direction.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";
import { textMotionFixture } from "./fixtures/text-motion.ts";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("texture is explicit, bounded and reviewed without changing legacy environments", () => {
  const legacy = { family: "editorial", color: "#F7F3E9", accent: "#203B3A", depth: .45 };
  assert.deepEqual(backgroundSchema.parse(legacy), legacy);
  assert.throws(() => backgroundSchema.parse({ ...legacy, texture: "remote-url" }));
  assert.equal(backgroundSchema.parse({ ...legacy, texture: "rough-paper@1" }).texture, "rough-paper@1");
  const { board } = textMotionFixture(); if (board.output.kind !== "storyboard") throw new Error();
  board.schemaVersion = 2;
  assert.ok(inspectGraphics(board).findings.some((finding) => finding.rule === "plain-background" && finding.shotIndex === 0));
  for (const frame of [board.output.shots[0].startFrame, board.output.shots[0].endFrame]) {
    frame.environment = backgroundSchema.parse({ ...legacy, texture: "paper-grain@1" });
  }
  assert.ok(!inspectGraphics(board).findings.some((finding) => finding.rule === "plain-background" && finding.shotIndex === 0));
  for (const frame of [board.output.shots[0].startFrame, board.output.shots[0].endFrame]) frame.environment!.texture = "rough-paper@1";
  assert.ok(!inspectGraphics(board).findings.some((finding) => finding.rule === "plain-background" && finding.shotIndex === 0));
  board.output.shots[0].startFrame.environment!.depth = 0;
  assert.ok(inspectGraphics(board).findings.some((finding) => finding.rule === "plain-background" && finding.shotIndex === 0));
});

test("rough paper renders fixed fibers and edges without changing the legacy texture", async () => {
  const loader = registerHooks({ load(url, context, nextLoad) {
    if (url.endsWith("/engine/graphics/background.tsx")) return { format: "module", source: ts.transpileModule(readFileSync(new URL(url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText, shortCircuit: true };
    return nextLoad(url, context);
  } });
  try {
    const { GraphicBackground } = await import("../engine/graphics/background.tsx");
    const environment = backgroundSchema.parse({ family: "editorial", color: "#E8DECA", accent: "#A17755", depth: 1, texture: "rough-paper@1" });
    const render = (progress: number) => renderToStaticMarkup(createElement(GraphicBackground, { environment, width: 360, height: 640, progress }));
    const rough = render(0);
    assert.match(rough, /data-rough-paper="rough-paper@1"/);
    assert.match(rough, /baseFrequency=".045 .19"/);
    assert.equal(rough, render(1), "paper texture must not flicker with scene progress");
    const legacy = renderToStaticMarkup(createElement(GraphicBackground, { environment: { ...environment, texture: "paper-grain@1" }, width: 360, height: 640 }));
    assert.match(legacy, /data-texture="paper-grain@1"/);
    assert.doesNotMatch(legacy, /data-rough-paper|fibers/);
  } finally { loader.deregister(); }
});
