import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { graphicReference } from "../workflow/graphic-assets.ts";
import { componentParts } from "../workflow/components.ts";
import { visualArtifactSchema, type Frame } from "../workflow/visuals.ts";
import { hydrateMotion, validateMotion, scheduleMotion, motionBeatSchema } from "../workflow/motion.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { mixAudioLayer } from "../server/audio-layer.ts";
import { isTrustedScene } from "../workflow/trusted-scenes.ts";
import { pcm16Data, inspectWav } from "../server/wav.ts";
import { rhythmReport } from "./rhythm-report.ts";

const hash=(bytes:string|Buffer)=>createHash("sha256").update(bytes).digest("hex");
const ranges=[0,39,84,169,197,240,271,324,395,450];
const chunks=["Would you trust this AI", "with the send button?", "OpenAI’s new GPT-6.1", "Terra promises", "faster computer", "work at", "lower token prices.", "It launched October twenty-sixth", "for Work, Codex and the API."];
const ids=["elastic-token@1","message-transform@1","processor-editorial@1","message-transform@1","parallax-workspace@1","computer-editorial@1","price-tag-motion@1","signal-burst@1","loop-handoff@1"];
const labels=["","","","Terra","","","","26 OCT","Work · Codex · API"];
const backgrounds=["#F7F3E9","#C6DED3","#203B3A","#FFFDF8","#F7F3E9","#F1D7C7","#FFFDF8","#C6DED3","#F7F3E9"];

