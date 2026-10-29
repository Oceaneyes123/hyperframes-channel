import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {readConfig} from '../../server/config.ts';
import {openMotion} from '../../server/motion-store.ts';
import {openTiming} from '../../server/timing-store.ts';
import {openProduction} from '../../server/production-store.ts';
const receiptPath=new URL('./receipt.json',import.meta.url);
const r=JSON.parse(readFileSync(receiptPath,'utf8')),c=readConfig();
const motion=openMotion(c.dataDirectory,c.videosDirectory);
try {
 const prior=motion.acceptance(r.projectId);
 if(!prior)motion.decide(r.projectId,r.motionId,'accept');
 const accepted=motion.acceptance(r.projectId);
 assert.equal(accepted.runId,r.motionId);assert.equal(accepted.stale,false);
}finally{motion.close();}
const timing=openTiming(c.dataDirectory,c.videosDirectory),production=openProduction(c.dataDirectory,c.videosDirectory);
try {
 const planned=timing.read(r.projectId,r.timingId);assert(planned);assert(timing.current(r.projectId,r.timingId));
 let state=production.status(r.projectId);
 if(!state.ready){
  assert.equal(state.reason,'Import measured narration before production review.');
  r.productionNarrationId=production.importNarration(r.projectId,r.motionId,timing.audio(r.projectId,r.timingId),planned.artifact.timing);
  state=production.status(r.projectId);
 }
 assert(state.ready);assert.equal(state.narration.motionId,r.motionId);assert.equal(state.quality.durationFrames,2244);
 assert.equal(state.gate1,null);assert.equal(state.gate2,null);assert.equal(state.history.length,0);
 Object.assign(r,{motionApprovalEvidence:"User response to the 74.8s narrated motion review: I'm good with it",productionNarrationId:state.narration.id,productionBinding:state.binding});
 writeFileSync(receiptPath,JSON.stringify(r,null,2)+'\n');
 writeFileSync(new URL('./production-review-state.json',import.meta.url),JSON.stringify(state,null,2)+'\n');
 console.log(JSON.stringify({motionAccepted:true,binding:state.binding,narrationId:state.narration.id,frames:state.quality.durationFrames,gate1:state.gate1,gate2:state.gate2,renders:state.history.length}));
}finally{production.close();timing.close();}
