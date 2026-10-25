import assert from "node:assert/strict";
import { test } from "node:test";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { expandMotionShot, motionBeatSchema } from "../workflow/motion.ts";
import { graphicReference } from "../workflow/graphic-assets.ts";

test("depth motion separates roles and restores exact authored layer positions", () => {
  const { plan } = kineticExample("depth"), shot = plan.shots[0], actions = expandMotionShot(shot).actions;
  const background = actions.find((action) => action.targetIds[0] === "object-1.setting" && action.endFrame === 25)!;
  const foreground = actions.find((action) => action.targetIds[0] === "object-1.test-cards" && action.endFrame === 25)!;
  assert.ok(Math.abs(background.to.x!) < Math.abs(foreground.to.x!));
  const assembly = actions.filter((action) => action.endFrame === 86);
  assert.ok(assembly.length >= 2);
  assert.ok(assembly.every((action) => action.to.x === 0 && action.to.y === 0));
});

test("depth rejects unreviewed scenes, unknown exploded layers and excessive offsets", () => {
  const { plan } = kineticExample("depth");
  const unknown = structuredClone(plan.shots[0]); unknown.objects[0].asset = graphicReference("research-interface@1");
  assert.throws(() => expandMotionShot(unknown), /depth-approved/);
  const bad = structuredClone(plan.shots[0]); const beat = bad.beats!.find((beat) => beat.presetId === "explode-assemble@1")!;
  if (beat.presetId === "explode-assemble@1") beat.parameters.offsets.missing = { x: 1, y: 1 };
  assert.throws(() => expandMotionShot(bad), /known visible layers/);
  assert.throws(() => motionBeatSchema.parse({ ...plan.shots[0].beats![0], parameters: { offsetX: 3, offsetY: 0 } }));
});
