import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { graphicReference, assetMetadata } from '../../../workflow/graphic-assets.ts';
import { frameSchema, validateStoryboard, visualArtifactSchema } from '../../../workflow/visuals.ts';
import { inspectGraphics } from '../../../engine/quality/inspect-graphics.ts';

const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'../receipt.json','utf8'));
const baseline=JSON.parse(readFileSync(`videos/${receipt.projectId}/visuals/${receipt.storyboardId}.json`,'utf8'));
const script=JSON.parse(readFileSync(`videos/${receipt.projectId}/scripts/${receipt.revisionId}.json`,'utf8'));
const C={paper:'#F7F3E9',ink:'#203B3A',accent:'#AA472D',mint:'#C6DED3',surface:'#FFFDF8'};
const text=(label,x,y,width,height=5.5,color=C.ink,type='heading')=>({type,x,y,width,height,color,label});
const rect=(x,y,width,height,color)=>({type:'rect',x,y,width,height,color,label:''});
function art(id,x,y,width,hidden=[]) {
 const metadata=assetMetadata(id);
 assert(metadata);
 return {type:'graphic-asset@2',x,y,width,height:width*1080/1920,color:C.accent,label:'',asset:graphicReference(id),parts:Object.fromEntries(metadata.layers.map(layer=>[layer,{x:0,y:0,scale:1,opacity:hidden.includes(layer)?0:1,color:C.accent,reveal:1}]))};
}
const frame=(shapes,dark=false)=>frameSchema.parse({background:dark?C.ink:C.paper,shapes});
const scenes=[
 {title:'A service worth building',family:'editorial-illustration',metaphor:'A real working salon is the customer, not a software icon.',focal:'Expressive owner and reception desk.',layout:'Large two-line title over a full-width illustrated salon.',asset:'salon-working-studio@1',
  end:frame([text('Your first',7,7,86,7.5),text('AI service.',7,15,86,7.5,C.accent),art('salon-working-studio@1',0,29,100,['calm-owner']),text('DeepSeek V4.1 Flash',8,88,84,5.5,C.ink,'centered-text')]),
  action:'Open on the complete salon; inquiries enter from both sides, then the service title lands. Camera follows the owner, not a floating symbol.'},
 {title:'Find the reply bottleneck',family:'editorial-illustration',metaphor:'The reception counter becomes the pressure point for unanswered questions.',focal:'Owner between two approaching inquiry tickets.',layout:'Environment-first full-width artwork, coral problem statement below.',asset:'salon-working-studio@1',
  end:frame([text('Same questions.',7,8,86,6.5),text('Again. And again.',7,15,86,6.5,C.accent),art('salon-working-studio@1',0,26,100,['calm-owner']),rect(7,85,86,8,C.ink),text('Where do replies stall?',10,86.2,80,5.5,C.paper,'centered-text')]),
  action:'Match the opening room. Punch into the owner as inquiry tickets arrive; hold the visibly overwhelmed expression. No invented counts or lost revenue.'},
 {title:'Build from approved answers',family:'editorial-illustration',metaphor:'An overhead research desk separates question samples from an owner-approved reference binder.',focal:'Physical FAQ binder and owner sign-off.',layout:'Overhead diagonal stationery composition with large editable corner labels.',asset:'faq-research-desk@1',
  end:frame([text('Start with',7,6,86,7),text('their answers.',7,13.5,86,7,C.accent),art('faq-research-desk@1',0,26,100),text('Questions',5,39,40,5),text('FAQ',56,39,33,5),text('Owner-approved',8,86,84,5.5,C.ink,'centered-text')]),
  action:'Match-cut an inquiry ticket onto the research desk. Reveal reference pages, compare samples, then stamp owner approval. Fabricated question content stays reviewer metadata.'},
 {title:'Follow one real workflow',family:'interface-demonstration',metaphor:'A submitted inquiry becomes a highlighted row, then a trigger activates the HTTP request.',focal:'Highlighted Google Sheets row and n8n trigger.',layout:'Tall stacked software cutaway with actual operation names.',asset:'inquiry-intake-console@1',
  end:frame([text('One inquiry.',7,6,86,7.5),text('A clear route.',7,14,86,7.5,C.accent),text('Google Sheets',7,24,86,5.5),art('inquiry-intake-console@1',0,31,100),text('Question',26,43.3,31,4.5,C.ink,'centered-text'),text('n8n',19,64.3,25,4.5),text('Trigger',18,79,23,4,C.ink,'centered-text'),text('HTTP Request',41,79,38,4,C.ink,'centered-text')]),
  action:'Reveal the intake form, insert one row, carry its packet into Google Sheets Trigger and activate HTTP Request. Stage UI labels instead of shrinking them.'},
 {title:'Turn a question into fields',family:'technical-cutaway',metaphor:'A processor cutaway combines the inquiry and reference rather than a magical all-knowing chatbot.',focal:'Isometric processor between two inputs and a structured draft.',layout:'Dark cinematic stage with input rails, raised processor and output drawer.',asset:'deepseek-processing-studio@1',
  end:frame([text('From question',7,6,86,7,C.paper),text('to structured draft.',7,13.5,86,6.5,C.mint),art('deepseek-processing-studio@1',0,29,100),text('deepseek-flash',9,23,82,5.3,C.mint,'code'),text('Question',6,46,33,4.5,C.ink,'centered-text'),text('FAQ',61,46,33,4.5,C.ink,'centered-text'),text('category',15,73.5,65,4,C.ink,'code'),text('reply_draft',15,78,65,4,C.ink,'code'),text('JSON',8,88,84,5.5,C.mint,'centered-text')],true),
  action:'Two input packets travel to the processor. Its top opens; category and reply_draft reveal in the output drawer. Punch on the field structure after both inputs arrive.'},
 {title:'The owner makes the decision',family:'interface-demonstration',metaphor:'A physical hand interrupts automation at the review desk.',focal:'Human hand beside review controls and unresolved tray.',layout:'Close monitor view with large controls and a separate missing-information tray.',asset:'owner-review-console@1',
  end:frame([text('Draft first.',7,6,86,7.5),text('Owner decides.',7,14,86,7.5,C.accent),art('owner-review-console@1',0,27,100),text('Review',31,57.5,24,4,C.ink,'centered-text'),text('Edit',58,57.5,23,4,C.ink,'centered-text'),text('Ask owner',61,70.5,29,4,C.ink,'centered-text'),text('Approve before sending',7,86,86,5.5,C.ink,'centered-text')]),
  action:'Validate fields and update the row, notify the owner, highlight their edit, then require their approval. The unresolved tray is routed back to the owner. No automatic send.'},
 {title:'Test what it cannot answer',family:'visual-comparison',metaphor:'Two test benches make the success path and uncertainty path equally visible.',focal:'Booking test on one side and owner escalation on the other.',layout:'Full-height paired test lanes; one check and one unresolved question.',asset:'booking-test-bench@1',
  end:frame([text('Test both paths.',7,8,86,7.5),art('booking-test-bench@1',0,25,100),text('Booking',4,37.5,43,5,C.ink,'centered-text'),text('Unknown',53,37.5,43,5,C.ink,'centered-text'),text('Draft',6,82,40,5,C.ink,'centered-text'),text('Ask owner',54,82,40,5,C.accent,'centered-text')]),
  action:'Run the booking case first; its calendar resolves to a draft. Run the unknown case second; its information gap routes to the owner. Never show a fabricated pass rate.'},
 {title:'Offer a complete handover',family:'editorial-illustration',metaphor:'A service leaves a working demonstration, test evidence and documented handover on a real desk.',focal:'Open laptop, checked test cards and reference binder.',layout:'Meeting scene with a tangible delivery kit, not three feature cards.',asset:'service-handover-desk@1',
  end:frame([text('Show the workflow.',7,7,86,7),text('Offer the setup.',7,14.5,86,7,C.accent),art('service-handover-desk@1',0,28,100),text('Test. Document. Hand over.',7,87,86,5.5,C.ink,'centered-text')]),
  action:'Show the laptop demonstration to the owner; test cards and handover binder assemble around it. Maintenance remains an optional agreement, with no sale or customer result implied.'},
 {title:'Agree the running costs',family:'technical-cutaway',metaphor:'Separate metered model usage from hosting, then put responsibility into the agreement.',focal:'Usage meter, server stack and signed responsibility sheet.',layout:'Paired physical instruments over an agreement, wide generous headings.',asset:'service-running-costs@1',
  end:frame([text('Agree the costs.',7,8,86,7.5),art('service-running-costs@1',0,25,100),text('API usage',7,62,42,5,C.ink,'centered-text'),text('Hosting',54,62,39,5,C.ink,'centered-text'),text('Who pays?',8,86,84,6,C.accent,'centered-text')]),
  action:'The API meter responds to usage while hosting stays a separate obligation. End on responsibility agreement. Do not invent rates, costs, savings or earnings.'},
 {title:'Bring control back to the salon',family:'editorial-illustration',metaphor:'Return to the same workplace with a calm owner and a visible review process.',focal:'The same owner now working with their review console.',layout:'Opening environment returns, calmer silhouette and strong final statement.',asset:'salon-working-studio@1',
  end:frame([text('A useful process.',7,7,86,7),text('An owner in control.',7,14.5,86,6.5,C.accent),art('salon-working-studio@1',0,29,100,['owner','inquiries']),text('Every reply. Their decision.',7,87,86,5.5,C.ink,'centered-text')]),
  action:'Match back into the original salon. Replace inquiry pressure with a calm owner examining a draft. End on the explicit owner decision boundary, not a fabricated business result.'},
];
const boundaries=[0,240,402,540,750,1080,1380,1560,1810,1950,2100];
// Resolve short UI labels onto opaque local surfaces; root contrast checks cannot infer asset paint.
scenes[3].end.shapes.find(s=>s.label==='Trigger').width=25;
scenes[3].end.shapes.find(s=>s.label==='Trigger').x=14;
scenes[3].end.shapes.find(s=>s.label==='HTTP Request').width=41;
scenes[3].end.shapes.find(s=>s.label==='HTTP Request').x=42;
scenes[3].end.shapes.find(s=>s.label==='Google Sheets').height=4;
const sheetLabel=scenes[3].end.shapes.find(s=>s.label==='Question');
Object.assign(sheetLabel,{label:'New inquiry',x:11,y:44.3,width:43,height:4});
scenes[3].end.shapes.splice(scenes[3].end.shapes.indexOf(sheetLabel),0,rect(10,44,45,4.8,C.mint));
scenes[5].end.shapes.find(s=>s.label==='Ask owner').width=31;
scenes[7].end.shapes.find(s=>s.label==='Test. Document. Hand over.').label='Test. Document. Handover.';
scenes[9].end.shapes.find(s=>s.label==='Every reply. Their decision.').label='Every reply. Owner-led.';
const processing=scenes[4].end.shapes;
for(const label of ['Question','FAQ','category','reply_draft']) {
 const shape=processing.find(shape=>shape.label===label);
 shape.height=3.2;
 shape.y=label==='Question'||label==='FAQ'?39:label==='category'?71.5:76;
}
for(const label of ['Question','FAQ']) {
 const index=processing.findIndex(shape=>shape.label===label),shape=processing[index];
 processing.splice(index,0,rect(shape.x-.5,shape.y-.5,shape.width+1,shape.height+1,C.surface));
}
processing.splice(processing.findIndex(shape=>shape.label==='category'),0,rect(14,70.8,66,9.2,C.surface));
// Alternate environment-first, interface-first and headline-first framing across the board.
const moveArt=(scene,y)=>{scene.end.shapes.find(shape=>shape.asset).y=y;};
moveArt(scenes[1],8);
Object.assign(scenes[1].end.shapes.find(s=>s.label==='Same questions.'),{y:72});
Object.assign(scenes[1].end.shapes.find(s=>s.label==='Again. And again.'),{y:79.5});
scenes[1].end.shapes=scenes[1].end.shapes.filter(s=>s.type!=='rect'&&s.label!=='Where do replies stall?');
scenes[1].layout='Environment-first salon fills the upper frame; the problem statement lands underneath.';
scenes[3].end.shapes=scenes[3].end.shapes.filter(s=>s.label!=='A clear route.');
scenes[3].end.shapes.find(s=>s.label==='One inquiry.').label='Follow the inquiry.';
for(const shape of scenes[3].end.shapes) if(shape.y>=24) shape.y-=4;
moveArt(scenes[5],10);
for(const shape of scenes[5].end.shapes) if(['Review','Edit','Ask owner'].includes(shape.label)) shape.y-=17;
scenes[5].end.shapes.find(s=>s.label==='Review').label='Approve';
scenes[5].end.shapes.find(s=>s.label==='Draft first.').y=74;
scenes[5].end.shapes.find(s=>s.label==='Owner decides.').y=82;
scenes[5].end.shapes=scenes[5].end.shapes.filter(s=>s.label!=='Approve before sending');
scenes[5].layout='Close review monitor above; the human decision statement anchors the lower third.';
moveArt(scenes[7],12);
scenes[7].end.shapes.find(s=>s.label==='Show the workflow.').y=75;
scenes[7].end.shapes.find(s=>s.label==='Offer the setup.').y=83;
scenes[7].end.shapes=scenes[7].end.shapes.filter(s=>s.label!=='Test. Document. Handover.');
scenes[7].layout='Illustrated meeting leads; an offer statement sits beneath the tangible delivery kit.';
moveArt(scenes[8],12);
for(const shape of scenes[8].end.shapes) if(['API usage','Hosting'].includes(shape.label)) shape.y-=13;
scenes[8].end.shapes.find(s=>s.label==='Agree the costs.').y=77;
scenes[8].end.shapes.find(s=>s.label==='Who pays?').y=85;
scenes[8].layout='Instruments and agreement lead the composition; cost responsibility concludes below.';
const intake=scenes[3].end.shapes;
const intakeArt=intake.find(s=>s.asset);
intakeArt.asset=graphicReference('inquiry-intake-console@3');
intake.find(s=>s.label==='n8n').x=72;
const trigger=intake.find(s=>s.label==='Trigger');
Object.assign(trigger,{x:15,width:25,y:78.5});
intake.push(text('Sheets',15,75,25,3.2,C.ink,'centered-text'));
const request=intake.find(s=>s.label==='HTTP Request');
Object.assign(request,{label:'HTTP',x:43,width:25,y:75,height:3.2});
intake.push(text('Request',43,78.5,25,3.2,C.ink,'centered-text'));
processing.find(s=>s.label==='category').label='{"category":"…",';
processing.find(s=>s.label==='reply_draft').label='"reply_draft":"…"}';
Object.assign(scenes[5].end.shapes.find(s=>s.asset).parts['human-hand'],{x:-14,y:5});
const missing=scenes[5].end.shapes.find(s=>s.label==='Ask owner');
Object.assign(missing,{label:'Missing?',x:58.5,y:51.8,width:34,height:3.2});
const reviewShapes=scenes[5].end.shapes;
reviewShapes.splice(reviewShapes.indexOf(missing),0,rect(59,51.5,33,7.4,C.paper));
reviewShapes.splice(reviewShapes.findIndex(s=>s.label==='Approve'),0,rect(30.4,40.3,24,3.4,C.mint));
reviewShapes.push(text('Ask owner',60,55.6,31,3.2,C.ink,'centered-text'));
scenes[0].end.shapes.find(s=>s.label==='DeepSeek V4.1 Flash').label='Inquiry reply service';
scenes[0].end.shapes.push(text('DeepSeek V4.1 Flash',8,25,84,4,C.ink,'centered-text'));
const shots=scenes.map((scene,index)=>{
 const start=structuredClone(scene.end);
 // Keep a composed first state; named layers reveal progressively in motion after storyboard acceptance.
 const illustration=start.shapes.find(shape=>shape.asset);
 const hiddenByShot=[['inquiries'],['inquiries'],['owner-mark'],['new-row','row-packet'],['draft','field-markers'],['human-hand','unresolved'],['unknown'],['documentation','test-cards'],['agreement'],[]];
 for(const layer of hiddenByShot[index]) illustration.parts[layer].opacity=0;
 if(index===2) start.shapes=start.shapes.filter(shape=>shape.label!=='Owner-approved');
 if(index===3) start.shapes=start.shapes.filter(shape=>shape.label!=='New inquiry'&&!(shape.type==='rect'&&shape.x===10));
 if(index===4) start.shapes=start.shapes.filter(shape=>!['{"category":"…",','"reply_draft":"…"}'].includes(shape.label)&&!(shape.type==='rect'&&shape.x===14));
 if(index===5) start.shapes=start.shapes.filter(shape=>!['Missing?','Ask owner'].includes(shape.label)&&!(shape.type==='rect'&&shape.x===59));
 return {lineNumbers:[index+1],seconds:(boundaries[index+1]-boundaries[index])/30,purpose:scene.title,framing:scene.layout,subject:scene.focal,action:scene.action,transition:index===0?'start':'hard-cut',continuity:index===1?'Retain the same salon and owner to introduce the problem.':index===9?'Return to the same salon to connect service and customer.':'Carry the inquiry motif into a distinct explanatory composition.',
 design:{theme:'editorial-workflow@1',family:scene.family,meaning:script.content.split('\n')[index],metaphor:scene.metaphor,focalPoint:scene.focal,layout:scene.layout,density:'balanced',continuityReason:[1,9].includes(index)?'The same workplace makes the problem/payoff connection explicit.':''},startFrame:start,endFrame:scene.end};
});
validateStoryboard({shots},script.content);
assert.equal(shots.length,10);
assert.equal(boundaries.at(-1),2100);
const timing=JSON.parse(readFileSync('.data/deepseek-short-eec7f710/line-timing.json','utf8'));
timing.forEach((line,index)=>{assert(line.startFrame>=boundaries[index]);assert(line.endFrame<=boundaries[index+1]);});
const artifact=visualArtifactSchema.parse({...baseline,schemaVersion:2,id:randomUUID(),createdAt:new Date().toISOString(),baseId:baseline.id,instruction:'Working Studio redesign: original layered illustrations and reconstructed interfaces throughout. Preserve exact script and measured narration. Proposed storyboard only; no human approval inferred.',output:{kind:'storyboard',shots}});
const quality=inspectGraphics(artifact);
writeFileSync(root+'storyboard-draft.json',JSON.stringify(artifact,null,2)+'\n');
writeFileSync(root+'graphics-review.json',JSON.stringify(quality,null,2)+'\n');
writeFileSync(root+'scene-timing.json',JSON.stringify({boundaries,lines:timing,scriptHash:createHash('sha256').update(script.content).digest('hex'),narrationHash:createHash('sha256').update(readFileSync('.data/deepseek-short-eec7f710/narration.wav')).digest('hex')},null,2)+'\n');
console.log(JSON.stringify({shots:shots.length,frames:boundaries.at(-1),qualityFindings:quality.findings},null,2));
