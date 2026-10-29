import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { openScriptwriting } from '../../server/scriptwriting-store.ts';
import { readConfig } from '../../server/config.ts';
import { openNarrationStudio } from '../../server/narration/studio.ts';

const receipt = JSON.parse(readFileSync(new URL('./receipt.json', import.meta.url), 'utf8'));
const config = readConfig(), store = openScriptwriting(config.dataDirectory, config.videosDirectory);
const destination = new URL('../../docs/projects/terra-61-investigation/', import.meta.url);
try {
  const hooks = store.read(receipt.projectId, receipt.hooksId), draft = store.read(receipt.projectId, receipt.editorReviewedDraftId ?? receipt.draftId);
  assert.equal(draft.output.kind, 'draft');
  const lines = draft.output.refined.lines;
  let measured=null;
  if(receipt.fullNarrationId){const narration=openNarrationStudio(config.dataDirectory,config.videosDirectory);try{measured=narration.read(receipt.projectId,receipt.fullNarrationId);}finally{narration.close();}}
  const words = lines.map(line => line.text).join(' ').split(/\s+/u).length;
  const totalWeight = lines.reduce((sum, line) => sum + line.text.split(/\s+/u).length, 0);
  let elapsed = 0;
  const script = lines.map((line, index) => {
    const start = elapsed;
    elapsed += line.text.split(/\s+/u).length / totalWeight * 65;
    const segment=measured?.manifest.segments.find(x=>x.number===index+1);
    return `### Line ${index + 1} · ${segment?'measured segment':'estimated'} ${segment?(segment.startFrame/30).toFixed(2):start.toFixed(1)}–${segment?(segment.endFrame/30).toFixed(2):elapsed.toFixed(1)}s\n\n${line.text}\n\nClaim references: ${line.claimIds.join(', ') || 'connective'}.`;
  }).join('\n\n');
  const heading = `# Terra 6.1 — script review\n\nGenerated read-only view of Studio draft ${draft.id}. Edit through Studio; regenerate this view after a new immutable artifact.\n\nSelected hook: #3, explicitly chosen by the user in this chat. Status: author proposal, not accepted. The configured gateway failed with ECONNREFUSED; writer/refinement/self-review were performed in this Codex session. The required separate editorial workflow remains pending; the saved draft carries a revise verdict and cannot be imported as ready.\n\n${words} whitespace-delimited words. Estimated speech: 56–61 seconds at 180–165 words/minute before pauses; numerical names and pronunciation can add time. The line windows below distribute a 65-second planning target by word count. They are NOT measured alignment or evidence of spoken delivery. No audio has been synthesized.\n\n`;
  const approval = receipt.scriptId ? `# Terra 6.1 — accepted script review\n\nGenerated read-only view of reviewed draft ${draft.id}, imported as script ${receipt.scriptId}. The user approved this exact narration in this chat. A separate gateway editor returned ready after connectivity was restored. Original authorship/refinement remain from the Codex session; no regenerated writer or refiner call is claimed. Original revise-status draft remains preserved.\n\nSelected hook: #3. ${words} whitespace-delimited words; approximately 56–61 seconds before pauses. The following windows distribute a 65-second planning target by word count and are NOT measured audio alignment. No voice or production gate is implied by script acceptance.\n\n` : heading;
  const measuredNote=measured?`Complete Qwen Ryan candidate ${receipt.fullNarrationId}: **${measured.measured.durationSeconds.toFixed(3)} seconds**. Measured line-segment boundaries below replace the planning estimates. They are not independently verified word alignment; complete-take human listening is still required. No time stretching.\n\n`:'';
  const currentApproval=measured?`# Terra 6.1 — accepted script review\n\nGenerated read-only view of reviewed draft ${draft.id}, imported as script ${receipt.scriptId}. The user approved this exact narration in this chat. Separate gateway editor returned ready; original session authorship/refinement remains preserved.\n\nSelected hook #3. ${words} whitespace-delimited words. No voice or production gate is implied by script acceptance.\n\n`:approval;
  const output = currentApproval + measuredNote + script + '\n';
  writeFileSync(new URL('SCRIPT.md', destination), output);
  for (const line of lines) assert(output.includes(line.text));
  const rows = hooks.output.hooks.map(hook => `## ${hook.id}${hook.id === receipt.selectedHookId ? ' — user selected' : ''}\n\n${hook.spoken}\n\nAngle: ${hook.angle}\n\nFirst visual: ${hook.openingVisual}\n\nOverlay: ${hook.overlay || 'none'}.\n\nPayoff: ${hook.payoffConnection}`).join('\n\n');
  writeFileSync(new URL('HOOKS.md', destination), `# Terra 6.1 — hook review\n\nGenerated read-only view of Studio hooks ${hooks.id}. Session-authored after the gateway failed; no separate gateway hook call succeeded. No audience retention test was run.\n\nThe author initially recommended #2 for model identification, short delivery and a fair question. The user selected #3 for the concrete consequence. #1 has a strong conflict but risks sounding universal; #4 needs benchmark context; #5 offers nuance but has a more abstract opening. All five require the full script to supply conditions and counterevidence.\n\n${rows}\n`);
  console.log('SCRIPT.md and HOOKS.md exported from hash-validated artifacts; exact narration correspondence passed.');
} finally { store.close(); }
