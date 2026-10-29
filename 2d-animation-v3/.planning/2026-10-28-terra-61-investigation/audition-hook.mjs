import assert from 'node:assert/strict';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {readConfig} from '../../server/config.ts';
import {openNarrationStudio} from '../../server/narration/studio.ts';
import {pythonNarrationProvider} from '../../server/narration/providers/local.ts';

const path=new URL('./receipt.json',import.meta.url),receipt=JSON.parse(readFileSync(path,'utf8'));
assert(!receipt.hookAuditionId,'Preserve existing audition.');
const prior=JSON.parse(readFileSync('.data/narration-takes/af23719a-5fd8-468d-bfee-8780cc5a9050/line-1/request.json','utf8'));
assert(existsSync(prior.python));assert(existsSync(prior.modelPath));
const provider=pythonNarrationProvider({provider:prior.provider,python:prior.python,modelPath:prior.modelPath,version:prior.version,voice:prior.voice,device:prior.device});
const config=readConfig(),store=openNarrationStudio(config.dataDirectory,config.videosDirectory);
try {
  console.log('Generating one local Qwen hook audition; no full narration or import.');
  const id=await store.generate(receipt.projectId,provider,{scriptId:receipt.scriptId,lineNumber:1,pronunciation:[],rate:0,seed:20261028},AbortSignal.timeout(600000));
  const take=store.read(receipt.projectId,id);
  assert.equal(take.complete,false);assert.equal(take.stale,false);
  receipt.hookAuditionId=id;receipt.voiceApproval='pending human listening';
  const latest=JSON.parse(readFileSync(path,'utf8'));
  writeFileSync(path,JSON.stringify({...latest,hookAuditionId:id,voiceApproval:receipt.voiceApproval},null,2)+'\n');
  console.log(JSON.stringify({id,voice:prior.voice,durationSeconds:take.measured.durationSeconds,sampleRate:take.measured.sampleRate,quality:take.manifest.quality,complete:take.complete},null,2));
}finally{store.close();}
