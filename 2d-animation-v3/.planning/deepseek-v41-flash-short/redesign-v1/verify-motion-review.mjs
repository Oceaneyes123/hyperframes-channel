import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readConfig} from '../../../server/config.ts';
import {openMotion} from '../../../server/motion-store.ts';
import {openVisuals} from '../../../server/visual-store.ts';
const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
const review=JSON.parse(readFileSync(root+'motion-review-receipt.json','utf8'));
const proof=JSON.parse(readFileSync(review.verificationPath,'utf8'));
const config=readConfig(),motion=openMotion(config.dataDirectory,config.videosDirectory),visuals=openVisuals(config.dataDirectory,config.videosDirectory);
try{
 assert.equal(visuals.acceptance(receipt.projectId).runId,receipt.storyboardId);
 assert(motion.current(receipt.projectId,receipt.motionId));
 assert.notEqual(motion.acceptance(receipt.projectId).runId,receipt.motionId);
 for(const file of receipt.preserved)assert.equal(createHash('sha256').update(readFileSync(file.path)).digest('hex'),file.sha256);
 assert.equal(proof.frames,2100);assert.equal(proof.audioSync.lagSeconds,0);assert.equal(proof.freshSeeks.length,6);
 receipt.reviewPath=review.reviewPath;receipt.reviewUrl='http://127.0.0.1:3035/';receipt.reviewVerified=true;receipt.motionAccepted=false;receipt.productionExportPending=true;
 writeFileSync(root+'proposal-receipt.json',JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({motionId:receipt.motionId,sourceFilesPreserved:4,frames:2100,reviewBytes:statSync(review.reviewPath).size,audioCorrelation:proof.audioSync.correlation,lagSeconds:0,pendingMotionApproval:true}));
}finally{motion.close();visuals.close();}
