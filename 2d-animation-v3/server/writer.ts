import { creativeFeedback } from "./creative-feedback.ts";
import { creativeRuleGuidance } from "../workflow/creative-rules.ts";
import { readConfig } from "./config.ts";
import { openStudio, ConflictError } from "./studio.ts";
import { openWritingJobs } from "./writing-jobs.ts";
import { requestReplacement } from "./gateway.ts";
import { applyReplacement, revisionRequestSchema } from "../workflow/review.ts";
import { z } from "zod";

// Request lifetime is the worker lifetime. No background retry or model tool execution.
export async function reviseScript(projectId: string, input: unknown, signal: AbortSignal, progress: (message: string) => void,
  config = readConfig()) {
  z.uuid().parse(projectId);
  const request = revisionRequestSchema.parse(input);
  if (!config.gateway.baseUrl || !config.gateway.model) throw new Error("Configure a gateway URL and model on the server first.");
  const studio = openStudio(config.dataDirectory, config.videosDirectory);
  const jobs = openWritingJobs(config.dataDirectory);
  let jobId: string | undefined;
  try {
    const base = studio.readRevision(projectId, request.baseId);
    if (!base || studio.listRevisions(projectId)[0]?.id !== base.id) throw new ConflictError("Select text from the latest saved revision before requesting changes.");
    applyReplacement(base.content, request.start, request.end, base.content.slice(request.start, request.end));
    const history = jobs.list(projectId).filter((job) => job.status === "succeeded").slice(0, 3).reverse().map((job) => {
      const proposal = job.proposalId ? studio.readProposal(projectId, job.proposalId) : null;
      return { instruction: job.request.instruction, status: studio.listProposals(projectId).find((item) => item.id === proposal?.id)?.status ?? job.status, notes: proposal?.notes ?? "" };
    });
    jobId = jobs.start(projectId, request, config.gateway.model);
    progress("Checking gateway model availability…");
    let last = 0;
    const rules = creativeFeedback(config.dataDirectory).snapshot("writing");
    const result = await requestReplacement({ baseUrl: config.gateway.baseUrl, apiKey: config.gateway.apiKey, model: config.gateway.model },
      { script: base.content, start: request.start, end: request.end, instruction: request.instruction, history, creativeGuidance: creativeRuleGuidance(rules) },
      AbortSignal.any([signal, AbortSignal.timeout(90_000)]), (characters) => {
        if (characters - last >= 100) { progress(`Receiving proposal (${characters} characters)…`); last = characters; }
      });
    signal.throwIfAborted();
    const proposal = studio.createProposal(projectId, request, result.replacement, result.notes, jobId, rules);
    progress("Proposal saved for review. The script has not changed.");
    return proposal.id;
  } catch (error) {
    // Do not expose upstream bodies, credentials, connection details or raw parsing errors.
    const message = error instanceof ConflictError ? error.message : "Writing request failed or timed out. No script changes were applied. Check gateway access and retry.";
    if (jobId) jobs.fail(jobId, message);
    throw new Error(message);
  } finally { jobs.close(); studio.close(); }
}
