import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { openVisuals } from '../server/visual-store.ts';
import { openProduction } from '../server/production-store.ts';
const {chromium}=await import(process.env.V3_PLAYWRIGHT_MODULE);
const root=resolve(process.argv[2]),seed=JSON.parse(readFileSync(join(root,'seed.json'))),store=openVisuals(seed.database,seed.videos);
const original=store.read(seed.projectId,seed.boardId),bytes=readFileSync(join(seed.videos,seed.projectId,'visuals',`${seed.boardId}.json`));
const browser=await chromium.launch({executablePath:process.env.V3_CHROME_PATH,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:3003/motion-library?project=${seed.projectId}&shot=1`);await page.getByLabel('Capability',{exact:true}).selectOption('variable-type');
 await page.getByRole('link',{name:'Use in shot 2',exact:true}).click();await page.getByRole('button',{name:'Propose capability in shot 2',exact:true}).click();
 await page.waitForURL(url=>url.searchParams.has('run'),{timeout:30000});const id=new URL(page.url()).searchParams.get('run');assert.notEqual(id,seed.boardId);
 const proposed=store.read(seed.projectId,id);assert.deepEqual(proposed.output.shots[0],original.output.shots[0]);assert.deepEqual(proposed.output.shots[2],original.output.shots[2]);assert.deepEqual(readFileSync(join(seed.videos,seed.projectId,'visuals',`${seed.boardId}.json`)),bytes);assert.equal(store.acceptance(seed.projectId).runId,seed.boardId);assert.equal(store.acceptance(seed.projectId).stale,true);
 await page.screenshot({path:join(root,'proposal-desktop.png'),fullPage:true});
 await page.getByRole('button',{name:'Accept storyboard',exact:true}).click();await page.waitForTimeout(800);assert.equal(store.acceptance(seed.projectId).runId,id);await page.reload();await page.getByRole('button',{name:'Storyboard accepted',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:join(root,'studio-phone.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const production=openProduction(seed.database,seed.videos);try{const status=production.status(seed.projectId);assert.equal(status.gate1,null);assert.equal(status.gate2,null);}finally{production.close();}
 assert.deepEqual(errors,[]);writeFileSync(join(root,'verification.json'),JSON.stringify({syntheticOnly:true,provider:'fixture-model',liveModel:false,humanAcceptance:false,projectId:seed.projectId,baseBoardId:seed.boardId,proposalId:id,unchangedNeighbors:true,originalBytesPreserved:true,pendingBeforeExplicitTestAcceptance:true,syntheticAcceptanceReloaded:true,productionGates:false,phoneWidth:390,noHorizontalOverflow:true,errors},null,2));console.log(root);
}finally{await browser.close();store.close();}
