import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { rasterAssets, verifyRaster, rasterReferenceSchema, editorialCollage, collageHash, collageReferenceSchema } from "../workflow/raster.ts";
import { kineticExample } from "../workflow/examples/kinetic.ts";
import { validateMotion } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
const bytes = (path: string) => Uint8Array.from(readFileSync(`public/${path}`)).buffer;

test("local static raster manifest binds bounded dimensions, provenance, bytes and editable scene", async () => {
  assert.equal(createHash("sha256").update(JSON.stringify(editorialCollage)).digest("hex"),collageHash);
  collageReferenceSchema.parse({id:editorialCollage.id,contentHash:collageHash});
  assert.equal(new Set(editorialCollage.layers).size,5);
  for(const asset of rasterAssets){
    assert.ok(asset.source && asset.license && asset.intendedUse);assert.ok(!asset.path.includes(":") && !asset.path.includes(".."));
    assert.equal((await verifyRaster({id:asset.id,contentHash:asset.contentHash},bytes(asset.path),asset.mime)).id,asset.id);
  }
  assert.equal(rasterAssets[1].hasAlpha,true);assert.equal(rasterAssets[0].animated,false);
});

test("raster validation fails closed on corruption, wrong format, dimensions, animation and remote paths", async () => {
  const asset=rasterAssets[0],ref={id:asset.id,contentHash:asset.contentHash},original=bytes(asset.path);
  await assert.rejects(verifyRaster(ref,original,"image/jpeg"));
  await assert.rejects(verifyRaster(ref,original.slice(0,100),asset.mime));
  const corrupt=original.slice(0);new Uint8Array(corrupt)[100]^=1;await assert.rejects(verifyRaster(ref,corrupt,asset.mime));
  const dimensions=original.slice(0);new DataView(dimensions).setUint32(16,32);await assert.rejects(verifyRaster(ref,dimensions,asset.mime));
  const animated=original.slice(0),a=new Uint8Array(animated);a.set([97,99,84,76],37);await assert.rejects(verifyRaster(ref,animated,asset.mime));
  for(const change of [{id:"https://example.com/x.png"},{contentHash:"0".repeat(64)},{path:"media/other.png"}])assert.throws(()=>rasterReferenceSchema.parse({...ref,...change}));
});

test("collage preserves approved source identity and supports independent paper, icon and type edits", () => {
  const {board,plan}=kineticExample("collage");if(board.output.kind!=="storyboard")throw Error();
  plan.shots[0].sourceHash=hashMotionSource(board.output.shots[0]);validateMotion(plan,board,hashMotionSource);
  assert.equal(plan.shots[0].objects[0].initialParts!.vector.x,-12);
  const changed=structuredClone(plan);changed.shots[0].objects[0].collage=undefined;assert.throws(()=>validateMotion(changed,board,hashMotionSource));
});