export function buildRetentionCandidate(source: unknown, sourceScript: string) {
  const original=visualArtifactSchema.parse(source); if(original.output.kind!=="storyboard")throw new Error("Source storyboard required.");
  const first=sourceScript.split("\n").slice(0,3); first[2]=first[2].split(" It isn’t")[0];
  assert.equal(chunks.join(" "),first.join(" "),"Review segmentation changed the source wording.");
  const projectId=randomUUID(),scriptId=randomUUID();
  const shots=chunks.map((narration,index)=>{
    const asset=graphicReference(ids[index]),trusted=isTrustedScene(ids[index]);
    const shape:Frame["shapes"][number]={type:"graphic-asset@2",asset,label:"",x:6,y:index===0?12:index===3?32:index===6?14:20,width:88,height:49.5,color:"#D9633F"};
    shape.parts=componentParts("graphic-asset@2",shape.color,undefined,shape);
    for(const state of Object.values(shape.parts))Object.assign(state,{opacity:1,reveal:1});
    if(trusted)shape.parts.motion.reveal=0;
    const start:Frame={background:backgrounds[index],shapes:[]};
    if(index===2)start.shapes.push({type:"rect",label:"",x:8,y:20,width:84,height:54,color:"#F7F3E9"});
    start.shapes.push(shape);
    if(labels[index])start.shapes.push({type:"heading",label:labels[index],typography:"inter-heading@1",x:8,y:index===3?24:index===7?70:index===8?12:13,width:84,height:9,color:index===2?"#FFFDF8":"#203B3A"});
    const end=structuredClone(start);
    if(trusted){end.shapes[index===2?1:0].parts!.motion.reveal=1;if(ranges[index+1]-ranges[index]>60)end.shapes[index===2?1:0].x=10;}
    else {end.shapes[index===2?1:0].x=10;}
    return {lineNumbers:[index+1],seconds:(ranges[index+1]-ranges[index])/30,purpose:narration,framing:"Object-led portrait teaching",subject:ids[index],action:trusted?"Play the registered authored scene and hold its result.":"Reframe the supplied object to show its role.",transition:index?"hard-cut" as const:"start" as const,continuity:"Preserve the narrated information through each concrete state change.",startFrame:start,endFrame:end};
  });
  const board=visualArtifactSchema.parse({...original,schemaVersion:2,id:randomUUID(),projectId,scriptId,scriptHash:hash(chunks.join("\n")),output:{kind:"storyboard",shots}});
  const generated={shots:shots.map((drawing,index)=>{
    const durationFrames=ranges[index+1]-ranges[index],hero=index===2?1:0,objectId=`object-${hero+1}`,trusted=isTrustedScene(ids[index]);
    const beat=motionBeatSchema.parse({id:"develop",purpose:drawing.purpose,type:"transformation",targetIds:[trusted?`${objectId}.motion`:objectId],startFrame:0,endFrame:Math.max(12,durationFrames-13),importance:"primary",narrationAnchor:{kind:"word",lineNumber:index+1,anchorId:`word-${index+1}`},continuity:null,presetId:trusted?"scene-play@1":"snap-overshoot@1",parameters:trusted?{}:{to:{x:10},anticipation:.94,overshoot:1.04}});
    const beats=[beat];
    if(durationFrames>60)beats[0].endFrame=42;
    if(durationFrames>60)beats.push(motionBeatSchema.parse({id:"receiving-focus",purpose:"Follow the same information into its result.",type:"emphasis",targetIds:[objectId],startFrame:46,endFrame:durationFrames-13,importance:"supporting",narrationAnchor:null,continuity:null,presetId:"snap-overshoot@1",parameters:{to:{x:10},anticipation:.94,overshoot:1.04}}));
    const holdStart=Math.max(...beats.map(b=>b.endFrame))+1;
    return {durationFrames,camera:{x:0,y:0,scale:1,rotation:0},incoming:{type:drawing.transition,overlapFrames:0,presentation:"cut",anchor:null},objects:drawing.startFrame.shapes.map((_,i)=>({id:`object-${i+1}`,startIndex:i,endIndex:i})),beats:[...beats,motionBeatSchema.parse({id:"read",purpose:"Read the settled state.",type:"hold",presetId:"hold@1",parameters:{},targetIds:[objectId],startFrame:holdStart,endFrame:durationFrames-1,importance:"supporting",narrationAnchor:null,continuity:null})]};
  })};
  const plan=hydrateMotion(generated,board,hashMotionSource,undefined,"3","intense");
  validateMotion(plan,board,hashMotionSource);assert.equal(scheduleMotion(plan).durationFrames,450);
  return {board,plan,script:chunks.join("\n"),ranges};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const root="output/retention-experiment/project-v2";
  const originalMotion=JSON.parse(readFileSync("videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/motion/370b9586-071f-4c52-a1a2-298a59f671c1.json","utf8"));
  const sourceBoard=JSON.parse(readFileSync("videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/visuals/f85221d8-88c8-48ff-95b5-de06fe408079.json","utf8"));
  const sourceScript=JSON.parse(readFileSync("videos/48fac465-c64f-4ad4-afdf-47d41cf6c0b9/scripts/e60b250e-599b-4892-a6e9-f480f4382c96.json","utf8")).content;
  const candidate=buildRetentionCandidate(sourceBoard,sourceScript);
  mkdirSync(root,{recursive:false});
  const sourceAudio="output/terra-61-investigation/voice-review/qwen-ryan-complete.wav",audio=readFileSync(sourceAudio),measured=inspectWav(audio);
  const wav=join(root,"narration.wav");execFileSync("ffmpeg",["-v","error","-i",sourceAudio,"-t","15","-c:a","pcm_s16le",wav]);
  const excerpt=readFileSync(wav);assert.deepEqual(pcm16Data(excerpt),pcm16Data(audio).subarray(0,15*measured.sampleRate*measured.channels*2));
  const alignment=JSON.parse(readFileSync("output/retention-experiment/forced-alignment.json","utf8"));
  assert.equal(alignment.audioHash,hash(audio));
  const cues=candidate.ranges.slice(0,-1).map((frame,i)=>({frame:Math.max(1,frame),sound:i===7?"chime":i===6?"click":i%2?"pop":"whoosh"}));
  const mix=await mixAudioLayer(excerpt,{enabled:true,music:true,cues,seed:17,targetLufs:-16},join(root,"audio"));
  const anchors=candidate.ranges.slice(0,-1).map((frame,i)=>{const word=alignment.words.find((word:{startFrame:number})=>word.startFrame===frame);assert.ok(word,"Missing measured boundary word");return{...word,id:`word-${i+1}`,sourceLineNumber:word.lineNumber,lineNumber:i+1,kind:"word",reviewedByHuman:false};});
  for(const [name,value]of Object.entries({"board.json":candidate.board,"motion.json":candidate.plan,"anchors.json":anchors,"candidate-rhythm.json":rhythmReport(candidate.plan,candidate.board),"baseline-rhythm-full.json":rhythmReport(originalMotion.plan,sourceBoard)}))writeFileSync(join(root,name),JSON.stringify(value,null,2),{flag:"wx"});
  writeFileSync(join(root,"script.txt"),candidate.script,{flag:"wx"});
  writeFileSync(join(root,"manifest.json"),JSON.stringify({reviewOnly:true,productionGates:false,humanApproval:false,frames:450,fps:30,sourceAudioHash:hash(audio),excerptAudioHash:hash(excerpt),mixedAudioHash:hash(mix.bytes),sourceVideo:"output/terra-61-investigation/terra-61-final.mp4",sourceVideoHash:hash(readFileSync("output/terra-61-investigation/terra-61-final.mp4")),sourceScriptHash:alignment.scriptHash,ranges:candidate.ranges,audio:mix.report,alignment:"../forced-alignment.json"},null,2),{flag:"wx"});
  console.log(JSON.stringify({output:root,frames:450,narrationSamplesPreserved:true,mix:mix.report}));
}
