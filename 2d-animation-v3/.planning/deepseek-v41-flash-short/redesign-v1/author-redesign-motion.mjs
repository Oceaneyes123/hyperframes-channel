import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {openMotion,hashMotionSource} from '../../../server/motion-store.ts';
import {hydrateMotion,validateMotion,scheduleMotion,expandMotionShot} from '../../../workflow/motion.ts';
import {validateTiming} from '../../../workflow/production.ts';
import {compileMotion} from '../../../engine/compile-motion.ts';
import {inspectCreativeMotion} from '../../../engine/quality/inspect-motion.ts';

const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
const config=readConfig(),visuals=openVisuals(config.dataDirectory,config.videosDirectory),store=openMotion(config.dataDirectory,config.videosDirectory);
try {
 const board=visuals.read(receipt.projectId,receipt.storyboardId);
 assert.equal(visuals.acceptance(receipt.projectId).runId,board.id);
 assert.equal(visuals.acceptance(receipt.projectId).stale,false);
 const baseId=store.latest(receipt.projectId);
 const durations=[240,162,138,210,330,300,180,250,140,150];
 const shots=board.output.shots.map((source,index)=>{
  const start=source.startFrame.shapes,end=source.endFrame.shapes,available=new Set(end.map((_,i)=>i));
  const objects=start.map((shape,startIndex)=>{
   const candidates=[...available].filter(i=>end[i].type===shape.type&&end[i].label===shape.label&&JSON.stringify(end[i].asset)===JSON.stringify(shape.asset));
   candidates.sort((a,b)=>Math.abs(end[a].x-shape.x)+Math.abs(end[a].y-shape.y)-Math.abs(end[b].x-shape.x)-Math.abs(end[b].y-shape.y));
   const endIndex=candidates[0]??null;
   if(endIndex!==null)available.delete(endIndex);
   return{id:`object-${startIndex+1}`,startIndex,endIndex};
  });
  for(const endIndex of available)objects.push({id:`object-${objects.length+1}`,startIndex:null,endIndex});
  assert(objects.length<=16);
  const shape=o=>o.startIndex===null?end[o.endIndex]:start[o.startIndex];
  const art=objects.find(o=>shape(o).asset),part=id=>`${art.id}.${id}`;
  const label=value=>objects.find(o=>shape(o).label===value).id;
  const entries=objects.filter(o=>o.startIndex===null).map(o=>o.id);
  const beats=[];
  const beat=(presetId,type,targetIds,from,to,parameters,purpose,importance='supporting')=>beats.push({id:`beat-${beats.length+1}`,presetId,type,targetIds,startFrame:from,endFrame:to,parameters,purpose,importance,narrationAnchor:null,continuity:null});
  const snap=(target,from,to,values,purpose,importance='supporting')=>beat('snap-overshoot@1','transformation',[target],from,to,{to:values,anticipation:.95,overshoot:1.025},purpose,importance);
  const cascade=(targets,from,to,purpose,importance='supporting',offsetY=2)=>{
   if(targets.length)beat('cascade@1','entry',targets,from,to,{staggerFrames:2,offsetY,overshoot:1.025},purpose,importance);
  };
  const mask=(target,from,to,reveal,purpose,importance='supporting')=>beat('mask-reveal@1','transformation',[target],from,to,{reveal},purpose,importance);
  const hold=(from,to,purpose)=>beat('hold@1','hold',['camera'],from,to,{},purpose);
  const punch=(from,to,purpose)=>beat('punch-zoom@1','emphasis',['camera'],from,to,{focusId:art.id,zoom:1.045},purpose,'primary');
  const restore=(target,from,to,purpose)=>{
   const name=target.split('.')[1];
   snap(target,from,to,name?end[art.endIndex].parts[name]:{scale:1,rotation:0,opacity:1,color:shape(objects.find(o=>o.id===target)).color},purpose);
  };
  if(index===0){
   hold(8,35,'Read the service proposition in a recognizable salon');
   cascade([part('inquiries')],44,64,'Customer inquiries accumulate around the owner','primary');
   snap(label('AI service.'),78,96,{scale:1},'Emphasize the service rather than an app');
   punch(112,138,'Connect the service to the owner reception desk');
   hold(150,239,'Hold the complete service promise while narration explains the pitch');
  }
  if(index===1){
   mask(part('inquiries'),0,6,0,'Prepare the hidden inquiry layer');
   cascade([part('inquiries')],8,24,'Bring the repeated questions into the salon');
   mask(part('inquiries'),26,48,1,'Expose the accumulated inquiry pressure','primary');
   hold(52,86,'Recognize where replies get stuck');
   snap(label('Again. And again.'),94,112,{scale:1},'Underline repetition without an invented count');
   hold(120,161,'Read the owner problem before moving to the FAQ');
  }
  if(index===2){
   snap(part('question-one'),8,24,{x:3,y:0},'Compare the first question with the reference','primary');
   restore(part('question-one'),28,44,'Keep the sample beside its reference');
   snap(part('question-two'),48,64,{x:3,y:-1},'Check another inquiry against the same approved answers');
   restore(part('question-two'),66,82,'Retain both fabricated samples');
   cascade([part('owner-mark')],86,104,'The owner signs off on the FAQ');
   cascade(entries,100,118,'Identify the owner-approved source');
   hold(120,137,'Read the reference boundary');
  }
  if(index===3){
   mask(part('row-packet'),0,6,0,'Prepare the hidden row-to-trigger connection');
   hold(10,42,'Locate the Sheets and n8n surfaces');
   cascade([part('new-row')],54,72,'The submitted question becomes a new row');
   cascade(entries,54,76,'Label the newly stored inquiry');
   cascade([part('row-packet')],96,112,'Start the row handoff', 'supporting',0);
   mask(part('row-packet'),114,138,1,'Trace the stored inquiry into the Sheets Trigger','primary');
   snap(part('trigger'),140,154,{scale:1},'The new row activates the trigger');
   snap(part('request'),158,172,{color:'#C6DED3'},'The HTTP operation receives the inquiry');
   restore(part('request'),174,188,'Keep the operation identity visible');
   hold(190,209,'Read the connected intake route');
  }
  if(index===4){
   mask(part('draft'),0,6,0,'Prepare the hidden structured output');
   snap(part('input-one'),24,40,{opacity:.55},'Focus the first model input: the customer question');
   restore(part('input-one'),50,66,'Keep the question available as source context');
   snap(part('input-two'),80,96,{opacity:.55},'Focus the second input: owner-approved FAQ');
   restore(part('input-two'),108,124,'Keep the approved source visible');
   snap(part('processor'),138,154,{color:'#C6DED3'},'The supplied inputs are processed together');
   restore(part('processor'),164,180,'Settle the model processing state');
   punch(182,204,'Read the exact model identifier before its output');
   cascade([part('draft')],212,230,'A structured draft arrives', 'supporting',0);
   mask(part('draft'),232,254,1,'Reveal the machine-readable output drawer','primary');
   cascade(entries,236,260,'Expose both JSON fields and their placeholder values');
   cascade([part('field-markers')],268,286,'Show the two fields as separate workflow values');
   hold(292,329,'Inspect category and reply draft without implying factual verification');
  }
  if(index===5){
   mask(part('unresolved'),0,6,0,'Prepare the missing-information route');
   snap(part('draft'),24,40,{color:'#C6DED3'},'Check the received draft and structured fields');
   restore(part('draft'),52,68,'Keep the editable draft visible');
   hold(72,94,'Allow time for owner fact checking');
   cascade([part('human-hand')],102,122,'A person takes control of the decision', 'supporting',4);
   snap(part('human-hand'),154,174,{x:-8,y:0},'Gesture toward the owner approval control','primary');
   restore(part('human-hand'),184,204,'Keep the approval label readable after the gesture');
   cascade([part('unresolved')],228,246,'An unanswered case returns to the owner', 'supporting',0);
   cascade(entries,230,254,'Name the missing-information escalation');
   mask(part('unresolved'),256,276,1,'Expose the separate owner-escalation tray');
   hold(280,299,'Hold both owner decision paths');
  }
  if(index===6){
   mask(part('unknown'),0,6,0,'Prepare the unanswerable test');
   snap(part('booking'),18,34,{color:'#C6DED3'},'Test an FAQ-covered booking question');
   restore(part('booking'),44,60,'Retain the answerable test result');
   cascade([part('unknown')],68,86,'Run a question outside the FAQ', 'supporting',0);
   mask(part('unknown'),88,110,1,'Reveal that missing knowledge returns to the owner','primary');
   hold(120,179,'Compare the draft and owner-escalation outcomes');
  }
  if(index===7){
   mask(part('documentation'),0,6,0,'Prepare the handover deliverable');
   hold(10,92,'Present the working demonstration and ask whether it fits');
   cascade([part('test-cards')],100,120,'Offer testing as part of the setup service','primary');
   cascade([part('documentation')],158,178,'Bring the handover document to the owner', 'supporting',0);
   mask(part('documentation'),180,202,1,'Reveal the documented handover');
   hold(208,249,'Explain optional maintenance without implying a sale');
  }
  if(index===8){
   mask(part('agreement'),0,6,0,'Prepare the cost-responsibility agreement');
   snap(part('usage-meter'),10,26,{color:'#C6DED3'},'Distinguish usage-based API billing');
   restore(part('usage-meter'),34,50,'Keep hosting as a separate running cost');
   cascade([part('agreement')],62,82,'Put cost responsibility into the agreement', 'supporting',0);
   mask(part('agreement'),84,106,1,'Reveal who is responsible for the bills','primary');
   hold(110,139,'Read the responsibility decision without invented prices');
  }
  if(index===9){
   snap(part('phone'),12,28,{color:'#C6DED3'},'Return an inquiry to the same owner workspace');
   restore(part('phone'),38,54,'Keep the reply process visible');
   punch(64,88,'Return attention to the calm owner in the same salon');
   hold(96,149,'End on owner control of every reply');
  }
  beats.sort((a,b)=>a.startFrame-b.startFrame);
  return{durationFrames:durations[index],objects,beats,camera:{x:0,y:0,scale:1,rotation:0},incoming:{type:source.transition,overlapFrames:0,presentation:'cut',anchor:null}};
 });
 const plan=hydrateMotion({shots},board,hashMotionSource,undefined,'3','energetic');
 validateMotion(plan,board,hashMotionSource);
 const compiled=compileMotion(plan,board),timing=JSON.parse(readFileSync('.data/deepseek-short-eec7f710/line-timing.json','utf8'));
 validateTiming(timing,plan,timing.map(line=>({number:line.number})));
 assert.equal(scheduleMotion(plan).durationFrames,2100);
 const quality=inspectCreativeMotion(plan,board);
 const proof={frames:2100,seconds:70,interpreter:'3',energy:'energetic',objects:plan.shots.map(shot=>shot.objects.length),expandedActions:plan.shots.map(shot=>expandMotionShot(shot).actions.length),expandedTargets:compiled.groups.map(group=>group.shots.reduce((sum,item)=>sum+item.shot.actions.reduce((n,action)=>n+action.targetIds.length,0),0)),quality};
 writeFileSync(root+'authored-motion-plan.json',JSON.stringify(plan,null,2)+'\n');
 writeFileSync(root+'motion-validation.json',JSON.stringify(proof,null,2)+'\n');
 assert.equal(quality.findings.filter(finding=>finding.severity==='warning').length,0,JSON.stringify(quality.findings));
 const id=store.begin(receipt.projectId,{storyboardId:board.id,baseId,shotId:null,interpreterVersion:'3',energyProfile:'energetic',instruction:'Codex-authored correction after installed Motion Director failed. Named-layer causality, fixed measured narration boundaries, exact approved endpoints. No production or motion approval.'},'codex-authored-working-studio-motion');
 try{store.complete(receipt.projectId,id,plan);}catch(error){store.fail(receipt.projectId,id);throw error;}
 receipt.motionId=id;receipt.motionCreated=true;receipt.motionAccepted=false;receipt.motionAuthorship='Codex-authored declarative correction using installed interpreter and presets after Motion Director failed';
 writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
 appendFileSync(root+'progress.md',`\nSaved corrected pending Energetic motion ${id}. All10 shots,2100frames, exact endpoints, narration containment and engine budgets validated. Motion not accepted.\n`);
 console.log(JSON.stringify({motionId:id,...proof},null,2));
}finally{store.close();visuals.close();}
