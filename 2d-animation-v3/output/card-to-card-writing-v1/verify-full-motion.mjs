import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
import sharp from 'sharp';
import {readConfig} from '../../server/config.ts';
import {openVisuals} from '../../server/visual-store.ts';
import {openMotion} from '../../server/motion-store.ts';
import {openTiming} from '../../server/timing-store.ts';
import {verifyAudioSync} from '../../server/render.ts';
import {scheduleMotion} from '../../workflow/motion.ts';
const run=promisify(execFile),projectId='5a474ca9-fb23-4989-a680-9ca755d3fc0f';
const out=resolve(process.argv[2]),report=JSON.parse(readFileSync(join(out,'review.json'),'utf8')),video=join(out,'review.mp4'),checks=join(out,'verification');mkdirSync(checks,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(report.scope,'all-shots');assert.equal(report.humanApproval,false);assert.equal(report.files[0].sha256,hash(readFileSync(video)));
const results=await Promise.allSettled([run('ffprobe',['-v','error','-show_streams','-of','json',video]),run('ffmpeg',['-v','error','-i',video,'-f','null','-'])]);for(const result of results)if(result.status==='rejected')throw result.reason;
const streams=JSON.parse(results[0].value.stdout).streams,v=streams.find(s=>s.codec_type==='video'),a=streams.find(s=>s.codec_type==='audio');assert.equal(streams.length,2);assert.equal(v.width,360);assert.equal(v.height,640);assert.equal(v.r_frame_rate,'30/1');assert.equal(Number(v.nb_frames),1205);assert(a);assert(Math.abs(Number(v.duration)-1205/30)<1/30);
const config=readConfig(),motions=openMotion(config.dataDirectory,config.videosDirectory),visuals=openVisuals(config.dataDirectory,config.videosDirectory),timings=openTiming(config.dataDirectory,config.videosDirectory);let artifact,board,voice;
try{artifact=motions.read(projectId,report.artifactId);board=visuals.read(projectId,artifact.source.storyboardId);voice=timings.audio(projectId,artifact.source.timingId);assert(motions.current(projectId,artifact.id));assert.equal(motions.acceptance(projectId),null);}finally{timings.close();visuals.close();motions.close();}
assert.equal(hash(voice),report.audioHash);const raw=join(checks,'approved-full-source.wav');writeFileSync(raw,voice,{flag:'wx'});const audio=await verifyAudioSync(raw,video);
const schedule=scheduleMotion(artifact.plan);assert.equal(schedule.durationFrames,1205);
const phases=[[0,11,20,28,158],[0,34,42,76,88,116,153],[0,42,48,166,178,190,201],[0,53,62,69,111,178],[0,89,102,110,146,167,192,211],[0,21,47,53,112,154],[0,38,76,96,115,128,143]];
const frames=[...new Set(phases.flatMap((list,i)=>list.map(frame=>schedule.shots[i].startFrame+frame)))].sort((a,b)=>a-b),comparisons=[];
const serveUrl=await bundle({entryPoint:resolve('engine/register.tsx'),publicDir:resolve('public')});
const inputProps={plan:artifact.plan,board,narrationUrl:`data:audio/wav;base64,${voice.toString('base64')}`};const browserExecutable=process.env.V3_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await openBrowser('chrome',{browserExecutable});
try{
 const composition=await selectComposition({serveUrl,id:'Production',inputProps,browserExecutable,puppeteerInstance:browser});
 for(const frame of frames){
  const fresh=join(checks,`fresh-${frame}.png`),encoded=join(checks,`encoded-${frame}.png`);
  await renderStill({serveUrl,composition,inputProps,browserExecutable,puppeteerInstance:browser,frame,imageFormat:'png',scale:1/3,output:fresh});
  await run('ffmpeg',['-v','error','-i',video,'-vf',`select=eq(n\\,${frame})`,'-frames:v','1',encoded]);
  const result=await run('ffmpeg',['-v','info','-i',encoded,'-i',fresh,'-filter_complex','[0:v]format=yuv420p[a];[1:v]format=yuv420p[b];[a][b]ssim','-f','null','-']);const match=result.stderr.match(/All:([0-9.]+)/);assert(match);const ssim=Number(match[1]);assert(ssim>=.98,`Fresh-seek mismatch at ${frame}: ${ssim}`);comparisons.push({frame,ssim});
  if(comparisons.length%10===0)console.log(JSON.stringify({checked:comparisons.length,total:frames.length}));
 }
 for(const frame of [568,0,694,515,1204,568]){
  const repeated=join(checks,`repeat-${frame}-${Date.now()}.png`);await renderStill({serveUrl,composition,inputProps,browserExecutable,puppeteerInstance:browser,frame,imageFormat:'png',scale:1/3,output:repeated});
  if(frames.includes(frame))assert(readFileSync(repeated).equals(readFileSync(join(checks,`fresh-${frame}.png`))));
  else {const first=join(checks,`repeat-reference-${frame}.png`);try{assert(readFileSync(repeated).equals(readFileSync(first)));}catch(error){if(error.code!=='ENOENT')throw error;writeFileSync(first,readFileSync(repeated),{flag:'wx'});}}
 }
}finally{await browser.close({silent:true});}
const strips=[];
for(let i=0;i<7;i++){
 const picked=phases[i].slice(0,5).map(frame=>schedule.shots[i].startFrame+frame),tiles=[];
 for(const [j,frame]of picked.entries()){const buffer=await sharp(join(checks,`encoded-${frame}.png`)).resize(180,320).png().toBuffer();tiles.push({input:buffer,left:j*180,top:0});}
 const file=`scene-${i+1}-phases.png`;await sharp({create:{width:900,height:320,channels:3,background:'#F4E9D5'}}).composite(tiles).png().toFile(join(checks,file));strips.push({file,shotIndex:i,globalFrames:picked});
}
const seams=schedule.shots.slice(1).map((shot,i)=>({boundaryFrame:shot.startFrame,previousEnd:shot.startFrame-1,nextStart:shot.startFrame,previousShot:i,nextShot:i+1}));
for(const [i,seam]of seams.entries())await sharp({create:{width:720,height:640,channels:3,background:'#F4E9D5'}}).composite([{input:join(checks,`encoded-${seam.previousEnd}.png`),left:0,top:0},{input:join(checks,`encoded-${seam.nextStart}.png`),left:360,top:0}]).png().toFile(join(checks,`seam-${i+1}.png`));
const result={reviewId:basename(out),projectId,motionId:artifact.id,frames:1205,seconds:1205/30,width:360,height:640,fps:30,fullDecode:true,audio,comparedFrames:comparisons.length,comparisons,minimumSsim:Math.min(...comparisons.map(c=>c.ssim)),threshold:.98,repeatedSeeks:[568,0,694,515,1204,568],repeatedSeekExact:true,seams,strips,humanFullReview:false,motionAccepted:false,finalRenderAuthorized:false};
writeFileSync(join(checks,'verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
writeFileSync(join(checks,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Full motion inspection</title><style>body{font:16px/1.5 Arial;margin:24px;background:#eee9df;color:#172d38}video{width:360px;max-width:100%}img{max-width:100%;height:auto}section{margin:32px 0}</style><h1>Full motion inspection</h1><p>Native narrated review at normal speed. Static phase/seam checks are supporting evidence, not human motion approval.</p><video controls playsinline preload="metadata" src="../review.mp4"></video>${strips.map(s=>`<section><h2>Scene ${s.shotIndex+1}</h2><img src="${s.file}" alt="Scene ${s.shotIndex+1} key phases"><p>Global frames ${s.globalFrames.join(', ')}</p></section>`).join('')}${seams.map((s,i)=>`<section><h2>Seam ${i+1}: ${s.previousEnd} / ${s.nextStart}</h2><img src="seam-${i+1}.png" alt="Adjacent scene seam"></section>`).join('')}</html>`,{flag:'wx'});
console.log(JSON.stringify({reviewId:result.reviewId,motionId:result.motionId,output:out,audio,comparedFrames:result.comparedFrames,minimumSsim:result.minimumSsim,repeatedSeekExact:true,seams:seams.length},null,2));
