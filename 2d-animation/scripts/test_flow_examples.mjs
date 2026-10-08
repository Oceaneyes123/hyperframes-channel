// Run against the real compiled example preview; reuse the existing browser/capture stack.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {parseArgs} from 'node:util';
import {openPreview} from './motion_capture.mjs';

const {values:o} = parseArgs({options:{url:{type:'string'},modules:{type:'string'},browser:{type:'string'}}});
assert(o.url, 'Pass --url <local compiled HyperFrames preview URL>');
const session = await openPreview(o.url,o);
const out = resolve('examples/flow-motion/review');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
try {
  await mkdir(out,{recursive:true});
  assert.deepEqual(session.scenes.map(s=>s.id),['flow-examples']);
  const inspect = async (t, example) => {
    await session.seek(t);
    return session.page.evaluate(name => {
      const scene = document.querySelector(`[data-example="${name}"]`);
      const get = selector => {
        const el = scene.querySelector(selector), css = getComputedStyle(el);
        const matrix = new DOMMatrix(css.transform === 'none' ? undefined : css.transform);
        return {x:matrix.m41,y:matrix.m42,sx:Math.hypot(matrix.m11,matrix.m12),sy:Math.hypot(matrix.m21,matrix.m22),opacity:+css.opacity};
      };
      return {packet:scene.querySelector('.packet') && get('.packet'),
        result:scene.querySelector('.result') && get('.result'),
        response:scene.querySelector('.response') && get('.response'),
        stored:scene.querySelector('.stored-data') && get('.stored-data'),
        loaded:scene.querySelector('.device-content') && get('.device-content'),
        chunks:[...scene.querySelectorAll('.prop.chunk')].map(el=>get(`[data-piece="${el.dataset.piece}"]`)),
        header:scene.querySelector('.header') && get('.header'),
        body:scene.querySelector('.packet .body') && get('.packet .body'),
        ground:scene.querySelector('.ground-shadow .part') && get('.ground-shadow .part'),
        world:get('.world').opacity};
    },example);
  };
  const before = await inspect(1.2,'reject');
  assert.equal(before.result.opacity,0,'rejection must not precede the check');
  const arrival = await inspect(2.2,'reject'), recoil = await inspect(4,'reject');
  assert(recoil.packet.y > arrival.packet.y + 100,'request must visibly recoil after rejection');
  assert.equal(recoil.result.opacity,1);
  const anticipation = await inspect(.5,'reject'), flight = await inspect(1.2,'reject');
  assert(anticipation.body.sx>1.1 && anticipation.body.sy<.9,'anticipation must deform the complete packet');
  assert(flight.body.sy>1,'launch must stretch the packet before it settles');
  assert(flight.ground.sx<anticipation.ground.sx && flight.ground.opacity<anticipation.ground.opacity,'lift must soften and shrink the planted shadow');
  const cutaway = await inspect(11,'unfold');
  assert.equal(cutaway.header.opacity,1);
  assert(Math.abs(cutaway.header.x) < 1,'header must separate into its readable position');
  assert.equal((await inspect(20,'assemble')).chunks.length,4);
  const assembled = await inspect(20,'assemble');
  assert(assembled.chunks.every(p=>Math.abs(p.x)<.01 && Math.abs(p.y)<.01),'all four chunks must settle in their slots');
  assert.equal(assembled.result.opacity,1);
  const hit = await inspect(27,'cache'), done = await inspect(30,'cache');
  assert.equal(hit.result.opacity,1);
  assert.equal(done.stored.opacity,1,'returning a copy must retain the cached content');
  assert.equal(done.response.opacity,0,'returned copy must finish at the device');
  assert.equal(done.loaded.opacity,1,'received content must remain visible on the device');
  assert(await session.page.evaluate(()=>{
    const cache=document.querySelector('.cache');
    const children=[...cache.children];
    return children.indexOf(cache.querySelector('.cache-body'))<children.indexOf(cache.querySelector('.stored-data')) &&
      children.indexOf(cache.querySelector('.stored-data'))<children.indexOf(cache.querySelector('.cache-drawer'));
  }),'drawer front must occlude stored content');

  const handoff = async t => {
    await session.seek(t);
    return session.page.evaluate(()=>{
      const el=document.querySelector('.handoff-packet'),b=el.getBoundingClientRect();
      return {x:b.x,y:b.y,width:b.width,opacity:+getComputedStyle(el).opacity,
        source:+getComputedStyle(document.querySelector('[data-example="reject"] .packet')).opacity,
        target:+getComputedStyle(document.querySelector('[data-example="unfold"] .packet')).opacity};
    });
  };
  assert.deepEqual(await handoff(7.15),{x:385,y:670,width:220,opacity:1,source:0,target:0},'carrier must inherit the outgoing endpoint');
  const middle = await handoff(7.8);
  assert(middle.width>220 && middle.width<550 && middle.opacity===1 && middle.source===0 && middle.target===0,'one hero must span the scene change');
  const endpoint=await handoff(8.4);
  assert(Math.abs(endpoint.x-225)<.01 && Math.abs(endpoint.y-630)<.01 && Math.abs(endpoint.width-550)<.01 && endpoint.opacity===0 && endpoint.target===1,'incoming packet must inherit carrier geometry');

  // The scene changes only while the content tile covers every viewport corner.
  for (const t of [15.999,16,16.001]) {
    const bytes=await session.capture(t);
    const corners=await session.page.evaluate(async png=>{
      const img=new Image();img.src='data:image/png;base64,'+png;await img.decode();
      const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
      const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
      return [[0,0],[1079,0],[0,1919],[1079,1919]].map(([x,y])=>[...ctx.getImageData(x,y,1,1).data]);
    },bytes.toString('base64'));
    assert(corners.every(p=>p[3]===255 && p.slice(0,3).join(',')!=='11,16,32'),`wipe must cover the cut at ${t}`);
  }
  await session.seek(24.1);
  assert(await session.page.evaluate(()=>{
    const old=getComputedStyle(document.querySelector('[data-example="assemble"] .world'));
    const next=getComputedStyle(document.querySelector('[data-example="cache"] .world'));
    return +old.opacity===1 && +next.opacity===1 && next.clipPath.startsWith('circle(') &&
      new DOMMatrix(old.transform).m11>1 && new DOMMatrix(next.transform).m11>1;
  }),'zoom reveal must composite the outgoing and incoming states');
  assert.equal((await inspect(24.8,'assemble')).world,0);
  assert.equal((await inspect(24.8,'cache')).world,1);

  const seekTimes=[2.6,7.8,8.3,10.8,16.2,18.8,23.95,24.2,27.4];
  for (const t of seekTimes) {
    const first = await session.capture(t);
    const firstStyles = await session.page.evaluate(()=>[...document.querySelectorAll('#flow-examples *')].map(el=>el.getAttribute('style')));
    await session.capture(31); await session.capture(.1);
    const again = await session.capture(t);
    assert.deepEqual(await session.page.evaluate(()=>[...document.querySelectorAll('#flow-examples *')].map(el=>el.getAttribute('style'))),firstStyles,`style seek at ${t}`);
    if (hash(again)!==hash(first)) {
      await writeFile(join(out,'seek-first.png'),first);await writeFile(join(out,'seek-again.png'),again);
    }
    if (hash(again)!==hash(first)) {
      const difference = await session.page.evaluate(async images => {
        const pixels = await Promise.all(images.map(async bytes => {
          const img=new Image();img.src='data:image/png;base64,'+bytes;await img.decode();
          const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
          const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,img.width,img.height).data;
        }));
        let maximum=0;for(let i=0;i<pixels[0].length;i++) maximum=Math.max(maximum,Math.abs(pixels[0][i]-pixels[1][i]));
        return maximum;
      },[first.toString('base64'),again.toString('base64')]);
      // Hardware rasterization may round a color channel by one unit; poses must match exactly.
      assert(difference<=1,`seek raster difference ${difference} at ${t}`);
    }
  }
  const times = [0.5,1.8,2.6,4,8.8,10.8,12,14.5,16.5,17.5,18.8,20,25.5,27,28.5,30];
  const transitionTimes=[7.15,7.8,8.4,15.6,16,16.4,23.5,24.1,24.8];
  const frames = [];
  for (const t of times) {
    const bytes = await session.capture(t);
    frames.push({time:t,image:bytes.toString('base64')});
    await writeFile(join(out,`at-${t.toFixed(1)}.png`),bytes);
    const failures = await session.page.evaluate(() => {
      const labels=[...document.querySelectorAll('.world')].filter(el=>+getComputedStyle(el).opacity>.95).flatMap(el=>[...el.querySelectorAll('.label')]);
      return labels.filter(el=>+getComputedStyle(el).opacity>.95).filter(el=>{
        const b=el.getBoundingClientRect();return b.left<72 || b.right>936 || b.top<180 || b.bottom>1600;
      }).map(el=>el.textContent);
    });
    assert.deepEqual(failures,[],`label safe area at ${t}`);
  }
  const sheet = await session.browser.newPage();
  await sheet.setViewport({width:1080,height:2080,deviceScaleFactor:1});
  await sheet.setContent('<body style="margin:0;background:#0B1020;color:#F5F7FF;font:16px sans-serif;display:grid;grid-template-columns:repeat(4,270px)"></body>');
  await sheet.evaluate(async frames => {
    await Promise.all(frames.map(async frame => {
      const cell=document.createElement('div'),img=document.createElement('img');
      img.src='data:image/png;base64,'+frame.image;img.style.cssText='width:270px;height:480px;display:block';
      const label=document.createElement('div');label.style.cssText='height:40px;padding:10px';label.textContent=frame.time+'s';
      cell.append(label,img);document.body.append(cell);await img.decode();
    }));
  },frames);
  await sheet.screenshot({path:join(out,'contact-sheet.jpg'),type:'jpeg',quality:90});
  await sheet.setViewport({width:1080,height:520,deviceScaleFactor:1});
  await sheet.evaluate(() => {
    const cells=[...document.body.children];
    cells.forEach((cell,i)=>{if(![3,5,11,15].includes(i))cell.remove();});
    ['REJECTION','CUTAWAY','ASSEMBLY','CACHE HIT'].forEach((name,i)=>{document.body.children[i].firstChild.textContent=name;});
  });
  await sheet.screenshot({path:join(out,'overview.jpg'),type:'jpeg',quality:90});
  const transitions=[];
  await session.page.bringToFront();
  for(const t of transitionTimes) {
    const bytes=await session.capture(t);transitions.push({time:t,image:bytes.toString('base64')});
    await writeFile(join(out,`transition-${t}.png`),bytes);
  }
  await sheet.setViewport({width:810,height:1560,deviceScaleFactor:1});
  await sheet.bringToFront();
  await sheet.setContent('<body style="margin:0;background:#0B1020;color:#F5F7FF;font:16px sans-serif;display:grid;grid-template-columns:repeat(3,270px)"></body>');
  await sheet.evaluate(async frames=>{
    for(const frame of frames) {
      const cell=document.createElement('div'),img=new Image();img.src='data:image/png;base64,'+frame.image;
      img.style.cssText='width:270px;height:480px;display:block';
      const label=document.createElement('div');label.style.cssText='height:40px;padding:10px';label.textContent=frame.time+'s';
      cell.append(label,img);document.body.append(cell);await img.decode();
    }
  },transitions);
  await sheet.screenshot({path:join(out,'transitions.jpg'),type:'jpeg',quality:90});
  await writeFile(join(out,'checks.json'),JSON.stringify({times,transitionTimes,seekChecks:seekTimes.length,assertions:'passed',audio:'silent examples'},null,2));
  console.log('Compiled flow examples: performances, depth, three composited handoffs, causal outcomes, label bounds and identical seek poses passed (raster tolerance: 1/255).');
} finally {
  await session.browser.close();
}
