// Exercise real-time Studio playback separately from deterministic seek checks.
import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {openPreview} from '../../scripts/motion_capture.mjs';
const project=dirname(fileURLToPath(import.meta.url));
const meta=JSON.parse(await readFile(join(project,'audio_meta.json'),'utf8'));
const session=await openPreview('http://localhost:3048/api/projects/how-firewalls-decide-what-to-block/preview');
const passes=[];
try {
  await session.page.setViewport({width:360,height:640,deviceScaleFactor:1});
  // Playback checks timing/mounts; full-frame phone readability is checked separately.
  for(const mode of ['silent','narration-enabled']) {
    await session.page.evaluate(mode=>{
      window.__player.pause();window.__player.seek(0);
      for(const a of document.querySelectorAll('audio'))a.muted=mode==='silent';
      document.addEventListener('click',()=>{window.__player.play();window.gsap.ticker.wake();},{once:true});
    },mode);
    await session.page.click('svg');
    const samples=[],deadline=Date.now()+(meta.timeline_duration_s*2+30)*1000;
    let previous=-1;
    while(Date.now()<deadline) {
      await new Promise(r=>setTimeout(r,1800));
      const state=await session.page.evaluate(()=>({time:window.__player.getTime(),playing:window.__player.isPlaying(),audio:[...document.querySelectorAll('audio')].filter(a=>!a.paused).map(a=>({id:a.id,time:a.currentTime,muted:a.muted,error:a.error?.message??null}))}));
      assert(state.time>=previous,'Playback clock moved backward');previous=state.time;
      samples.push(state);
      if(!state.playing&&state.time>meta.timeline_duration_s-1)break;
      assert(state.playing,'Playback stopped before the last scene');
    }
    await writeFile(join(project,'review/playback-progress.json'),JSON.stringify({mode,last_time:previous,samples},null,2)+'\n');
    assert(previous>meta.timeline_duration_s-1,`Playback did not reach the end: ${previous.toFixed(3)}s`);
    const heard=new Set(samples.flatMap(s=>s.audio.map(a=>a.id)));
    assert.equal(heard.size,12,`${mode}: missing active narration mounts`);
    const mismatches=samples.flatMap(s=>s.audio.flatMap(a=>{
      const scene=meta.scenes.find(sc=>sc.audio_id===a.id),expected=s.time-scene.start_s;
      return Math.abs(a.time-expected)>.45?[{time:s.time,id:a.id,audio_time:a.time,expected}]:[];
    }));
    assert.equal(mismatches.length,0,'Audio drift exceeds 450ms');
    passes.push({mode,completed_to:previous,active_audio_ids:[...heard],samples,audio_drift_violations:mismatches});
    console.log(`${mode}: full playback passed, all 12 narration mounts active.`);
  }
  await writeFile(join(project,'review/playback-check.json'),JSON.stringify({passes,listening:'Automation exercised audible playback but cannot establish human intelligibility or voice-quality approval.'},null,2)+'\n');
} finally {await session.browser.close();}
