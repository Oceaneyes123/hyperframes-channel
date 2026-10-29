import assert from 'node:assert/strict';import {readFileSync,writeFileSync} from 'node:fs';import {readConfig} from '../../server/config.ts';import {openVisuals} from '../../server/visual-store.ts';import {openTiming} from '../../server/timing-store.ts';import {openMotion,hashMotionSource} from '../../server/motion-store.ts';import {hydrateMotion,scheduleMotion,validateMotion,expandMotionShot} from '../../workflow/motion.ts';import {resolveBeatTiming} from '../../workflow/timing.ts';import {isComponent} from '../../workflow/components.ts';import {inspectCreativeMotion} from '../../engine/quality/inspect-motion.ts';import {creativeFeedback} from '../../server/creative-feedback.ts';
const path=new URL('./receipt.json',import.meta.url),r=JSON.parse(readFileSync(path,'utf8')),c=readConfig(),v=openVisuals(c.dataDirectory,c.videosDirectory),t=openTiming(c.dataDirectory,c.videosDirectory),m=openMotion(c.dataDirectory,c.videosDirectory);
try{
const board=v.read(r.projectId,r.storyboardId),timing=t.read(r.projectId,r.timingId).artifact;
const overlaps=[0,24,0,18,0,18,0,18],durations=[84,497,386,256,161,382,250,306];let previousEnd=0;
const shots=board.output.shots.map((source,index)=>{
 const objects=[],used=new Set();
 const compatible=(a,b)=>a.type===b.type&&a.label===b.label&&a.typography===b.typography&&JSON.stringify(a.asset)===JSON.stringify(b.asset)&&JSON.stringify(a.diagram)===JSON.stringify(b.diagram)&&(!a.diagram||Object.keys(a.parts??{}).every(key=>a.parts[key].opacity===b.parts?.[key]?.opacity))&&(!(isComponent(a.type)||['text','heading','caption','centered-text','code'].includes(a.type))||(a.width===b.width&&a.height===b.height));
 for(const [startIndex,shape] of source.startFrame.shapes.entries()){const endIndex=source.endFrame.shapes.findIndex((end,i)=>!used.has(i)&&compatible(shape,end));if(endIndex>=0)used.add(endIndex);objects.push({id:`actor-${objects.length+1}`,startIndex,endIndex:endIndex<0?null:endIndex});}
 for(let endIndex=0;endIndex<source.endFrame.shapes.length;endIndex++)if(!used.has(endIndex))objects.push({id:`actor-${objects.length+1}`,startIndex:null,endIndex});
 const start=previousEnd-overlaps[index],end=start+durations[index];previousEnd=end;
 return{durationFrames:durations[index],objects,beats:[],camera:{x:0,y:0,scale:1,rotation:0},incoming:{type:source.transition,overlapFrames:overlaps[index],presentation:source.transition==='camera'?'slide':source.transition==='reveal'?'wipe':'cut',anchor:null},textMotions:[],offset:start};
});
const beat=(s,id,presetId,targetIds,startFrame,endFrame,parameters,type='transformation',importance='supporting',purpose='Develop the source-faithful visual explanation.')=>s.beats.push({id,presetId,targetIds,startFrame,endFrame,parameters,type,importance,purpose,narrationAnchor:null,continuity:null});
const snap=(s,id,target,start,end,to,type='emphasis',importance='supporting')=>beat(s,id,'snap-overshoot@1',[target],start,end,{to,anticipation:.95,overshoot:1.02},type,importance);
const enter=(s,id,target,start,end,type='entry',importance='supporting')=>beat(s,id,'cascade@1',[target],start,end,{staggerFrames:2,offsetY:0,overshoot:1.02},type,importance);
const mask=(s,id,target,start,end,reveal,type='transformation',importance='supporting')=>beat(s,id,'mask-reveal@1',[target],start,end,{reveal},type,importance);
const trace=(s,id,target,start,end)=>beat(s,id,'edge-trace@1',[target],start,end,{},'transformation','primary','Trace the task route and reveal its destination reaction.');
const hold=(s,start,end)=>beat(s,'reading-hold','hold@1',s.objects.filter(o=>o.endIndex!==null).map(o=>o.id),start,end,{},'hold','supporting','Hold the completed explanation for comprehension.');
const cue=(s,number)=>timing.timing.find(x=>x.number===number).startFrame-s.offset;
const text=(s,id,presetId,number,span=24)=>{const startFrame=cue(s,number);s.textMotions.push({targetId:id,presetId,startFrame,endFrame:startFrame+span,narrationAnchor:{kind:'line',lineNumber:number}});};
// Opening: the hand arrives at review immediately, without depicting a send action.
snap(shots[0],'hand-arrives','actor-2.human-hand',3,28,{opacity:1},'transformation','primary');hold(shots[0],45,83);
// Promise: a draft develops first, then the separate product-scope phrase is disclosed.
mask(shots[1],'draft-prepares','actor-2.draft',25,40,0);mask(shots[1],'draft-develops','actor-2.draft',41,105,1,'transformation','primary');
snap(shots[1],'workspace-shifts','actor-2',110,155,{y:28});snap(shots[1],'review-appears','actor-2.human-hand',180,210,{opacity:1},'impact');
snap(shots[1],'old-scope-exits','actor-3',220,240,{opacity:0},'exit');enter(shots[1],'scope-enters','actor-4',235,257);text(shots[1],'actor-4','word-stagger@1',3,42);snap(shots[1],'scope-settles','actor-2',305,355,{y:25});hold(shots[1],385,496);
// Warnings: emphasize the limit, then uncover the alternate route and its result.
mask(shots[2],'prepare-alternate','actor-4.alternate',0,6,0,'anticipation');mask(shots[2],'prepare-result','actor-4.completed',6,12,0,'anticipation');trace(shots[2],'blocked-route','actor-2.direct',20,82);
text(shots[2],'actor-1','pop-settle@1',5,30);
snap(shots[2],'old-test-state-exits','actor-2',150,172,{opacity:0},'exit');snap(shots[2],'new-test-state-enters','actor-4',150,172,{opacity:1},'entry');mask(shots[2],'alternate-route','actor-4.alternate',200,255,1,'transformation','primary');mask(shots[2],'task-result','actor-4.completed',258,282,1,'impact','primary');hold(shots[2],290,385);
// Conditions: supported replacement actors preserve changed text and fixed-size diagram roots.
const s4=shots[3];snap(s4,'large-graph-exits','actor-2',35,57,{opacity:0},'exit');enter(s4,'context-graph-enters','actor-4',42,64);snap(s4,'old-caption-exits','actor-3',110,130,{opacity:0},'exit');enter(s4,'qualified-caption-enters','actor-5',130,152,'transformation','primary');text(s4,'actor-1','mask-rise@1',6,24);hold(s4,170,255);
// Favorable separate monitor test: reveal the path into review, never beyond it.
mask(shots[4],'review-path-reveals','actor-2.review-path',15,65,1);trace(shots[4],'agent-reaches-monitor','actor-2.review-path',78,132);hold(shots[4],140,160);
// Independent analytics evidence is a report, not a security score or invented counter.
const s6=shots[5];snap(s6,'report-arrives','actor-3',20,60,{y:44});text(s6,'actor-1','wipe-reveal@1',8,36);snap(s6,'report-result','actor-3.signal',130,158,{opacity:1},'impact','primary');snap(s6,'report-settles','actor-3',180,220,{y:48});beat(s6,'examine-independent-report','punch-zoom@1',['camera'],265,335,{focusId:'actor-3',zoom:1.07},'emphasis');hold(s6,345,381);
// The imagined example returns to the same document and its human review handoff.
text(shots[6],'actor-1','underline-draw@1',10,30);snap(shots[6],'example-handoff','actor-2.human-hand',95,140,{opacity:1},'transformation','primary');hold(shots[6],145,249);
// Close on the authorized scope; replacement console sizes retain exact approved endpoints.
const s8=shots[7];snap(s8,'opening-console-exits','actor-2',48,70,{opacity:0},'exit');enter(s8,'final-console-enters','actor-4',62,84);text(s8,'actor-1','highlight-sweep@1',13,30);hold(s8,220,305);
for(const s of shots){s.beats.sort((a,b)=>a.startFrame-b.startFrame);delete s.offset;}
let plan=hydrateMotion({shots},board,hashMotionSource,undefined,'3','energetic');plan=resolveBeatTiming(plan,timing).plan;
for(const [i,shot]of plan.shots.entries())for(const object of shot.objects){const state={...object.initial};for(const action of expandMotionShot(shot).actions)if(action.targetIds.includes(object.id))Object.assign(state,action.to);const end=object.endIndex===null?null:board.output.shots[i].endFrame.shapes[object.endIndex];const mismatches=end?['x','y','width','height','color'].filter(key=>state[key]!==end[key]):[];if(end?mismatches.length||state.opacity!==1||state.scale!==1||state.rotation!==0:state.opacity!==0)console.log(JSON.stringify({shot:i+1,id:object.id,mismatches,state,end}));}
validateMotion(plan,board,hashMotionSource);assert.equal(scheduleMotion(plan).durationFrames,2244);
const id=m.begin(r.projectId,{storyboardId:r.storyboardId,baseId:m.latest(r.projectId),shotId:null,interpreterVersion:'3',energyProfile:'energetic',instruction:'Current-session authored interpreter-3 beats after gateway proposal failed. Compound components require interpreter 3. Preserves exact approved endpoint drawings, measured line anchors and required replacement actors for changed labels, dimensions or diagram opacity; semantic route traces remain fixed to graph-owned paths. Total 2244 frames. No motion acceptance or production gate.'},'codex-session motion author');
try{m.complete(r.projectId,id,plan,creativeFeedback(c.dataDirectory).snapshot('motion'));}catch(error){m.fail(r.projectId,id);throw error;}
const saved=m.read(r.projectId,id),quality=inspectCreativeMotion(saved.plan,board),latest=JSON.parse(readFileSync(path,'utf8'));writeFileSync(path,JSON.stringify({...latest,motionId:id,motionProvenance:'Current-session declarative interpreter-3 beats through existing presets, preserving failed gateway attempt'},null,2)+'\n');
writeFileSync(new URL('./motion-quality.json',import.meta.url),JSON.stringify(quality,null,2)+'\n');console.log(JSON.stringify({id,durationFrames:scheduleMotion(saved.plan).durationFrames,findings:quality.findings.map(x=>({rule:x.ruleId,shot:x.shotId,message:x.message}))},null,2));
}finally{v.close();t.close();m.close();}
