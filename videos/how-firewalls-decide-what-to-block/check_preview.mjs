import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {openPreview} from '../../scripts/motion_capture.mjs';

const project=dirname(fileURLToPath(import.meta.url));
const meta=JSON.parse(await readFile(join(project,'audio_meta.json'),'utf8'));
const beats=JSON.parse(await readFile(join(project,'motion_beats.json'),'utf8'));
let sharp;
const cache=join(process.env.LOCALAPPDATA,'npm-cache/_npx');
for(const dir of await readdir(cache)) {
  try{sharp=createRequire(join(cache,dir,'node_modules/_review.cjs'))('sharp');break;}catch{}
}
assert(sharp,'Installed HyperFrames sharp is required');
const out=join(project,'review/preview');await mkdir(out,{recursive:true});
const session=await openPreview('http://localhost:3048/api/projects/how-firewalls-decide-what-to-block/preview');
const evidence=[],violations=[],overlaps=[];
let sampleCount=0;
const hash=b=>createHash('sha256').update(b).digest('hex');
const named=[['passes','blocked','question'],['launch','packet','memory'],['arrival','protocol','web'],['first','web','match'],['first','above','passes'],['record','reverse','passes'],['launch','miss','block'],['discard','retry','refusal'],['filter','content','opaque'],['download','allowed','safety'],['app','miss','block'],['compare','state','fallback']];
const motionWindows=[
  c=>[c.passes-.8,c.passes+1.1],c=>[c.launch,c.packet+1],
  (c,d)=>[d-1.35,d-.45],c=>[c.web,c.match+.4],c=>[c.reorder,c.reorder+1.4],
  c=>[c.passes-.7,c.passes+1.3],c=>[c.launch-1,c.miss-.3],
  c=>[c.refusal-.3,c.refusal+1],c=>[c.opaque-.6,c.opaque+.3],
  c=>[Math.max(0,c.download-1),c.allowed+1.5],c=>[c.fresh-.9,c.miss],c=>[c.state,c.state+1.1]
];
try {
  assert.equal(session.scenes.length,12);
  for(const scene of meta.scenes) {
    const cues=beats.scenes[scene.id].cues;
    const [onset,settled]=motionWindows[scene.index-1](cues,scene.duration_s);
    const midpoints=Array.from({length:Math.ceil((settled-onset)/.05)+1},(_,i)=>onset+i*.05);
    const samples=[0,.1,scene.duration_s-.05,...midpoints,...Object.values(cues).flatMap(t=>[-.25,0,.05,.1,.15,.2,.25,.3,.65].map(offset=>Math.max(0,t+offset)))].filter(t=>t<scene.duration_s);
    for(const t of samples) {
      await session.seek(scene.start_s+t);
      sampleCount++;
      const {unsafe,collisions}=await session.page.evaluate(id=>{
        const root=document.querySelector(`[data-composition-id="${id}"]`),svg=root.querySelector('.diagram'),box=svg.getBoundingClientRect();
        const visible=el=>{for(let e=el;e&&e!==root.parentElement;e=e.parentElement)if(+getComputedStyle(e).opacity<.15)return false;return true;};
        const texts=[...root.querySelectorAll('text')].filter(visible),collisions=[];
        for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++) {
          const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect();
          const area=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
          if(area>Math.min(a.width*a.height,b.width*b.height)*.2)collisions.push([texts[i].textContent,texts[j].textContent]);
        }
        return {unsafe:texts.flatMap(el=>{const b=el.getBoundingClientRect();return b.left<box.left+72-2||b.right>box.left+936+2||b.top<box.top+180-2||b.bottom>box.top+1600+2?[{text:el.textContent,x:b.left-box.left,y:b.top-box.top,w:b.width,h:b.height}]:[];}),collisions};
      },scene.id);
      if(unsafe.length)violations.push({scene:scene.id,time:t,unsafe});
      if(collisions.length)overlaps.push({scene:scene.id,time:t,collisions});
    }
    for(const [pose,key] of named[scene.index-1].entries()) {
      const local=Math.min(scene.duration_s-.05,cues[key]+(key==='passes'?1.4:key==='fallback'?1.5:.8));
      const global=scene.start_s+local, original=await session.capture(global);
      await session.seek(meta.timeline_duration_s-.1);
      await session.seek(0);
      const backward=await session.capture(global);
      assert.equal(hash(original),hash(backward),`${scene.id} ${key}: backward seek changed pixels`);
      const image=await sharp(original).resize(360,640).png().toBuffer();
      const stats=await sharp(image).stats();assert(stats.channels.some(s=>s.stdev>15),'Blank frame');
      const file=`${scene.id}-pose-${pose}.png`;await writeFile(join(out,file),image);
      evidence.push({scene:scene.id,key,local,global,file});
    }
  }
  const sheets=[];
  for(let group=0;group<2;group++) {
    const composite=[];
    for(let row=0;row<6;row++)for(let col=0;col<3;col++)composite.push({input:join(out,evidence[group*18+row*3+col].file),left:col*360,top:row*640});
    const path=join(out,`contact-sheet-${group+1}.png`);
    await sharp({create:{width:1080,height:3840,channels:3,background:'#0B1020'}}).composite(composite).png().toFile(path);sheets.push(path);
  }
  const summary=meta.scenes.map((s,i)=>({input:join(out,evidence[i*3+2].file),left:(i%3)*360,top:Math.floor(i/3)*640}));
  await sharp({create:{width:1080,height:2560,channels:3,background:'#0B1020'}}).composite(summary).png().toFile(join(out,'all-scenes.png'));
  const motion=[];
  for(const s of meta.scenes) {
    const [start,end]=motionWindows[s.index-1](beats.scenes[s.id].cues,s.duration_s);
    for(const [p,local] of [start,(start+end)/2,end].entries()) {
      const file=`${s.id}-motion-${p}.png`;
      await sharp(await session.capture(s.start_s+local)).resize(360,640).png().toFile(join(out,file));
      motion.push({scene:s.id,local,file});
    }
  }
  for(let group=0;group<3;group++) {
    const composite=motion.slice(group*12,group*12+12).map((item,i)=>({input:join(out,item.file),left:(i%3)*360,top:Math.floor(i/3)*640}));
    await sharp({create:{width:1080,height:2560,channels:3,background:'#0B1020'}}).composite(composite).png().toFile(join(out,`motion-sheet-${group+1}.png`));
  }
  const cuts=[];
  for(let i=1;i<meta.scenes.length;i++)for(const [side,t] of [['before',meta.scenes[i].start_s-.05],['after',meta.scenes[i].start_s+.05]]) {
    const file=`cut-${i}-${side}.png`;await sharp(await session.capture(t)).resize(360,640).png().toFile(join(out,file));cuts.push({cut:i,side,time:t,file});
  }
  for(let group=0;group<4;group++) {
    const items=cuts.slice(group*6,group*6+6),composite=items.map((item,i)=>({input:join(out,item.file),left:(i%2)*360,top:Math.floor(i/2)*640}));
    await sharp({create:{width:720,height:Math.ceil(items.length/2)*640,channels:3,background:'#0B1020'}}).composite(composite).png().toFile(join(out,`cuts-sheet-${group+1}.png`));
  }
  const audio=await session.page.evaluate(async()=>{
    const context=new AudioContext(),out=[];
    for(const a of document.querySelectorAll('audio')) {
      const response=await fetch(a.src);if(!response.ok)throw new Error('WAV HTTP '+response.status);
      const decoded=await context.decodeAudioData(await response.arrayBuffer());
      out.push({id:a.id,src:a.getAttribute('src'),start:a.dataset.start,duration:a.dataset.duration,decoded_duration:decoded.duration});
    }
    await context.close();return out;
  });
  assert.equal(audio.length,12);audio.forEach((a,i)=>{assert.equal(a.id,meta.scenes[i].audio_id);assert(Math.abs(a.decoded_duration-meta.scenes[i].duration_s)<.001,'Decoded WAV duration mismatch');});
  const boundaries=[];
  // Assembled starts are rounded to six decimals; sample inside the new host.
  for(const s of meta.scenes)for(const [pose,local] of [['opening',.03],['settled',s.duration_s-.05]]) {
    const file=`${s.id}-${pose}.png`;
    await sharp(await session.capture(s.start_s+local)).resize(360,640).png().toFile(join(out,file));
    boundaries.push({scene:s.id,pose,local,file});
  }
  const detail=[];
  for(const [id,key,offset] of [['line-6','update',.8],['line-9','decryption',.8],['line-8','log',.8]]) {
    const s=meta.scenes.find(s=>s.id===id),local=beats.scenes[id].cues[key]+offset,file=`${id}-${key}.png`;
    await sharp(await session.capture(s.start_s+local)).resize(360,640).png().toFile(join(out,file));
    detail.push({scene:id,key,local,file});
  }
  const report={duration:meta.timeline_duration_s,scenes:12,sample_count:sampleCount,phone_size:[360,640],backward_seek_pixel_equal:36,safe_area_violations:violations,text_overlaps:overlaps,evidence,motion,cuts,boundaries,detail,sheets,audio,listening:'Not established by this browser check'};
  await writeFile(join(project,'review/preview-check.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({samples:report.sample_count,evidence:36,violations:violations.length,overlaps:overlaps.length,sheets}));
  assert.equal(violations.length,0,'Visible labels leave safe area');
  assert.equal(overlaps.length,0,'Visible teaching labels overlap');
} finally {await session.browser.close();}
