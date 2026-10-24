import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { readConfig } from '../../server/config.ts';
import { openStudio } from '../../server/studio.ts';
import { openScriptwriting } from '../../server/scriptwriting-store.ts';
import { generateWriting } from '../../server/scriptwriting.ts';

const receiptPath = '.planning/deepseek-v41-flash-short/receipt.json';
assert(!existsSync(receiptPath), 'Project already prepared; preserve the receipt and existing project.');
const config = readConfig();
const review = readFileSync('docs/projects/deepseek-v41-flash/REVIEW.md', 'utf8');
const content = review.split('## Proposed narration\n\n')[1].split('\n\n## Hook choices')[0].trim().split(/\n\s*\n/).join('\n');
const words = content.split(/\s+/).length;
assert(words >= 140 && words <= 200, `Review pacing: ${words} words`);
const source = (id, title, url, notes) => ({ id, title, url, notes });
const sources = [
  source('deepseek-model', 'DeepSeek models and pricing', 'https://api-docs.deepseek.com/quick_start/pricing/', 'Checked 2026-10-24: deepseek-flash serves DeepSeek-V4.1-Flash-1017. Input/output token usage billing. Rates vary by cache and peak period. No demonstrated business outcome or fixed per-inquiry cost.'),
  source('deepseek-json', 'DeepSeek JSON Output', 'https://api-docs.deepseek.com/guides/json_mode/', 'JSON Output uses response_format json_object, requires JSON prompt guidance/example, and can return empty content. JSON validity does not prove factual or schema correctness.'),
  source('deepseek-api', 'DeepSeek first API call', 'https://api-docs.deepseek.com/', 'OpenAI-compatible API at api.deepseek.com with API key; explicit model deepseek-flash. Model classification/drafting is a proposed task, not verified performance.'),
  source('sheets-trigger', 'n8n Google Sheets Trigger', 'https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.googlesheetstrigger/', 'Supports Row added. Use that event to avoid self-triggering row updates. Google credentials required.'),
  source('http-request', 'n8n HTTP Request', 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/', 'Can call REST APIs. Use HTTP Request to specify the model alias explicitly rather than assume a native dropdown lists it.'),
  source('sheets-update', 'n8n Sheets operations', 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/sheet-operations/', 'Supports updating existing rows. Proposed design validates category/reply fields and matches inquiry_id before writing pending_review status.'),
  source('owner-approval', 'n8n Gmail message operations', 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/message-operations/', 'Supports owner notification and Send and Wait for Approval. Proposed minimal workflow ends at owner review; owner checks, edits and sends manually. No automatic customer send.'),
];
const brief = {
  topic: 'How to Start a Business Using DeepSeek V4.1 Flash',
  audience: 'Beginners exploring a small AI automation service for local businesses.',
  viewerProblem: 'Needs a concrete service, a testable demo and a way to discuss it with an owner, rather than generic business ideas.',
  payoff: 'Plan a customer inquiry assistant, test it with synthetic questions, show it to a salon owner, offer paid setup/testing/handover and optional maintenance. This is a proposed offer with no verified demand or earnings.',
  format: 'tutorial', targetSeconds: 70,
  boundaries: '50–75 seconds. Exact requested title. Customer inquiry > Google Sheets > n8n > DeepSeek category/reply draft > updated sheet > owner notification/human approval. Ask owner about repeated questions; use approved FAQ and synthetic inquiries. Owner checks/edits/sends manually; missing information returns to owner. No earnings, customer results, fixed costs, automatic unverified sends or exact captured UI claims. 1080x1920 30fps; interpreter 3, energetic; captions/music/SFX off. All hook/script/storyboard/motion approvals remain human decisions. Detailed node settings are outside Short duration.',
  sources,
  claims: [
    { id: 'model', statement: 'Use deepseek-flash for the current DeepSeek V4.1 Flash API model.', sourceIds: ['deepseek-model', 'deepseek-api'], caveat: 'Currently serves V4.1-Flash-1017; aliases can change.' },
    { id: 'json', statement: 'Request a category and reply draft in JSON structured fields, then validate before using.', sourceIds: ['deepseek-json', 'deepseek-api'], caveat: 'Proposed task; JSON is not proof of accuracy and empty output must fail to review.' },
    { id: 'sheet-flow', statement: 'n8n can pick up a new Sheets row, call the DeepSeek API and update the original row.', sourceIds: ['sheets-trigger', 'http-request', 'sheets-update'], caveat: 'Proposed integration; authenticated accounts and testing required; not executed here.' },
    { id: 'human-review', statement: 'Notify the owner for factual checking, editing and approval before the owner manually sends.', sourceIds: ['owner-approval'], caveat: 'Safety design requirement, not an automatic factual verification capability.' },
    { id: 'usage', statement: 'DeepSeek API costs depend on usage; agree responsibility for API and hosting costs.', sourceIds: ['deepseek-model'], caveat: 'No price, margin, customer demand, time savings or income promised.' },
  ],
};
const studio = openStudio(config.dataDirectory, config.videosDirectory);
const before = studio.listProjects();
const project = studio.createProject(brief.topic);
const writing = openScriptwriting(config.dataDirectory, config.videosDirectory);
let briefId;
try { briefId = writing.saveBrief(project.id, brief, null); } finally { writing.close(); }
const revision = studio.saveScript(project.id, content, null);
assert.equal(studio.listProjects().length, before.length + 1);
for (const previous of before) assert.deepEqual(studio.getProject(previous.id), previous);
studio.close();
const receipt = { projectId: project.id, revisionId: revision.id, briefId, words,
  estimatedSecondsAt160To175Wpm: [Math.round(words / 175 * 60), Math.round(words / 160 * 60)],
  scriptAccepted: false, hookSelected: false, storyboardAccepted: false, motionAccepted: false,
  productionGates: false, renderAuthorized: false, published: false,
  sourceReview: 'docs/projects/deepseek-v41-flash/FACTS.md', review: 'docs/projects/deepseek-v41-flash/REVIEW.md',
  manualDraft: true, independentEditorialReview: false, previousProjectMetadataPreserved: before.length,
};
writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
try {
  const hooks = await generateWriting(project.id, { kind: 'hooks', parentId: briefId,
    instruction: 'Payoff-first concrete service. No guaranteed sale/income. Keep openings short. Hook options remain unselected; a separate manually authored draft is saved for human review.' },
    AbortSignal.timeout(100_000), (stage) => console.log(stage), config);
  receipt.hooksId = hooks;
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  console.log('Gateway hook options saved; no hook selected.');
} catch (error) {
  receipt.hooksError = error.message;
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  console.log(error.message);
}
