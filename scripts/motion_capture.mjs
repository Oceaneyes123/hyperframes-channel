// Capture the actual HyperFrames preview bundle. No substitute HTML assembler.
// Reuses HyperFrames' installed puppeteer-core and sharp; no new dependencies.
import {createRequire} from 'node:module';
import {readFile, writeFile, mkdir, mkdtemp, rm, readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, join, dirname} from 'node:path';
import {tmpdir, homedir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {spawn, spawnSync} from 'node:child_process';
import {once} from 'node:events';

export function sampleTimes(time, fps = 30, samples = 4, shutter = 180, start = 0, end = Infinity) {
  if (!Number.isFinite(time) || !(fps > 0) || !Number.isFinite(fps) || !Number.isInteger(samples) || samples < 1 || samples > 16 || !(shutter >= 0 && shutter <= 360) || end < start) throw new Error('Invalid temporal sampling settings');
  const exposure = shutter / 360 / fps;
  return Array.from({length:samples}, (_, k) => Math.max(start, Math.min(end, time + ((k + .5) / samples - .5) * exposure)));
}

async function installedModules(explicit) {
  if (explicit) return createRequire(join(resolve(explicit), '_motion.cjs'));
  const local = createRequire(import.meta.url);
  try { local.resolve('puppeteer-core'); local.resolve('sharp'); return local; } catch {}
  const cache = process.env.npm_config_cache || (process.platform === 'win32' ? join(process.env.LOCALAPPDATA, 'npm-cache') : join(homedir(), '.npm'));
  const candidates = [];
  for (const dir of await readdir(join(cache, '_npx')).catch(() => [])) {
    const modules = join(cache, '_npx', dir, 'node_modules');
    try {
      const pkg = JSON.parse(await readFile(join(modules, 'hyperframes/package.json'), 'utf8'));
      candidates.push({modules, version:pkg.version});
    } catch {}
  }
  candidates.sort((a,b) => b.version.localeCompare(a.version, undefined, {numeric:true}));
  for (const {modules} of candidates) {
    const req = createRequire(join(modules, '_motion.cjs'));
    try { req.resolve('puppeteer-core'); req.resolve('sharp'); return req; } catch {}
  }
  throw new Error('Run HyperFrames once, or pass --modules <existing node_modules containing puppeteer-core and sharp>');
}

export async function openPreview(url, options = {}) {
  const parsed = new URL(url);
  if (!['localhost','127.0.0.1','[::1]'].includes(parsed.hostname)) throw new Error('Use a local HyperFrames preview URL');
  const req = await installedModules(options.modules);
  const puppeteer = req('puppeteer-core'), sharp = req('sharp');
  const browser = await puppeteer.launch(options.browser ? {executablePath:resolve(options.browser),headless:true} : {channel:'chrome',headless:true});
  try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });
    page.on('response', r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
    await page.goto(url, {waitUntil:'networkidle0'});
    await page.waitForFunction(() => typeof window.__player?.renderSeek === 'function' || typeof window.__hf?.seek === 'function');
    const dimensions = await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode()));
      const root = document.querySelector('[data-composition-id][data-width]');
      return {width:+root.dataset.width,height:+root.dataset.height};
    });
    await page.setViewport({...dimensions,deviceScaleFactor:1});
    const scenes=await page.evaluate(()=>[...document.querySelectorAll('.scene[data-composition-id][data-start]')].map(el=>({id:el.dataset.compositionId,start:+el.dataset.start,duration:+(el.dataset.duration??el.dataset.hfAuthoredDuration)})));
    if(!scenes.length || scenes.some(s=>!Number.isFinite(s.duration)||s.duration<=0)) throw new Error('Capture requires channel-assembled scene timing');
    if(await page.$('video')) throw new Error('Use the native HyperFrames renderer for source video');
    await page.evaluate(()=>{window.__player?.pause?.();window.gsap.ticker.sleep();});
    const seek = async t => {
      // Studio renderSeek quantizes to output frames and can schedule redraws.
      // Keep Studio paused; seek its compiled GSAP scenes directly in one task.
      await page.evaluate(({t,scenes})=>{
        for(const s of scenes) {
          const tl=window.__timelines[s.id];
          if(!tl) throw new Error(`Missing timeline ${s.id}`);
          tl.pause().seek(Math.max(0,Math.min(s.duration,t-s.start)),false);
          tl.channelSeek?.(t-s.start);
          const el=document.querySelector(`[data-composition-id="${s.id}"]`);
          el.style.visibility=t>=s.start && t<s.start+s.duration?'visible':'hidden';
        }
        window.gsap.ticker.sleep();
      },{t,scenes});
      if(errors.length) throw new Error(errors.join('\n'));
    };
    const capture = async t => {
      await seek(t);
      return Buffer.from(await page.screenshot({type:'png'}));
    };
    // Equal exposure weights in linear light, not gamma-encoded screenshot RGB.
    const blend = async buffers => {
      if(buffers.length === 1) return buffers[0];
      const frames = await Promise.all(buffers.map(b => sharp(b).removeAlpha().raw().toBuffer()));
      const out = Buffer.alloc(frames[0].length);
      const linear = Array.from({length:256},(_,v) => {const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});
      for(let i=0;i<out.length;i++) {
        const v=frames.reduce((sum,f)=>sum+linear[f[i]],0)/frames.length;
        out[i]=Math.round(255*(v<=.0031308?12.92*v:1.055*v**(1/2.4)-.055));
      }
      return sharp(out,{raw:{...dimensions,channels:3}}).png().toBuffer();
    };
    return {browser,page,capture,seek,blend,dimensions,scenes};
  } catch(error) {await browser.close();throw error;}
}

