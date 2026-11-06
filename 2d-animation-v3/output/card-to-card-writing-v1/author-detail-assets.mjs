import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parseVectorAsset } from '../../workflow/vector-assets.ts';
import assert from 'node:assert/strict';
const out = './output/card-to-card-writing-v1/detail-assets';
mkdirSync(out, { recursive: true });
const rect = (x, y, width, height, radius, fill, stroke = 'ink', strokeWidth = 4, opacity = 1) => ({ kind: 'rect', x, y, width, height, radius, fill, stroke, strokeWidth, opacity });
const path = (d, stroke = 'ink', strokeWidth = 4, fill = 'none', opacity = 1) => ({ kind: 'path', d, fill, stroke, strokeWidth, opacity });
const ellipse = (cx, cy, rx, ry, fill, stroke = 'ink', strokeWidth = 4) => ({ kind: 'ellipse', cx, cy, rx, ry, fill, stroke, strokeWidth, opacity: 1 });
const layer = (id, nodes, role = 'detail') => ({ id, role, nodes });
const asset = (id, width, height, purpose, layers) => parseVectorAsset({ schemaVersion: 1, id, source: 'Original vector artwork for the approved card-to-card explainer; authored through V3 vector import.', license: 'CC0-1.0', attribution: 'Original artwork authored for HyperFrames V3; dedicated to CC0.', width, height, purpose, tags: ['credit-card', 'finance', 'editorial'], compositions: ['editorial-illustration', 'illustrated-workflow', 'visual-comparison'], layers });
const assets = [
  asset('credit-card-detail@1', 600, 380, 'Recognizable credit card with recessed chip, contactless arcs, embossed nonnumeric marks and layered edge. Accent identifies the card; no real issuer or account data.', [
    layer('body', [rect(18, 28, 568, 338, 34, 'ink', 'none', 0, .16), rect(8, 8, 570, 340, 30, 'accent'), path('M30 78V46Q30 29 49 29H523', 'surface', 3, 'none', .55), path('M34 321H552', 'ink', 3, 'none', .35)], 'subject'),
    layer('chip', [rect(58, 110, 102, 77, 12, 'mint', 'ink', 3), path('M91 110V187M127 110V187M58 135H91M127 135H160M58 160H91M127 160H160M91 122H127V176H91Z', 'ink', 2)]),
    layer('details', [path('M206 118Q235 148 206 178M222 104Q265 148 222 192M238 90Q298 148 238 206', 'surface', 6), path('M58 245H134M157 245H233M256 245H332M355 245H431', 'surface', 9), path('M58 285H233M355 285H410', 'surface', 4, 'none', .65), ellipse(495, 267, 27, 27, 'surface', 'none', 0), ellipse(525, 267, 27, 27, 'surface', 'none', 0)]),
  ]),
  asset('card-bill-detail@1', 600, 820, 'Large folded credit-card bill with printed row cues and a conceptual shuttered payment slot. No invented amounts, lender branding or network-processing UI.', [
    layer('paper', [path('M38 30H482L582 130V800H38Z', 'none', 0, 'ink', .14), path('M16 10H462L562 110V780H16Z', 'ink', 4, 'surface'), path('M462 10V110H562', 'ink', 4, 'paper')], 'subject'),
    layer('statement', [rect(60, 62, 98, 62, 9, 'accent', 'ink', 3), path('M72 84H146', 'surface', 7), path('M187 76H400M187 102H340', 'ink', 8), path('M60 175H514M60 244H514M60 313H514M60 382H514', 'line', 3), path('M60 207H254M60 276H218M60 345H280M421 207H514M450 276H514M432 345H514', 'muted', 6), path('M60 451H164M60 479H235', 'ink', 6), path('M60 694H517M60 706H74M86 706H100M112 706H126M138 706H152M164 706H178M190 706H204M216 706H230M242 706H256M268 706H282M294 706H308M320 706H334M346 706H360M372 706H386M398 706H412M424 706H438M450 706H464M476 706H490M502 706H516', 'muted', 2)]),
    layer('slot', [rect(74, 524, 434, 112, 17, 'ink'), rect(88, 538, 406, 84, 10, 'muted', 'none', 0), path('M94 647H487', 'line', 4)]),
    layer('shutter-left', [rect(88, 538, 200, 84, 8, 'accent', 'ink', 3), path('M263 553V607', 'surface', 5)]),
    layer('shutter-right', [rect(294, 538, 200, 84, 8, 'accent', 'ink', 3), path('M318 553V607', 'surface', 5)]),
  ]),
  asset('debt-parcel-detail@1', 240, 220, 'One intact coral borrowed-principal token with folded edge, coin relief and grip, carried unchanged between the two cards.', [
    layer('parcel', [rect(20, 47, 207, 159, 18, 'ink', 'none', 0, .15), rect(8, 30, 207, 159, 16, 'accent'), path('M154 30L215 91H154Z', 'ink', 3, 'paper'), path('M27 170H193', 'surface', 3, 'none', .45)], 'subject'),
    layer('detail', [path('M62 30V21Q62 7 80 7H127Q145 7 145 21V30', 'ink', 6), ellipse(91, 107, 40, 40, 'paper', 'ink', 3), path('M91 81V132M108 88H82Q67 88 67 101Q67 111 82 111H100Q116 111 116 122Q116 133 101 133H75', 'ink', 3)]),
  ]),
];
for (const item of assets) {
  assert.equal(new Set(item.layers.map(x => x.id)).size, item.layers.length);
  writeFileSync(join(out, item.id.replace('@', '-') + '.json'), JSON.stringify(item, null, 2) + '\n', { flag: 'wx' });
}
const prior = JSON.parse(readFileSync('workflow/graphic-pack.json', 'utf8'));
writeFileSync(join(out, 'prior-entries.json'), JSON.stringify(prior.map(({ asset, contentHash }) => ({ id: asset.id, contentHash, entrySha256: createHash('sha256').update(JSON.stringify({ asset, contentHash })).digest('hex') })), null, 2), { flag: 'wx' });
console.log(JSON.stringify(assets.map(a => ({ id: a.id, layers: a.layers.map(x => x.id) }))));
