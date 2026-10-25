import {readFileSync,writeFileSync,existsSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {inspectGraphics} from '../../../engine/quality/inspect-graphics.ts';

const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'../receipt.json','utf8'));
const draft=JSON.parse(readFileSync(root+'storyboard-draft.json','utf8'));
const config=readConfig(),store=openVisuals(config.dataDirectory,config.videosDirectory);
const previous=existsSync(root+'proposal-receipt.json')?JSON.parse(readFileSync(root+'proposal-receipt.json','utf8')):null;
const baseId=previous?.storyboardId??receipt.storyboardId;
const paths=[`videos/${receipt.projectId}/scripts/${receipt.revisionId}.json`,`videos/${receipt.projectId}/visuals/${receipt.storyboardId}.json`,`.data/deepseek-short-eec7f710/narration.wav`,receipt.exportPath];
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const baseline=paths.map(path=>({path,sha256:hash(path)}));
try {
 assert.equal(store.latest(receipt.projectId,'storyboard'),baseId,'Preserve concurrent edits; do not overwrite a newer board');
 const acceptance=store.acceptance(receipt.projectId);
 assert.equal(acceptance.runId,receipt.storyboardId);
 const id=store.begin(receipt.projectId,{kind:'storyboard',scriptId:receipt.revisionId,selectionId:receipt.selectionId,baseId:baseId,shotIndex:null,instruction:draft.instruction},'codex-authored-working-studio-redesign');
 try {store.complete(receipt.projectId,id,draft.output);} catch(error) {store.fail(receipt.projectId,id);throw error;}
 const board=store.read(receipt.projectId,id);
 assert(store.current(receipt.projectId,id));
 assert.equal(store.acceptance(receipt.projectId).runId,acceptance.runId,'No new approval inferred');
 assert.equal(store.acceptance(receipt.projectId).stale,true);
 baseline.forEach(file=>assert.equal(hash(file.path),file.sha256));
 if(previous){copyFileSync(root+'proposal-receipt.json',root+`proposal-receipt-${baseId}.json`);copyFileSync(root+'storyboard-proposal.json',root+`storyboard-proposal-${baseId}.json`);}
 writeFileSync(root+'storyboard-proposal.json',JSON.stringify(board,null,2)+'\n');
 writeFileSync(root+'proposal-receipt.json',JSON.stringify({projectId:receipt.projectId,storyboardId:id,previousStoryboardId:receipt.storyboardId,scriptId:receipt.revisionId,shots:10,frames:2100,narrationReused:true,storyboardAccepted:false,motionCreated:false,productionGatesCreated:false,exportCreated:false,published:false,preserved:baseline},null,2)+'\n');
 writeFileSync(root+'graphics-review.json',JSON.stringify(inspectGraphics(board),null,2)+'\n');
 console.log(JSON.stringify({storyboardId:id,approvalPending:true,previousFilesPreserved:baseline.length}));
} finally {store.close();}
