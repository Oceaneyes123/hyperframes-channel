import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {readConfig} from '../../server/config.ts';
import {openProduction} from '../../server/production-store.ts';
import {renderProduction} from '../../server/render.ts';
const file=new URL('./receipt.json',import.meta.url),r=JSON.parse(readFileSync(file,'utf8')),config=readConfig();
const store=openProduction(config.dataDirectory,config.videosDirectory);
try {
 const state=store.status(r.projectId);assert(state.ready);assert.equal(state.binding,r.productionBinding);
 const notes="Human approval in this chat: 'Please export', replying to the exact production review asking approval of final plan, moving/audio review and local export. Prior exact storyboard, narration and motion approvals are recorded. No model-issued review is claimed.";
 if(!state.gate1)store.approve(r.projectId,{binding:state.binding,gate:'gate1',reviewed:true,notes});
 if(!store.status(r.projectId).gate2)store.approve(r.projectId,{binding:state.binding,gate:'gate2',reviewed:true,notes});
 r.productionApprovalEvidence=notes;r.localRenderAuthorized=true;
 writeFileSync(file,JSON.stringify(r,null,2)+'\n');
 console.log(JSON.stringify({stage:'approved',binding:state.binding,gates:store.status(r.projectId)}));
}finally{store.close();}
const monitor=setInterval(()=>{
 const s=openProduction(config.dataDirectory,config.videosDirectory);
 try{const state=s.status(r.projectId),job=state.history.find(x=>x.kind==='rendering');if(job){const dir=join(config.videosDirectory,r.projectId,'production',job.id),frames=join(dir,'frames');console.log(JSON.stringify({stage:'rendering',jobId:job.id,videoCreated:existsSync(join(dir,'export.mp4')),referenceFrames:existsSync(frames)?readdirSync(frames).length:0,totalFrames:2244}));}}finally{s.close();}
},30000);
try {
 const jobId=await renderProduction(r.projectId,r.productionBinding,true,new AbortController().signal,config);
 const s=openProduction(config.dataDirectory,config.videosDirectory);
 try{const record=s.exportRecord(r.projectId,jobId);assert(record);r.productionJobId=jobId;r.finalVideo=resolve(config.videosDirectory,r.projectId,'production',jobId,'export.mp4');writeFileSync(file,JSON.stringify(r,null,2)+'\n');writeFileSync(new URL('./export-verification.json',import.meta.url),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({stage:'complete',video:r.finalVideo,record}));}finally{s.close();}
}finally{clearInterval(monitor);}
