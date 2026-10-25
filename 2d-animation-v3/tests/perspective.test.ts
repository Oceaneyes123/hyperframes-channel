import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { perspectiveScene as scene, perspectiveHash, perspectiveReferenceSchema, projectPoint, projectedBox, requireVisibleFocus, tokenPoint, perspectivePose } from "../workflow/perspective.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { expandMotionShot, validateMotion, motionBeatSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";

test("perspective scene binds three original ordered planes and rejects unsafe identity or camera distance",()=>{
 assert.equal(createHash("sha256").update(JSON.stringify(scene)).digest("hex"),perspectiveHash);
 perspectiveReferenceSchema.parse({id:scene.id,contentHash:perspectiveHash});assert.deepEqual(scene.planes.map(p=>p.z),[300,0,-450]);
 assert.throws(()=>perspectiveReferenceSchema.parse({id:scene.id,contentHash:"0".repeat(64)}));
 assert.throws(()=>projectPoint({x:0,y:0,z:-800},{x:0,y:0,z:0}));assert.throws(()=>projectPoint({x:0,y:0,z:0},{x:0,y:0,z:500}));
 const near=projectPoint({x:100,y:100,z:-450},{x:0,y:0,z:0}),far=projectPoint({x:100,y:100,z:300},{x:0,y:0,z:0});
 assert.ok(near.scale>far.scale*2);assert.equal(near.scale,2);
 assert.throws(()=>requireVisibleFocus("inquiry",{x:0,y:0,z:0}));requireVisibleFocus("inquiry",{x:160,y:0,z:0});
 assert.throws(()=>requireVisibleFocus("processing",{x:-180,y:0,z:0}));
});

test("five camera actions preserve one token, readable focal bounds, clear depth crossing and deterministic frame poses",()=>{
 const {board,plan}=kineticExample("perspective");if(board.output.kind!=="storyboard")throw Error();plan.shots[0].sourceHash=hashMotionSource(board.output.shots[0]);validateMotion(plan,board,hashMotionSource);
 const shot=expandMotionShot(plan.shots[0]),initial=shot.objects[0].initialParts!.camera;
 assert.equal(new Set(shot.beats!.filter(b=>b.presetId!=="hold@1"&&b.targetIds.includes("object-1.camera")).map(b=>b.presetId)).size,5);
 for(let f=0;f<420;f++) {
  const {camera,progress}=perspectivePose(initial,shot.actions.filter(a=>a.behavior!=="hold"),f),token=tokenPoint(progress),p=projectPoint(token,camera);
  assert.ok([p.x,p.y,p.scale].every(Number.isFinite));assert.ok(p.x-35*p.scale>=0&&p.x+35*p.scale<=1000&&p.y-25*p.scale>=0&&p.y+25*p.scale<=1000);
  if(progress>.25&&progress<.75)assert.equal(token.y,280);
  if(progress>0&&progress<1&&token.z>0&&token.z<295)assert.ok(token.y+25<scene.subjects.inquiry.y);
  const processing=projectedBox(scene.subjects.processing,camera);assert.ok(processing.x>=0&&processing.x+processing.width<=1000);
 }
 const final=perspectivePose(initial,shot.actions.filter(a=>a.behavior!=="hold"),419);assert.deepEqual(final,{camera:{x:220,y:0,z:120},progress:1});
 assert.equal(inspectCreativeMotion(plan,board).findings.filter(f=>f.ruleId==="perspective-projected-bounds").length,0);
 const fast=structuredClone(plan.shots[0]);fast.beats![0].endFrame=24;assert.throws(()=>expandMotionShot(fast));
 const wrong=structuredClone(plan.shots[0]);wrong.beats![2]=motionBeatSchema.parse({...wrong.beats![2],parameters:{toX:-180,toY:0}});assert.throws(()=>expandMotionShot(wrong));
 const hidden=structuredClone(plan.shots[0]);hidden.objects[0].initialParts!.camera.opacity=0;assert.throws(()=>expandMotionShot(hidden));
});
