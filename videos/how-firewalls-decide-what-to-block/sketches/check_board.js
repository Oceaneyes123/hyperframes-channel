async (page) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://127.0.0.1:3047/sketches/board.html');
  await page.waitForSelector('body[data-ready="true"]');
  await page.evaluate(() => document.fonts.ready);
  const structure = await page.evaluate(async () => {
    const [script, storyboard, plan, meta] = await Promise.all([
      fetch('../SCRIPT.md').then(r => r.text()), fetch('../STORYBOARD.md').then(r => r.text()),
      fetch('../ICON_PLAN.json').then(r => r.json()), fetch('../audio_meta.json').then(r => r.json())
    ]);
    const narration = [...script.matchAll(/^ {4}(.+)$/gm)].map(m => m[1]);
    const copied = [...storyboard.matchAll(/^- voiceover: (.+)$/gm)].map(m => m[1]);
    const visible = [...document.querySelectorAll('.narration')].map(e => e.textContent);
    const assets = await Promise.all([...new Set(plan.icons.map(i => i.path))].map(async path => ({path,ok:(await fetch(`../${path}`)).ok})));
    const bounds = [];
    for (const svg of document.querySelectorAll('.sketch')) {
      for (const label of svg.querySelectorAll('text[data-teaching]')) {
        if (!label.textContent) continue;
        const b = label.getBBox();
        if (b.x < 72 || b.y < 180 || b.x+b.width > 936 || b.y+b.height > 1600) bounds.push({scene:svg.dataset.scene,pose:svg.dataset.pose,text:label.textContent,box:{x:b.x,y:b.y,w:b.width,h:b.height}});
      }
    }
    const sprite = new DOMParser().parseFromString(await fetch('../channel/artwork/flow-props.svg').then(r=>r.text()), 'image/svg+xml');
    const missingSymbols = [...document.querySelectorAll('use')].map(e=>e.getAttribute('href').split('#')[1]).filter(id=>!sprite.getElementById(id));
    return {narration,copied,visible,assets,bounds,missingSymbols,sections:document.querySelectorAll('section').length,poses:document.querySelectorAll('.sketch').length,total:[...storyboard.matchAll(/^- duration: (\d+(?:\.\d+)?)s$/gm)].reduce((sum,m)=>sum+Number(m[1]),0),measured:meta.timeline_duration_s,width:document.documentElement.scrollWidth};
  });
  const ensure = (condition, message) => { if (!condition) throw new Error(message); };
  const output = 'D:/Project/Javascript/hyperframes-channel/videos/how-firewalls-decide-what-to-block/output/playwright-revised-gate1';
  ensure(structure.sections === 12 && structure.poses === 36, 'Need every scene and three poses each');
  ensure(JSON.stringify(structure.narration) === JSON.stringify(structure.copied), 'Storyboard narration differs from canonical script');
  ensure(JSON.stringify(structure.narration) === JSON.stringify(structure.visible), 'Review board does not show complete canonical narration');
  ensure(Math.abs(structure.total-structure.measured)<.001, 'Board scene windows differ from measured audio');
  ensure(structure.narration.join(' ').split(/\s+/).length === 332, 'Revised complete narration word count changed');
  ensure(structure.total < 180, 'Revised planning estimate must be under three minutes');
  ensure(structure.assets.every(a=>a.ok), `Missing local assets: ${JSON.stringify(structure.assets)}`);
  ensure(!structure.missingSymbols.length, `Missing local symbol layers: ${structure.missingSymbols}`);
  ensure(!structure.bounds.length, `Unsafe teaching text: ${JSON.stringify(structure.bounds)}`);
  await page.setViewportSize({width:1160,height:900});
  await page.screenshot({path:`${output}/desktop.png`});
  for (let scene=1; scene<=12; scene++) {
    for (let pose=0; pose<3; pose++) {
      await page.locator(`.sketch[data-scene="${scene}"][data-pose="${pose}"]`).screenshot({path:`${output}/scene-${String(scene).padStart(2,'0')}-pose-${pose}.png`});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('header').scrollIntoViewIfNeeded();
  ensure(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth), 'Mobile horizontal overflow');
  await page.screenshot({path:`${output}/mobile.png`});
  ensure(!errors.length, `Browser/asset errors: ${errors.join('; ')}`);
  return {pass:true,scenes:structure.sections,poses:structure.poses,narrationExact:true,localAssets:true,safeAreaText:true,mobileOverflow:false,totalEstimateSeconds:structure.total,captures:output};
}
