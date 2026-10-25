import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {bundle} from '@remotion/bundler';
import {renderStill,renderMedia,selectComposition} from '@remotion/renderer';
import {readConfig} from '../../../server/config.ts';
import {openMotion,hashMotionSource} from '../../../server/motion-store.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {validateMotion,scheduleMotion} from '../../../workflow/motion.ts';
import {validateTiming} from '../../../workflow/production.ts';
import {inspectCreativeMotion} from '../../../engine/quality/inspect-motion.ts';
import {hashEngine} from '../../../server/production-store.ts';
import {verifyAudioSync} from '../../../server/render.ts';

const root=resolve('.planning/deepseek-v41-flash-short/redesign-v1');
const receipt=JSON.parse(readFileSync(join(root,'proposal-receipt.json'),'utf8'));
const config=readConfig(),motions=openMotion(config.dataDirectory,config.videosDirectory),visuals=openVisuals(config.dataDirectory,config.videosDirectory);
let motion,board;
try {
 motion=motions.read(receipt.projectId,receipt.motionId);
 board=visuals.read(receipt.projectId,receipt.storyboardId);
 assert(motion&&motions.current(receipt.projectId,motion.id));
 assert.equal(visuals.acceptance(receipt.projectId).runId,board.id);
 assert.notEqual(motions.acceptance(receipt.projectId)?.runId,motion.id,'Review must not infer motion approval');
}finally{motions.close();visuals.close();}
validateMotion(motion.plan,board,hashMotionSource);
const schedule=scheduleMotion(motion.plan);
assert.equal(schedule.durationFrames,2100);
const timing=JSON.parse(readFileSync('.data/deepseek-short-eec7f710/line-timing.json','utf8'));
validateTiming(timing,motion.plan,timing.map(line=>({number:line.number})));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const engineHash=hashEngine();
mkdirSync(join(root,'motion-review'),{recursive:true});
const output=join(root,'motion-review',motion.id);mkdirSync(output,{recursive:false});
const audio=readFileSync('.data/deepseek-short-eec7f710/narration.wav');
const inputProps={plan:motion.plan,board,narrationUrl:`data:audio/wav;base64,${audio.toString('base64')}`};
const serveUrl=await bundle({entryPoint:resolve('engine/register.tsx'),webpackOverride:config=>({...config,cache:false})});
const browserExecutable=process.env.V3_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const composition=await selectComposition({serveUrl,id:'Production',inputProps,browserExecutable});
const frames=[...new Set(schedule.shots.flatMap(shot=>[shot.startFrame,Math.min(shot.endFrame-1,shot.startFrame+Math.floor(shot.durationFrames*.55)),shot.endFrame-1]))];
for(const frame of frames){
 await renderStill({serveUrl,composition,inputProps,browserExecutable,frame,imageFormat:'png',output:join(output,`frame-${frame}.png`)});
}
const seeks=[];
for(const frame of [1079,0,1245,749,2099,1079]){
 const path=join(output,`seek-${seeks.length}.png`);
 await renderStill({serveUrl,composition,inputProps,browserExecutable,frame,imageFormat:'png',output:path});
 assert.equal(hash(readFileSync(path)),hash(readFileSync(join(output,`frame-${frame}.png`))),'Fresh seek must reproduce the same frame');
 seeks.push({frame,sha256:hash(readFileSync(path))});
}
const settled=schedule.shots.flatMap(shot=>['-i',join(output,`frame-${shot.endFrame-1}.png`)]);
const tiles=schedule.shots.map((_,i)=>`[${i}:v]scale=216:384[s${i}]`);
execFileSync('ffmpeg',['-v','error',...settled,'-filter_complex',`${tiles.join(';')};${schedule.shots.map((_,i)=>`[s${i}]`).join('')}xstack=inputs=10:layout=${schedule.shots.map((_,i)=>`${i%5*216}_${Math.floor(i/5)*384}`).join('|')}`,'-frames:v','1',join(output,'settled-contact.png')],{stdio:'pipe'});
let last=-1;
console.log('Rendering 360×640 narrated review copy; no production gates or final export.');
await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',crf:18,pixelFormat:'yuv420p',scale:1/3,concurrency:2,outputLocation:join(output,'review.mp4'),onProgress:progress=>{const percent=Math.floor(progress.progress*10)*10;if(percent>last){last=percent;console.log(`Review render ${percent}%`);}}});
const metadata=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',join(output,'review.mp4')],{encoding:'utf8'}));
const video=metadata.streams.find(stream=>stream.codec_type==='video');
assert.equal(video.width,360);assert.equal(video.height,640);assert.equal(video.r_frame_rate,'30/1');assert.equal(Number(video.nb_frames),2100);assert(metadata.streams.some(stream=>stream.codec_type==='audio'));
execFileSync('ffmpeg',['-v','error','-i',join(output,'review.mp4'),'-f','null','-'],{stdio:'pipe'});
assert.equal(hashEngine(),engineHash,'Preserve review and retry if engine changed');
const audioSync=await verifyAudioSync(resolve('.data/deepseek-short-eec7f710/narration.wav'),join(output,'review.mp4'));
const proof={motionId:motion.id,storyboardId:board.id,reviewOnly:true,humanMotionApproval:false,productionExport:false,frames:2100,seconds:70,width:360,height:640,fps:30,fullDecode:true,narrationHash:hash(audio),audioSync,engineHash,freshSeeks:seeks,motionQuality:inspectCreativeMotion(motion.plan,board)};
writeFileSync(join(output,'verification.json'),JSON.stringify(proof,null,2)+'\n');
writeFileSync(join(root,'motion-review-receipt.json'),JSON.stringify({motionId:motion.id,output,reviewPath:join(output,'review.mp4'),verificationPath:join(output,'verification.json')},null,2)+'\n');
console.log(JSON.stringify({output,frames:2100,reviewOnly:true}));
