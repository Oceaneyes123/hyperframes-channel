import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readConfig} from '../../server/config.ts';
import {openVisuals} from '../../server/visual-store.ts';
import {openMotion,hashMotionSource} from '../../server/motion-store.ts';
import {openTiming} from '../../server/timing-store.ts';
import {validateMotion,expandMotionShot,scheduleMotion} from '../../workflow/motion.ts';
const projectId='5a474ca9-fb23-4989-a680-9ca755d3fc0f',baseId='ff0cf2c7-e31d-4118-95a0-8a8659eee67e';
const config=readConfig(),motions=openMotion(config.dataDirectory,config.videosDirectory),visuals=openVisuals(config.dataDirectory,config.videosDirectory),timings=openTiming(config.dataDirectory,config.videosDirectory);
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const snap=(id,target,start,end,to,purpose,importance='primary',type='transformation',overshoot=1.04)=>({id,purpose,type,presetId:'snap-overshoot@1',parameters:{to,anticipation:.95,overshoot},targetIds:Array.isArray(target)?target:[target],startFrame:start,endFrame:end,importance,narrationAnchor:null,continuity:null});
const hold=(id,targets,start,end,purpose)=>({id,purpose,type:'hold',presetId:'hold@1',parameters:{},targetIds:targets,startFrame:start,endFrame:end,importance:'supporting',narrationAnchor:null,continuity:null});
const punch=(id,focusId,start,end,zoom,purpose)=>({id,purpose,type:'emphasis',presetId:'punch-zoom@1',parameters:{focusId,zoom},targetIds:['camera'],startFrame:start,endFrame:end,importance:'supporting',narrationAnchor:null,continuity:null});
const text=(targetId,presetId,startFrame,endFrame)=>({targetId,presetId,startFrame,endFrame});
const cascade=(id,targets,start,end,purpose)=>({id,purpose,type:'entry',presetId:'cascade@1',parameters:{staggerFrames:2,offsetY:7,overshoot:1.04},targetIds:targets,startFrame:start,endFrame:end,importance:'primary',narrationAnchor:null,continuity:null});
try{
 const original=motions.read(projectId,baseId);assert(motions.current(projectId,baseId));
 const board=visuals.read(projectId,original.source.storyboardId),timing=timings.latest(projectId);assert(timing&&!timing.stale);
 const plan=structuredClone(original.plan),s=plan.shots;assert.equal(plan.energyProfile,'intense');
 // The first frame already contains the card and bill. Closing shutters cause the strike and stop.
 s[0].beats=[
  snap('left-shutter-prepare','object-2.shutter-left',0,6,{x:-12,opacity:0},'Prepare the hidden left shutter outside its closing position.','supporting'),
  snap('right-shutter-prepare','object-2.shutter-right',0,6,{x:12,opacity:0},'Prepare the hidden right shutter outside its closing position.','supporting'),
  snap('drive-toward-slot','object-3',2,16,{x:18,y:59},'Drive the recognizable second card into the payment slot in one decisive approach.'),
  snap('left-shutter-close','object-2.shutter-left',8,20,{x:0,opacity:1},'Slide the left shutter closed before the card can enter.','supporting'),
  snap('right-shutter-close','object-2.shutter-right',8,20,{x:0,opacity:1},'Slide the right shutter closed, meeting the left shutter.','supporting'),
  snap('bill-receives-strike','object-2',12,24,{},'The bill housing compresses once at contact and settles.','primary','impact',1.03),
  snap('card-stops-at-block','object-3',16,28,{x:12,y:63},'Stop the rejected approach with one recoil to the approved resting position.','primary','impact'),
  snap('blocked-route-lock','object-6',24,36,{opacity:1},'The closed-route lock resolves after the physical stop.','supporting'),
  punch('inspect-closed-slot','object-2',105,123,1.06,'Inspect the bill restriction as narration asks why another card cannot pay it.'),
  hold('read-opening-question',['object-2','object-3','object-4','object-5','object-6'],125,157,'Let the complete spoken question land over the blocked route.')
 ];
 s[0].textMotions=[text('object-4','underline-draw@1',0,8),text('object-5','highlight-sweep@1',8,20)];
 // Ordinary purchase and bill payment are separate presentations, never a universal network sequence.
 s[1].beats=[
  snap('card-meets-store-reader','object-2',22,34,{x:18,y:47},'Bring the card into the recognizable store reader as the purchase is described.'),
  snap('reader-receives-card','object-1',30,42,{},'The store reader visibly responds to the arriving purchase card.','primary','impact',1.08),
  snap('remove-purchase-view',['object-1','object-2','object-3','object-4','object-5'],64,76,{opacity:0},'Remove the purchase view before showing the different bill-payment route.','supporting'),
  snap('move-attached-rule','object-6',64,76,{x:10,y:28.5,width:46},'Carry the headline rule into the replacement bill composition.','supporting'),
  cascade('assemble-blocked-bill',['object-7','object-8','object-9'],76,88,'Assemble the bill, stopped card and lock as a separate rejected route.'),
  snap('bill-receives-replacement','object-7',88,100,{},'The closed bill housing responds to the stopped card, without an invented network message.','primary','impact',1.04),
  snap('introduce-bill-copy',['object-10','object-11'],88,94,{opacity:1},'Introduce only the two essential replacement text actors.','supporting'),
  hold('read-bill-restriction',['object-7','object-8','object-9','object-10','object-11'],125,152,'Read the settled restriction with its spoken qualification generally.')
 ];
 s[1].textMotions=[text('object-4','word-stagger@1',0,8),text('object-5','mask-rise@1',8,20),text('object-10','word-stagger@1',94,104),text('object-11','blur-resolve@1',104,116)];
 // Present the requested balance to a closed approval gate. Actual relocation occurs only in shot 4.
 s[2].beats=[
  snap('present-transfer-request-card','object-6',24,42,{x:26,y:60},'Present the card with its balance at the separate approval gate.','supporting'),
  snap('present-transfer-request-balance','object-7',24,42,{x:38,y:52},'The same balance parcel approaches the closed gate while remaining with its carrier.'),
  snap('closed-gate-receives-request','object-5',36,48,{},'The closed gate receives the request and stays closed pending the issuer decision.','primary','impact',1.08),
  punch('inspect-transfer-agreement','object-1',80,98,1.1,'Inspect the separate agreement while narration names a balance transfer.'),
  snap('retire-pending-status',['object-8','object-10'],155,161,{opacity:0},'Remove pending lock and approval wording before the accepted state.','supporting'),
  snap('approved-word-appears','object-12',161,167,{opacity:1},'Resolve the issuer-approved state only in the approval phrase.','supporting'),
  snap('issuer-check-lands','object-11',162,174,{opacity:1},'The issuer check lands to acknowledge approval.','primary','impact',1.08),
  snap('approval-opens-gate','object-5',166,178,{x:80,opacity:0},'The issuer decision opens the separate gate; direct bill payment remains a different route.'),
  snap('return-approved-carrier','object-6',178,190,{x:10,y:66},'Return the approved request to its settled issuer-side presentation.','supporting'),
  snap('return-approved-balance','object-7',178,190,{x:19,y:58},'Keep the intact parcel with the carrier; the following scene explains actual relocation.'),
  hold('read-approved-agreement',['object-1','object-6','object-7','object-9','object-11','object-12'],191,200,'Read the issuer approval before the transfer demonstration.')
 ];
 s[2].textMotions=[text('object-9','tracking-settle@1',0,10),text('object-10','blur-resolve@1',12,24),text('object-12','highlight-sweep@1',178,188)];
 // Shot 4 is deliberately untouched: this is the exact human-approved representative mechanism.
 assert.deepEqual(s[3],original.plan.shots[3]);
 // The approved endpoint reorders these two rectangles; preserve their semantic identities.
 s[4].objects.find(o=>o.id==='object-7').endIndex=8;
 s[4].objects.find(o=>o.id==='object-8').endIndex=4;
 s[4].beats=[
  punch('inspect-transfer-terms','object-1',30,48,1.06,'Inspect the separate borrowing arrangement while its own rate is explained.'),
  snap('dock-fee-and-tag',['object-3','object-4'],78,96,{x:58,y:57},'Move the gold fee piece and its icon together onto the existing debt parcel.'),
  snap('principal-receives-fee','object-2',90,102,{},'The parcel receives the attaching fee with one visible landing response; principal remains intact.','primary','impact',1.06),
  snap('total-includes-fee','object-8',98,110,{width:72},'The total rail increases only after the fee attachment, with no invented amount.'),
  snap('retire-general-rate-copy',['object-5','object-6'],134,140,{opacity:0},'Remove general terms copy before showing the conditional promotional case.','supporting'),
  snap('conditional-copy-appears','object-9',140,146,{opacity:1},'Introduce IF PROMO as the narration explicitly makes the rate conditional.','supporting'),
  snap('promo-clock-appears','object-10',155,167,{opacity:1},'Introduce the clock only for the promotional-rate sentence.','supporting'),
  snap('rate-change-word-appears','object-11',174,180,{opacity:1},'Prepare the rate-terms change at promotional expiry.','supporting'),
  snap('carry-rate-rule','object-7',174,186,{width:80},'Keep the decoration attached to the replacement rate wording.','supporting'),
  punch('inspect-promo-deadline','object-10',175,193,1.04,'Inspect the conditional deadline as expiry changes the applicable rate terms.'),
  hold('read-expired-promo',['object-1','object-2','object-3','object-4','object-8','object-9','object-10','object-11'],194,210,'Keep principal and fee separate while the conditional rate change settles.')
 ];
 s[4].textMotions=[text('object-5','word-stagger@1',0,10),text('object-6','highlight-sweep@1',12,24),text('object-9','mask-rise@1',146,154),text('object-11','wipe-reveal@1',180,192)];
 s[5].beats=[
  snap('withdraw-borrowed-cash','object-3',9,21,{x:25,y:44},'Borrowed cash emerges from the credit card at the cash-advance event.'),
  snap('interest-starts-with-advance','object-4',9,23,{width:20},'Begin the cost meter when cash is borrowed, before the bill receives payment.','supporting'),
  snap('cash-funds-payment','object-3',38,53,{x:62,y:53},'Move the borrowed cash to the bill, illustrating an indirect funding route.'),
  snap('bill-receives-borrowed-cash','object-2',47,59,{},'The bill receives the cash token and settles.','primary','impact',1.06),
  snap('retire-advance-copy',['object-6','object-7'],86,92,{opacity:0},'Remove the advance title before explaining its costs.','supporting'),
  snap('introduce-advance-cost-copy',['object-8','object-9'],92,98,{opacity:1},'Introduce fees and interest while the cost meter already runs.','supporting'),
  snap('show-advance-cost','object-4',96,112,{width:33},'Show that fees and interest add cost, without a quoted rate or amount.'),
  hold('read-immediate-costs',['object-1','object-2','object-3','object-4','object-5','object-8','object-9'],130,153,'Let starting that day land without a procedural tutorial.')
 ];
 s[5].textMotions=[text('object-6','word-stagger@1',0,8),text('object-7','tracking-settle@1',8,18),text('object-8','mask-rise@1',98,108),text('object-9','underline-draw@1',112,124)];
 s[6].beats=[
  punch('inspect-empty-original','object-1',20,38,1.08,'Inspect the first card, which has no remaining debt parcel.'),
  snap('retire-paid-off-copy',['object-8','object-9'],52,58,{opacity:0},'Remove the first-card-only wording before the borrower-wide payoff.','supporting'),
  snap('introduce-still-owed-copy',['object-11','object-12'],58,64,{opacity:1},'Resolve the continuing obligation on the second card.','supporting'),
  snap('fee-can-increase-total','object-7',103,115,{width:9},'Expose the fee contribution to total owed while leaving the principal rail unchanged.'),
 ];
 const group=['object-2','object-3','object-4','object-5'];
 for(const [i,id]of group.entries()){
  const o=s[6].objects.find(o=>o.id===id),p=o.initial,zoom=1.1;
  s[6].beats.push(snap(`inspect-held-balance-${i}`,id,78,96,{x:65+(p.x-65)*zoom,y:55+(p.y-55)*zoom,scale:zoom},'Bring the card, intact principal and attached fee forward as one coherent balance inspection.',i===1?'primary':'supporting'));
  s[6].beats.push(snap(`settle-held-balance-${i}`,id,110,128,{x:p.x,y:p.y,scale:1},'Settle the inspected balance without changing principal or removing the fee.',i===1?'primary':'supporting'));
 }
 s[6].beats.push(hold('read-borrower-payoff',s[6].objects.map(o=>o.id),129,142,'Hold the complete borrower-wide result with the debt and fee still visible.'));
 s[6].textMotions=[text('object-8','word-stagger@1',0,10),text('object-9','mask-rise@1',8,20),text('object-11','blur-resolve@1',64,72),text('object-12','pop-settle@1',76,88)];
 for(const shot of s)shot.beats.sort((a,b)=>a.startFrame-b.startFrame);
 assert.deepEqual(plan.shots[3],original.plan.shots[3]);assert.equal(sha(plan.shots[3]),sha(original.plan.shots[3]));
 for(const [index,shot]of plan.shots.entries()){
  const expanded=expandMotionShot(shot),states=new Map(shot.objects.map(o=>[o.id,{...o.initial}]));
  for(const action of expanded.actions)if(action.behavior!=='hold')for(const id of action.targetIds)if(states.has(id))Object.assign(states.get(id),action.to);
  for(const o of shot.objects){const expected=o.endIndex===null?null:board.output.shots[index].endFrame.shapes[o.endIndex],actual=states.get(o.id);if(expected&&['x','y','width','height','color'].some(k=>actual[k]!==expected[k])||expected&&(actual.opacity!==1||actual.scale!==1||actual.rotation!==0)||!expected&&actual.opacity!==0)console.error(JSON.stringify({shot:index,object:o.id,actual,expected}));}
 }
 validateMotion(plan,board,hashMotionSource);for(const shot of plan.shots)expandMotionShot(shot);
 const schedule=scheduleMotion(plan),before=scheduleMotion(original.plan);assert.deepEqual(schedule,before);assert.equal(schedule.durationFrames,1205);
 const request={storyboardId:board.id,baseId,shotId:null,interpreterVersion:'3',energyProfile:'intense',instruction:'Extend the user-approved representative direction across all seven scenes with the exact approved narration, timing and storyboard. Shot 4 remains byte-for-byte unchanged. Other scenes now have causal authored motion rather than placeholders. Mixed regular/bold text and versioned treatments continue throughout. No music, SFX or captions. Preserve qualifications, separate borrowing arrangements and the same debt parcel. Full-sequence human review and final rendering authorization remain pending.'};
 const id=motions.begin(projectId,request,'codex-coordinator-authored');try{motions.complete(projectId,id,plan);}catch(e){motions.fail(projectId,id,e.message);throw e;}
 const current=motions.read(projectId,id);assert.equal(current.source.timingId,original.source.timingId);assert.deepEqual(current.plan.shots[3],original.plan.shots[3]);assert.equal(motions.acceptance(projectId),null);
 const out=join(config.videosDirectory,projectId,'review',`full-motion-plan-${id}`);mkdirSync(out,{recursive:true});
 const receipt={projectId,motionId:id,baseMotionId:baseId,approvedSampleReviewId:'a321b6d5-b4e0-42c9-8423-83764eb08c75',sampleShotIndex:3,originalSampleShotHash:sha(original.plan.shots[3]),currentSampleShotHash:sha(current.plan.shots[3]),sourceUnchanged:JSON.stringify(current.source)===JSON.stringify(original.source),scheduleUnchanged:JSON.stringify(schedule)===JSON.stringify(before),fullSequenceHumanReviewed:false,fullMotionApproved:false,finalRenderAuthorized:false};
 writeFileSync(join(out,'extension-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({...receipt,output:out},null,2));
}finally{timings.close();visuals.close();motions.close();}
