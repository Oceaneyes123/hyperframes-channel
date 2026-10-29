import assert from "node:assert/strict";
import { test } from "node:test";
import { buildRetentionCandidate } from "../scripts/prepare-retention-review.ts";
import { motionBeatFixture } from "./fixtures/motion-beats.ts";
import { rhythmReport } from "../scripts/rhythm-report.ts";
import { expandMotionShot } from "../workflow/motion.ts";

const excerpt="Would you trust this AI with the send button?\nOpenAI’s new GPT-6.1 Terra promises faster computer work at lower token prices.\nIt launched October twenty-sixth for Work, Codex and the API. It isn’t replacing normal Chat.";
test("review candidate preserves exact excerpt words and uses bounded registered scenes",()=>{
  const {board}=motionBeatFixture(),before=JSON.stringify(board),candidate=buildRetentionCandidate(board,excerpt);
  assert.equal(JSON.stringify(board),before);
  assert.equal(candidate.script.replaceAll("\n"," "),excerpt.split(" It isn’t")[0].replaceAll("\n"," "));
  assert.equal(candidate.plan.shots.reduce((sum,shot)=>sum+shot.durationFrames,0),450);
  for(const shot of candidate.plan.shots){
    assert.ok(shot.objects.filter(object=>object.type==="heading").length<=1);
    assert.ok(expandMotionShot(shot).actions.length<=64);
  }
  assert.throws(()=>buildRetentionCandidate(board,excerpt.replace("lower","higher")));
});
test("clipped rhythm measurements stop at the exact frame boundary",()=>{
  const {plan,board}=motionBeatFixture(),report=rhythmReport(plan,board,45);
  assert.equal(report.durationFrames,45);assert.equal(report.windows.length,1);assert.equal(report.windows[0].endSeconds,1.5);
  assert.equal(report.summary.shots,1);assert.ok(report.events.every(event=>event.startFrame<45));
  assert.throws(()=>rhythmReport(plan,board,0));
});
