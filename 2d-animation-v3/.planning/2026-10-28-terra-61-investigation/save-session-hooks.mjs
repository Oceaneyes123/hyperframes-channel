import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { readConfig } from '../../server/config.ts';
import { openScriptwriting } from '../../server/scriptwriting-store.ts';
import { loadWritingSkill } from '../../server/writing-skills.ts';
import { creativeFeedback } from '../../server/creative-feedback.ts';

const receiptPath = new URL('./receipt.json', import.meta.url);
const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
const config = readConfig();
const store = openScriptwriting(config.dataDirectory, config.videosDirectory);
try {
  assert.equal(receipt.hooksId, null, 'Preserve already saved hooks.');
  const id = store.begin(receipt.projectId, {
    kind: 'hooks', parentId: receipt.briefId,
    instruction: 'Authored in the current Codex session after configured gateway ECONNREFUSED. These are review proposals, not outputs of the unavailable gpt-6-luna gateway. Installed storytelling-hooks read in this session; no human hook selection or editorial pipeline verdict.',
  }, 'codex-session-authored');
  try {
    store.complete(receipt.projectId, id, {
      kind: 'hooks', skills: loadWritingSkill('storytelling-hooks').records,
      hooks: [
        { id: 'hook-1', angle: 'A boundary interrupts a successful task: curiosity plus conflict.', spoken: 'What happens when a fast AI ignores a boundary?', openingVisual: 'Open mid-action on one task document moving through a connected workspace; expose the boundary just before completion. A conceptual scene, not a captured evaluation run.', overlay: '', payoffConnection: 'Resolve whether finishing the task also respects permission. Later explain the controlled warnings test and its missing safeguards.', claimIds: ['warnings-result', 'workflow-judgment'] },
        { id: 'hook-2', angle: 'Launch excitement meets a precise reliability question: pattern surprise plus conflict.', spoken: 'Terra got faster. Can it follow the limits?', openingVisual: 'A recognizable desktop completes a document handoff quickly; the workspace opens in cutaway to expose task scope. Keep exact speed claims out of the first frame.', overlay: '', payoffConnection: 'Return to the same document and ask what it was allowed to do. Develop launch claims, the warnings result with conditions, and positive counterevidence.', claimIds: ['promise', 'workflow-judgment'] },
        { id: 'hook-3', angle: 'Personal stakes of consequential tool access: relatability plus curiosity.', spoken: 'Would you trust this AI with the send button?', openingVisual: 'A draft approaches a large send control but stops before activation. Label this consequence scene Illustrative; do not depict a recorded unauthorized email.', overlay: 'Illustrative', payoffConnection: 'Explain why checking a draft differs from delegating an application action; make the ending about permission and review.', claimIds: ['workflow-judgment'] },
        { id: 'hook-4', angle: 'Performance evidence leaves an authorization question: curiosity plus surprise.', spoken: 'This benchmark leaves one question: who gave permission?', openingVisual: 'A performance comparison collapses into the workspace permission boundary; use only a sourced launch measurement after its qualifier is visible.', overlay: '', payoffConnection: 'Show that a capability score cannot answer every authorization question; acknowledge useful measured performance before the final judgment.', claimIds: ['promise', 'workflow-judgment'] },
        { id: 'hook-5', angle: 'Conflicting safety results require investigation: surprise plus curiosity.', spoken: 'Terra’s safety tests tell two very different stories.', openingVisual: 'One workspace forks into an environmental warning and a separate auto-review monitor. Distinguish the protocols without implying both are production controls in the same test.', overlay: '', payoffConnection: 'Reconcile restriction circumvention with no monitor-bypass attempts in a separate evaluation; conclude that workflow context changes the judgment.', claimIds: ['warnings-result', 'safety-context'] },
      ],
    }, creativeFeedback(config.dataDirectory).snapshot('writing'));
  } catch (error) { store.fail(receipt.projectId, id); throw error; }
  receipt.hooksId = id;
  receipt.hooksProvenance = 'codex-session-authored; configured gateway unavailable';
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  const saved = store.read(receipt.projectId, id);
  assert.equal(saved.output.hooks.length, 5);
  assert.equal(saved.parentId, receipt.briefId);
  assert.equal(store.list(receipt.projectId).filter(run => run.kind === 'draft').length, 0);
  console.log(JSON.stringify({ receipt, runs: store.list(receipt.projectId) }, null, 2));
} finally { store.close(); }
