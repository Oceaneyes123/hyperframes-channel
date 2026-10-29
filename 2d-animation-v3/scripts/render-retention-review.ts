import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderFrames, renderStill, selectComposition, stitchFramesToVideo } from "@remotion/renderer";
import { verifyExport, verifyPreviewFrames, verifyAudioSync } from "../server/render.ts";
import { hashEngine } from "../server/production-store.ts";

const mode=process.argv[2];
if(!["probe","render-review-only"].includes(mode))throw new Error("Choose probe or render-review-only. This tool never creates production records or gates.");
const root=resolve("output/retention-experiment/project-v2"),manifest=JSON.parse(readFileSync(join(root,"manifest.json"),"utf8"));
assert.equal(manifest.reviewOnly,true);assert.equal(manifest.productionGates,false);assert.equal(manifest.frames,450);
const plan=JSON.parse(readFileSync(join(root,"motion.json"),"utf8")),board=JSON.parse(readFileSync(join(root,"board.json"),"utf8"));
const audio=readFileSync(join(root,"audio/mix.wav"));assert.equal(createHash("sha256").update(audio).digest("hex"),manifest.mixedAudioHash);
const inputProps={plan,board,narrationUrl:`data:audio/wav;base64,${audio.toString("base64")}`};
const serveUrl=await bundle({entryPoint:resolve("engine/register.tsx"),publicDir:resolve("public")});
const browserExecutable=process.env.V3_CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe";
const composition=await selectComposition({serveUrl,id:"Production",inputProps,browserExecutable});assert.equal(composition.durationInFrames,450);
const options={serveUrl,composition,inputProps,browserExecutable};
const seeks=[0,30,70,120,180,220,260,300,350,420,449];
if(mode==="probe"){
  const probe=join(root,"probe");mkdirSync(probe,{recursive:false});
  for(const frame of seeks)await renderStill({...options,frame,scale:1/3,imageFormat:"png",output:join(probe,`frame-${String(frame).padStart(3,"0")}.png`)});
  const list=join(probe,"frames.txt");writeFileSync(list,seeks.map(frame=>`file '${join(probe,`frame-${String(frame).padStart(3,"0")}.png`).replaceAll("\\","/")}'`).join("\n"),{flag:"wx"});
  execFileSync("ffmpeg",["-v","error","-f","concat","-safe","0","-i",list,"-vf","tile=4x3:padding=10:margin=10:color=0xe2e5e1","-frames:v","1",join(root,"candidate-probe.png")]);
  console.log(join(root,"candidate-probe.png"));
}else{
  const output=join(root,"render");mkdirSync(output,{recursive:false});const engineHash=hashEngine();
  const frames=await renderFrames({...options,outputDir:join(output,"frames"),imageFormat:"png",concurrency:1,onStart:()=>{},onFrameUpdate:count=>{if(count%90===0)console.log(`Review frames ${count}/450`);}});
  await stitchFramesToVideo({assetsInfo:frames.assetsInfo,fps:30,width:1080,height:1920,outputLocation:join(output,"export.mp4"),codec:"h264",pixelFormat:"yuv420p",crf:18});
  const files=readdirSync(join(output,"frames")).sort();
  for(const frame of seeks){const path=join(output,`seek-${frame}.png`);await renderStill({...options,frame,output:path,imageFormat:"png"});assert.deepEqual(readFileSync(path),readFileSync(join(output,"frames",files[frame])),`Fresh seek ${frame}`);}
  const verification=await verifyExport(join(output,"export.mp4"),450),preview=await verifyPreviewFrames(output,450),audioSync=await verifyAudioSync(join(root,"audio/mix.wav"),join(output,"export.mp4"));
  assert.equal(hashEngine(),engineHash,"Engine changed during review render");
  const original=readFileSync(manifest.sourceVideo);assert.equal(createHash("sha256").update(original).digest("hex"),manifest.sourceVideoHash);
  const baseline=join(root,"baseline-15s.mp4"),candidate=join(root,"candidate-15s.mp4");
  execFileSync("ffmpeg",["-v","error","-i",manifest.sourceVideo,"-i",join(root,"narration.wav"),"-t","15","-map","0:v:0","-map","1:a:0","-c:v","libx264","-crf","18","-pix_fmt","yuv420p","-c:a","aac","-movflags","+faststart",baseline]);
  const baselineVerification=await verifyExport(baseline,450);
  const {copyFileSync,constants}=await import("node:fs");copyFileSync(join(output,"export.mp4"),candidate,constants.COPYFILE_EXCL);
  for(const [name,source]of [["baseline",baseline],["candidate",candidate]])execFileSync("ffmpeg",["-v","error","-i",source,"-vf","fps=1,scale=270:480,tile=5x3:padding=8:margin=8:color=0xe2e5e1","-frames:v","1",join(root,`${name}-contact-sheet.png`)]);
  writeFileSync(join(root,"verification.json"),JSON.stringify({reviewOnly:true,humanApproval:false,productionGates:false,engineHash,candidate:verification,baseline:baselineVerification,preview,audioSync,freshSeekFrames:seeks},null,2),{flag:"wx"});
  writeFileSync(join(root,"index.html"),`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>15-second Terra comparison</title><style>body{font:16px system-ui;background:#f7f3e9;color:#203b3a;margin:24px}main{display:flex;flex-wrap:wrap;gap:24px}video{width:320px;max-width:100%}figure{margin:0}</style><h1>Terra: 15-second review pair</h1><p>Same original narration span. Review only; no quality or production approval recorded. Play each at normal speed with sound.</p><main><figure><figcaption>Baseline</figcaption><video controls playsinline src="baseline-15s.mp4"></video></figure><figure><figcaption>Candidate: motion and local audio experiment</figcaption><video controls playsinline src="candidate-15s.mp4"></video></figure></main><p>Judge clarity, rhythm, object continuity and whether sound supports the explanation. Metrics are diagnostics; phone viewing and later analytics decide retention.</p></html>`,{flag:"wx"});
  console.log(JSON.stringify({root,verification,preview,audioSync}));
}
