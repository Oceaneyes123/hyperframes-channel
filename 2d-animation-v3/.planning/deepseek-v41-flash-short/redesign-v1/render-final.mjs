import {readFileSync,writeFileSync,appendFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {openMotion} from '../../../server/motion-store.ts';
import {openProduction,hashEngine} from '../../../server/production-store.ts';
import {renderProduction} from '../../../server/render.ts';

const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
const review=JSON.parse(readFileSync(root+'motion-review-receipt.json','utf8'));
const proof=JSON.parse(readFileSync(review.verificationPath,'utf8'));
const config=readConfig();
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const preserved=()=>receipt.preserved.forEach(file=>assert.equal(hash(file.path),file.sha256));
const quote='This is better, now render the video';
assert.equal(receipt.motionId,review.motionId);
assert.equal(hashEngine(),proof.engineHash,'Engine changed after human-reviewed preview');
assert.equal(hash('.data/deepseek-short-eec7f710/narration.wav'),proof.narrationHash);
preserved();
assert(!receipt.exportCreated,'An export already exists; inspect it instead of creating a duplicate');
const visuals=openVisuals(config.dataDirectory,config.videosDirectory),motions=openMotion(config.dataDirectory,config.videosDirectory);
try{
 assert.equal(visuals.acceptance(receipt.projectId).runId,receipt.storyboardId);
 assert.equal(visuals.acceptance(receipt.projectId).stale,false);
 assert.equal(motions.latest(receipt.projectId),receipt.motionId,'Inspect any newer motion before approving');
 assert(motions.current(receipt.projectId,receipt.motionId));
 if(motions.acceptance(receipt.projectId)?.runId!==receipt.motionId)motions.decide(receipt.projectId,receipt.motionId,'accept');
 assert.equal(motions.acceptance(receipt.projectId).stale,false);
}finally{motions.close();visuals.close();}
const store=openProduction(config.dataDirectory,config.videosDirectory);
let binding;
try{
 const status=store.status(receipt.projectId);
 const voiceId=status.ready&&status.narration?.motionId===receipt.motionId?status.narration.id:store.importNarration(receipt.projectId,receipt.motionId,readFileSync('.data/deepseek-short-eec7f710/narration.wav'),JSON.parse(readFileSync('.data/deepseek-short-eec7f710/line-timing.json','utf8')));
 const snapshot=store.snapshot(receipt.projectId);
 assert.equal(snapshot.artifact.id,receipt.motionId);assert.equal(snapshot.board.id,receipt.storyboardId);
 assert.equal(snapshot.voice.id,voiceId);assert.equal(snapshot.voice.audioHash,proof.narrationHash);
 assert.equal(snapshot.quality.durationFrames,2100);assert.equal(snapshot.engineHash,proof.engineHash);
 binding=snapshot.binding;
 const notes=`Human approval in this chat after the displayed 70-second narrated motion proposal and synchronized before/after review: "${quote}". Exact motion ${receipt.motionId}, storyboard ${receipt.storyboardId}, unchanged original narration. User approved motion/narration and explicitly requested final 1080x1920 render. Intentional final owner-control hold reviewed; no publishing authorized.`;
 if(!store.status(receipt.projectId).gate1)store.approve(receipt.projectId,{binding,gate:'gate1',reviewed:true,notes:'Creative/source approval. '+notes});
 if(!store.status(receipt.projectId).gate2)store.approve(receipt.projectId,{binding,gate:'gate2',reviewed:true,notes:'Human moving/audio approval. '+notes});
 const authorizationPath=root+`render-authorization-${binding}.json`;
 if(!existsSync(authorizationPath))writeFileSync(authorizationPath,JSON.stringify({projectId:receipt.projectId,motionId:receipt.motionId,binding,quote,recordedAt:new Date().toISOString(),publish:false},null,2)+'\n',{flag:'wx'});
 receipt.motionAccepted=true;receipt.narrationId=voiceId;receipt.productionGatesCreated=true;receipt.productionBinding=binding;receipt.renderApprovalEvidence=quote;
 writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
 appendFileSync(root+'progress.md',`\n2026-10-25: User approved moving/narrated review and explicitly requested rendering: "${quote}". Exact motion accepted, unchanged audio imported for that motion, separate exact-binding Gate1/Gate2 records and local render authorization saved. No publishing authorized.\n`);
 console.log(JSON.stringify({stage:'guarded-final-render',binding,narrationId:voiceId,frames:2100,width:1080,height:1920,fps:30}));
}finally{store.close();}

const monitor=setInterval(()=>{
 const current=openProduction(config.dataDirectory,config.videosDirectory);
 try{
  const job=current.status(receipt.projectId).history.find(row=>row.kind==='rendering'&&row.payload.binding===binding);
  if(!job)return;
  const output=join(config.videosDirectory,receipt.projectId,'production',job.id),frames=join(output,'frames');
  const count=existsSync(frames)?readdirSync(frames).filter(name=>/^element-\d+\.png$/.test(name)).length:0;
  console.log(JSON.stringify({jobId:job.id,stage:count===2100?'Verifying picture, fresh seeks and audio':count?'Capturing full-resolution preview references':'Encoding final MP4',referenceFrames:count,totalReferenceFrames:2100}));
 }catch(error){console.log(`Progress unavailable: ${error.message}`);}finally{current.close();}
},30000);
try{
 const jobId=await renderProduction(receipt.projectId,binding,true,new AbortController().signal,config);
 const finalStore=openProduction(config.dataDirectory,config.videosDirectory);
 try{
  const record=finalStore.exportRecord(receipt.projectId,jobId);assert(record);
  const path=join(config.videosDirectory,receipt.projectId,'production',jobId,'export.mp4');
  assert.equal(hash(path),record.payload.verification.sha256);preserved();
  assert.equal(record.payload.verification.preview.comparedFrames,2100);
  receipt.renderJobId=jobId;receipt.exportPath=path;receipt.exportCreated=true;receipt.exportVerified=true;receipt.productionExportPending=false;
  writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
  writeFileSync(root+`final-export-${jobId}.json`,JSON.stringify(record,null,2)+'\n');
  appendFileSync(root+'progress.md',`\nGuarded production render ${jobId} verified: ${path}; ${statSync(path).size} bytes. Original four source files unchanged; no publication, commit or push.\n`);
  console.log(JSON.stringify({jobId,path,bytes:statSync(path).size,verification:record.payload.verification},null,2));
 }finally{finalStore.close();}
}finally{clearInterval(monitor);}
