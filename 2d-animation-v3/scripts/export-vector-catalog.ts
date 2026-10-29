import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { vectorLibrary } from "../workflow/graphic-library.ts";
import type { VectorNode } from "../workflow/vector-assets.ts";

const colors={ink:"#203B3A",muted:"#607570",accent:"#D9633F",mint:"#C6DED3",paper:"#F7F3E9",surface:"#FFFDF8",line:"#D7DFD4",wash:"#E8EEE6",grid:"#D7DFD4",none:"none"};
const output="public/media/vector-catalog";mkdirSync(output,{recursive:true});
const ledger=[];
for(const {asset,contentHash} of Object.values(vectorLibrary)){
  let index=0;
  const node=(value:VectorNode):string=>{
    const paint=`fill="${colors[value.fill]}" stroke="${colors[value.stroke]}" stroke-width="${value.strokeWidth}" opacity="${value.opacity}" stroke-linecap="round" stroke-linejoin="round"`;
    if(value.kind==="path")return `<path ${paint} d="${value.d}"/>`;
    if(value.kind==="rect")return `<rect ${paint} x="${value.x}" y="${value.y}" width="${value.width}" height="${value.height}" rx="${value.radius}"/>`;
    if(value.kind==="ellipse")return `<ellipse ${paint} cx="${value.cx}" cy="${value.cy}" rx="${value.rx}" ry="${value.ry}"/>`;
    const id=`clip-${index++}`,clip=value.clip?`<defs><clipPath id="${id}"><rect x="${value.clip.x}" y="${value.clip.y}" width="${value.clip.width}" height="${value.clip.height}"/></clipPath></defs>`:"";
    return `${clip}<g ${paint} transform="translate(${value.x} ${value.y}) rotate(${value.rotation}) scale(${value.scale})" style="mix-blend-mode:${value.blend}" ${value.clip?`clip-path="url(#${id})"`:""}>${value.children.map(node).join("")}</g>`;
  };
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${asset.width}" height="${asset.height}" viewBox="0 0 ${asset.width} ${asset.height}">${asset.layers.map(layer=>`<g id="${layer.id}">${layer.nodes.map(node).join("")}</g>`).join("")}</svg>\n`;
  assert.ok(!/<script|\bon\w+=|\bhref=/iu.test(svg));
  const file=`${asset.id.replace("@","-")}.svg`;writeFileSync(`${output}/${file}`,svg);
  ledger.push({id:asset.id,file,contentHash,license:asset.license,source:asset.source,attribution:asset.attribution,note:asset.layers.some(layer=>layer.id==="motion")?"Static registry icon; animated scene is trusted authored source":"Static SVG export of original registered vector nodes"});
}
assert.ok(ledger.length>=40);
writeFileSync(`${output}/provenance.json`,JSON.stringify(ledger,null,2)+"\n");
console.log(`Exported ${ledger.length} registered local SVGs with per-item provenance; original packs unchanged.`);
