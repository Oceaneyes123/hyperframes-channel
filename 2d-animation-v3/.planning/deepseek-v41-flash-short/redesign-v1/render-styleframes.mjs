import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderStill,selectComposition} from '@remotion/renderer';

const root=resolve('.planning/deepseek-v41-flash-short/redesign-v1');
const board=JSON.parse(readFileSync(join(root,'storyboard-draft.json'),'utf8'));
const directory=join(root,'styleframes');mkdirSync(directory,{recursive:true});
const serveUrl=await bundle({entryPoint:resolve('engine/register-planning.tsx'),webpackOverride:config=>({...config,cache:false})});
const browserExecutable=process.env.V3_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const selected=process.argv.slice(2).map(Number);
for (const [index,shot] of board.output.shots.entries()) {
 if(selected.length&&!selected.includes(index+1))continue;
 for(const state of ['start','end']) {
  const inputProps={frame:shot[`${state}Frame`]},composition=await selectComposition({serveUrl,id:'Planning',inputProps,browserExecutable});
  await renderStill({serveUrl,composition,inputProps,browserExecutable,imageFormat:'png',output:join(directory,`${String(index+1).padStart(2,'0')}-${state}.png`)});
 }
 console.log(`Styleframe ${index+1}/${board.output.shots.length}`);
}
const inputs=board.output.shots.flatMap((_,i)=>['-i',join(directory,`${String(i+1).padStart(2,'0')}-end.png`)]);
const filters=board.output.shots.map((_,i)=>`[${i}:v]scale=216:384[s${i}]`);
const layout=board.output.shots.map((_,i)=>`${i%5*216}_${Math.floor(i/5)*384}`).join('|');
execFileSync('ffmpeg',['-y','-v','error',...inputs,'-filter_complex',`${filters.join(';')};${board.output.shots.map((_,i)=>`[s${i}]`).join('')}xstack=inputs=10:layout=${layout}`,'-frames:v','1',join(root,'storyboard-contact.png')],{stdio:'pipe'});
writeFileSync(join(root,'styleframe-verification.json'),JSON.stringify({width:1080,height:1920,shots:10,states:20,renderer:'Existing V3 PlanningFrame and Remotion',humanApproval:false},null,2)+'\n');
