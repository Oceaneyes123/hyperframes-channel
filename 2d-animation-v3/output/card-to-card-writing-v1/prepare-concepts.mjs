import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import assert from 'node:assert/strict';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { readConfig } from '../../server/config.ts';
import { openVisuals } from '../../server/visual-store.ts';

// Render the existing TSX planning component without starting the whole Next app.
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
    if (url.startsWith('file:') && url.endsWith('.tsx') && !url.includes('/node_modules/')) {
      return { format: 'module', source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText, shortCircuit: true };
    }
    return next(url, context);
  }
});
const { default: PlanningFrame } = await import('../../app/projects/[id]/visuals/frame.tsx');
const { conceptsSchema } = await import('../../workflow/visuals.ts');
const projectId = '5a474ca9-fb23-4989-a680-9ca755d3fc0f';
const scriptId = '0f481f06-ba63-4d46-8767-6357e02f0137';
const ink = '#172D38', teal = '#167477', coral = '#B74731', paper = '#F4E9D5';
const shape = (type, x, y, width, height, color, label = '') => ({ type, x, y, width, height, color, label });
const rect = (x, y, w, h, color) => shape('rect', x, y, w, h, color);
const label = (x, y, w, h, text, color = ink) => shape('heading', x, y, w, h, color, text);
const card = (x, y, w, color) => [rect(x, y, w, w * .355, color), rect(x + w * .12, y + w * .07, w * .16, w * .08, '#D4B16A'), rect(x + w * .12, y + w * .23, w * .56, .6, '#D9E4DD')];
const frame = (family, shapes) => ({ background: paper, environment: { family, color: paper, accent: ink, depth: .8, texture: 'rough-paper@1' }, shapes });
const concepts = conceptsSchema.parse({ concepts: [
  {
    title: 'The bill closes its slot',
    metaphor: 'A bill is a physical payment machine with one closed direct slot and a separate approved transfer channel.',
    teachingApproach: 'Begin with the requested blocked card. Reveal the debt block behind the bill, then follow it through a distinct approved channel. The same block survives the transfer.',
    visualLanguage: 'Oversized cream bill, teal card, coral shutters and debt. Static coarse paper, offset ink planes, freestanding type. Impact compresses the slot housing; a receiving card opens and settles on the debt landing.',
    frame: frame('editorial', [
      rect(9, 27, 84, 52, '#D8C9B0'), rect(7, 25, 84, 52, '#FFF9EA'),
      label(12, 13, 77, 10, 'WHY BLOCK THIS?'),
      rect(17, 34, 57, 1, '#B9AB96'), rect(17, 38, 40, 1, '#B9AB96'),
      rect(21, 49, 63, 12, ink), rect(22, 50, 30, 10, coral), rect(53, 50, 30, 10, coral),
      ...card(10, 65, 60, teal), rect(74, 51, 3, 8, '#E4B794')
    ])
  },
  {
    title: 'The debt stays on the scale',
    metaphor: 'Two credit cards sit above a single total-debt platform; moving the debt between them cannot shrink that platform.',
    teachingApproach: 'Keep the requested blocked-bill opening, then center the conservation demonstration. The same coral block leaves the first card and lands on the second while the total bar stays fixed. Add fees as a separate extension later.',
    visualLanguage: 'Broad navy support platform, two large card pockets and one coral block. Horizontal transfer dominates. The receiving pocket expands on landing; the fixed lower total is the stable visual reference.',
    frame: frame('geometric', [
      label(10, 14, 72, 9, 'SAME TOTAL'), rect(10, 68, 80, 6, ink), rect(20, 74, 60, 3, '#D8C9B0'),
      ...card(7, 37, 39, teal), ...card(54, 37, 39, ink),
      rect(60, 48, 26, 13, coral), shape('centered-text', 60, 49, 26, 11, '#FFF9EA', 'DEBT'),
      rect(10, 65, 80, 1, coral)
    ])
  },
  {
    title: 'One blocked route, one approved bridge',
    metaphor: 'Direct bill payment is a closed doorway; a balance transfer is a separate bridge with its own approval gate.',
    teachingApproach: 'Keep the requested opening. Pull back to reveal physically separate routes. A closed direct slot remains visible while approval opens the transfer bridge. Follow one debt block, then attach the fee and conditional promotional clock.',
    visualLanguage: 'Vertical composition with card at the bottom and bill above. Coral blocks the short direct route; teal frames the separate bridge. Approval changes a gate, never an invented network-processing state.',
    frame: frame('technical-grid', [
      rect(13, 15, 48, 26, '#FFF9EA'), rect(20, 22, 32, 1, '#B9AB96'),
      rect(23, 33, 26, 6, coral), rect(32, 40, 7, 17, '#D8C9B0'),
      rect(65, 30, 15, 40, teal), rect(61, 63, 19, 7, teal), rect(59, 30, 21, 7, teal),
      shape('centered-text', 47, 18, 47, 7, teal, 'APPROVED'),
      ...card(10, 71, 56, ink), rect(66, 43, 13, 12, coral),
      label(10, 57, 44, 7, 'TRANSFER', ink)
    ])
  }
] });
const config = readConfig();
const store = openVisuals(config.dataDirectory, config.videosDirectory);
let artifact;
try {
  const existing = store.latest(projectId, 'concepts');
  if (existing) artifact = store.read(projectId, existing);
  if (!artifact || JSON.stringify(artifact.output.concepts) !== JSON.stringify(concepts.concepts)) {
    assert.equal(store.selection(projectId), null);
    const request = { kind: 'concepts', scriptId, selectionId: null, baseId: existing, shotIndex: null, instruction: 'Coordinator-authored concept proposals. Gateway unavailable; no gateway generation claimed. Preserve exact approved script. Opening: card approaches bill, slot closes, receiver reacts. rough-paper@1; maximum two essential labels. Later motion energyProfile intense. No music, SFX or captions. No concept choice or approval inferred.' };
    const id = store.begin(projectId, request, 'codex-coordinator-authored');
    store.complete(projectId, id, concepts);
    artifact = store.read(projectId, id);
  }
  assert.equal(artifact.scriptId, scriptId);
  assert.equal(artifact.output.kind, 'concepts');
  assert.equal(store.selection(projectId), null);
  assert.equal(artifact.output.concepts.length, 3);
} finally { store.close(); }
const out = join(config.videosDirectory, projectId, 'review', 'concepts-' + artifact.id);
mkdirSync(out, { recursive: true });
const tiles = [];
for (const [i, concept] of artifact.output.concepts.entries()) {
  const svg = renderToStaticMarkup(React.createElement(PlanningFrame, { frame: concept.frame, label: concept.title }));
  assert(svg.includes('rough-paper@1'));
  writeFileSync(join(out, `concept-${i + 1}.svg`), svg);
  await sharp(Buffer.from(svg)).resize(360, 640).png().toFile(join(out, `concept-${i + 1}.png`));
  tiles.push(`<article><h2>${i + 1}. ${concept.title}</h2>${svg}<p>${concept.teachingApproach}</p></article>`);
}
await sharp({ create: { width: 1080, height: 640, channels: 3, background: paper } }).composite([0, 1, 2].map(i => ({ input: join(out, `concept-${i + 1}.png`), left: i * 360, top: 0 }))).png().toFile(join(out, 'contact-sheet.png'));
writeFileSync(join(out, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Credit-card concept review</title><style>body{margin:24px;background:#eee9df;color:#172d38;font:16px/1.5 Arial}main{display:flex;gap:24px;flex-wrap:wrap}article{width:360px}svg{width:360px;height:640px;display:block}h1{font-size:26px}h2{font-size:19px}p{max-width:70ch}</style><h1>Choose a concept</h1><p>Static V3 planning drawings, not motion previews. All three retain the approved script and requested blocked-bill opening. Option 1 is recommended. Select one concept before storyboard authoring.</p><main>${tiles.join('')}</main><p>Source: coordinator-authored, validated and saved through V3 stores. No gateway model run, concept choice, storyboard or narration approval claimed.</p></html>`);
writeFileSync(join(out, 'review-receipt.json'), JSON.stringify({ projectId, scriptId, artifactId: artifact.id, conceptSelected: false, preview: 'Existing V3 PlanningFrame rendered to static SVG, then PNG with installed sharp; not a video render.', output: out }, null, 2));
console.log(JSON.stringify({ artifactId: artifact.id, output: out }, null, 2));
