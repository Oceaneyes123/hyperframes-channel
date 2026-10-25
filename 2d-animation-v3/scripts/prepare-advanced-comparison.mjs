import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {visualArtifactSchema} from '../workflow/visuals.ts';
import {motionArtifactSchema,motionBeatSchema,validateMotion,scheduleMotion} from '../workflow/motion.ts';
import {hashMotionSource} from '../server/motion-store.ts';
import {hashEngine} from '../server/production-store.ts';
const original=resolve('.planning/deepseek-v41-flash-short/redesign-v1'),root=resolve(`.data/advanced-comparison-${Date.now()}`);mkdirSync(root,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),save=(name,data)=>writeFileSync(join(root,name),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
// Freeze criteria before preparing the candidate or asking anyone to review it.
const rubric={createdAt:new Date().toISOString(),scale:{min:1,max:5},dimensions:['readability','information traceability','continuity','appropriate energy','visual sophistication'],requiredReasons:'Timestamped reasons for each dimension, critical regressions and final preference/tie.',criteria:['No factual or narration changes','No critical readability or continuity regression','Recorded human preference/tie with reasons','Review the three exact pinned sections, then the complete narrated pair'],humanReview:{reviewer:null,reviewedAt:null,scoresA:null,scoresB:null,timestampedReasons:[],preference:null},editingEffort:{measured:false,editingMinutes:null,revisionCount:null},audienceResults:null};save('rubric.json',rubric);
const board=visualArtifactSchema.parse(JSON.parse(readFileSync(join(original,'storyboard-proposal.json')))),basePlan=JSON.parse(readFileSync(join(original,'authored-motion-plan.json'))),timing=JSON.parse(readFileSync(join(original,'scene-timing.json')));
validateMotion(basePlan,board,hashMotionSource);assert.equal(board.output.kind,'storyboard');
const review=readFileSync('docs/projects/deepseek-v41-flash/REVIEW.md','utf8'),script=review.split('## Proposed narration\n\n')[1].split('\n\n## Hook choices')[0].trim().split(/\n\s*\n/).join('\n');assert.equal(sha(script),timing.scriptHash);save('source-narration.txt',script);
const candidate=structuredClone(board);candidate.id=randomUUID();candidate.createdAt=new Date().toISOString();candidate.baseId=board.id;candidate.instruction='Prepared candidate: measured source headings recompose into more separated layouts in the three pinned sections. Preserve all wording, factual content, scene durations and original narration. Human review and ordinary production gates pending.';
const plan=structuredClone(basePlan),changes=[{index:1,start:94,end:112,ys:[70,80]},{index:4,start:6,end:24,ys:[5,14]},{index:5,start:208,end:226,ys:[72,83]}];
for(const change of changes){
 const drawing=candidate.output.shots[change.index],shot=plan.shots[change.index];
 for(let i=0;i<2;i++){drawing.startFrame.shapes[i].typography='inter-heading@1';drawing.endFrame.shapes[i].typography='inter-heading@1';drawing.endFrame.shapes[i].x=10;drawing.endFrame.shapes[i].y=change.ys[i];shot.objects[i].typography='inter-heading@1';}
 if(change.index===1)shot.beats=shot.beats.filter(beat=>beat.id!=='beat-5');
 shot.beats.push(motionBeatSchema.parse({id:'measured-layout',purpose:'Give the existing source headings separate measured positions, then leave a reading hold while the same information remains visible.',type:'transformation',presetId:'text-layout-morph@1',targetIds:['object-1','object-2'],startFrame:change.start,endFrame:change.end,parameters:{route:'vertical-first',destinations:{'object-1':{x:10,y:change.ys[0]},'object-2':{x:10,y:change.ys[1]}}},importance:'supporting',narrationAnchor:null,continuity:null}));shot.beats.sort((a,b)=>a.startFrame-b.startFrame);
}
for(const shot of plan.shots)shot.sourceHash=hashMotionSource(candidate.output.shots[shot.sourceIndex]);
visualArtifactSchema.parse(candidate);validateMotion(plan,candidate,hashMotionSource);assert.equal(scheduleMotion(plan).durationFrames,2100);
for(let i=0;i<10;i++){
 const before=board.output.shots[i],after=candidate.output.shots[i];
 for(const frame of ['startFrame','endFrame'])assert.deepEqual(after[frame].shapes.map(s=>s.label),before[frame].shapes.map(s=>s.label));
 assert.deepEqual(after.lineNumbers,before.lineNumbers);assert.equal(after.seconds,before.seconds);
 if(!changes.some(c=>c.index===i)){assert.deepEqual(after,before);assert.deepEqual(plan.shots[i],basePlan.shots[i]);}
}
const boardBytes=JSON.stringify(candidate,null,2)+'\n';save('candidate-storyboard.json',boardBytes);
const motion=motionArtifactSchema.parse({schemaVersion:1,id:randomUUID(),projectId:board.projectId,createdAt:new Date().toISOString(),parentId:'4b2f5826-2e7f-46fa-aea5-b056bde61345',source:{storyboardId:candidate.id,storyboardHash:sha(boardBytes),scriptId:board.scriptId,scriptHash:board.scriptHash,selectionId:board.selectionId},plan});save('candidate-motion.json',motion);
save('baseline-input.json',{board,plan:basePlan});save('candidate-input.json',{board:candidate,plan});
const baselineReview=join(original,'motion-review','4b2f5826-2e7f-46fa-aea5-b056bde61345','review.mp4');
const manifest={createdAt:new Date().toISOString(),projectId:board.projectId,baselineStoryboardId:board.id,baselineMotionId:motion.parentId,candidateStoryboardId:candidate.id,candidateMotionId:motion.id,sourceScriptId:board.scriptId,sourceScriptArtifactHash:board.scriptHash,sourceNarrationTextHash:sha(script),sourceNarrationOriginalWavHash:timing.narrationHash,retainedReview:baselineReview,retainedReviewSha256:sha(readFileSync(baselineReview)),engineHash:hashEngine(),rubricHash:sha(readFileSync(join(root,'rubric.json'))),sections:[{name:'inquiry overload',startFrame:240,endExclusive:402},{name:'processing/category',startFrame:750,endExclusive:1080},{name:'human review',startFrame:1080,endExclusive:1380}],changedShotIndices:changes.map(c=>c.index),unchangedNeighborShots:7,labelsAndNarrationUnchanged:true,preparedWithExistingSchemas:true,indexedInOriginalStore:false,importBlocker:'Original SQLite/project script artifact and raw narration/1080p export are missing from this checkout. These schema-valid import candidates are unindexed preparation, not accepted artifacts.',humanAcceptance:false,productionGates:false,productionRender:false,liveDirectorAudit:'pending configured authorized project gateway',objectiveMediaChecks:'pending',limitations:['Retained baseline is the360px narrated review, not the missing pinned1080px production export.','Review narration must be copied from the retained AAC track without re-encoding; raw WAV is absent.','No human listening, aesthetic preference, editing savings or audience outcome is recorded.']};save('manifest.json',manifest);
console.log(root);
