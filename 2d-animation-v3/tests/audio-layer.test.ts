import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { synthesizeLayer } from "../workflow/audio-layer.ts";
import { mixAudioLayer } from "../server/audio-layer.ts";
import { wavFixture } from "./fixtures/wav.ts";

test("audio defaults preserve narration; seeded layers are deterministic and reject late cues",async(t)=>{
  const voice=wavFixture(2),root=mkdtempSync(join(tmpdir(),"v3-audio-"));t.after(()=>rmSync(root,{recursive:true,force:true}));
  assert.equal((await mixAudioLayer(voice,{},join(root,"default"))).bytes,voice);
  const settings={enabled:true,music:true,cues:[{frame:15,sound:"whoosh"}]};
  assert.deepEqual(synthesizeLayer(2,settings,"sfx"),synthesizeLayer(2,settings,"sfx"));
  assert.throws(()=>synthesizeLayer(2,{...settings,cues:[{frame:60,sound:"click"}]},"sfx"));
  const mix=await mixAudioLayer(voice,settings,join(root,"opt-in"));
  assert.ok(mix.report.enabled);assert.equal(mix.report.durationFrames,60);
  if(mix.report.enabled){assert.ok(Math.abs(mix.report.integratedLufs!+16)<=1);assert.ok(mix.report.truePeakDbtp!<=-1);}
});
