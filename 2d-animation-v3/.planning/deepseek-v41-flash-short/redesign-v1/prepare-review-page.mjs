import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('.planning/deepseek-v41-flash-short/redesign-v1');
const receipt=JSON.parse(readFileSync(join(root,'motion-review-receipt.json'),'utf8'));
const baseline=JSON.parse(readFileSync(join(root,'../receipt.json'),'utf8'));
const timing=JSON.parse(readFileSync(join(root,'scene-timing.json'),'utf8'));
const board=JSON.parse(readFileSync(join(root,'storyboard-proposal.json'),'utf8'));
assert.equal(timing.boundaries.length,11);
execFileSync('ffmpeg',['-v','error','-i',baseline.exportPath,'-vf','scale=360:640','-an','-c:v','libx264','-crf','20','-preset','fast',join(receipt.output,'before-review.mp4')],{stdio:'pipe'});
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const buttons=board.output.shots.map((shot,index)=>`<button type="button" data-frame="${timing.boundaries[index]}">${index+1}. ${escape(shot.purpose)}</button>`).join('\n');
writeFileSync(join(receipt.output,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DeepSeek · motion review</title>
<style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f7f3e9;color:#203b3a;font:16px/1.5 Arial,sans-serif}main{max-width:1040px;margin:auto;padding:32px 24px}h1{font-size:clamp(28px,4vw,44px);line-height:1.05;margin:12px 0}p{max-width:72ch}header{border-bottom:1px solid #c6ded3;margin-bottom:24px;padding-bottom:20px}.status{font-size:13px;font-weight:bold;letter-spacing:.08em;color:#aa472d}.players{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.players.solo{grid-template-columns:minmax(0,480px)}figure{margin:0}video{display:block;width:100%;max-height:70vh;aspect-ratio:9/16;background:#203b3a;border-radius:8px}figcaption{font-size:14px;margin:8px 0}nav{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}button{font:inherit;padding:8px 12px;background:#fffdf8;border:1px solid #c6ded3;border-radius:4px;color:inherit;cursor:pointer}button:hover,button:focus-visible{border-color:#203b3a}small{color:#607570}.controls{margin:20px 0}label{cursor:pointer}@media(max-width:620px){.players{gap:12px}main{padding:20px 12px}video{max-height:65vh}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style>
<main><header><div class="status">PENDING MOTION REVIEW</div><h1>The Working Studio</h1><p>DeepSeek inquiry-service explainer. Original narration, redesigned illustrations and Energetic GSAP choreography. This is a 360×640 review copy of the 1080×1920 composition.</p><small>70 seconds · 30 fps · motion ${receipt.motionId}</small></header>
<div class="controls"><label><input id="compare" type="checkbox" checked> Compare the previous output at the same time</label><p>Play the redesigned version. The previous version follows silently.</p></div>
<div class="players" id="players"><figure id="before-figure"><video id="before" src="before-review.mp4" muted playsinline preload="metadata" aria-label="Previous version, synchronized comparison"></video><figcaption>Previous output</figcaption></figure><figure><video id="after" src="review.mp4" controls playsinline preload="metadata" aria-label="Redesigned narrated motion proposal"></video><figcaption>Redesigned proposal · original audio</figcaption></figure></div>
<nav aria-label="Jump to a scene">${buttons}</nav><p id="position" role="status">Ready for review.</p>
<p>Storyboard approved. Motion acceptance and production export remain pending. Review the pacing, owner approval gesture, JSON readability and narration alignment.</p><small>No customer deployment, sales or business results are demonstrated. Software surfaces are explanatory reconstructions. The final salon return intentionally holds the owner-control conclusion.</small></main>
<script>
const after=document.getElementById('after'),before=document.getElementById('before'),compare=document.getElementById('compare');
const sync=()=>{if(before.readyState>0&&Math.abs(before.currentTime-after.currentTime)>.08)before.currentTime=after.currentTime;};
after.addEventListener('play',()=>{sync();if(compare.checked)before.play().catch(()=>{});});
after.addEventListener('pause',()=>before.pause());
after.addEventListener('seeking',sync);after.addEventListener('ratechange',()=>before.playbackRate=after.playbackRate);
after.addEventListener('timeupdate',()=>{sync();document.getElementById('position').textContent=after.currentTime.toFixed(1)+' / 70.0 seconds';});
compare.addEventListener('change',()=>{document.getElementById('before-figure').hidden=!compare.checked;document.getElementById('players').classList.toggle('solo',!compare.checked);if(!compare.checked)before.pause();else if(!after.paused){sync();before.play().catch(()=>{});}});
for(const button of document.querySelectorAll('[data-frame]'))button.addEventListener('click',()=>{after.currentTime=Number(button.dataset.frame)/30;sync();});
</script></html>`);
console.log(join(receipt.output,'index.html'));