async function main() {
  const {values:o} = parseArgs({options:Object.fromEntries(['project','url','output','stills','mode','fps','samples','shutter','start','duration','modules','browser'].map(k=>[k,{type:'string'}]))});
  if(!o.project || !o.url || !o.output) throw new Error('Required: --project PATH --url LOCAL_COMPILED_PREVIEW_URL --output PATH; optional --stills 1.2,3.4 --mode production');
  const project=resolve(o.project), meta=JSON.parse(await readFile(join(project,'audio_meta.json'),'utf8'));
  const fps=Number(o.fps??30), mode=o.mode??'preview';
  if(!['preview','production'].includes(mode)) throw new Error('Mode must be preview or production');
  const samples=mode==='production'?Number(o.samples??4):1, shutter=Number(o.shutter??180);
  const start=Number(o.start??0), duration=Number(o.duration??(meta.timeline_duration_s-start));
  if(!Number.isFinite(start)||!Number.isFinite(duration)||start<0||duration<=0||start+duration>meta.timeline_duration_s+.000001) throw new Error('Invalid capture range');
  sampleTimes(start,fps,samples,shutter);
  const cuts=meta.scenes.map(s=>s.start_s);
  const times = t => {
    const scene=meta.scenes.find(s=>t>=s.start_s && t<s.start_s+s.duration_s);
    if(!scene) throw new Error(`Time outside narration: ${t}`);
    // Keep a hard cut crisp: never integrate samples from two semantic scenes.
    return sampleTimes(t,fps,samples,shutter,Math.max(start,scene.start_s),Math.min(start+duration,scene.start_s+scene.duration_s)-1e-7);
  };
  if(!o.stills) {
    const script=join(dirname(fileURLToPath(import.meta.url)),'validate_project.py');
    const validation=spawnSync('python',[script,'--project',project,'--stage','render'],{stdio:'inherit'});
    if(validation.status!==0) throw new Error('Render validation/preview approval failed');
    if(existsSync(resolve(o.output))) throw new Error('Output exists; choose a new output filename');
  }
  const session=await openPreview(o.url,o), temp=await mkdtemp(join(tmpdir(),'hf-motion-'));
  let encoder;
  try {
    if(session.scenes.length!==meta.scenes.length || session.scenes.some((s,i)=>s.id!==meta.scenes[i].id || Math.abs(s.start-meta.scenes[i].start_s)>.000001 || Math.abs(s.duration-meta.scenes[i].duration_s)>.000001)) throw new Error('Preview scene timings do not match project audio metadata');
    const captureFrame=async t=>{const frames=[];for(const sample of times(t))frames.push(await session.capture(sample));return session.blend(frames);};
    if(o.stills) {
      await mkdir(o.output,{recursive:true});
      for(const t of o.stills.split(',').map(Number)) {
        if(t<start||t>=start+duration||!Number.isFinite(t)) throw new Error('Still outside capture range');
        await writeFile(join(o.output,`at-${t.toFixed(3)}-${mode}.png`),await captureFrame(t));
      }
    } else {
      const audioList=join(temp,'audio.txt');
      await writeFile(audioList,meta.scenes.map(s=>`file '${resolve(project,s.audio_path).replaceAll('\\','/').replaceAll("'","'\\''")}'`).join('\n'));
      const part=join(temp,'render.mp4');
      encoder=spawn('ffmpeg',['-v','error','-f','image2pipe','-framerate',String(fps),'-i','pipe:0','-f','concat','-safe','0','-i',audioList,'-filter_complex',`[1:a]atrim=start=${start}:duration=${duration},asetpts=PTS-STARTPTS[a]`,'-map','0:v','-map','[a]','-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-c:a','aac','-t',String(duration),'-movflags','+faststart',part],{stdio:['pipe','inherit','inherit']});
      const done=once(encoder,'close');
      done.catch(()=>{}); // The frame loop observes failure below; avoid an early unhandled rejection.
      let pipeError; encoder.stdin.on('error',e=>{pipeError=e;});
      const count=Math.ceil(duration*fps);
      for(let f=0;f<count;f++) {
        const frame=await captureFrame(Math.min(start+f/fps,start+duration-1e-6));
        if(pipeError || encoder.exitCode!==null) throw pipeError??new Error('FFmpeg stopped');
        if(!encoder.stdin.write(frame)) await Promise.race([once(encoder.stdin,'drain'),done.then(()=>{throw new Error('FFmpeg stopped');})]);
        if(f%30===0) console.log(`${f}/${count} frames`);
      }
      encoder.stdin.end();
      const [code]=await done;if(code!==0) throw new Error(`FFmpeg exited ${code}`);
      await mkdir(dirname(resolve(o.output)),{recursive:true});
      const {copyFile}=await import('node:fs/promises');
      await copyFile(part,resolve(o.output),1);
    }
    const report={mode,fps,samples,shutter,start,duration,cuts,dimensions:session.dimensions,browser:await session.browser.version(),audio:'canonical per-scene WAVs',blend:'equal weights in linear sRGB light'};
    await writeFile(o.stills?join(o.output,'capture.json'):`${o.output}.json`,JSON.stringify(report,null,2));
    console.log(JSON.stringify(report));
  } finally {
    if(encoder && encoder.exitCode===null) encoder.kill();
    await session.browser.close();
    if(dirname(resolve(temp))!==resolve(tmpdir()) || !temp.includes('hf-motion-')) throw new Error('Refusing cleanup outside capture temp directory');
    await rm(temp,{recursive:true,force:true});
  }
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) main().catch(e=>{console.error(e);process.exitCode=1;});
