import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { vectorLibrary } from "../workflow/graphic-library.ts";
import { scenePose, trustedSceneIds, trustedSceneIdSchema } from "../workflow/trusted-scenes.ts";

test("trusted scenes and new artwork are registered, hash-bound originals", () => {
  assert.ok(Object.keys(vectorLibrary).length >= 40);
  for (const id of trustedSceneIds) {
    const { asset, contentHash } = vectorLibrary[id];
    assert.equal(asset.license, "CC0-1.0");
    assert.equal(asset.layers[0].id, "motion");
    assert.equal(createHash("sha256").update(JSON.stringify(asset)).digest("hex"), contentHash);
  }
  assert.throws(() => trustedSceneIdSchema.parse("https://example.com/scene.svg"));
});

test("scene poses seek exactly, stay bounded and loop with continuous velocity", () => {
  for (const id of trustedSceneIds) {
    const expected = Array.from({length:61},(_,frame)=>scenePose(id, frame/60));
    for (const frame of [60, 0, 31, 4, 59, 31]) assert.deepEqual(scenePose(id,frame/60), expected[frame]);
    assert.ok(expected.every(pose=>pose.x >= 220 && pose.x <= 780 && pose.y >= 250 && pose.y <= 750 && pose.scaleX > .7 && pose.scaleY > .7));
  }
  assert.ok(Math.abs(scenePose("loop-handoff@1", 0).x-scenePose("loop-handoff@1",1).x)<1e-9);
  const dx0=(scenePose("loop-handoff@1",.0001).x-scenePose("loop-handoff@1",0).x)/.0001;
  const dx1=(scenePose("loop-handoff@1",1).x-scenePose("loop-handoff@1",.9999).x)/.0001;
  assert.ok(Math.abs(dx0-dx1)<.001);
  assert.throws(()=>scenePose("elastic-token@1",NaN));
});
