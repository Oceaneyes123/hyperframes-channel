import { z } from "zod";
import { gsap } from "gsap";
import type { MotionAction } from "./motion.ts";
import type { PartState } from "./components.ts";

export const perspectiveScene = {
  id: "support-depth@1", width: 1000, height: 1000, focalLength: 900, center: [500,500], nearPlane: 300,
  license: "CC0-1.0", source: "Original three-plane schematic customer-support artwork for HyperFrames V3",
  planes: [{id:"processing",z:300},{id:"inquiry",z:0},{id:"foreground",z:-450}],
  subjects: { inquiry: {x:300,y:330,width:180,height:240,z:0}, processing: {x:600,y:330,width:240,height:300,z:300} },
  foreground: {x:-500,y:70,width:950,height:860,z:-450},
  token: {from:{x:390,y:450,z:-5},to:{x:720,y:450,z:295},liftY:280,width:70,height:50},
  camera: {minX:-180,maxX:220,minY:-60,maxY:60,minZ:0,maxZ:120},
  clip: {x:0,y:0,width:1000,height:1000}, occlusion: "far-to-near; foreground intentionally hides part of inquiry before reveal",
} as const;
export const perspectiveHash = "4e3ffb6120f75310d4ee3ea0a6217b9cd8882305a88cfd509ec3d032fac2f3a8";
export const perspectiveReferenceSchema = z.strictObject({id:z.literal(perspectiveScene.id),contentHash:z.literal(perspectiveHash)});
export type PerspectiveReference = z.infer<typeof perspectiveReferenceSchema>;
export type PerspectiveCamera = {x:number;y:number;z:number};
export const depthCameraSchema = z.strictObject({x:z.number().min(-180).max(220),y:z.number().min(-60).max(60),z:z.number().min(0).max(120)});
export function projectPoint(point: {x:number;y:number;z:number}, camera: PerspectiveCamera) {
  depthCameraSchema.parse(camera);
  const distance=perspectiveScene.focalLength+point.z-camera.z;
  if(!Number.isFinite(distance)||distance<perspectiveScene.nearPlane)throw new Error("Perspective near plane exceeded.");
  const scale=perspectiveScene.focalLength/distance;
  return {x:500+(point.x-camera.x-500)*scale,y:500+(point.y-camera.y-500)*scale,scale};
}
export function projectedBox(box: {x:number;y:number;z:number;width:number;height:number},camera:PerspectiveCamera) {
  const p=projectPoint(box,camera);return {x:p.x,y:p.y,width:box.width*p.scale,height:box.height*p.scale};
}
export function requireVisibleFocus(focus:"inquiry"|"processing",camera:PerspectiveCamera) {
  const b=projectedBox(perspectiveScene.subjects[focus],camera),cover=projectedBox(perspectiveScene.foreground,camera);
  if(b.x<0||b.y<0||b.x+b.width>1000||b.y+b.height>1000)throw new Error("Projected focal subject exceeds the fixed viewport.");
  if(b.x<cover.x+cover.width&&b.x+b.width>cover.x&&b.y<cover.y+cover.height&&b.y+b.height>cover.y)throw new Error("Foreground unexpectedly occludes the focal subject.");
  return b;
}
export function perspectivePose(initial:PartState,actions:MotionAction[],frame:number) {
  const pose={cameraX:initial.cameraX!,cameraY:initial.cameraY!,cameraZ:initial.cameraZ!,depthProgress:initial.depthProgress!};
  for(const action of actions)if(frame>=action.startFrame&&["cameraX","cameraY","cameraZ","depthProgress"].some(field=>action.to[field as keyof typeof action.to]!==undefined)){const t=gsap.parseEase(action.ease)(Math.min(1,(frame-action.startFrame)/(action.endFrame-action.startFrame)));for(const field of ["cameraX","cameraY","cameraZ","depthProgress"] as const)if(action.to[field]!==undefined)pose[field]+=(action.to[field]!-pose[field])*t;}
  return {camera:{x:pose.cameraX,y:pose.cameraY,z:pose.cameraZ},progress:pose.depthProgress};
}
export function perspectiveTarget(focus:"inquiry"|"processing") {return {x:focus==="inquiry"?160:220,y:0,z:focus==="inquiry"?0:120};}
export function tokenPoint(progress:number) {
  if(!Number.isFinite(progress)||progress<0||progress>1)throw new Error("Invalid depth handoff progress.");
  const {from,to,liftY}=perspectiveScene.token;
  if(progress<.25)return {x:from.x,y:from.y+(liftY-from.y)*progress*4,z:from.z};
  if(progress>.75)return {x:to.x,y:liftY+(to.y-liftY)*(progress-.75)*4,z:to.z};
  const t=(progress-.25)*2;return {x:from.x+(to.x-from.x)*t,y:liftY,z:from.z+(to.z-from.z)*t};
}
export const perspectiveGuidance = "perspective-scene@1 requires the exact support-depth@1 perspective reference, square artwork and one visible fixed camera part. cameraX/Y/Z are illustration-pixel positions, explicit in both drawings, limited to x[-180,220],y[-60,60],z[0,120]; camera part also has explicit depthProgress0..1. Original three-plane support scene uses focalLength900, center500,500, nearPlane300, fixed viewport clipping and far-to-near occlusion. Not a general 3D engine or technical diagram. Presets18..90frames: depth-push@1 {focus:processing,toZ:0..120}, parallax-pan@1 {toX,toY}, depth-reveal@1 {subject:inquiry} from rest, perspective-reframe@1 {focus:inquiry|processing}, depth-handoff@1 {from:inquiry,to:processing} once, after inquiry reveal. Same inquiry token travels between fixed depths; no automatic approval. Root transforms compose normally. No text/connector topology is put in perspective; explain outside the artwork. Foreground clipping is intentional, focal subject bounds must stay inside viewport after each action.";
