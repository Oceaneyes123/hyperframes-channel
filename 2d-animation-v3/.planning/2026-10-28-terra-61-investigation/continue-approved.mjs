import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { readConfig } from '../../server/config.ts';
import { requestJson } from '../../server/gateway.ts';
import { openStudio } from '../../server/studio.ts';
import { openScriptwriting } from '../../server/scriptwriting-store.ts';
import { editorialSchema } from '../../workflow/scriptwriting.ts';
import { creativeFeedback } from '../../server/creative-feedback.ts';

const path = new URL('./receipt.json', import.meta.url);
const receipt = JSON.parse(readFileSync(path, 'utf8'));
const config = readConfig();
const writing = openScriptwriting(config.dataDirectory, config.videosDirectory);
try {
  const draft = writing.read(receipt.projectId, receipt.draftId);
  const brief = writing.read(receipt.projectId, receipt.briefId);
  assert.equal(draft.output.kind, 'draft');
  if (!receipt.editorReviewedDraftId) {
    const review = editorialSchema.parse(await requestJson(config.gateway, [
      { role: 'system', content: 'You are a separate editorial reviewer of a technology Short. Return strict JSON {verdict:"ready"|"revise",summary,findings:[{line:number|null,reason,change}]}. Ready requires no unresolved findings; revise requires concrete findings. Check supplied claim notes and caveats, line references, natural delivery, hook/payoff and 50–75s feasibility. Do not rewrite. Do not claim independent source verification, audible delivery or human approval. The author drafted and refined this script in another session stage; review only the final supplied text. A hypothetical email is clearly introduced with Imagine; never treat it as an actual reported incident. Test percentages are explicitly not ordinary-use failure rates. The human has approved this exact script; raise only concrete substantive issues, not alternate stylistic preferences.' },
      { role: 'user', content: JSON.stringify({ brief: brief.output.brief, script: draft.output.refined }) },
    ], AbortSignal.timeout(90000), () => {}));
    writeFileSync(new URL('./gateway-editor-review.json', import.meta.url), JSON.stringify({ model: config.gateway.model, reviewedAt: new Date().toISOString(), sourceDraftId: draft.id, review }, null, 2) + '\n', { flag: 'wx' });
    const id = writing.begin(receipt.projectId, { kind: 'draft', parentId: receipt.hooksId, hookId: 'hook-3', instruction: 'Human approved the exact session-authored refined script in this chat: Please continue, I approved. Preserve exact narration. Separate gateway editorial call now completed; authorship and installed humanizer application remain from the original session, not three regenerated model calls.' }, `codex-session author; ${config.gateway.model} editor`);
    try { writing.complete(receipt.projectId, id, { ...draft.output, review }, creativeFeedback(config.dataDirectory).snapshot('writing')); }
    catch(error) { writing.fail(receipt.projectId,id); throw error; }
    receipt.editorReviewedDraftId = id;
    receipt.editorVerdict = review.verdict;
    writeFileSync(path, JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify(review,null,2));
  }
  const reviewed = writing.read(receipt.projectId,receipt.editorReviewedDraftId);
  assert.equal(reviewed.output.review.verdict,'ready','Resolve concrete editorial findings before import.');
  const studio = openStudio(config.dataDirectory,config.videosDirectory);
  try {
    const revision = studio.importReviewedDraft(receipt.projectId,reviewed.id);
    assert.equal(revision.content,draft.output.refined.lines.map(line=>line.text).join('\n'));
    studio.acceptScript(receipt.projectId,revision.id);
    const accepted=studio.acceptance(receipt.projectId);
    assert.equal(accepted.stale,false);
    assert.equal(accepted.revisionId,revision.id);
    receipt.scriptId=revision.id;
    receipt.scriptHash=accepted.sha256;
    receipt.scriptApprovalEvidence='User message in this chat: Please continue, I approved. Applied only to the exact previously delivered script.';
    writeFileSync(path,JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify({scriptId:revision.id,accepted:true,exactTextPreserved:true}));
  } finally {studio.close();}
} finally {writing.close();}
