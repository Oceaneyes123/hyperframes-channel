import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {reviewGraphicShot} from '../../../server/graphic-review.ts';
const root='.planning/deepseek-v41-flash-short/redesign-v1/';
const receipt=JSON.parse(readFileSync(root+'proposal-receipt.json','utf8'));
for(const shotIndex of [0,3,4,5,9]) {
 const path=root+`model-review-${shotIndex+1}.json`;
 if(existsSync(path))continue;
 try {
  const review=await reviewGraphicShot(receipt.projectId,{runId:receipt.storyboardId,shotIndex},new AbortController().signal,message=>console.log(`Shot ${shotIndex+1}: ${message}`));
  writeFileSync(path,JSON.stringify(review,null,2)+'\n');
  console.log(JSON.stringify({shot:shotIndex+1,findings:review.findings}));
 } catch(error) {
  writeFileSync(path,JSON.stringify({error:error.message,shotIndex,humanApproval:false},null,2)+'\n');
  console.log(`Shot ${shotIndex+1}: review unavailable: ${error.message}`);
 }
}
