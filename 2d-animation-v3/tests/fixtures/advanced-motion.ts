import { kineticExample, type KineticExampleId } from "../../workflow/examples/kinetic.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { hydrateMotion } from "../../workflow/motion.ts";

export const advancedCases = [
  {category:"numeric",example:"rolling-value"}, {category:"layout",example:"text-layout"},
  {category:"ui",example:"ui-workflow"}, {category:"rig",example:"character-rig"},
  {category:"morph",example:"document-checklist"}, {category:"collage",example:"collage"},
  {category:"camera",example:"perspective"}, {category:"font",example:"variable-type"},
] as const satisfies readonly {category:string;example:KineticExampleId}[];
export function advancedFixture(example: KineticExampleId, copies = 3) {
  const source=kineticExample(example), board=structuredClone(source.board);
  if(board.output.kind!=="storyboard")throw Error("Expected synthetic board");
  const first=structuredClone(board.output.shots[0]);
  board.output.shots=Array.from({length:copies},(_,index)=>({...structuredClone(first),lineNumbers:[index+1],transition:index?"hard-cut":"start"}));
  const generated={shots:board.output.shots.map(drawing=>{const shot=source.plan.shots[0];return {durationFrames:shot.durationFrames,camera:shot.camera,incoming:{...shot.incoming,type:drawing.transition,anchor:null,overlapFrames:0,presentation:"cut"},beats:shot.beats,objects:shot.objects.map(({id,startIndex,endIndex})=>({id,startIndex,endIndex})),...(shot.textMotions?{textMotions:shot.textMotions}:{})};})};
  return {board,generated,plan:hydrateMotion(generated,board,hashMotionSource,undefined,"3")};
}

export function advancedAuditSequence() {
  const scenes=advancedCases.map(item=>advancedFixture(item.example,1)),board=structuredClone(scenes[0].board);
  if(board.output.kind!=="storyboard")throw Error();
  board.output.shots=scenes.map((scene,index)=>{if(scene.board.output.kind!=="storyboard")throw Error();return {...scene.board.output.shots[0],lineNumbers:[index+1],transition:index?"hard-cut":"start"};});
  const generated={shots:scenes.map((scene,index)=>({...scene.generated.shots[0],incoming:{...scene.generated.shots[0].incoming,type:index?"hard-cut":"start"}}))};
  return {board,plan:hydrateMotion(generated,board,hashMotionSource,undefined,"3")};
}
