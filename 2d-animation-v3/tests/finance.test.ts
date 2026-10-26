import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { componentParts, isComponent } from "../workflow/components.ts";
import { comparisonSources } from "../workflow/comparison.ts";
import { frameSchema } from "../workflow/visuals.ts";
import { validateMotion, expandMotionShot } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { financeFixture, financeFrame, styleDirections } from "./fixtures/finance.ts";

test("finance records bind exact supplied cents and arithmetic without an invented approval", () => {
  const { source, contentHash } = comparisonSources.find(e => e.source.id === "card-declined-example@1")!;
  assert.equal(createHash("sha256").update(JSON.stringify(source)).digest("hex"), contentHash);
  const amount = (id: string) => source.records.find(r => r.id === id)!.value;
  assert.equal(amount("current") - amount("hold"), amount("available"));
  assert.ok(amount("purchase") > amount("available"));
  assert.match(source.note, /pending human approval/);
});

test("finance surfaces register safe editable parts and reject invalid terminal/geometry states", () => {
  for (const type of ["payment-terminal@1", "banking-balance@1"] as const) {
    assert.ok(isComponent(type));
    assert.throws(() => componentParts(type, "#FFFFFF", { invented: { x: 0, y: 0, scale: 1, opacity: 1, color: "#FFFFFF" } }));
  }
  const terminal = financeFrame("terminal", true);
  terminal.shapes[1].parts!.approved.opacity = 1;
  assert.throws(() => frameSchema.parse(terminal));
  const phone = financeFrame("balance", true);
  phone.shapes[1].parts!.hold.x = 1;
  assert.throws(() => frameSchema.parse(phone));
  for (const direction of styleDirections) frameSchema.parse(direction.frame);
});

test("finance interpreter3 proof preserves current funds, exact endpoints and geometry ownership", () => {
  const { plan, board } = financeFixture();
  validateMotion(plan, board, hashMotionSource);
  assert.equal(plan.interpreterVersion, "3"); assert.equal(plan.energyProfile, "energetic");
  const balance = expandMotionShot(plan.shots[1]);
  assert.equal(balance.objects[2].numeric!.recordId, "current");
  assert.ok(balance.actions.every(a => !a.targetIds.some(t => t.startsWith("object-3"))));
  const bad = structuredClone(plan);
  bad.shots[0] = expandMotionShot(bad.shots[0]);
  bad.shots[0].beats = undefined;
  bad.shots[0].actions[0].to = { x: 1 };
  assert.throws(() => validateMotion(bad, board, hashMotionSource));
});
