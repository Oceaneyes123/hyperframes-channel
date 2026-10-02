// Reuse the approved sketch artwork; add measured, seekable performances.
import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import {createHash} from 'node:crypto';

const project=dirname(fileURLToPath(import.meta.url));
const meta=JSON.parse(await readFile(join(project,'audio_meta.json'),'utf8'));
const words=JSON.parse(await readFile(join(project,'review/word-alignment.json'),'utf8'));
const normal=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
function anchor(n, phrase, occurrence=0) {
  const hay=words[`line-${n}`], needle=phrase.split(' ').map(normal), hits=[];
  hay.forEach((w,i)=>{if(needle.every((v,k)=>normal(hay[i+k]?.word??'')===v))hits.push(w.start);});
  if(hits[occurrence]===undefined)throw new Error(`Missing measured cue: line-${n}: ${phrase}`);
  return hits[occurrence];
}
const anchors=[
  {reply:'reply',passes:'pass',incoming:'Another',blocked:'blocked',question:'difference'},
  {launch:'connecting',pieces:'small',packet:'packets',memory:'remembers'},
  {arrival:'arrival',inspect:'checks',addresses:'source',protocol:'protocol',ports:'ports',side:'side',web:'Webport'},
  {fresh:'new',empty:'no existing',rules:'rules',first:'block',miss:"isn't listed",web:'allow outgoing',match:'matches'},
  {first:'first matching',reorder:'Move',above:'above',listed:'listed',passes:'pass',other:'Firewalls'},
  {record:'temporary',addresses:'addresses',ports:'ports',protocol:'protocol',progress:'progress',develops:'develops',update:'updated',reply:'reply',reverse:'reversed',match:'state',passes:'passes',scope:'conversation',outside:'outside'},
  {launch:'starts',miss:'matches',rules:'allow rule',default:'default',block:'block',fallback:'fallback',different:'different'},
  {stop:'forwarded',drop:'drop',discard:'discards',retry:'sender',timeout:'time',reject:'reject',refusal:'refusal',log:'record',enabled:'enabled'},
  {filter:'filters',packets:'packet',memory:'stateful',content:'content',opaque:'encrypted',connection:'connections',decryption:'decryption'},
  {harmful:'dangerous',download:'download',allowed:'allowed',inspect:'unseen',safety:'safety'},
  {app:'app',fresh:'new',miss:"doesn't allow",default:'default',block:'block'},
  {bad:'bad',compare:'compares',inspect:'information',rules:'rules',state:'state',fallback:'default'}
];
const beats={schema:'hyperframes-channel/motion-beats@1',scenes:{}};
for(const scene of meta.scenes) {
  const cues=Object.fromEntries(Object.entries(anchors[scene.index-1]).map(([key,phrase])=>[key,anchor(scene.index,phrase)]));
  if(Object.values(cues).some(v=>v<0||v>=scene.duration_s))throw new Error('Cue outside measured WAV');
  beats.scenes[scene.id]={source:'word-alignment',method:'faster-whisper base, CPU int8, English beam=5, word_timestamps, no prompt; review/word-alignment.json',review_status:'machine-aligned; listening review pending',audio_sha256:createHash('sha256').update(await readFile(join(project,scene.audio_path))).digest('hex'),cues};
}
await writeFile(join(project,'motion_beats.json'),JSON.stringify(beats,null,2)+'\n');

const board=await readFile(join(project,'sketches/board.html'),'utf8');
const begin=board.indexOf('const C='), end=board.indexOf('// Each row is a static');
if(begin<0||end<begin)throw new Error('Approved sketch helper boundary missing');
const glyphs={};
for(const name of ['lock','shield-halved','list','ban','check','arrow-up','arrow-down','hourglass-half','triangle-exclamation','file-lines']) {
  const raw=await readFile(join(project,`public/icons/${name}.svg`),'utf8');
  glyphs[name]={viewBox:raw.match(/viewBox="([^"]+)"/)[1],paths:[...raw.matchAll(/<path\b[^>]*\/>/g)].map(m=>m[0]).join('')};
}
const helper=board.slice(begin,end).replace("const sprite='../channel/artwork/flow-props.svg';","const sprite='channel/artwork/flow-props.svg';")
  .replace('const glyphs={};',`const glyphs=${JSON.stringify(glyphs)};`)
  .replace('data-asset="${name}"','data-asset="public/icons/${name}.svg"');
