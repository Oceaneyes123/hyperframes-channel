import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { advancedCases, advancedFixture } from "./fixtures/advanced-motion.ts";
import { fakeGateway } from "./fixtures/gateway.ts";
import { conceptFixture } from "./fixtures/visuals.ts";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion } from "../server/motion-store.ts";
import { generateMotion } from "../server/motion.ts";
import { generateVisuals } from "../server/visuals.ts";
import { readConfig } from "../server/config.ts";
import { capabilityDirection } from "../workflow/examples/kinetic.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";

test("all eight Directors preserve source-bound full/scoped immutable proposals and reject bad/stale output", async () => {
 for(const item of advancedCases) {
  const root=mkdtempSync(join(tmpdir(),`v3-director-${item.category}-`)), config=readConfig({V3_DATA_DIR:join(root,"database"),V3_VIDEOS_DIR:join(root,"videos")});
  const studio=openStudio(config.dataDirectory,config.videosDirectory),visuals=openVisuals(config.dataDirectory,config.videosDirectory),motions=openMotion(config.dataDirectory,config.videosDirectory);
  const source=advancedFixture(item.example);if(source.board.output.kind!=="storyboard")throw Error();
  let mode="full",selected=source.plan.shots[1];
  const guidanceRecords: string[] = [];
  const gateway=await fakeGateway("writing",0,body=>{
   const guidance=body.messages.map(message=>message.content).join("\n");
   guidanceRecords.push(guidance);
   if(mode.startsWith("visual")) {
    const shot=structuredClone(source.board.output.kind==="storyboard"?source.board.output.shots[1]:null)!;shot.action+=" Preserve the exact source identity.";
    shot.design ??= { theme: "editorial-workflow@1", family: "visual-comparison", meaning: "Explain the synthetic example.", metaphor: "Follow the example.", focalPoint: "Primary subject", layout: "Centered", density: "balanced", continuityReason: "Carry the same example." };
    if(mode==="visual-invalid")shot.startFrame.shapes[0].parts={unknown:{x:0,y:0,scale:1,opacity:1,color:"#244E42"}};
    return shot;
   }
   if(mode==="full")return source.generated;
   const scoped={camera:selected.camera,durationFrames:selected.durationFrames,incoming:selected.incoming,beats:structuredClone(selected.beats!),...(selected.textMotions?{textMotions:selected.textMotions}:{})};
   scoped.beats[0].purpose="Emphasize the same approved mechanism while preserving source identity.";
   if(mode==="invalid")scoped.beats[0].targetIds=["unknown"];
   return scoped;
  });
  config.gateway={baseUrl:gateway.baseUrl,model:"fixture-model",apiKey:undefined};
  try {
   const project=studio.createProject(`SYNTHETIC ${item.category} Director audit; no human approval`),script=studio.saveScript(project.id,"Suppose this is the supplied example.\nFollow the same information.\nReview its source before acting.",null);studio.acceptScript(project.id,script.id);
   const request={kind:"concepts",scriptId:script.id,selectionId:null,baseId:null,shotIndex:null,instruction:"Automated synthetic integration fixture only."};
   const concepts=visuals.begin(project.id,request,"fixture-model");visuals.complete(project.id,concepts,conceptFixture);const selectionId=visuals.choose(project.id,concepts,0,null);
   const boardRequest={...request,kind:"storyboard",selectionId};const boardId=visuals.begin(project.id,boardRequest,"fixture-model");visuals.complete(project.id,boardId,source.board.output);visuals.accept(project.id,boardId);
   const input={storyboardId:boardId,baseId:null,shotId:null,instruction:capabilityDirection(item.example),interpreterVersion:"3",energyProfile:"balanced"};
   const id=await generateMotion(project.id,input,new AbortController().signal,()=>{},config),base=motions.read(project.id,id)!;motions.decide(project.id,id,"accept");
   const path=join(config.videosDirectory,project.id,"motion",`${id}.json`),bytes=readFileSync(path);selected=base.plan.shots[1];
   mode="scoped";const scopedInput={...input,baseId:id,shotId:selected.id},childId=await generateMotion(project.id,scopedInput,new AbortController().signal,()=>{},config),child=motions.read(project.id,childId)!;
   assert.deepEqual(child.plan.shots[0],base.plan.shots[0]);assert.deepEqual(child.plan.shots[2],base.plan.shots[2]);assert.deepEqual(readFileSync(path),bytes);assert.equal(motions.acceptance(project.id)!.runId,id);
   mode="invalid";await assert.rejects(generateMotion(project.id,{...scopedInput,baseId:childId},new AbortController().signal,()=>{},config));assert.equal(motions.list(project.id)[0].status,"failed");assert.deepEqual(readFileSync(path),bytes);
   const board=visuals.read(project.id,boardId)!;mode="visual";
   const visualInput={...boardRequest,kind:"shot",baseId:boardId,shotIndex:1,instruction:capabilityDirection(item.example)},visualId=await generateVisuals(project.id,visualInput,new AbortController().signal,()=>{},config),revised=visuals.read(project.id,visualId)!;
   if(board.output.kind!=="storyboard"||revised.output.kind!=="storyboard")throw Error();
   assert.deepEqual(revised.output.shots[0],board.output.shots[0]);assert.deepEqual(revised.output.shots[2],board.output.shots[2]);assert.equal(visuals.acceptance(project.id)!.runId,boardId);assert.equal(visuals.acceptance(project.id)!.stale,true);
   mode="visual-invalid";await assert.rejects(generateVisuals(project.id,{...visualInput,baseId:visualId},new AbortController().signal,()=>{},config));
   studio.saveScript(project.id,script.content+"\nA source correction.",script.id);
   assert.throws(()=>motions.decide(project.id,childId,"accept"));assert.throws(()=>visuals.accept(project.id,visualId));
   assert.ok(inspectCreativeMotion(base.plan,board));
   for(const guidance of guidanceRecords) for(const registered of ["odometer-roll@1","text-layout-morph@1","ui-state-transition@1","character-look@1","morph-chain-step@1","editorial-collage@1","depth-push@1","font-expression@1"]) assert.ok(guidance.includes(registered),`${item.category}: missing Director guidance ${registered}`);
  }catch(error){console.error(item.category,error);throw error;}finally{await gateway.close();motions.close();visuals.close();studio.close();rmSync(root,{recursive:true,force:true});}
 }
});

test("gallery direction stays bounded and never imports synthetic facts",()=>{
 for(const item of advancedCases){const direction=capabilityDirection(item.example,"Preserve this exact source instruction.");assert.ok(direction.length<=2000);assert.match(direction,/Never copy hypothetical gallery numbers/);assert.match(direction,/visual proposal before motion planning/);assert.throws(()=>capabilityDirection(item.example,"x".repeat(2000)),/Shorten/);}
});
