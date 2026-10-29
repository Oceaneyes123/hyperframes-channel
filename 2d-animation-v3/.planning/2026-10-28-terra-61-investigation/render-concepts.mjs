import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderStill,selectComposition} from '@remotion/renderer';
import {readConfig} from '../../server/config.ts';
import {openVisuals} from '../../server/visual-store.ts';
import {inspectGraphics} from '../../engine/quality/inspect-graphics.ts';

const receipt=JSON.parse(readFileSync(new URL('./receipt.json',import.meta.url),'utf8'));
const config=readConfig(),store=openVisuals(config.dataDirectory,config.videosDirectory);
let artifact;
try{artifact=store.read(receipt.projectId,receipt.conceptsId);assert.equal(artifact.output.kind,'concepts');}finally{store.close();}
const output=resolve(`output/terra-61-investigation/concepts-${artifact.id}`);mkdirSync(output,{recursive:true});
const entry=join(output,'register.tsx'),planning=JSON.stringify(resolve('app/projects/[id]/visuals/frame.tsx').replaceAll('\\','/'));
writeFileSync(entry,`import{Composition,registerRoot,getInputProps}from'remotion';import PlanningFrame from ${planning};const Planning=({frame})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Terra concept planning frame"/></div>;registerRoot(()=> <Composition id="Concept" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={getInputProps()}/>);`);
const serveUrl=await bundle({entryPoint:entry,webpackOverride:config=>({...config,cache:false})});
const browserExecutable=process.env.V3_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
for(const [i,concept] of artifact.output.concepts.entries()){
 const inputProps={frame:concept.frame},composition=await selectComposition({serveUrl,id:'Concept',browserExecutable,inputProps});
 await renderStill({serveUrl,composition,inputProps,browserExecutable,imageFormat:'png',output:join(output,`concept-${i+1}.png`)});
 execFileSync('ffmpeg',['-v','error','-i',join(output,`concept-${i+1}.png`),'-vf','scale=360:640','-frames:v','1',join(output,`phone-${i+1}.png`)],{stdio:'pipe'});
}
execFileSync('ffmpeg',['-v','error',...Array.from({length:3},(_,i)=>['-i',join(output,`phone-${i+1}.png`)]).flat(),'-filter_complex','hstack=inputs=3','-frames:v','1',join(output,'contact-sheet.png')],{stdio:'pipe'});
writeFileSync(join(output,'review.json'),JSON.stringify({artifactId:artifact.id,scriptId:artifact.scriptId,phoneWidth:360,planningOnly:true,humanApproval:false,quality:inspectGraphics(artifact)},null,2)+'\n');
console.log(JSON.stringify({output,quality:inspectGraphics(artifact)},null,2));