const A=new Function(helper+'return {C,text,shape,icon,part,device,endpoint,other,gate,route,packet,result,evidence,state,rule,rules,metadata,locked};')();
const {C,text,shape,icon,part,device,endpoint,other,gate,route,packet,result,evidence,state,rule,rules,metadata,locked}=A;
// The gate's center intentionally travels around its fixed left hinge.
const layer=(name,body)=>`<g class="${name}" data-prop="${name}"${name==='gate-arm'?' data-layout-allow-orbit="hinged gate"':''}>${body}</g>`;
const outcome=(label,tone)=>tone===C.green?text(804,995,label,36,tone)+icon('check',779,1020,56,tone):result(label,tone)+icon('ban',760,953,56,tone);
const panel=()=>text(504,300,'RULES',36,C.muted)+layer('listed-rule',rule(330,'listed'))+layer('web-rule',rule(460,'web'));
const fallback=()=>shape(108,590,792,100,C.red)+text(236,655,'DEFAULT',40,C.ink,'start')+icon('ban',760,618,42,C.red);
const ring=(y,tone)=>`<rect x="108" y="${y}" width="792" height="100" rx="8" fill="none" stroke="${tone}" stroke-width="9"/>`;
const flash=()=>`<circle cx="504" cy="1380" r="56" fill="none" stroke="${C.blue}" stroke-width="7"/>`;

