import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {readConfig} from '../../server/config.ts';
import {generateVisuals} from '../../server/visuals.ts';
import {openVisuals} from '../../server/visual-store.ts';

const path=new URL('./receipt.json',import.meta.url), receipt=JSON.parse(readFileSync(path,'utf8'));
assert(receipt.scriptId);
const config=readConfig();
const lookup=openVisuals(config.dataDirectory,config.videosDirectory);
try { receipt.conceptsId=lookup.latest(receipt.projectId,'concepts'); } finally { lookup.close(); }
if(!receipt.conceptsId || process.argv.includes('--revise')) {
  const priorId=receipt.conceptsId??null;
  receipt.conceptsId=await generateVisuals(receipt.projectId,{
    kind:'concepts',scriptId:receipt.scriptId,selectionId:null,baseId:priorId,shotIndex:null,
    instruction:'Retry revised concepts. Prior revision failed because every parts entry requires x:0,y:0,scale:1,opacity:1,reveal:1; include ALL five fields for every part. Previous rendered round repeated primitive boxes and obscured text. Produce DISTINCT concepts: A HUMAN REVIEW CONSOLE: graphic-asset@2 owner-review-console@1 exact registry hash, square pixel aspect so height=width*0.5625. Show workspace,monitor,draft,review-controls,human-hand layers; hide unresolved if helpful. Generic review handoff, not Terra real UI. Only heading Draft versus send and Illustrative. B PERMISSION MAP: large semantic-diagram@1 down with task document, prepare/draft, human review, external message nodes; review stage separates drafting and consequential action. No loose box floorplan. C EVIDENCE CLOSE-UP: dark ink editorial typography, dominant 29.6% and one 2-line caption Simulated, max effort / No system controls. Keep this sourced evidence separate from ordinary-use probability and other tests; no comparison axis. Explain how persistent document returns to workspace after evidence close-up. inter-heading@1 for text. No obscured labels. At most two text actors and eight root shapes. A is illustration, B is semantic mechanism, C is editorial data evidence: do not repeat layouts. No serif defaults, robots, brains, particles or invented asset references. Preserve approved narration, all factual conditions and human decision boundaries.',
  },new AbortController().signal,message=>console.log(message),config);
  const latest=JSON.parse(readFileSync(path,'utf8'));
  writeFileSync(path,JSON.stringify({...latest,conceptsId:receipt.conceptsId,priorConceptsIds:priorId?[...(latest.priorConceptsIds??[]),priorId]:(latest.priorConceptsIds??[])},null,2)+'\n');
}
const store=openVisuals(config.dataDirectory,config.videosDirectory);
try {
  const saved=store.read(receipt.projectId,receipt.conceptsId);
  assert.equal(saved.output.kind,'concepts');assert.equal(saved.output.concepts.length,3);
  assert.equal(saved.scriptId,receipt.scriptId);assert.equal(store.selection(receipt.projectId),null);
  console.log(JSON.stringify({id:saved.id,concepts:saved.output.concepts.map(c=>({title:c.title,metaphor:c.metaphor,teachingApproach:c.teachingApproach,visualLanguage:c.visualLanguage}))},null,2));
}finally{store.close();}
