import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parseVectorAsset} from '../../../workflow/vector-assets.ts';
const root='docs/projects/deepseek-v41-flash/artwork/redesign-v1/';
const asset=JSON.parse(readFileSync(root+'inquiry-intake-console-v1.json','utf8'));
asset.id='inquiry-intake-console@3';
asset.layers.find(layer=>layer.id==='row-packet').nodes[0].d='M494 454V491H285V704M275 691L285 704L295 691';
for(const node of asset.layers.find(layer=>layer.id==='n8n-shell').nodes) {
 if(node.kind==='rect'&&node.height>=371)node.height+=57;
}
parseVectorAsset(asset);
const path=root+'inquiry-intake-console-v3.json';
writeFileSync(path,JSON.stringify(asset,null,2)+'\n');
const existing=JSON.parse(readFileSync('workflow/graphic-pack.json','utf8')).find(entry=>entry.asset.id===asset.id);
if(existing)assert.equal(existing.contentHash,createHash('sha256').update(JSON.stringify(asset)).digest('hex'));
else execFileSync(process.execPath,['scripts/import-graphic-asset.ts','--install',path],{stdio:'pipe'});
console.log(asset.id);
