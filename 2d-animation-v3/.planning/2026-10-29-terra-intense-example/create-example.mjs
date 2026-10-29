import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {componentParts,isComponent} from '../../workflow/components.ts';
import {graphicAssetRegistry} from '../../workflow/graphic-assets.ts';
import {expandMotionShot,motionPlanSchema,validateMotion,scheduleMotion} from '../../workflow/motion.ts';
import {visualArtifactSchema} from '../../workflow/visuals.ts';
import {hashMotionSource} from '../../server/motion-store.ts';
import {inspectMotion} from '../../workflow/production.ts';

const output=resolve('output/terra-intense-10s-example');
if(existsSync(output)&&readdirSync(output).length)throw new Error('Preserve existing example; choose a new output directory.');
mkdirSync(output,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const sourceFiles=[
 'videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/visuals/f85221d8-88c8-48ff-95b5-de06fe408079.json',
 'videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/motion/370b9586-071f-4c52-a1a2-298a59f671c1.json',
 'output/terra-61-investigation/voice-review/qwen-ryan-complete.wav',
 'output/terra-61-investigation/terra-61-final.mp4',
];
const sources=sourceFiles.map(file=>({file,sha256:hash(readFileSync(file))}));
const paper='#F7F3E9',ink='#203B3A',orange='#D9633F';
const heading=(label,y=10,height=11)=>({type:'heading',x:7,y,width:86,height,color:ink,label,typography:'inter-heading@1'});
const symbol=(type,x,y,width=20,height=20)=>({type,x,y,width,height,color:ink,label:''});
const footer=label=>heading(label,86,4);
const part=(opacity=1,reveal=1)=>({x:0,y:0,scale:1,opacity,reveal,color:ink});
const consoleShape={type:'graphic-asset@2',x:4,y:29,width:92,height:51.75,color:orange,label:'',asset:{id:'owner-review-console@1',contentHash:graphicAssetRegistry['owner-review-console@1'].contentHash},parts:{workspace:part(),monitor:part(),draft:part(1,0),'review-controls':part(),unresolved:part(0),'human-hand':part(0)}};
const b=(id,presetId,targetIds,startFrame,endFrame,parameters,type='transformation',importance='primary')=>({id,purpose:id.replaceAll('-',' '),presetId,targetIds,startFrame,endFrame,parameters,type,importance,narrationAnchor:null,continuity:null});
const snap=(id,targetIds,start,end,to={},type='emphasis',importance='supporting')=>b(id,'snap-overshoot@1',targetIds,start,end,{to,anticipation:.85,overshoot:1.12},type,importance);
const enter=(id,ids,start,end)=>b(id,'cascade@1',ids,start,end,{staggerFrames:2,offsetY:5,overshoot:1.1},'entry','supporting');
const hold=(ids,start,end)=>b('read-result','hold@1',ids,start,end,{},'hold','supporting');
const sceneDefinitions=[
 {title:'TRUST THIS AI?',duration:42,meaning:'A draft appears in a workspace; sending needs a separate human decision.',specs:[{id:'title',shape:heading('TRUST THIS AI?'),enter:true},{id:'console',shape:consoleShape},{id:'note',shape:footer('Illustrative')}],beats:[enter('question-hits',['title'],0,10),snap('workspace-hits',['console'],6,18),b('draft-forms','mask-reveal@1',['console.draft'],18,26,{reveal:1}),snap('controls-react',['console.review-controls'],18,26),hold(['title','console','note'],26,41)]},
 {title:'SEND?',duration:42,meaning:'The human hand reaches the review control; the control reacts without sending anything.',specs:[{id:'title',shape:heading('SEND?'),enter:true},{id:'console',shape:{...consoleShape,parts:{...consoleShape.parts,draft:part()}}},{id:'note',shape:footer('Your decision · Illustrative')}],beats:[enter('send-question-hits',['title'],0,10),snap('hand-arrives',['console.human-hand'],6,16,{opacity:1},'impact','primary'),snap('control-receives-hand',['console.review-controls'],16,24),hold(['title','console','note'],25,41)]},
 {title:'GPT-6.1 TERRA',duration:54,meaning:'Connected computer-work elements assemble into an illustrative model identity.',specs:[{id:'title',shape:heading('GPT-6.1 TERRA'),enter:true},{id:'left',shape:symbol('browser',12,42,22,22),exit:true},{id:'right',shape:symbol('document',66,42,22,22),exit:true},{id:'model',shape:symbol('chip',35,39,30,26),enter:true},{id:'note',shape:footer('Launch promise · Illustrative')}],beats:[enter('model-name-hits',['title'],0,12),b('workspace-assembles-model','converge-assemble@1',['left','right'],4,24,{resultId:'model',overshoot:1.12}),snap('model-receives',['model'],26,36),hold(['title','model','note'],37,53)]},
 {title:'COMPUTER WORK',duration:54,meaning:'A document moves into a computer workspace, which visibly reacts.',specs:[{id:'title',shape:heading('COMPUTER WORK'),enter:true},{id:'packet',shape:symbol('document',8,44,18,19),exit:true},{id:'workspace',shape:symbol('browser',39,34,48,36)},{id:'note',shape:footer('Launch promise · Illustrative')}],beats:[enter('work-label-hits',['title'],0,12),b('document-handoff','flow-handoff@1',['packet'],8,26,{destinationId:'workspace',reactionScale:1.15}),hold(['title','workspace','note'],32,53)]},
 {title:'FASTER',duration:54,meaning:'The model dispatches work into several documents; no benchmark or speed figure is asserted.',specs:[{id:'title',shape:heading('FASTER',10,14),enter:true},{id:'model',shape:symbol('chip',40,35,20,20),exit:true},{id:'first',shape:symbol('document',12,54,20,20),enter:true},{id:'second',shape:symbol('document',40,54,20,20),enter:true},{id:'third',shape:symbol('document',68,54,20,20),enter:true},{id:'note',shape:footer('Launch promise · Illustrative')}],beats:[enter('faster-hits',['title'],0,12),b('model-dispatches-work','split-disperse@1',['model'],8,28,{childIds:['first','second','third']}),hold(['title','first','second','third','note'],36,53)]},
 {title:'LOWER TOKEN PRICES',duration:54,meaning:'A token moves into a pricing document; no invented price or savings ratio is shown.',specs:[{id:'title',shape:heading('LOWER TOKEN',10,10),enter:true},{id:'prices',shape:heading('PRICES',22,13),enter:true},{id:'token',shape:symbol('chip',8,48,20,20),exit:true},{id:'pricing',shape:symbol('document',58,41,30,29)},{id:'note',shape:footer('Launch promise · Illustrative')}],beats:[enter('lower-token-hits',['title'],0,12),enter('prices-hit',['prices'],10,22),b('pricing-handoff','flow-handoff@1',['token'],16,34,{destinationId:'pricing',reactionScale:1.15}),hold(['title','prices','pricing','note'],36,53)]},
];
const boardShots=[],planShots=[];
for(const [index,definition] of sceneDefinitions.entries()){
 const start=[],end=[];
 const objects=definition.specs.map(spec=>{
  const shape=structuredClone(spec.shape),startIndex=spec.enter?null:start.push(structuredClone(shape))-1,endIndex=spec.exit?null:end.push(structuredClone(shape))-1;
  return {id:spec.id,startIndex,endIndex,type:shape.type,label:shape.label,initial:{x:shape.x,y:shape.y,width:shape.width,height:shape.height,color:shape.color,opacity:spec.enter?0:1,scale:1,rotation:0},...(shape.typography?{typography:shape.typography}:{}),...(shape.asset?{asset:shape.asset}:{}),...(isComponent(shape.type)?{initialParts:componentParts(shape.type,shape.color,shape.parts,shape)}:{})};
 });
 const shot={id:`shot-${index+1}`,sourceIndex:index,sourceHash:'a'.repeat(64),lineNumbers:[index+1],durationFrames:definition.duration,objects,actions:[],beats:definition.beats,camera:{x:0,y:0,scale:1,rotation:0},incoming:{type:index?'hard-cut':'start',overlapFrames:0,presentation:'cut',anchor:null}};
 const expanded=expandMotionShot(shot),states=new Map(objects.map(object=>[object.id,{...object.initial}]));
 for(const object of objects)for(const [name,state]of Object.entries(object.initialParts??{}))states.set(`${object.id}.${name}`,{...state});
 states.set('camera',{...shot.camera});
 for(const action of expanded.actions)if(action.behavior!=='hold')for(const target of action.targetIds)Object.assign(states.get(target),action.to);
 for(const object of objects){
  const state=states.get(object.id); assert.equal(state.opacity,object.endIndex===null?0:1,`${object.id} final visibility`);
  if(object.endIndex!==null){const shape=end[object.endIndex];for(const key of ['x','y','width','height','color'])shape[key]=state[key];
   if(object.initialParts)shape.parts=Object.fromEntries(Object.keys(object.initialParts).map(name=>[name,states.get(`${object.id}.${name}`)]));
  }
 }
 const boardShot={lineNumbers:[index+1],seconds:definition.duration/30,purpose:definition.meaning,framing:'Large mobile-first editorial composition',subject:definition.title,action:definition.meaning,transition:index?'hard-cut':'start',continuity:'Continue the narrated opening with source-faithful illustrative objects.',design:{theme:'editorial-workflow@1',family:'illustrated-workflow',meaning:definition.meaning,metaphor:'Human review and connected computer work',focalPoint:definition.title,layout:'Sparse heading above a large causal object sequence',density:'sparse',continuityReason:''},startFrame:{background:paper,shapes:start},endFrame:{background:paper,shapes:end}};
 shot.sourceHash=hashMotionSource(boardShot);boardShots.push(boardShot);planShots.push(shot);
}
const sampleScript='Would you trust this AI\nwith the send button?\nOpenAI’s new GPT-6.1 Terra\npromises\nfaster computer work\nat lower token prices.';
const board=visualArtifactSchema.parse({schemaVersion:2,id:randomUUID(),projectId:randomUUID(),scriptId:randomUUID(),scriptHash:hash(sampleScript),selectionId:randomUUID(),baseId:null,createdAt:new Date().toISOString(),instruction:'Separate 10-second Intense review example only. Local shot references, not measured word alignment or production approval.',output:{kind:'storyboard',shots:boardShots}});
planShots.forEach((shot,index)=>{shot.sourceHash=hashMotionSource(board.output.shots[index]);});
const plan=motionPlanSchema.parse({schemaVersion:1,width:1080,height:1920,fps:30,interpreterVersion:'3',energyProfile:'intense',shots:planShots});
validateMotion(plan,board,hashMotionSource);assert.equal(scheduleMotion(plan).durationFrames,300);
writeFileSync(join(output,'board.json'),JSON.stringify(board,null,2),{flag:'wx'});
writeFileSync(join(output,'motion.json'),JSON.stringify(plan,null,2),{flag:'wx'});
writeFileSync(join(output,'sample-script.txt'),sampleScript,{flag:'wx'});
writeFileSync(join(output,'motion-quality.json'),JSON.stringify(inspectMotion(plan,board),null,2),{flag:'wx'});
writeFileSync(join(output,'sources.json'),JSON.stringify({reviewOnly:true,humanApproval:false,energyProfile:'intense',frames:300,fps:30,narrationExcerptSeconds:[0,10],wordAlignment:null,localShotReferencesOnly:true,sources},null,2),{flag:'wx'});
console.log(JSON.stringify({output,frames:300,shots:6,energy:'intense',findings:inspectMotion(plan,board).findings.map(f=>({rule:f.ruleId,shot:f.shotId}))}));