// Each scene config contains only its semantic layers and local motion program.
const configurations=[
  {site:true,other:true,packet:'arrow-down',tone:C.cyan,start:[504,610],extra:layer('second',packet(0,0,C.amber,180,'arrow-down'))+layer('allow',outcome('ALLOWED',C.green))+layer('block',outcome('BLOCKED',C.red)),program:`
    const reply=move(c.passes-.8,c.passes+1.1,[504,610],[504,1190]);
    const incoming=onPath('M794 590Q794 700 504 742L504 810',c.incoming,c.blocked);
    const hinge=M.track(-64,[[c.incoming,0,'SLOW',.75]]);
    draw=t=>{paintPacket(reply(t),t,c.passes+1.1);show('packet',t,null,c.incoming,.25);show('allow',t,c.passes,null,.25);if(t>=c.incoming)show('allow',t,null,c.incoming,.25);M.apply(q('second'),incoming(t));show('second',t,c.incoming);show('block',t,c.blocked);arm(hinge(t));receive(t,c.passes+1.1);};`},
  {site:true,packet:'arrow-up',tone:C.blue,start:[504,1190],extra:layer('new',text(744,1100,'NEW',40,C.blue)),program:`
    const approach=move(c.launch,c.packet+1,[504,1190],[504,810]);
    draw=t=>{paintPacket(approach(t),t,c.packet+1,c.launch);deviceLaunch(t,c.launch);show('new',t);arm(0);};`},
  {packet:'arrow-up',tone:C.blue,start:[504,810],extra:layer('metadata',metadata())+layer('header',part('header',300,635,220))+layer('content',part('data',658,633,220))+layer('chip',evidence('SITE:443')),program:`
    const grow=M.track(1,[[c.arrival,420/180,'MORPH',1],[D-1.35,1,'MORPH',.9]]);
    const fan=M.state({x:0,y:0,scale:1},[[c.inspect,{x:-168},'MORPH',.9],[D-1.35,{x:0},'MORPH',.9]]);
    draw=t=>{paintPacket({x:504,y:810,scale:grow(t)},t);show('metadata',t,c.inspect,D-.8);show('header',t,c.arrival,D-1.2);M.apply(q('header'),fan(t));show('content',t,c.inspect+.3,D-1.2);show('chip',t,D-1);flap(t,c.arrival,D-1.35);arm(0); highlightField(t);};`},
  {packet:'arrow-up',tone:C.blue,start:[504,810],extra:layer('rules',panel())+layer('fallback',fallback())+layer('ledger-empty',state('empty'))+layer('chip',evidence('SITE:443'))+layer('scan-list',ring(330,C.amber))+layer('scan-web',ring(460,C.green))+layer('miss',icon('ban',765,717,50,C.muted))+layer('allow',outcome('ALLOW',C.green)),program:`
    draw=t=>{paintPacket({x:504,y:810},t);show('rules',t,c.rules-.5);show('fallback',t,999);show('ledger-empty',t,c.fresh);show('chip',t);show('scan-list',t,c.first,c.miss,.3);show('miss',t,c.miss,c.web,.25);show('scan-web',t,c.web);show('allow',t,c.match);arm(0);};`},
  {packet:'arrow-up',tone:C.blue,start:[504,810],extra:layer('rules',panel())+layer('first',text(504,245,'FIRST MATCH',36,C.muted))+layer('chip',evidence('LISTED:443',C.amber,680))+layer('block',outcome('BLOCK',C.red))+layer('allow',outcome('ALLOW',C.green))+layer('scan-web',ring(330,C.green))+layer('scan-list',ring(330,C.red))+layer('fresh-main',packet(504,810,C.blue,180,'arrow-up')),program:`
    const swapUp=M.track(0,[[c.reorder,-130,'MORPH',1.4],[c.other,0,'MORPH',1]]);
    const swapDown=M.track(0,[[c.reorder,130,'MORPH',1.4],[c.other,0,'MORPH',1]]);
    const depart=move(c.passes-.8,c.passes+1.1,[504,810],[504,610]);
    const hinge=M.track(0,[[c.listed,-64,'SLOW',.7],[c.other,0,'SLOW',1]]);
    draw=t=>{paintPacket(depart(t),t,c.passes+1.1);show('packet',t,null,c.other-.2);show('fresh-main',t,c.other+.15);show('rules',t);M.apply(q('web-rule'),{y:swapUp(t)});M.apply(q('listed-rule'),{y:swapDown(t)});const labelOpacity=M.smooth((Math.abs(130+swapUp(t)-swapDown(t))-60)/55);for(const name of ['web-rule','listed-rule'])q(name).querySelectorAll('text').forEach(el=>el.style.opacity=labelOpacity);show('first',t,null,c.other);show('chip',t,null,c.other);show('block',t,null,c.reorder);show('scan-list',t,null,c.reorder);show('scan-web',t,c.listed,c.other);show('allow',t,c.listed,c.other);arm(hinge(t));};`},
  {site:true,packet:'arrow-up',tone:C.blue,start:[504,810],extra:layer('reply',packet(0,0,C.cyan,180,'arrow-down'))+layer('ledger',state('initial'))+layer('metadata',metadata('SITE:443','DEVICE:51514',false))+layer('match',outcome('MATCH',C.green))+layer('allow',outcome('ALLOWED',C.green))+layer('copy',part('header',425,770,158)),program:`
    const outward=move(.45,c.record+1,[504,810],[504,497]);
    const reply=move(c.reply,c.reverse,[504,497],[504,810]);
    const passing=move(c.passes-.7,c.passes+1.3,[504,810],[504,1190]);
    const stamp=move(c.record-.3,c.record+.9,[0,0],[0,265]);
    const hinge=M.track(0,[[.1,-64,'SLOW',.6],[c.record+1,0,'SLOW',.7],[c.match,-64,'SLOW',.7],[c.scope,0,'SLOW',.7]]);
    draw=t=>{paintPacket(outward(t),t,c.record+1);show('packet',t,null,c.record+1);show('site',t,null,c.reverse-.3);if(t>c.passes+1.5)show('site',t,c.passes+1.5);show('copy',t,c.record-.3,c.record+1);M.apply(q('copy'),stamp(t));show('ledger',t,c.record);q('ledger').querySelectorAll('circle').forEach((el,i)=>el.setAttribute('fill',i===0||t>=c.update?'#63D69A':'#33415F'));show('metadata',t,c.reverse,c.passes+1.5);show('reply',t,c.reply);M.apply(q('reply'),t<c.passes-.7?reply(t):passing(t));show('match',t,c.match,c.passes-.3);show('allow',t,c.passes);arm(hinge(t));receive(t,c.passes+1.3);};`},
  {other:true,packet:'arrow-down',tone:C.amber,start:[794,500],extra:layer('metadata',metadata('OTHER:4444','DEVICE:51514',false))+layer('rules',panel())+layer('fallback',fallback())+layer('ledger',state())+layer('miss',outcome('NO MATCH',C.red))+layer('block',outcome('BLOCK',C.red))+layer('compare',`<path d="M700 580Q870 720 840 1080" stroke="${C.amber}" stroke-width="6" stroke-dasharray="12 10" fill="none"/>`),program:`
    const incoming=onPath('M794 590Q794 700 504 742L504 810',c.launch-1,c.miss-.3);
    draw=t=>{paintPacket(incoming(t),t,c.miss-.3);show('other',t,null,c.launch-.3);show('metadata',t,c.launch,c.rules);show('ledger',t);show('compare',t,c.miss-.4,c.rules);show('miss',t,c.miss,c.default);show('rules',t,c.rules);show('fallback',t,c.default);show('block',t,c.block);arm(0);};`},
  {other:true,packet:'arrow-down',tone:C.amber,start:[504,810],extra:layer('ledger',state())+layer('drop-label',text(504,285,'DROP',48,C.amber))+layer('reject-label',text(504,285,'REJECT',48,C.red))+layer('stop',icon('ban',469,795,70,C.red))+layer('wait',icon('hourglass-half',758,610,72,C.amber))+layer('refusal',icon('ban',-36,-36,72,C.red))+layer('log',icon('file-lines',755,1210,90,C.muted)+text(800,1370,'LOG',36,C.muted)),program:`
    const reset=onPath('M794 590Q794 700 504 742L504 810',c.reject-1,c.reject-.1);
    const refusal=onPath('M504 810L504 742Q794 700 794 610',c.refusal-.3,c.refusal+1);
    draw=t=>{paintPacket(t<c.reject-1?{x:504,y:810}:reset(t),t,c.reject-.1);show('packet',t,null,c.discard+.25,.4);if(t>=c.reject-1)show('packet',t,c.reject-1,c.reject+.35,.25);show('ledger',t);show('drop-label',t,c.drop-.3,c.reject-1.3,.2);show('reject-label',t,c.reject-1.1);show('stop',t,c.discard);show('wait',t,c.retry,c.reject-1.3,.2);show('refusal',t,c.refusal-.3);M.apply(q('refusal'),refusal(t));show('log',t,c.log);arm(0);};`},
  {packet:'arrow-up',tone:C.blue,start:[504,810],size:320,extra:layer('filter',text(270,325,'RULES',36)+part('header',125,350,290))+layer('state-prop',text(734,325,'STATE',36,C.violet)+part('header',589,350,290))+layer('ledger',state())+layer('content',part('data',674,580,240)+text(794,845,'CONTENT',32,C.cyan))+layer('locked',locked(504,770)+text(504,615,'CONTENT',36,C.muted)+text(504,1030,'HTTPS',40,C.cyan))+layer('decryption',icon('lock',754,560,74,C.muted)+text(794,695,'DECRYPT',32,C.muted)),program:`
    draw=t=>{paintPacket({x:504,y:810},t);show('packet',t,null,c.opaque-.6);show('filter',t);show('state-prop',t,c.memory);show('ledger',t,c.memory);show('content',t,c.content-.6,c.opaque-.6);show('locked',t,c.opaque-.6);show('decryption',t,c.decryption);arm(0);};`},
  {site:true,extra:layer('locked',locked(0,0))+layer('ledger',state())+layer('https',text(804,610,'HTTPS',40,C.cyan))+layer('allow',text(804,995,'ALLOWED',36,C.green)+icon('check',779,1020,56,C.green))+layer('hazard',icon('triangle-exclamation',466,1332,84,C.amber)),program:`
    const payload=move(c.download-1,c.allowed+1.5,[504,770],[504,1285]);
    const hinge=M.track(0,[[Math.max(0,c.download-1),-64,'SLOW',.7],[c.allowed+1.5,0,'SLOW',.7]]);
    draw=t=>{M.apply(q('locked'),payload(t));show('locked',t,null,c.allowed+1.5);show('ledger',t);show('https',t);show('allow',t,c.allowed);show('hazard',t,c.allowed+1.5);arm(hinge(t));receive(t,c.allowed+1.5);};`},
  {app:true,packet:'arrow-up',tone:C.blue,start:[504,1190],extra:layer('rules',panel())+layer('chip',evidence('8443',C.amber,720))+layer('fallback',fallback())+layer('compare',`<path d="M650 740Q720 650 700 550" fill="none" stroke="${C.amber}" stroke-width="6" stroke-dasharray="12 10"/>`+icon('ban',660,530,45,C.red))+layer('block',text(504,1050,'BLOCKED',48,C.red)),program:`
    const attempt=move(c.fresh-.9,c.miss,[504,1190],[504,930]);
    draw=t=>{paintPacket(attempt(t),t,c.miss,c.fresh-.9);show('rules',t);show('chip',t,c.app);show('compare',t,c.miss,c.default);show('fallback',t,c.default);show('block',t,c.block);arm(0);deviceLaunch(t,c.fresh-.9);};`},
  {packet:'arrow-down',tone:C.cyan,start:[504,810],extra:layer('rules',panel())+layer('ledger',state())+layer('fallback',fallback())+layer('second',packet(0,0,C.amber,180,'arrow-down'))+layer('allow',outcome('ALLOW',C.green))+layer('block',outcome('BLOCK',C.red)),program:`
    const received=c.state+1.1, incomingAt=Math.max(received,c.fallback-.8);
    const passing=move(c.state,received,[504,810],[504,1190]);
    const incoming=onPath('M794 590Q794 700 504 742L504 810',incomingAt,c.fallback+1);
    const hinge=M.track(0,[[c.state-.6,-64,'SLOW',.6],[incomingAt,0,'SLOW',.6]]);
    draw=t=>{paintPacket(passing(t),t,received);show('packet',t,null,incomingAt);show('rules',t);show('ledger',t);show('allow',t,c.state,incomingAt);show('second',t,incomingAt);M.apply(q('second'),incoming(t));show('fallback',t,c.fallback);show('block',t,c.fallback+1);arm(hinge(t));receive(t,received);};`}
];

