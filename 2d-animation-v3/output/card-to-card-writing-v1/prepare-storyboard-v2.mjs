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
import { vectorLibrary } from '../../workflow/graphic-library.ts';

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
const head = (x, y, w, h, copy, color = ink) => s('heading', x, y, w, h, color === coral ? '#A63828' : color, copy);
const line = (x, y, w, h, color = ink) => s('line', x, y, w, h, color);
const art = (id, x, y, width, color = coral, visibility = {}) => {
  const entry = vectorLibrary[id]; assert(entry, `Missing registered artwork: ${id}`);
  return { ...s('graphic-asset@2', x, y, width, width * 1080 / 1920 * entry.asset.height / entry.asset.width, color), asset: { id, contentHash: entry.contentHash }, parts: Object.fromEntries(entry.asset.layers.map(l => [l.id, { x: 0, y: 0, scale: 1, opacity: visibility[l.id] ?? 1, color, reveal: 1 }])) };
};
const regular = (x, y, w, copy, color = ink) => s('text', x, y, w, 3.6, color, copy);
const card = (x, y, w, color) => [art('credit-card-detail@1', x, y, w, color)];
const debt = (x, y, w = 24) => [art('debt-parcel-detail@1', x, y, w)];
const bill = closed => [art('card-bill-detail@1', 18, 28, 64, coral, { 'shutter-left': closed ? 1 : 0, 'shutter-right': closed ? 1 : 0 })];
const slot = () => [];
const frame = (shapes, family = 'editorial') => ({ background: paper, environment: { family, color: paper, accent: ink, depth: .8, texture: 'rough-paper@1' }, shapes });
const opening = closed => frame([r(10, 28.5, 46, 1, gold), ...bill(closed), ...card(closed ? 12 : 6, closed ? 63 : 69, 54, teal), ...(closed ? [art('lock-motion@1', 76, 57, 14, ink)] : []), regular(10, 12, 25, 'WHY'), head(10, 18, 82, 10, 'BLOCK THIS?', coral)]);
const twoCards = (destination) => frame([
  r(7, 29, 86, 35, '#E4D6BD'), ...card(7, 34, 40, teal), ...card(53, 34, 40, ink),
  ...debt(destination ? 60 : 14, 44, 27), r(10, 65, 80, 2, coral),
  r(34, 81, 47, 1, gold), regular(12, 72.8, 21, 'same'), head(34, 71, 52, 10, 'TOTAL', teal)
], 'geometric');
const route = approved => frame([
  art('document-editorial@1', 7, 31, 34),
  r(61, 42, 12, 26, teal), r(48, 61, 25, 7, teal), r(35, 42, 38, 7, teal),
  ...(!approved ? [r(62, 50, 10, 7, coral)] : []),
  ...card(10, 66, 54, ink), ...debt(19, 58, 25),
  art(approved ? 'check-motion@1' : 'lock-motion@1', 8, 17, 18),
  regular(30, 13, 40, 'issuer'), head(28, 19, 66, 10, approved ? 'APPROVED' : 'APPROVAL', approved ? teal : coral)
], 'technical-grid');
const feeFrame = attached => frame([
  ...card(13, 37, 72, ink), ...debt(29, 52, 32),
  r(attached ? 58 : 72, attached ? 57 : 65, 18, 10.125, gold), art('price-tag-motion@1', attached ? 58 : 72, attached ? 57 : 65, 18),
  regular(11, 15, 45, 'transfer'), head(11, 22, 80, 10, 'FEE + RATE', coral), r(11, 33, 78, 1, gold),
  r(15, 79, attached ? 72 : 62, 2, coral)
]);
const promoFrame = () => frame([
  ...card(13, 37, 72, ink), ...debt(29, 52, 32), r(58, 57, 18, 10.125, gold), art('price-tag-motion@1', 58, 57, 18),
  r(15, 79, 72, 2, coral), regular(11, 14, 45, 'IF PROMO'), art('clock-motion@1', 73, 11, 19),
  head(11, 22, 82, 10, 'RATE CHANGES', coral), r(11, 33, 80, 1, gold)
]);
const advance = end => frame([
  ...card(9, 22, 61, ink), art('document-editorial@1', 53, 40, 38),
  s('coin', end ? 62 : 19, end ? 53 : 41, 20, 11.25, teal),
  r(14, 62, end ? 33 : 10, 2, coral), art('price-tag-motion@1', 8, 58, 13),
  regular(11, 71.6, 26, end ? 'fees +' : 'cash'), head(37, 70, 58, 10, end ? 'INTEREST' : 'ADVANCE', end ? coral : ink)
], 'environment');
const payoff = end => frame([
  ...card(7, 42, 40, teal), ...card(53, 42, 40, ink), ...debt(59, 53, 27),
  r(82, 58, 13, 7.3125, gold), art('price-tag-motion@1', 82, 58, 13),
  r(10, 76, 74, 2, coral), r(84, 76, end ? 9 : 5, 2, gold),
  regular(12, 17, 38, end ? 'still' : 'first card'), head(12, 23, 79, 11, end ? 'OWED' : 'PAID OFF', end ? coral : teal), r(8, 23, 1, 11, gold)
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
  ['Purchase versus bill payment', 'visual-comparison', frame([art('terminal-motion@1', 8, 32, 46), ...card(29, 56, 61, teal), art('check-motion@1', 65, 35, 20), regular(12, 16, 34, 'at a'), head(12, 22, 74, 11, 'STORE', teal), r(12, 34, 62, 1, gold)]), frame(opening(true).shapes.map(item => item.label === 'WHY' ? { ...item, label: 'bill payment', width: 70 } : item.label === 'BLOCK THIS?' ? { ...item, label: 'BLOCKED' } : item)), 'A shop purchase reader receives the card; its gate opens in response. Cut back to the original bill and close its payment shutters. Receiving behavior establishes the difference; this is conceptual, not issuer UI.', 'Return to the exact bill/card composition from shot 1.'],
  ['The separate agreement', 'illustrated-workflow', route(false), route(true), 'Unfold the separate transfer bridge beside the still-blocked direct route. Approval changes its gate from closed to open. Keep the debt on its source card while approval is pending; no automatic approval or invented network sequence.', 'Coral is always borrowed principal; teal/navy preserve the two card identities.'],
  ['The debt changes cards', 'visual-comparison', twoCards(false), twoCards(true), 'Representative mechanism: lift the intact coral block from the teal card, carry it across and land it in the navy card. The destination pocket expands at impact and settles. The teal card empties. Keep the total rail identical throughout; no fee or cash payment appears here.', 'Preserve the debt silhouette and color from the approval scene. This sample needs normal-speed narrated review before full animation.'],
  ['Transfer cost and promotional expiry', 'illustrated-workflow', feeFrame(false), promoFrame(), 'First dock the gold transfer-fee tab against the coral principal and extend the total rail by that fee only. Reveal the rate terms. Only for the conditional promotional sentence, introduce the clock with IF PROMO. At expiry, replace its rate tag with post-promotion terms. Principal and fee remain separate; do not invent a rate or imply every transfer has a promo.', 'The same navy destination card, coral principal and gold fee persist; the clock is newly introduced only for promotional discussion.'],
  ['The cash-advance alternative', 'technical-cutaway', advance(false), advance(true), 'Show borrowed cash emerge from a card, then fund a bill. A fee tab attaches and the interest meter begins at the advance event, before cash reaches the bill. No withdrawal instructions or tutorial. This is a separate branch, not a transfer automatically classified as an advance.', 'Use an explicit hard cut to distinguish the alternative; teal cash differs from coral debt principal.'],
  ['A cleared card can leave the debt elsewhere', 'visual-comparison', payoff(false), payoff(true), 'Return to the same teal and navy cards: the first has no debt block, the second retains principal and its fee tab. Isolate the second card with a purposeful inspection punch-in, then settle with the full principal still visible. Preserve the fee and show its contribution to the total.', 'Return to shot 4 card positions and colors. Do not let the fee disappear at the payoff.']
];
const shots = plans.map(([title, family, startFrame, endFrame, action, continuity], i) => ({
  lineNumbers: [lines[i].number], seconds: Math.round(lines[i].text.split(/\s+/).length / 2.5 * 10) / 10,
  purpose: title, framing: 'Portrait 1080×1920. Detailed registered editorial artwork, mixed regular/bold copy with different sizes and colors; endpoints reviewed at 360×640.',
  subject: 'Recognizable credit cards and bill, one persistent coral principal block, separate gold fee where discussed.',
  action, transition: i === 0 ? 'start' : 'hard-cut', continuity, startFrame, endFrame,
  design: { theme: 'editorial-workflow@1', family, meaning: title, metaphor: 'The bill is a payment machine; moving debt requires a separate approved route.', focalPoint: i === 3 ? 'The intact detailed debt parcel landing in the receiving card.' : 'One causal change supported by detailed recognizable artwork.', layout: ['Small regular WHY above oversized coral BLOCK THIS, with a gold underline.', 'Split-scale regular lead and bold store/status word; oversized checkout illustration.', 'Right-offset approval word, small issuer lead, and an illustrated seal.', 'Lower lockup: small regular same next to large teal TOTAL; cards occupy the upper field.', 'Small conditional lead and large coral rate terms; clock appears only in conditional promo state.', 'Low horizontal lockup with regular lead and large contrasting keyword under the mechanism.', 'Large coral payoff word below a quiet regular lead; detailed cards and fee below.'][i], density: 'sparse', continuityReason: continuity.slice(0, 300) }
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
    const request = { kind: 'storyboard', scriptId, selectionId, baseId: prior, shotIndex: null, instruction: 'User revision: dynamic typography with mixed sizes, weights and colors, plus detailed recognizable graphics and suitable icons. Coordinator-authored concept-1 storyboard. Exact script preserved. Registered detailed card, bill and principal parcel; existing lock/check/clock/fee/document icons. Regular 400 lead plus bold 700 keyword, split scale, contrast color, attached underline. Static rough-paper@1. Two essential text actors maximum. Estimated durations; no narration yet. Later energyProfile intense; 6–12-frame entrances and 8–18-frame focal actions, preset minima and reading holds respected. No SFX, music or captions. No storyboard acceptance inferred.' };
    const id = store.begin(projectId, request, 'codex-coordinator-authored');
    store.complete(projectId, id, { shots }); artifact = store.read(projectId, id);
  }
  assert.equal(artifact.selectionId, selectionId); assert.equal(store.acceptance(projectId), null);
} finally { store.close(); }
const out = join(config.videosDirectory, projectId, 'review', 'storyboard-' + artifact.id);
mkdirSync(out, { recursive: true });
const review = inspectGraphics(artifact);
assert.equal(review.findings.length, 0, JSON.stringify(review.findings));
for (const shot of artifact.output.shots) for (const state of ['startFrame', 'endFrame']) {
  const labels = shot[state].shapes.filter(item => ['text', 'heading'].includes(item.type));
  assert.equal(labels.length, 2);
  assert(labels.some(item => item.type === 'text') && labels.some(item => item.type === 'heading'));
  assert(shot[state].shapes.some(item => item.asset));
}
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
const typographyPlan = [
  { shot: 1, lead: 'WHY', keyword: 'BLOCK THIS?', treatments: ['mask-rise@1', 'pop-settle@1'], decoration: 'Short gold underline follows the keyword.' },
  { shot: 2, lead: 'at a / bill payment', keyword: 'STORE / BLOCKED', treatments: ['word-stagger@1', 'highlight-sweep@1'], decoration: 'Keep the bill continuity underline attached; no new header band.' },
  { shot: 3, lead: 'issuer', keyword: 'APPROVAL / APPROVED', treatments: ['tracking-settle@1', 'blur-resolve@1'], decoration: 'Approval icon lands beside the keyword after the gate changes.' },
  { shot: 4, lead: 'same', keyword: 'TOTAL', treatments: ['tracking-settle@1', 'underline-draw@1'], decoration: 'The total reference stays stable during debt movement; animate its introduction only.' },
  { shot: 5, lead: 'transfer / IF PROMO', keyword: 'FEE + RATE / RATE CHANGES', treatments: ['wipe-reveal@1', 'highlight-sweep@1'], decoration: 'Gold rule belongs to the label; clock appears only with the conditional promo wording.' },
  { shot: 6, lead: 'cash / fees +', keyword: 'ADVANCE / INTEREST', treatments: ['word-stagger@1', 'mask-rise@1'], decoration: 'Low horizontal lockup follows the alternative branch.' },
  { shot: 7, lead: 'first card / still', keyword: 'PAID OFF / OWED', treatments: ['wipe-reveal@1', 'pop-settle@1'], decoration: 'Short vertical gold rule stays attached to the payoff keyword.' }
];
writeFileSync(join(out, 'typography-plan.json'), JSON.stringify({ status: 'Planned for the later motion stage; not animated or approved.', defaultWeights: { lead: 400, keyword: 700 }, timing: 'Use 6–18-frame treatments after the root entrance settles, within measured narration; preserve reading holds.', unsupportedQuota: 'Typewriter and character-rise are omitted here because there is no typed input, short name or acronym that needs them. Do not add copy to fill the ten-style catalog.', scenes: typographyPlan }, null, 2));
receipt.typography = 'Every endpoint has a regular-weight lead and bold keyword, mixed scale and color. No thin weight or rich-text engine extension claimed.';
writeFileSync(join(out, 'review-receipt.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({ artifactId: artifact.id, selectionId, estimatedSeconds: receipt.durationEstimatedSeconds, findings: review.findings.map(f => ({ rule: f.rule, shotIndex: f.shotIndex, message: f.message })), output: out }, null, 2));
