import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { readConfig } from "../server/config.ts";
import { openStudio } from "../server/studio.ts";
import { openWritingJobs } from "../server/writing-jobs.ts";
import { reviseScript } from "../server/writer.ts";

// Explicit live smoke test: one model call, synthetic text, isolated local storage.
const current = readConfig();
const root = resolve(".data", `gateway-live-${randomUUID()}`);
const config = { ...current, dataDirectory: join(root, "database"), videosDirectory: join(root, "videos") };
const studio = openStudio(config.dataDirectory, config.videosDirectory);
const jobs = openWritingJobs(config.dataDirectory);
try {
  const project = studio.createProject("Synthetic live gateway check");
  const content = "A draft opening.\nKeep this exact ending.";
  const base = studio.saveScript(project.id, content, null);
  const progress: string[] = [];
  const proposalId = await reviseScript(project.id, {
    baseId: base.id, start: 0, end: "A draft opening.".length,
    instruction: 'Replace the selected sentence with exactly "Here is a clearer opening." This is a technical integration test; put any explanation in notes.',
  }, new AbortController().signal, (message) => progress.push(message), config);
  assert.equal(studio.listRevisions(project.id).length, 1);
  const proposal = studio.readProposal(project.id, proposalId)!;
  assert.ok(proposal.replacement.trim());
  const revision = studio.decideProposal(project.id, proposalId, "accept")!;
  assert.equal(revision.content, proposal.replacement + "\nKeep this exact ending.");
  assert.equal(studio.readRevision(project.id, base.id)?.content, content);
  assert.equal(studio.acceptance(project.id)?.revisionId, revision.id);
  assert.equal(studio.acceptance(project.id)?.stale, false);
  const reopened = openStudio(config.dataDirectory, config.videosDirectory);
  try { assert.equal(reopened.readRevision(project.id, revision.id)?.content, revision.content); }
  finally { reopened.close(); }
  const job = jobs.list(project.id)[0];
  assert.equal(job.status, "succeeded"); assert.equal(job.proposalId, proposalId);
  const report = { verifiedAt: new Date().toISOString(), model: config.gateway.model, projectId: project.id, proposalId,
    revisionId: revision.id, acceptedHash: studio.acceptance(project.id)?.sha256, progress,
    checks: { liveStreaming: true, strictProposal: true, unchangedOutsideSelection: true, draftPreservedUntilAcceptance: true,
      syntheticAcceptance: true, persistenceReopened: true, successfulJobLinked: true },
    productionApproval: false, editorialQualityAssessed: false };
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "report.json"), JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({ status: "PASS", model: config.gateway.model, report: join(root, "report.json"), checks: report.checks }));
} finally { jobs.close(); studio.close(); }
