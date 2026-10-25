import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {openMotion} from '../../../server/motion-store.ts';
import {generateMotion} from '../../../server/motion.ts';

const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
const config=readConfig(),visuals=openVisuals(config.dataDirectory,config.videosDirectory);
let baseId;
try {
 assert.equal(visuals.latest(receipt.projectId,'storyboard'),receipt.storyboardId,'Inspect concurrent storyboard changes first');
 assert(visuals.current(receipt.projectId,receipt.storyboardId));
 if(visuals.acceptance(receipt.projectId)?.runId!==receipt.storyboardId)visuals.accept(receipt.projectId,receipt.storyboardId);
 assert.equal(visuals.acceptance(receipt.projectId).stale,false);
 receipt.storyboardAccepted=true;
 receipt.storyboardApprovalEvidence='2026-10-25 user: Please continue with it. In response to explicit request to approve the displayed storyboard and continue into Energetic animation.';
 writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
 appendFileSync(root+'progress.md','\n2026-10-25: User approved presented storyboard and continuation. Exact current storyboard acceptance recorded; no motion acceptance or production gates inferred. Calling installed Motion Director, interpreter 3, Energetic, with fixed existing narration boundaries.\n');
}finally{visuals.close();}
const store=openMotion(config.dataDirectory,config.videosDirectory);
try {baseId=store.latest(receipt.projectId);}finally{store.close();}
const instruction=`Animate all 10 approved scenes, interpreter 3 Energetic. Preserve drawings, script and audio. Exact shot durations in frames: [240,162,138,210,330,300,180,250,140,150], total2100. These follow preserved measured narration; no overlaps or duration changes. All boundaries remain hard-cut (first start). Use named asset layers, not merely root entrances. Every hidden start layer must end at its exact visible end state. Match label/type/asset plus geometry for root correspondence; identical rect labels require geometric matching. Max16 actors,64 expanded actions/shot,128 expanded targets/group. Keep unit scale and rotation0 at endpoints. No generated markup or engine changes. Meaningful progression:1 inquiry pressure establishes a reply service;2 repeated questions around salon owner;3 compare samples to approved FAQ and owner sign-off;4 reveal new-row, draw row-packet into Sheets Trigger, react HTTP Request;5 question+FAQ feed processor, then draft and both editable JSON lines reveal late;6 validate/edit, reveal human-hand, gesture toward Approve, then unresolved+Missing?/Ask owner at end;7 booking followed by unknown escalation;8 test-cards then documentation around demo;9 separate API usage and hosting, reveal agreement;10 calm salon, end on owner control. Cascade only initially hidden roots/parts. Geometric flow/converge/punch accept ROOT targets only. Camera punches small, max1.06, restore camera, avoid repeating the same effect. Prefer short named-layer choreography and mask reveals. Include explicit reading holds. Preserve all part x/y/scale/color/reveal endpoints, especially human-hand x=-14,y=5. Reply ONLY full shots array with 10 nonempty objects and beats, never actions. No approval or production claims.`;
try {
 const id=await generateMotion(receipt.projectId,{storyboardId:receipt.storyboardId,baseId,shotId:null,interpreterVersion:'3',energyProfile:'energetic',instruction},new AbortController().signal,message=>console.log(message),config);
 receipt.motionId=id;receipt.motionCreated=true;receipt.motionAccepted=false;
 writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({motionId:id}));
}catch(error){appendFileSync(root+'progress.md',`Motion Director failed: ${error.message} Previous artifacts retained.\n`);console.log(error.message);process.exitCode=1;}
