import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { morphPairs, morphReferenceSchema } from "../workflow/morphs.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { expandMotionShot, motionBeatSchema } from "../workflow/motion.ts";

test("curated morph pair binds original paths, license and exact hash", () => {
  for (const entry of morphPairs) {
    assert.equal(createHash("sha256").update(JSON.stringify(entry.pair)).digest("hex"), entry.contentHash);
    assert.equal(entry.pair.license, "CC0-1.0");
    for (const reference of [{ pairId: "unknown@1", contentHash: entry.contentHash }, { pairId: entry.pair.id, contentHash: "0".repeat(64) }, { pairId: entry.pair.id, contentHash: entry.contentHash, path: "M0 0" }]) assert.throws(() => morphReferenceSchema.parse(reference));
  }
});

test("morphs require visible approved outlines and reject unsupported targets/parameters", () => {
  const { plan } = kineticExample("morph"), shot = plan.shots[0];
  assert.ok(expandMotionShot(shot).actions.some((action) => action.to.morphProgress === 1));
  const bad = structuredClone(shot); bad.beats![0].targetIds = ["object-1"];
  assert.throws(() => expandMotionShot(bad), /curated outline/);
  const changed = structuredClone(shot); changed.objects[0].morph!.contentHash = "0".repeat(64);
  assert.throws(() => expandMotionShot(changed), /curated morph pair/);
  assert.throws(() => motionBeatSchema.parse({ ...shot.beats![0], parameters: { targetPath: "M0 0" } }));
});
