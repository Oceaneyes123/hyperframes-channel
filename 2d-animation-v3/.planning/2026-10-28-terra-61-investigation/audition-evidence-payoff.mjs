import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {readConfig} from '../../server/config.ts';
import {openNarrationStudio} from '../../server/narration/studio.ts';
import {pythonNarrationProvider} from '../../server/narration/providers/local.ts';
import {inspectNarration} from '../../engine/quality/inspect-narration.ts';

const path=new URL('./receipt.json',import.meta.url);
let receipt=JSON.parse(readFileSync(path,'utf8'));
const prior=JSON.parse(readFileSync('.data/narration-takes/af23719a-5fd8-468d-bfee-8780cc5a9050/line-1/request.json','utf8'));
const provider=pythonNarrationProvider({provider:prior.provider,python:prior.python,modelPath:prior.modelPath,version:prior.version,voice:prior.voice,device:prior.device});
const config=readConfig(),store=openNarrationStudio(config.dataDirectory,config.videosDirectory);
const output='output/terra-61-investigation/voice-review';mkdirSync(output,{recursive:true});
receipt.ryanHookApproval='User approved hook voice for further auditioning in this chat.';
writeFileSync(path,JSON.stringify(receipt,null,2)+'\n');
try {
  for(const [lineNumber,key,name] of [[5,'evidenceAuditionId','evidence'],[13,'payoffAuditionId','payoff']]) {
    receipt=JSON.parse(readFileSync(path,'utf8'));
    assert(!receipt[key],'Preserve existing audition.');
    console.log(`Generating Ryan ${name} audition from accepted line ${lineNumber}.`);
    const id=await store.generate(receipt.projectId,provider,{scriptId:receipt.scriptId,lineNumber,pronunciation:[],rate:0,seed:20261028},AbortSignal.timeout(600000));
    const take=store.read(receipt.projectId,id);assert.equal(take.complete,false);assert.equal(take.stale,false);
    const latest=JSON.parse(readFileSync(path,'utf8'));latest[key]=id;
    writeFileSync(path,JSON.stringify(latest,null,2)+'\n');
    writeFileSync(join(output,`qwen-ryan-${name}.wav`),take.audio,{flag:'wx'});
    const quality=inspectNarration(take.audio);
    writeFileSync(join(output,`${name}-review.json`),JSON.stringify({takeId:id,lineNumber,durationSeconds:take.measured.durationSeconds,quality,humanListening:'pending'},null,2)+'\n');
    console.log(JSON.stringify({name,id,durationSeconds:take.measured.durationSeconds,clippedFraction:quality.clippedFraction,findings:quality.findings}));
  }
}finally{store.close();}
