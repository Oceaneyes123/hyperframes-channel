import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { readConfig } from '../../server/config.ts';
import { openStudio } from '../../server/studio.ts';
import { openVisuals } from '../../server/visual-store.ts';
import { inspectGraphics } from '../../engine/quality/inspect-graphics.ts';
import { scriptLines, storyboardSchema } from '../../workflow/visuals.ts';

registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); }
    catch (error) {
      if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
        const base = resolve(dirname(fileURLToPath(context.parentURL)), specifier);
        for (const extension of ['.ts', '.tsx']) if (existsSync(base + extension)) return next(pathToFileURL(base + extension).href, context);
      }
      throw error;
    }
  },
  load(url, context, next) {
    if (url.startsWith('file:') && url.endsWith('.json')) return next(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } });
    if (url.startsWith('file:') && url.endsWith('.tsx') && !url.includes('/node_modules/')) return { format: 'module', source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText, shortCircuit: true };
    return next(url, context);
  }
});
const { default: PlanningFrame } = await import('../../app/projects/[id]/visuals/frame.tsx');
const projectId = '5a474ca9-fb23-4989-a680-9ca755d3fc0f';
const scriptId = '0f481f06-ba63-4d46-8767-6357e02f0137';
const conceptId = 'e76a3238-822a-4d3f-98f1-5eceb38bc50b';
const ink = '#172D38', teal = '#167477', coral = '#B74731', paper = '#F4E9D5', cream = '#FFF9EA', gold = '#D4B16A';
const s = (type, x, y, width, height, color, label = '') => ({ type, x, y, width, height, color, label });
const r = (x, y, w, h, color) => s('rect', x, y, w, h, color);
const text = (x, y, w, h, copy, color = ink) => s('centered-text', x, y, w, h, color, copy);
const head = (x, y, w, h, copy, color = ink) => s('heading', x, y, w, h, color, copy);
const line = (x, y, w, h, color = ink) => s('line', x, y, w, h, color);
const card = (x, y, w, color) => [r(x, y, w, w * .355, color), r(x + w * .12, y + w * .07, w * .16, w * .08, gold)];
const debt = (x, y, w = 24, h = 13) => [r(x, y, w, h, coral), text(x, y, w, h, 'DEBT', cream)];
const bill = () => [r(9, 27, 84, 52, '#D8C9B0'), r(7, 25, 84, 52, cream), r(17, 34, 57, 1, '#B9AB96')];
const slot = (closed) => [r(21, 49, 63, 12, ink), r(22, 50, closed ? 30 : 6, 10, coral), r(closed ? 53 : 77, 50, closed ? 30 : 6, 10, coral)];
const frame = (shapes, family = 'editorial') => ({ background: paper, environment: { family, color: paper, accent: ink, depth: .8, texture: 'rough-paper@1' }, shapes });
const opening = closed => frame([...bill(), head(12, 13, 77, 10, 'WHY BLOCK THIS?'), ...slot(closed), ...card(closed ? 10 : 4, closed ? 61 : 70, 60, teal)]);
const twoCards = (destination) => frame([
  r(7, 29, 86, 40, '#E4D6BD'), ...card(8, 37, 38, teal), ...card(54, 37, 38, ink),
  ...debt(destination ? 60 : 14, 48, 26, 13), r(10, 69, 80, 2, coral), r(10, 72, 80, 5, ink),
  head(12, 82, 72, 9, 'SAME TOTAL')
], 'geometric');
const route = approved => frame([
  r(10, 24, 28, 14, cream), r(16, 32, 16, 3, coral),
  r(61, 30, 16, 37, teal), r(48, 60, 29, 7, teal), r(36, 30, 41, 7, teal),
  ...(!approved ? [r(62, 42, 14, 8, coral)] : []),
  ...card(9, 72, 54, ink), r(20, 65, 23, 12, coral),
  text(42, 16, 48, 8, approved ? 'APPROVED' : 'APPROVAL')
], 'technical-grid');
const feeFrame = attached => frame([
  ...card(13, 35, 72, ink), r(32, 49, 35, 19, coral), r(attached ? 67 : 74, attached ? 51 : 69, 10, 15, gold),
  text(16, 22, 66, 7, 'FEE + RATE'), r(15, 77, attached ? 72 : 62, 4, coral),
  r(16, 13, 66, 3, gold)
]);
const promoFrame = () => frame([
  ...card(13, 35, 72, ink), r(32, 49, 35, 19, coral), r(67, 51, 10, 15, gold), r(15, 77, 72, 4, coral),
  text(13, 14, 74, 7, 'IF PROMO'), r(13, 23, 74, 2, gold),
  s('ellipse', 39, 26, 22, 12.375, cream), line(50, 28, .2, 5),
  text(17, 85, 66, 7, 'RATE CHANGES')
]);
const advance = end => frame([
  ...card(10, 28, 63, ink), r(14, 51, 29, 11, teal),
  r(57, 52, 29, 26, cream), r(61, 58, 21, 1, '#B9AB96'),
  r(end ? 61 : 20, end ? 67 : 51, 15, 9, teal), r(14, 73, end ? 30 : 9, 4, coral), r(10, 73, 4, 4, gold),
  head(10, 14, 78, 8, 'CASH ADVANCE'), text(8, 84, 84, 7, end ? 'FEES + INTEREST' : 'BORROWED CASH')
], 'environment');
const payoff = end => frame([
  ...card(8, 36, 38, teal), ...card(54, 36, 38, ink),
  r(60, 48, 26, 14, coral), r(86, 50, 7, 11, gold),
  r(10, 71, 80, 4, coral), r(90, 71, end ? 5 : 2, 4, gold),
  text(end ? 52 : 8, end ? 64 : 23, 40, 8, end ? 'STILL OWED' : 'PAID OFF'), text(14, 82, 70, 7, 'SAME DEBT + FEE')
]);
const config = readConfig();
const studio = openStudio(config.dataDirectory, config.videosDirectory);
let script;
try {
  const approval = studio.acceptance(projectId);
  assert.equal(approval.revisionId, scriptId); assert.equal(approval.stale, false);
  script = studio.readRevision(projectId, scriptId).content;
  assert.equal(script, readFileSync('./output/card-to-card-writing-v1/script-v2.txt', 'utf8'));
} finally { studio.close(); }
const lines = scriptLines(script);
assert.equal(lines.length, 7);
const plans = [
  ['The blocked bill', 'visual-metaphor', opening(false), opening(true), 'Card starts approaching the open bill slot. Shutters close before entry; card stops on contact. Housing compresses once and settles. Do not show a transaction reaching a network. Keep the question audible from the opening; its full duration is not forced into two seconds.', 'The requested opening, with the card and bill already visible at frame zero.'],
  ['Purchase versus bill payment', 'visual-comparison', frame([...card(10, 52, 60, teal), r(18, 24, 65, 21, cream), r(24, 38, 53, 7, ink), head(13, 13, 74, 8, 'AT A STORE')]), opening(true), 'A shop purchase reader receives the card; its gate opens in response. Cut back to the original bill and close its payment shutters. Receiving behavior establishes the difference; this is conceptual, not issuer UI.', 'Return to the exact bill/card composition from shot 1.'],
  ['The separate agreement', 'illustrated-workflow', route(false), route(true), 'Unfold the separate transfer bridge beside the still-blocked direct route. Approval changes its gate from closed to open. Keep the debt on its source card while approval is pending; no automatic approval or invented network sequence.', 'Coral is always borrowed principal; teal/navy preserve the two card identities.'],
  ['The debt changes cards', 'visual-comparison', twoCards(false), twoCards(true), 'Representative mechanism: lift the intact coral block from the teal card, carry it across and land it in the navy card. The destination pocket expands at impact and settles. The teal card empties. Keep the total rail identical throughout; no fee or cash payment appears here.', 'Preserve the debt silhouette and color from the approval scene. This sample needs normal-speed narrated review before full animation.'],
  ['Transfer cost and promotional expiry', 'illustrated-workflow', feeFrame(false), promoFrame(), 'First dock the gold transfer-fee tab against the coral principal and extend the total rail by that fee only. Reveal the rate terms. Only for the conditional promotional sentence, introduce the clock with IF PROMO. At expiry, replace its rate tag with post-promotion terms. Principal and fee remain separate; do not invent a rate or imply every transfer has a promo.', 'The same navy destination card, coral principal and gold fee persist; the clock is newly introduced only for promotional discussion.'],
  ['The cash-advance alternative', 'technical-cutaway', advance(false), advance(true), 'Show borrowed cash emerge from a card, then fund a bill. A fee tab attaches and the interest meter begins at the advance event, before cash reaches the bill. No withdrawal instructions or tutorial. This is a separate branch, not a transfer automatically classified as an advance.', 'Use an explicit hard cut to distinguish the alternative; teal cash differs from coral debt principal.'],
  ['A cleared card can leave the debt elsewhere', 'visual-comparison', payoff(false), payoff(true), 'Return to the same teal and navy cards: the first has no debt block, the second retains principal and its fee tab. Isolate the second card with a purposeful inspection punch-in, then settle with the full principal still visible. Preserve the fee and show its contribution to the total.', 'Return to shot 4 card positions and colors. Do not let the fee disappear at the payoff.']
];
const shots = plans.map(([title, family, startFrame, endFrame, action, continuity], i) => ({
  lineNumbers: [lines[i].number], seconds: Math.round(lines[i].text.split(/\s+/).length / 2.5 * 10) / 10,
  purpose: title, framing: 'Portrait 1080×1920. Large objects and quiet text areas; endpoints reviewed at 360×640.',
  subject: 'Recognizable credit cards and bill, one persistent coral principal block, separate gold fee where discussed.',
  action, transition: i === 0 ? 'start' : 'hard-cut', continuity, startFrame, endFrame,
  design: { theme: 'editorial-workflow@1', family, meaning: title, metaphor: 'The bill is a payment machine; moving debt requires a separate approved route.', focalPoint: i === 3 ? 'The intact debt block landing in the receiving card.' : 'The single causal change described in this shot.', layout: 'Oversized object-led portrait composition; no repeated header band.', density: 'sparse', continuityReason: continuity.slice(0, 300) }
}));
storyboardSchema.parse({ shots });
const store = openVisuals(config.dataDirectory, config.videosDirectory);
let artifact, selectionId;
try {
  let choice = store.selection(projectId);
  if (!choice) {
    selectionId = store.choose(projectId, conceptId, 0, null);
    choice = store.selection(projectId);
  }
  assert.equal(choice.runId, conceptId); assert.equal(choice.optionIndex, 0); selectionId = choice.id;
  const prior = store.latest(projectId, 'storyboard');
  if (prior) artifact = store.read(projectId, prior);
  if (!artifact || JSON.stringify(artifact.output.shots) !== JSON.stringify(shots)) {
    const request = { kind: 'storyboard', scriptId, selectionId, baseId: prior, shotIndex: null, instruction: 'Coordinator-authored storyboard for user-selected concept 1. Exact script preserved. Estimated durations only; no narration yet. rough-paper@1, two essential labels maximum. Later energyProfile intense; 6–12-frame entrances and 8–18-frame focal actions, preset minima and reading holds respected. No SFX, music or captions. No storyboard acceptance inferred.' };
    const id = store.begin(projectId, request, 'codex-coordinator-authored');
    store.complete(projectId, id, { shots }); artifact = store.read(projectId, id);
  }
  assert.equal(artifact.selectionId, selectionId); assert.equal(store.acceptance(projectId), null);
} finally { store.close(); }
const out = join(config.videosDirectory, projectId, 'review', 'storyboard-' + artifact.id);
mkdirSync(out, { recursive: true });
const review = inspectGraphics(artifact);
writeFileSync(join(out, 'graphics-report.json'), JSON.stringify(review, null, 2));
const sections = [], ends = [];
for (const [i, shot] of artifact.output.shots.entries()) {
  const images = [];
  for (const state of ['start', 'end']) {
    const svg = renderToStaticMarkup(React.createElement(PlanningFrame, { frame: shot[state + 'Frame'], label: `${i + 1}. ${shot.purpose}: ${state}` }));
    assert(svg.includes('rough-paper@1'));
    const name = `shot-${i + 1}-${state}`;
    writeFileSync(join(out, name + '.svg'), svg);
    await sharp(Buffer.from(svg)).resize(360, 640).png().toFile(join(out, name + '.png'));
    images.push(`<figure><img src="${name}.png" alt="Shot ${i + 1} ${state}"><figcaption>${state}</figcaption></figure>`);
  }
  ends.push({ input: join(out, `shot-${i + 1}-end.png`), left: i % 3 * 360, top: Math.floor(i / 3) * 640 });
  sections.push(`<section><h2>${i + 1}. ${shot.purpose}</h2><p>${lines[i].text}</p><div class="pair">${images.join('')}</div><p>${shot.action}</p><p>Continuity: ${shot.continuity}</p><p>Estimated: ${shot.seconds}s. Not measured narration.</p></section>`);
}
await sharp({ create: { width: 1080, height: 1920, channels: 3, background: paper } }).composite(ends).png().toFile(join(out, 'endpoints.png'));
await sharp({ create: { width: 720, height: 640, channels: 3, background: paper } }).composite(['start', 'end'].map((state, i) => ({ input: join(out, `shot-4-${state}.png`), left: i * 360, top: 0 }))).png().toFile(join(out, 'mechanism-pair.png'));
writeFileSync(join(out, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Credit-card storyboard review</title><style>body{margin:24px;background:#eee9df;color:#172d38;font:16px/1.5 Arial}section{margin:40px 0;max-width:760px}.pair{display:flex;gap:16px;flex-wrap:wrap}figure{margin:0}img{width:360px;max-width:100%;height:auto}p{max-width:75ch}h1{font-size:26px}h2{font-size:21px}</style><h1>Storyboard review: the bill closes its slot</h1><p>Seven scenes, exact approved narration, static V3 planning endpoints. Concept 1 selected by the user. No narration, timing, motion or storyboard approval claimed. The fee/rate/promo scene also requires intermediate drawing review before animation.</p><p>Entrances target 6–12 frames and focused actions 8–18 frames at 30fps, respecting preset minima and comprehension holds. No audio cues, music or captions. Durations remain estimates; the voice must not be accelerated.</p>${sections.join('')}<p>Source: coordinator-authored and validated through V3 stores. Images use the existing V3 PlanningFrame renderer, rasterized by installed sharp. These previews do not prove Chromium video output or motion quality.</p></html>`);
const receipt = { projectId, scriptId, selectionId, conceptId, conceptIndex: 0, userSelection: 'I choose the recommended', artifactId: artifact.id, storyboardApproved: false, durationEstimatedSeconds: shots.reduce((sum, shot) => sum + shot.seconds, 0), energyProfile: 'intense', music: false, sfx: false, captions: false, sourceHash: createHash('sha256').update(JSON.stringify(artifact)).digest('hex'), graphicsFindings: review.findings, output: out };
writeFileSync(join(out, 'review-receipt.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({ artifactId: artifact.id, selectionId, estimatedSeconds: receipt.durationEstimatedSeconds, findings: review.findings.map(f => ({ rule: f.rule, shotIndex: f.shotIndex, message: f.message })), output: out }, null, 2));
