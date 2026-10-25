import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { variableExpressions, variableFonts, variableExpression, variableAxisState, variableTypeLayout, variableTypeReferenceSchema, verifyVariableFont } from "../workflow/variable-type.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { validateMotion, expandMotionShot, motionPlanSchema, motionBeatSchema, hydrateMotion } from "../workflow/motion.ts";
import { frameSchema } from "../workflow/visuals.ts";
import { hashMotionSource } from "../server/motion-store.ts";

const reference = (entry: typeof variableExpressions[number]) => variableTypeReferenceSchema.parse({id:entry.id,contentHash:entry.contentHash});
test("real font bytes, license and complete measured trajectories are pinned", async () => {
  assert.equal(variableFonts.inter.axes.wght.min, 100); assert.equal(variableFonts.inter.axes.opsz.max, 32);
  assert.ok(!Object.hasOwn(variableFonts.inter.axes, "wdth")); assert.equal(variableFonts.flex.axes.wdth.min, 25);
  for (const [id,font] of Object.entries(variableFonts)) {
    await verifyVariableFont(Uint8Array.from(readFileSync(`public/${font.path}`)).buffer, id as keyof typeof variableFonts);
    assert.equal(createHash("sha256").update(readFileSync(`public/${font.licensePath}`)).digest("hex"), font.licenseHash);
    await assert.rejects(verifyVariableFont(new ArrayBuffer(0),id as keyof typeof variableFonts));
  }
  assert.throws(()=>variableTypeReferenceSchema.parse({id:"width@1",contentHash:"0".repeat(64)}));
  assert.throws(()=>variableTypeReferenceSchema.parse({...reference(variableExpressions[0]),axes:{wdth:2}}));
  for (const entry of variableExpressions) {
    const {contentHash,...data}=entry;
    assert.equal(createHash("sha256").update(JSON.stringify(data)).digest("hex"),contentHash);
    assert.equal(entry.states.length,121); assert.deepEqual(entry.states[0].axes,entry.from); assert.deepEqual(entry.states[120].axes,entry.to);
  }
});
test("every actual glyph instance and stagger combination fits the reserved two-line envelope", () => {
  for (const entry of variableExpressions) {
    const ref=reference(entry), layout=variableTypeLayout(ref,864,460);
    assert.ok(layout.width<=864 && layout.height<=460);
    const planned=variableTypeLayout(ref,288,460/3,1/3);assert.ok(Math.abs(planned.width*3-layout.width)<.00001);
    for (let step=0;step<=120;step++) {
      let i=0; const count=entry.label.replace(/\n/g,"").length;
      for(const line of entry.label.split("\n")) {
        let width=0;
        for(const ch of line) {
          const state=variableAxisState(ref,step/120,i++,count), g=state.glyphs[ch as keyof typeof state.glyphs]!;
          assert.ok(g.bounds[3]<=entry.envelope.ascent && -g.bounds[1]<=entry.envelope.descent);
          width+=entry.envelope.cells[ch as keyof typeof entry.envelope.cells]!;
        }
        assert.ok(width*layout.unit<=layout.width+.00001);
      }
    }
    assert.throws(()=>variableAxisState(ref,NaN)); assert.throws(()=>variableAxisState(ref,1.1));
    assert.equal(variableExpression(ref).label,entry.label);
  }
  const width=variableExpressions[2];assert.ok(width.states.at(-1)!.glyphs.M!.advance<width.states[0].glyphs.M!.advance);
});
test("generated hydration preserves expressions, endpoints, scoped labels and axis ownership", () => {
  const {board,plan}=kineticExample("variable-type");if(board.output.kind!=="storyboard")throw Error();
  for(const shot of plan.shots)shot.sourceHash=hashMotionSource(board.output.shots[shot.sourceIndex]);
  validateMotion(plan,board,hashMotionSource);
  const generated={shots:plan.shots.map(({durationFrames,camera,incoming,beats,objects})=>({durationFrames,camera,incoming,beats,objects:objects.map(({id,startIndex,endIndex})=>({id,startIndex,endIndex}))}))};
  const hydrated=hydrateMotion(generated,board,hashMotionSource,undefined,"3");validateMotion(hydrated,board,hashMotionSource);
  assert.deepEqual(hydrated.shots[0].objects,plan.shots[0].objects);
  const bad=structuredClone(plan);bad.shots[0].objects[0].label="Invented";assert.throws(()=>validateMotion(bad,board,hashMotionSource));
  const effect=structuredClone(plan);effect.shots[0].textMotions=[{targetId:"object-1",presetId:"highlight-sweep@1",startFrame:12,endFrame:70}];assert.throws(()=>motionPlanSchema.parse(effect));
  const overlap=structuredClone(plan.shots[0]);overlap.beats!.push(motionBeatSchema.parse({...overlap.beats![0],id:"mask",presetId:"mask-reveal@1",parameters:{reveal:.5}}));overlap.beats!.sort((a,b)=>a.startFrame-b.startFrame);assert.throws(()=>expandMotionShot(overlap));
  const fast=structuredClone(plan.shots[0]);fast.beats![0].endFrame=20;assert.throws(()=>expandMotionShot(fast));
  const frame=structuredClone(board.output.shots[0].startFrame);frame.shapes[0].label="Replacement";assert.throws(()=>frameSchema.parse(frame));
  const wrong=structuredClone(frame);wrong.shapes[0].parts!.glyphs.axisProgress=undefined;assert.throws(()=>frameSchema.parse(wrong));
});
