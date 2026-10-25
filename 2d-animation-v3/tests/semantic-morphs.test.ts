import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { newSemanticPairs, semanticMorphPairs, semanticMorphReferenceSchema, morphChainSchema } from "../workflow/semantic-morphs.ts";
import { morphPairs } from "../workflow/morphs.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { validateMotion, expandMotionShot } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
const ref = (id: string) => { const entry = semanticMorphPairs.find((entry) => entry.pair.id === id)!; return { pairId: id, contentHash: entry.contentHash }; };

test("six new schematic pairs bind original artwork without changing the legacy registry", () => {
  assert.equal(newSemanticPairs.length, 6); assert.equal(morphPairs.length, 1);
  for (const { pair, contentHash } of semanticMorphPairs) {
    assert.equal(createHash("sha256").update(JSON.stringify(pair)).digest("hex"), contentHash);
    semanticMorphReferenceSchema.parse(ref(pair.id));
    assert.equal(pair.license, "CC0-1.0");
  }
  assert.throws(() => semanticMorphReferenceSchema.parse({ ...ref("question-answer@1"), contentHash: "0".repeat(64) }));
  assert.throws(() => semanticMorphReferenceSchema.parse({ ...ref("question-answer@1"), path: "M0 0" }));
  morphChainSchema.parse({ pairs: [ref("message-record@1"), ref("document-checklist@1")] });
  morphChainSchema.parse({ pairs: [ref("complaints-problem@1"), ref("problem-product@1")] });
  assert.throws(() => morphChainSchema.parse({ pairs: [ref("question-answer@1"), ref("document-checklist@1")] }));
  assert.throws(() => morphChainSchema.parse({ pairs: [{ pairId: "unknown", contentHash: "0".repeat(64) }] }));
});

test("every authored intermediate silhouette stays bounded and has no crossing edges", () => {
  const cross = (a: number[], b: number[], c: number[]) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for (const pair of newSemanticPairs) for (let frame = 0; frame <= 180; frame++) {
    assert.equal(pair.fromPoints.length, pair.toPoints.length);
    const p = pair.fromPoints.map((a, i) => a.map((v, axis) => v + (pair.toPoints[i][axis] - v) * frame / 180));
    assert.ok(p.flat().every((v) => Number.isFinite(v) && v >= 0 && v <= 300));
    for (let i=0;i<p.length;i++) for (let j=i+1;j<p.length;j++) {
      const a=p[i],b=p[(i+1)%p.length],c=p[j],d=p[(j+1)%p.length];
      if (j===i+1 || i===0 && j===p.length-1) continue;
      assert.ok(!(cross(a,b,c)*cross(a,b,d)<-1e-7 && cross(c,d,a)*cross(c,d,b)<-1e-7), `${pair.id} crossing at ${frame}`);
    }
  }
});

test("chain advances exactly one step, preserves approved endpoints and rejects unsafe choreography", () => {
  const {board,plan}=kineticExample("morph-chain"); if(board.output.kind!=="storyboard") throw Error();
  plan.shots[0].sourceHash=hashMotionSource(board.output.shots[0]); validateMotion(plan,board,hashMotionSource);
  assert.deepEqual(expandMotionShot(plan.shots[0]).actions.filter((a)=>a.to.morphStage!==undefined).map((a)=>a.to.morphStage),[1,2]);
  const extra=structuredClone(plan.shots[0]); extra.beats!.splice(2,0,{...extra.beats![1],id:"extra",startFrame:140,endFrame:160}); assert.throws(()=>expandMotionShot(extra));
  const fast=structuredClone(plan.shots[0]); fast.beats![0].endFrame=24; assert.throws(()=>expandMotionShot(fast));
  const hidden=structuredClone(plan.shots[0]); hidden.objects[0].initialParts!.outline.reveal=.5; assert.throws(()=>expandMotionShot(hidden));
  const conflict=structuredClone(plan.shots[0]); conflict.beats!.splice(1,0,{...conflict.beats![0],id:"overlap",startFrame:24,endFrame:78}); assert.throws(()=>expandMotionShot(conflict));
});
