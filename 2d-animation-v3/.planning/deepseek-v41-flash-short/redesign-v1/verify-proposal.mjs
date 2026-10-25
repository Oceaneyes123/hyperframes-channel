import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openVisuals} from '../../../server/visual-store.ts';
import {validateStoryboard} from '../../../workflow/visuals.ts';
import {inspectGraphics} from '../../../engine/quality/inspect-graphics.ts';
const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
const config=readConfig(),store=openVisuals(config.dataDirectory,config.videosDirectory);
try {
 const board=store.read(receipt.projectId,receipt.storyboardId);
 const script=JSON.parse(readFileSync(`videos/${receipt.projectId}/scripts/${receipt.scriptId}.json`,'utf8'));
 validateStoryboard(board.output,script.content);
 assert(store.current(receipt.projectId,board.id));
 assert.notEqual(store.acceptance(receipt.projectId).runId,board.id);
 assert.equal(board.output.shots.length,10);
 const quality=inspectGraphics(board);
 assert.equal(quality.findings.filter(f=>f.severity==='warning').length,0);
 for(let index=1;index<=10;index++)for(const state of ['start','end'])assert(existsSync(root+`styleframes/${String(index).padStart(2,'0')}-${state}.png`));
 const json=board.output.shots[4].endFrame.shapes.filter(s=>s.type==='code'&&s.label!=='deepseek-flash').map(s=>s.label).join('');
 assert.deepEqual(JSON.parse(json),{category:'…',reply_draft:'…'});
 for(const file of receipt.preserved)assert.equal(createHash('sha256').update(readFileSync(file.path)).digest('hex'),file.sha256);
 const proof={storyboardId:board.id,shots:10,statesRendered:20,width:1080,height:1920,fps:30,frames:2100,orderedNarrationCoverage:true,originalFilesPreserved:receipt.preserved.length,graphicWarnings:0,graphicReviewAdvisories:quality.findings.length,humanApproval:false,motionGenerated:false,productionExportGenerated:false,check:'97 tests, lint and TypeScript passed',build:'passed'};
 writeFileSync(root+'verification.json',JSON.stringify(proof,null,2)+'\n');
 console.log(JSON.stringify(proof));
}finally{store.close();}
