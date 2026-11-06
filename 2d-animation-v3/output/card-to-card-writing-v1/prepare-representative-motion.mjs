import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {readConfig} from '../../server/config.ts';
import {openVisuals} from '../../server/visual-store.ts';
import {openMotion,hashMotionSource} from '../../server/motion-store.ts';
import {openTiming} from '../../server/timing-store.ts';
import {hydrateMotion,validateMotion,scheduleMotion,expandMotionShot} from '../../workflow/motion.ts';
import {componentParts,isComponent} from '../../workflow/components.ts';
const projectId='5a474ca9-fb23-4989-a680-9ca755d3fc0f',storyboardId='e2c1feec-fa12-4238-a7ca-ba31d207f97b';
const config=readConfig(),visuals=openVisuals(config.dataDirectory,config.videosDirectory),motions=openMotion(config.dataDirectory,config.videosDirectory),timings=openTiming(config.dataDirectory,config.videosDirectory);
const beat=(id,targetIds,startFrame,endFrame,to={},purpose='Schema-only endpoint placeholder; not authored or offered for motion review.')=>({id,purpose,type:'transformation',presetId:'snap-overshoot@1',parameters:{to,anticipation:.95,overshoot:1.02},targetIds,startFrame,endFrame,importance:'supporting',narrationAnchor:null,continuity:null});
const identity=(a,b)=>a.type===b.type&&a.label===b.label&&JSON.stringify(a.asset)===JSON.stringify(b.asset)&&JSON.stringify(a.diagram)===JSON.stringify(b.diagram)&&(!isComponent(a.type)||a.width===b.width&&a.height===b.height);
let artifact;
try{
 const board=visuals.read(projectId,storyboardId);assert.equal(visuals.acceptance(projectId).runId,storyboardId);assert.equal(visuals.acceptance(projectId).stale,false);
 const timing=timings.latest(projectId);assert(timing&&!timing.stale);
 const proposal={shots:board.output.shots.map((drawing,index)=>{
  const objects=[],used=new Set();
  for(const [startIndex,shape]of drawing.startFrame.shapes.entries()){
   const endIndex=drawing.endFrame.shapes.findIndex((end,i)=>!used.has(i)&&identity(shape,end));
   if(endIndex>=0)used.add(endIndex);
   objects.push({id:`object-${objects.length+1}`,startIndex,endIndex:endIndex>=0?endIndex:null});
  }
  for(let i=0;i<drawing.endFrame.shapes.length;i++)if(!used.has(i))objects.push({id:`object-${objects.length+1}`,startIndex:null,endIndex:i});
  assert(objects.length<=16);
  const durationFrames=Math.round(drawing.seconds*30),beats=[];
  for(const object of objects){
   const from=object.startIndex===null?null:drawing.startFrame.shapes[object.startIndex],to=object.endIndex===null?null:drawing.endFrame.shapes[object.endIndex];
   const changes={};if(!from)changes.opacity=1;else if(!to)changes.opacity=0;
   if(from&&to)for(const key of ['x','y','width','height','color'])if(from[key]!==to[key])changes[key]=to[key];
   if(Object.keys(changes).length)beats.push(beat(`end-${object.id}`,[object.id],durationFrames-14,durationFrames-2,changes));
   if(from&&to&&isComponent(from.type)){
    const before=componentParts(from.type,from.color,from.parts,from),after=componentParts(to.type,to.color,to.parts,to);
    for(const [id,state]of Object.entries(after)){
     const delta={};for(const key of Object.keys(state))if(before[id][key]!==state[key])delta[key]=state[key];
     if(Object.keys(delta).length)beats.push(beat(`end-${object.id}-${id}`,[`${object.id}.${id}`],durationFrames-14,durationFrames-2,delta));
    }
   }
  }
  if(!beats.length)beats.push({id:'placeholder-hold',purpose:'Static unanimated storyboard placeholder outside the authorized representative scene.',type:'hold',presetId:'hold@1',parameters:{},targetIds:[objects[0].id],startFrame:0,endFrame:durationFrames-2,importance:'supporting',narrationAnchor:null,continuity:null});
  beats.sort((a,b)=>a.startFrame-b.startFrame);
  return{objects,durationFrames,beats,camera:{x:0,y:0,scale:1,rotation:0},incoming:{type:drawing.transition,overlapFrames:0,presentation:'cut',anchor:null},textMotions:[]};
 })};
 const sample=proposal.shots[3],drawing=board.output.shots[3];
 const find=predicate=>{const mapped=sample.objects.find(o=>o.startIndex!==null&&predicate(drawing.startFrame.shapes[o.startIndex]));assert(mapped);return mapped.id;};
 const parcel=find(s=>s.asset?.id==='debt-parcel-detail@1'),sourceCard=find(s=>s.asset?.id==='credit-card-detail@1'&&s.color==='#167477'),receiver=find(s=>s.asset?.id==='credit-card-detail@1'&&s.color==='#172D38');
 const lead=find(s=>s.type==='text'&&s.label==='same'),keyword=find(s=>s.type==='heading'&&s.label==='TOTAL');
 sample.beats=[
  {...beat('lift-principal',[parcel],6,18,{y:40},'Lift the intact debt parcel clear of Card A before the transfer.'),importance:'primary',type:'anticipation'},
  {...beat('transfer-principal',[parcel],53,68,{x:60,y:44},'Carry the same parcel across the full gap and land at Card B as narration says to this one.'),importance:'primary',parameters:{to:{x:60,y:44},anticipation:.95,overshoot:1.05}},
  {...beat('receive-impact',[receiver],62,74,{},'Card B compresses and expands once at the parcel landing, then settles. This receiving response is caused by the transfer.'),importance:'primary',type:'impact',parameters:{to:{},anticipation:.95,overshoot:1.12}},
  {id:'inspect-cleared-card',purpose:'Briefly inspect the visibly empty Card A as narration says paid off; restore the full relationship before the debt reminder.',type:'emphasis',presetId:'punch-zoom@1',parameters:{focusId:sourceCard,zoom:1.12},targetIds:['camera'],startFrame:104,endFrame:122,importance:'primary',narrationAnchor:null,continuity:null},
  {id:'read-unchanged-total',purpose:'Hold the complete result for the concluding words; preserve the unchanged total and visible principal.',type:'hold',presetId:'hold@1',parameters:{},targetIds:[parcel,sourceCard,receiver,keyword,lead],startFrame:151,endFrame:177,importance:'primary',narrationAnchor:null,continuity:null}
 ];
 sample.textMotions=[{targetId:lead,presetId:'tracking-settle@1',startFrame:0,endFrame:10},{targetId:keyword,presetId:'highlight-sweep@1',startFrame:134,endFrame:146}];
 const plan=hydrateMotion(proposal,board,hashMotionSource,undefined,'3','intense');validateMotion(plan,board,hashMotionSource);
 const schedule=scheduleMotion(plan);assert.equal(schedule.durationFrames,timing.artifact.measured.durationFrames);assert.equal(schedule.shots[3].startFrame,515);assert.equal(schedule.shots[3].endFrame,694);
 const expanded=expandMotionShot(plan.shots[3]);assert(expanded.actions.some(a=>a.targetIds.includes(parcel)&&a.to.x===60));assert(expanded.actions.some(a=>a.targetIds.includes(receiver)&&a.to.scale>1));
 const totalRails=plan.shots[3].objects.filter(o=>o.type==='rect'&&o.initial.y===65);assert.equal(totalRails.length,1);assert(!expanded.actions.some(a=>a.targetIds.includes(totalRails[0].id)));
 const previous=motions.latest(projectId);assert.equal(previous,null);
 const request={storyboardId,baseId:null,shotId:null,interpreterVersion:'3',energyProfile:'intense',instruction:'Representative scene ONLY: zero-based shot3, debt transfer while total remains unchanged. Exact accepted script, storyboard, OmniVoice audio and reviewed line timing. Intense root choreography: lift, 15-frame wide transfer, receiving-card impact, 18-frame inspection punch-in, mixed-type effects and comprehension hold. Other shots are explicit schema-only static/endpoint placeholders, not authored direction and not reviewable as a full film. Render only shot3. No full motion acceptance or production authorization.'};
 const id=motions.begin(projectId,request,'codex-coordinator-authored');try{motions.complete(projectId,id,plan);}catch(e){motions.fail(projectId,id,e.message);throw e;}
 artifact=motions.read(projectId,id);assert.equal(artifact.source.timingId,timing.artifact.id);assert.equal(motions.acceptance(projectId),null);
 const out=join(config.videosDirectory,projectId,'review',`representative-plan-${id}`);mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'scope.json'),JSON.stringify({motionId:id,reviewOnlyShotIndex:3,globalFrames:[515,693],durationFrames:179,expectedSeconds:179/30,unreviewedPlaceholderShots:[0,1,2,4,5,6],sampleApproved:false,fullMotionApproved:false,finalRenderAuthorized:false,mechanism:{parcel,sourceCard,receiver,unchangedTotalRail:totalRails[0].id}},null,2),{flag:'wx'});
 console.log(JSON.stringify({motionId:id,reviewOnlyShotIndex:3,output:out,frames:schedule.shots[3],fullPlanPlaceholderDisclosure:true},null,2));
}finally{timings.close();motions.close();visuals.close();}
