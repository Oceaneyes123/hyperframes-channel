import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion, hashMotionSource } from "../server/motion-store.ts";
import { hydrateMotion } from "../workflow/motion.ts";
import { advancedFixture } from "../tests/fixtures/advanced-motion.ts";
import { conceptFixture } from "../tests/fixtures/visuals.ts";
import { fakeGateway } from "../tests/fixtures/gateway.ts";

if(process.argv.includes("--serve")) {
 await fakeGateway("writing",3106,body=>{
  const context=JSON.parse(body.messages.at(-1)!.content),index=Number(body.messages[0].content.match(/Revise only shotIndex (\d+)/)?.[1]);
  if(!Number.isInteger(index)||!context.board?.shots[index])return {};
  const shot=structuredClone(context.board.shots[index]);shot.action="Fixture application of the registered font expression; preserve the same supplied label and source. No human approval.";return shot;
 });
 console.log("Isolated deterministic Director fixture listening on127.0.0.1:3106; no model calls.");
} else {
 const root=resolve(`.data/advanced-studio-ui-${Date.now()}`);mkdirSync(root,{recursive:true});
 const database=join(root,"database"),videos=join(root,"videos"),studio=openStudio(database,videos),visuals=openVisuals(database,videos),motions=openMotion(database,videos);
 try {
  const project=studio.createProject("SYNTHETIC ONLY — gallery proposal integration"),script=studio.saveScript(project.id,"Suppose this says Review.\nThe same authored word changes weight.\nKeep the source unchanged.",null);studio.acceptScript(project.id,script.id);
  const request={kind:"concepts",scriptId:script.id,baseId:null,selectionId:null,shotIndex:null,instruction:"Automated synthetic software fixture. Not human quality approval."};
  const concepts=visuals.begin(project.id,request,"fixture-model");visuals.complete(project.id,concepts,conceptFixture);const selectionId=visuals.choose(project.id,concepts,0,null);
  const source=advancedFixture("variable-type"),boardId=visuals.begin(project.id,{...request,kind:"storyboard",selectionId},"fixture-model");visuals.complete(project.id,boardId,source.board.output);visuals.accept(project.id,boardId);
  const board=visuals.read(project.id,boardId)!,plan=hydrateMotion(source.generated,board,hashMotionSource,undefined,"3"),motionId=motions.begin(project.id,{storyboardId:boardId,baseId:null,shotId:null,instruction:request.instruction,interpreterVersion:"3"});motions.complete(project.id,motionId,plan);
  writeFileSync(join(root,"seed.json"),JSON.stringify({syntheticOnly:true,humanApproval:false,root,database,videos,projectId:project.id,scriptId:script.id,boardId,motionId},null,2),{flag:"wx"});console.log(root);
 }finally{motions.close();visuals.close();studio.close();}
}
