// Integration check against the real compiled HTTPS pilot, not a mock scene.
import {openPreview,sampleTimes} from './motion_capture.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
const {values:o}=parseArgs({options:Object.fromEntries(['url','browser','modules','project'].map(k=>[k,{type:'string'}]))});
const project=o.project??'videos/https-actually-works';
const meta=JSON.parse(await readFile(`${project}/audio_meta.json`,'utf8'));
const session=await openPreview(o.url,o), report={seekChecks:[],samples:[],notes:['Stillness is reported for visual review; reading pauses are allowed.','Listening review and MP4 encoding are separate from these checks.']};
try {
  const expected=meta.scenes.map(s=>s.id).concat('main').sort();
  assert.deepEqual(await session.page.evaluate(()=>Object.keys(window.__timelines).sort()),expected);
  const hash=b=>createHash('sha256').update(b).digest('hex');
  for(const t of [8.4,22.2,51.4,54.9]) {
    const first=await session.capture(t);
    await session.capture(68);
    await session.capture(.1);
    assert.equal(hash(await session.capture(t)),hash(first),`random-order seek ${t}`);
    report.seekChecks.push({time:t,sha256:hash(first),identical:true});
  }
  for(const [sid,target] of [['line-2','.hello'],['line-4','.certificate'],['line-7','.request']]) {
    const scene=meta.scenes.find(s=>s.id===sid);
    let previous, largestStep=0;
    const positions=[];
    for(let t=0;t<scene.duration_s;t+=1/30) {
      await session.seek(scene.start_s+t);
      const sample=await session.page.evaluate(async ({time,sid,target})=>{
        const root=document.querySelector(`[data-composition-id="${sid}"]`);
        const el=root.querySelector(target), box=el.getBoundingClientRect();
        const labels=[...root.querySelectorAll('.endpoint,.headline,.caption,.status,.hf-payload')].filter(e=>{
          let opacity=1;for(let p=e;p&&p!==root;p=p.parentElement)opacity*=Number(getComputedStyle(p).opacity);
          return opacity>.5;
        }).map(e=>{const b=e.getBoundingClientRect();return {text:e.textContent.trim(),left:b.left,top:b.top,right:b.right,bottom:b.bottom};});
        return {x:box.x,y:box.y,labels};
      },{time:scene.start_s+t,sid,target});
      if(previous) largestStep=Math.max(largestStep,Math.hypot(sample.x-previous.x,sample.y-previous.y));
      for(const label of sample.labels) assert(label.left>=71 && label.right<=937 && label.top>=179 && label.bottom<=1601,`${sid} unsafe label at ${t.toFixed(3)}: ${label.text}`);
      previous=sample;
      positions.push({t,x:sample.x,y:sample.y});
    }
    for(const p of positions.reverse()) {
      await session.seek(scene.start_s+p.t);
      const actual=await session.page.evaluate(({sid,target})=>{const b=document.querySelector(`[data-composition-id="${sid}"]`).querySelector(target).getBoundingClientRect();return {x:b.x,y:b.y};},{sid,target});
      assert(Math.abs(p.x-actual.x)<.01 && Math.abs(p.y-actual.y)<.01,`${sid} changed on reverse seek at ${p.t}`);
    }
    assert(largestStep<70,`${sid} possible teleport: ${largestStep}px/frame`);
    report.samples.push({scene:sid,fps:30,largestStep,teleportThreshold:70,safeArea:'72..936 / 180..1600'});
  }
  const subframes=[];
  for(const t of sampleTimes(8.4))subframes.push(await session.capture(t));
  assert.equal(new Set(subframes.map(hash)).size,4,'all four subframes must move; do not quantize to output FPS');
  const blended=await session.blend(subframes);
  assert(subframes.every(b=>hash(b)!==hash(blended)),'blend must differ from all single samples');
  assert.equal(hash(await session.blend(subframes)),hash(blended));
  report.temporalBlend={time:8.4,samples:4,shutter:180,distinctSamples:new Set(subframes.map(hash)).size,repeatIdentical:true};
  await writeFile(`${project}/review/motion-browser-check.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} finally {await session.browser.close();}