await mkdir(join(project,'compositions/frames'),{recursive:true});
await mkdir(join(project,'public/vendor'),{recursive:true});
await copyFile(resolve(project,'../../examples/flow-motion/public/vendor/gsap.min.js'),join(project,'public/vendor/gsap.min.js'));
const assertions=[];
for(const scene of meta.scenes) {
  const i=scene.index, config=configurations[i-1], c=beats.scenes[scene.id].cues, D=scene.duration_s;
  const gateBase=gate(false).replace(/<g transform="rotate\([^]*?<\/g>/,'');
  const body=layer('site',config.site?endpoint():'')+layer('other',config.other?other():'')+
    layer('device',device(314,1180,380,config.app?'APP':'DEVICE'))+gateBase+
    layer('gate-arm',part('gate-arm',294,650,420))+
    layer('arrival',flash())+(config.packet?layer('packet',layer('packet-body',packet(0,0,config.tone,config.size??180,config.packet))):'')+config.extra;
  const source=`<template>
<style>
@import url("channel/styles.css");
@import url("channel/motion.css");
#root{position:relative;width:1080px;height:1920px;background:#0B1020;overflow:hidden;}
#root .diagram{position:absolute;inset:0;z-index:1;display:block;width:1080px;height:1920px;}
#root text{font-family:var(--hf-mono);font-weight:700;letter-spacing:0;}
#root g[data-prop]{transform-box:view-box;transform-origin:0 0;}
</style>
<div id="root" class="hf-frame" data-composition-id="${scene.id}" data-width="1080" data-height="1920" data-duration="${D}">
<div id="${scene.id}-ground" class="clip" data-start="0" data-duration="${D}" data-track-index="0" style="position:absolute;inset:0;z-index:0;background:#0B1020"></div>
<svg class="diagram" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${scene.id}: firewall rule and connection-state decision">${body}</svg>
</div>
<script>
{
  const root=document.querySelector('[data-composition-id="${scene.id}"]');
  const q=name=>root.querySelector('[data-prop="'+name+'"]');
  const M=ChannelMotion,c=${JSON.stringify(c)},D=${D};
  const show=(name,t,enter=null,exit=null,duration=.3)=>{const {opacity}=M.visibility(t,enter,exit,duration);M.apply(q(name),{opacity});};
  const move=(start,end,from,to)=>{const p=M.travel(Math.max(0,start),end);return t=>({x:from[0]+(to[0]-from[0])*p(t),y:from[1]+(to[1]-from[1])*p(t)});};
  const onPath=(d,start,end)=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);return M.path(path,M.travel(Math.max(0,start),end));};
  const arm=rotation=>M.apply(q('gate-arm'),{rotation,origin:'355px 876px'});
  const paintPacket=(pose,t,arrival=999,launch=999)=>{M.apply(q('packet'),pose);M.apply(q('packet-body'),{scaleY:M.impact(t,arrival,.045),scaleX:2-M.impact(t,arrival,.045),rotation:t<launch+1?3*Math.sin(Math.PI*M.clamp((t-launch)/1)):0});};
  const receive=(t,at)=>{M.apply(q('device'),{y:-14*(1-M.impact(t,at,.9))});show('arrival',t,at,at+.65,.22);};
  const deviceLaunch=(t,at)=>M.apply(q('device'),{rotation:-2*Math.sin(Math.PI*M.clamp((t-at+.45)/1.4)),origin:'504px 1465px'});
  const flap=(t,at,close=999)=>{const el=q('packet-body').querySelector('[data-asset="flow:packet-flap"]');M.apply(el,{scaleY:1-.75*M.smooth((t-at)/1.1)+.75*M.smooth((t-close)/.8),origin:'0px -27px'});};
  const highlightField=t=>{const fields=q('metadata').querySelectorAll('text');for(const el of fields){const y=+el.getAttribute('y');const at=y<350?c.addresses:y<450?c.addresses+.7:y<520?c.protocol:c.side;el.style.opacity=.4+.6*M.smooth((t-at)/.45);}};
  let draw;
  ${config.program}
  const timeline=gsap.timeline({paused:true});
  show('arrival',0,999);
  M.mount(timeline,D,draw);
  window.__timelines=window.__timelines||{};
  window.__timelines['${scene.id}']=timeline;
}
</script>
</template>`;
  await writeFile(join(project,scene.src),source);
  assertions.push({kind:'appearsBy',selector:`[data-composition-id="${scene.id}"] .gate-arm`,bySec:scene.start_s+.8});
  assertions.push({kind:'staysInFrame',selector:`[data-composition-id="${scene.id}"] .diagram`});
  if(config.packet)assertions.push({kind:'staysInFrame',selector:`[data-composition-id="${scene.id}"] .packet`});
}
assertions.push({kind:'before',a:'[data-composition-id="line-6"] .ledger',b:'[data-composition-id="line-6"] .match'});
assertions.push({kind:'before',a:'[data-composition-id="line-10"] .allow',b:'[data-composition-id="line-10"] .hazard'});
await writeFile(join(project,'index.motion.json'),JSON.stringify({duration:meta.timeline_duration_s,assertions},null,2)+'\n');
console.log(`Built ${meta.scenes.length} scenes / ${meta.timeline_duration_s.toFixed(3)} seconds, ${assertions.length} motion assertions.`);
