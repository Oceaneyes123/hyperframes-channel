import assert from 'node:assert/strict';import {mkdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';import {resolve,join} from 'node:path';import {execFileSync} from 'node:child_process';import {bundle} from '@remotion/bundler';import {renderStill,selectComposition} from '@remotion/renderer';import {readConfig} from '../../server/config.ts';import {openVisuals} from '../../server/visual-store.ts';import {inspectGraphics} from '../../engine/quality/inspect-graphics.ts';
const r=JSON.parse(readFileSync(new URL('./receipt.json',import.meta.url),'utf8')),c=readConfig(),s=openVisuals(c.dataDirectory,c.videosDirectory);let a;
try{a=s.read(r.projectId,r.storyboardId);assert.equal(a.output.kind,'storyboard');assert.equal(a.scriptId,r.scriptId);assert.equal(s.acceptance(r.projectId),null);}finally{s.close();}
const output=resolve(`output/terra-61-investigation/storyboard-${a.id}`);mkdirSync(output,{recursive:true});
const previousId=process.argv.includes('--warnings-only')?'e72323e2-8b21-40a6-b3f9-31ae4b93f3af':null;
const previous=previousId?JSON.parse(readFileSync(`videos/${r.projectId}/visuals/${previousId}.json`,'utf8')):null;
const entry=join(output,'register.tsx'),planning=JSON.stringify(resolve('app/projects/[id]/visuals/frame.tsx').replaceAll('\\','/'));
writeFileSync(entry,`import{Composition,registerRoot,getInputProps}from'remotion';import PlanningFrame from ${planning};const Planning=({frame})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Terra storyboard planning frame"/></div>;registerRoot(()=> <Composition id="Board" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={getInputProps()}/>);`);
const serveUrl=await bundle({entryPoint:entry,webpackOverride:config=>({...config,cache:false})}),browserExecutable=process.env.V3_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
for(const [index,shot] of a.output.shots.entries())for(const state of ['start','end']){
 const name=`shot-${String(index+1).padStart(2,'0')}-${state}`;
 if(previous&&!([2,3].includes(index))){assert.deepEqual(shot[`${state}Frame`],previous.output.shots[index][`${state}Frame`]);for(const suffix of ['.png','-phone.png'])copyFileSync(resolve(`output/terra-61-investigation/storyboard-${previousId}/${name}${suffix}`),join(output,name+suffix));continue;}
 const inputProps={frame:shot[`${state}Frame`]},composition=await selectComposition({serveUrl,id:'Board',browserExecutable,inputProps});
 await renderStill({serveUrl,composition,inputProps,browserExecutable,imageFormat:'png',output:join(output,`${name}.png`)});
 execFileSync('ffmpeg',['-v','error','-i',join(output,`${name}.png`),'-vf','scale=360:640','-frames:v','1',join(output,`${name}-phone.png`)],{stdio:'pipe'});
 console.log(`Rendered shot ${index+1} ${state}.`);
}
for(const state of ['start','end']){
 const inputs=a.output.shots.flatMap((_,i)=>['-i',join(output,`shot-${String(i+1).padStart(2,'0')}-${state}-phone.png`)]);
 const layout=a.output.shots.map((_,i)=>`${i%4*360}_${Math.floor(i/4)*640}`).join('|');
 execFileSync('ffmpeg',['-v','error',...inputs,'-filter_complex',`xstack=inputs=${a.output.shots.length}:layout=${layout}:fill=white`,'-frames:v','1',join(output,`${state}-contact-sheet.png`)],{stdio:'pipe'});
}
writeFileSync(join(output,'review.json'),JSON.stringify({artifactId:a.id,scriptId:a.scriptId,planningOnly:true,humanApproval:false,quality:inspectGraphics(a)},null,2)+'\n');
console.log(JSON.stringify({output,shots:a.output.shots.length,quality:inspectGraphics(a)},null,2));
