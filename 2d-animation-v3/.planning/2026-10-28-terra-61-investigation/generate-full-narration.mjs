import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync} from 'node:fs';import {join} from 'node:path';
import {readConfig} from '../../server/config.ts';import {openNarrationStudio} from '../../server/narration/studio.ts';import {pythonNarrationProvider} from '../../server/narration/providers/local.ts';import {inspectNarration} from '../../engine/quality/inspect-narration.ts';
import {openStudio} from '../../server/studio.ts';import {inspectWav} from '../../server/wav.ts';
const path=new URL('./receipt.json',import.meta.url),r=JSON.parse(readFileSync(path,'utf8'));
assert(!r.fullNarrationId,'Preserve existing full take.');
const prior=JSON.parse(readFileSync('.data/narration-takes/af23719a-5fd8-468d-bfee-8780cc5a9050/line-1/request.json','utf8'));
const liveProvider=pythonNarrationProvider({provider:prior.provider,python:prior.python,modelPath:prior.modelPath,version:prior.version,voice:prior.voice,device:prior.device});
const config=readConfig(),s=openNarrationStudio(config.dataDirectory,config.videosDirectory);
const partialRoot='.data/studio-narration/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/narration-takes/b4a45a3c-433c-4f67-8bff-cc12eade2095';
const reuse=[];
const provider={...liveProvider,async generate(input,directory,signal){
 if(process.argv.includes('--resume')&&existsSync(join(partialRoot,'request.json'))){
  const source=JSON.parse(readFileSync(join(partialRoot,'request.json'),'utf8'));
  assert.equal(source.provider.version,liveProvider.identity.version);assert.equal(source.provider.voice,liveProvider.identity.voice);
  const studio=openStudio(config.dataDirectory,config.videosDirectory);try{assert.equal(source.request.lines.map(x=>x.text).join('\n'),studio.readRevision(r.projectId,r.scriptId).content);}finally{studio.close();}
  for(let i=1;i<=13;i++){
   const base=join(partialRoot,`line-${i}`),request=join(base,'request.json'),raw=join(base,'raw.wav'),runtime=join(base,'runtime.json');
   if(!existsSync(request)||!existsSync(raw)||!existsSync(runtime))continue;
   const saved=JSON.parse(readFileSync(request,'utf8'));
   if(saved.text!==input.text||saved.seed!==input.seed||saved.delivery!==input.delivery)continue;
   const bytes=readFileSync(raw);assert(inspectWav(bytes).durationSeconds>0);copyFileSync(runtime,join(directory,'runtime.json'));reuse.push(i);console.log(`Reused completed line ${i} from preserved full-take attempt.`);return bytes;
  }
 }
 return liveProvider.generate(input,directory,signal);
}};
try {
 console.log('Completing Ryan narration from all 13 accepted script lines. Resume mode may reuse exact completed segments from the interrupted full-take attempt; no audition audio or time stretching.');
 const id=await s.generate(r.projectId,provider,{scriptId:r.scriptId,pronunciation:[{term:'GPT-6.1',spoken:'G P T six point one'}],rate:0,seed:20261028},AbortSignal.timeout(3600000));
 const t=s.read(r.projectId,id);assert.equal(t.complete,true);assert.equal(t.stale,false);
 const latest=JSON.parse(readFileSync(path,'utf8'));latest.fullNarrationId=id;latest.fullNarrationSeconds=t.measured.durationSeconds;latest.voiceSelectionEvidence='User reply: Yes — use Ryan for complete narration.';
 writeFileSync(path,JSON.stringify(latest,null,2)+'\n');
 mkdirSync('output/terra-61-investigation/voice-review',{recursive:true});writeFileSync('output/terra-61-investigation/voice-review/qwen-ryan-complete.wav',t.audio,{flag:'wx'});
 const quality=inspectNarration(t.audio);writeFileSync('output/terra-61-investigation/voice-review/complete-review.json',JSON.stringify({id,durationSeconds:t.measured.durationSeconds,segments:t.manifest.segments,quality,humanListening:'pending',imported:false,partialSourceAttempt:reuse.length?partialRoot:null,reusedCompletedLines:reuse},null,2)+'\n');
 console.log(JSON.stringify({id,durationSeconds:t.measured.durationSeconds,inRequestedDuration:t.measured.durationSeconds>=50&&t.measured.durationSeconds<=75,clippedFraction:quality.clippedFraction,findings:quality.findings,complete:true}));
}finally{s.close();}
