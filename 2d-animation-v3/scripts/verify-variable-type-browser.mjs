import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const {chromium}=await import(process.env.V3_PLAYWRIGHT_MODULE);
const output=resolve(`.data/variable-type-mounted-${Date.now()}`);mkdirSync(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.V3_CHROME_PATH,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:1000}}), errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(`${process.env.V3_STUDIO_URL ?? 'http://127.0.0.1:3004'}/motion-library`);await page.getByLabel('Capability',{exact:true}).selectOption('variable-type');
 const svg=page.locator('svg[data-motion-frame]'), slider=page.getByLabel('Inspect frame',{exact:true});
 const seek=async frame=>{await slider.evaluate((el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(value));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},frame);await page.waitForFunction(f=>document.querySelector('svg[data-motion-frame]')?.getAttribute('data-motion-frame')===String(f % 120),frame);await page.waitForFunction(()=>document.querySelector('[data-variable-type][data-font-ready="true"]'));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));};
 const mounted=[];
 for(const frame of [42,162,282,402,522]) {
  await seek(frame);const before=await svg.evaluate(el=>el.outerHTML),path=join(output,`${frame}-before.png`);await svg.screenshot({path});
  await seek(599);await seek(0);await seek(frame);const returned = await svg.evaluate(el=>el.outerHTML);writeFileSync(join(output,`${frame}-before.svg`),before);writeFileSync(join(output,`${frame}-after.svg`),returned);assert.ok(returned===before,`SVG return ${frame}`);
  const after=join(output,`${frame}-after.png`);await svg.screenshot({path:after});assert.ok(readFileSync(path).equals(readFileSync(after)),`PNG return ${frame}`);
  mounted.push({frame,exactSvg:true,exactPng:true});
 }
 await seek(0);await svg.click({position:{x:80,y:80}});await page.waitForTimeout(600);const first=Number(await svg.getAttribute('data-motion-frame'));await page.waitForTimeout(600);const second=Number(await svg.getAttribute('data-motion-frame'));assert.ok(second>first,'Playback must move');await svg.click({position:{x:80,y:80}});
 await seek(522);await page.screenshot({path:join(output,'desktop.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:join(output,'phone.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Phone horizontal overflow');
 const geometry=await svg.locator('[data-variable-glyph]').evaluateAll(els=>els.map(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}}));assert.ok(geometry.every(b=>b.x>=0&&b.x+b.width<=390));assert.ok(geometry.every(b=>b.height>=18),'Phone glyph height');
 assert.deepEqual(errors,[]);
 writeFileSync(join(output,'verification.json'),JSON.stringify({syntheticOnly:true,humanAcceptance:false,mounted,playback:{first,second},phone:{width:390,noHorizontalOverflow:true,glyphBounds:geometry},errors},null,2));console.log(output);
}catch(error){await page.screenshot({path:join(output,'failure.png'),fullPage:true});writeFileSync(join(output,'failure.json'),JSON.stringify({error:error.message,errors,sliders:await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>({value:e.value,max:e.max}))),frames:await page.locator('svg[data-motion-frame]').evaluateAll(els=>els.map(e=>({frame:e.getAttribute('data-motion-frame'),group:e.getAttribute('data-motion-group')})))}));throw error;}finally{await browser.close();}
