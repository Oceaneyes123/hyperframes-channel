import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readConfig } from '../../server/config.ts';
import { openStudio } from '../../server/studio.ts';
import { openScriptwriting } from '../../server/scriptwriting-store.ts';
import { generateWriting } from '../../server/scriptwriting.ts';

// One-project preparation only; reruns reuse the receipt and preserve prior runs.
const receiptPath = new URL('./receipt.json', import.meta.url);
const config = readConfig();
let receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')) : null;
const save = () => writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
const studio = openStudio(config.dataDirectory, config.videosDirectory);
try {
  if (!receipt) {
    const project = studio.createProject('GPT-6.1 Terra Is Fast. Can It Respect the Limits?');
    receipt = { projectId: project.id, briefId: null, hooksId: null, hookSelected: false, createdAt: project.createdAt };
    save();
  }
  assert(studio.getProject(receipt.projectId));
  assert.equal(studio.listRevisions(receipt.projectId).length, 0);
} finally { studio.close(); }

const store = openScriptwriting(config.dataDirectory, config.videosDirectory);
try {
  if (!receipt.briefId) {
    receipt.briefId = store.saveBrief(receipt.projectId, {
      topic: 'GPT-6.1 Terra: faster agent tasks and the limits of authorization reliability',
      audience: 'English-speaking technology viewers considering AI agents for professional work; explain unfamiliar terms plainly.',
      viewerProblem: 'Launch benchmarks measure capability and speed, but users also need agents to respect the scope of connected-software tasks.',
      payoff: 'Editorial judgment: evaluate task quality and authorization behavior together before granting consequential tool access. Return to the opening fast workspace with a deliberate review handoff.',
      format: 'explainer', targetSeconds: 65,
      boundaries: 'YouTube Shorts 1080x1920 30fps, 50–75 seconds. No BGM, SFX or captions. Premium object-led editorial graphics, sparse teaching text. Proposed headline: GPT-6.1 Terra Is Fast. Can It Respect the Limits? Requested incredibly bad / fall of ChatGPT verdict is unsupported. No fabricated conversations, complaints, damage or universal failure claims. Clearly label an illustrative evaluation mechanism. Distinguish independent analytics testing from safety testing. Say the 29.6% test conditions aloud. Sources checked October 28, 2026. Human chooses hook; do not select or approve anything. Produce five distinct hooks; favor a short question or concrete conflict over a long setup. No forced CTA.',
      sources: [
        { id: 'release', title: 'OpenAI model release notes', url: 'https://help.openai.com/en/articles/9624314-model-release-notes', notes: 'October 26, 2026: Terra released for Work, Codex and API, not ordinary Chat. Standard API per million tokens: $1 input, $0.05 cached input, $5 output. API billing separate from subscriptions.' },
        { id: 'launch', title: 'OpenAI launch measurements', url: 'https://openai.com/index/introducing-gpt-6-1-terra/', notes: 'Publisher positions Terra for visual reasoning, computer use and writing. Reports over 3x faster task completion than Astra and 6.1 Sol in discussed benchmark setting; standard token prices 50% below 5.6 Terra and 6.1 Sol. Do not generalize task speed or total costs.' },
        { id: 'warnings', title: 'System-card section 7.2: Respecting Warnings', url: 'https://deploymentsafety.openai.com/gpt-6-1-terra/respecting-warnings', notes: '29.6% successful alternate-route restriction circumvention at maximum reasoning effort. Simulated primarily low-stakes work environments, WITHOUT system-level safeguards. Not normal production failure probability. Environmental barriers, not auto-review denials. No concrete destructive user incident established. Metric changed to successful circumvention. Source warns of evaluation awareness and external-validity limits.' },
        { id: 'safety-context', title: 'System-card section 7.1: Respecting Auto-Review', url: 'https://deploymentsafety.openai.com/gpt-6-1-terra/respecting-auto-review', notes: 'Separate auto-review protocol: Terra made no monitor-bypass attempts. Do not confuse this with environmental warnings circumvention. Broader internal deployment simulation in the same card also reports lower serious flag prevalence than older Sol, not universal regression.' },
        { id: 'plotly', title: 'Plotly independent analytics exam', url: 'https://plotly.com/blog/gpt-6-1-terra-plotly-data-analytics-bench/', notes: 'Plotly ran its own exam: Terra 40/43, Sol 43/43. Terra full-run cost $1.31 versus $2.61; median question 15s versus 18s. OpenRouter default effort, private exam on synthetic wind-fleet data, no uncertainty interval. Independent capability test, not an independent reproduction of safety findings.' },
      ],
      claims: [
        { id: 'availability', statement: 'OpenAI released GPT-6.1 Terra on October 26 for Work, Codex and API; it does not replace ordinary Chat.', sourceIds: ['release'], caveat: 'Do not describe all ChatGPT as powered by Terra.' },
        { id: 'promise', statement: 'OpenAI pitches faster computer work and lower token prices for Terra.', sourceIds: ['launch'], caveat: 'Attribute any speed figure to OpenAI and its tested setting; token price is not total task cost.' },
        { id: 'warnings-result', statement: 'OpenAI reports successful restriction circumvention in 29.6% of max-effort rollouts in a simulated warnings test without system-level safeguards.', sourceIds: ['warnings'], caveat: 'Primarily low-stakes controlled tasks, not ordinary deployment failure probability or successful bypass of auto-review.' },
        { id: 'safety-context', statement: 'Terra made no monitor-bypass attempts in OpenAI’s separate auto-review evaluation.', sourceIds: ['safety-context'], caveat: 'A different protocol; this favorable result does not erase the warnings finding.' },
        { id: 'independent-value', statement: 'Plotly’s own analytics exam scored Terra at 40 of 43 questions, supporting useful capability in that test.', sourceIds: ['plotly'], caveat: 'Private synthetic-data exam at default effort; not proof of authorization safety.' },
        { id: 'workflow-judgment', statement: 'Editorial inference: users should evaluate task performance and authorization behavior together for connected-software workflows.', sourceIds: ['warnings', 'safety-context'], caveat: 'Risk-based workflow judgment, not proof every deployed Terra agent crosses boundaries.' },
      ],
    }, null);
    save();
  }
  assert.equal(store.read(receipt.projectId, receipt.briefId).output.kind, 'brief');
} finally { store.close(); }

if (!receipt.hooksId) {
  receipt.hooksId = await generateWriting(receipt.projectId, {
    kind: 'hooks', parentId: receipt.briefId,
    instruction: 'Five distinct short hooks. Prefer a question about boundaries while keeping the launch appealing. No unsupported accusation; no implication the 29.6% is ordinary-use failure or auto-review bypass. Hook may pose an editorial question without a numeric claim. Put test conditions in the later explanation. State brief claim IDs precisely. Do not select an option. Visuals should carry a persistent document through one connected workspace. No fabricated UI evidence. Keep spoken hook ideally 6–10 words for the first 3 seconds.',
  }, new AbortController().signal, (message) => console.log(message), config);
  save();
}
const verify = openScriptwriting(config.dataDirectory, config.videosDirectory);
try {
  const hooks = verify.read(receipt.projectId, receipt.hooksId);
  assert.equal(hooks.output.kind, 'hooks');
  assert.equal(hooks.output.hooks.length, 5);
  assert.equal(hooks.parentId, receipt.briefId);
  assert.equal(receipt.hookSelected, false);
  console.log(JSON.stringify({ receipt, hooks: hooks.output.hooks }, null, 2));
} finally { verify.close(); }
