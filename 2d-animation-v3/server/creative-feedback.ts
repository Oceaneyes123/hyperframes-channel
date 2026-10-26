import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { creativeRuleSchema, creativeRules, creativeRulesVersion, creativeSnapshotSchema, type CreativeStage } from "../workflow/creative-rules.ts";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const feedbackInputSchema = z.strictObject({
  artifactId: z.uuid(), shotIndex: z.number().int().min(0).max(39),
  stage: z.enum(["graphics", "motion", "narration", "writing"]),
  evidence: z.string().trim().min(1).max(1000), correction: z.string().trim().min(1).max(1000),
  exceptions: z.string().trim().min(1).max(500),
});
const proposalSchema = z.strictObject({ id: z.uuid(), projectId: z.uuid(), artifactId: z.uuid(), shotIndex: z.number().int().min(0).max(39), sourceHash: z.string().regex(/^[a-f0-9]{64}$/), createdAt: z.iso.datetime(), rule: creativeRuleSchema });
const decisionSchema = z.strictObject({ proposalHash: z.string().regex(/^[a-f0-9]{64}$/), confirmedByHuman: z.literal(true), regressionEvidence: z.string().trim().min(1).max(2000), decision: z.enum(["activate", "reject"]), createdAt: z.iso.datetime() });

// Immutable proposals and one exclusive decision per proposal; no project files or approvals are rewritten.
export function creativeFeedback(directory: string) {
  const root = join(directory, "creative-feedback");
  function list() {
    if (!existsSync(root)) return [];
    return readdirSync(root).filter((name) => /^[a-f0-9-]{36}\.json$/.test(name)).sort().map((name) => {
      const bytes = readFileSync(join(root, name), "utf8"), proposal = proposalSchema.parse(JSON.parse(bytes));
      if (name !== `${proposal.id}.json`) throw new Error("Creative feedback identity mismatch.");
      const path = join(root, `${proposal.id}.decision.json`);
      const decision = existsSync(path) ? decisionSchema.parse(JSON.parse(readFileSync(path, "utf8"))) : null;
      if (decision && decision.proposalHash !== hash(bytes)) throw new Error("Creative feedback integrity failed.");
      return { ...proposal, decision };
    });
  }
  return {
    list,
    propose(projectId: string, input: unknown, sourceHash: string) {
      z.uuid().parse(projectId); const data = feedbackInputSchema.parse(input), id = randomUUID();
      const proposal = proposalSchema.parse({ id, projectId, artifactId: data.artifactId, shotIndex: data.shotIndex, sourceHash, createdAt: new Date().toISOString(),
        rule: { id: `CQ-USER-${id.toUpperCase()}`, version: 1, stages: [data.stage], evidence: data.evidence, correction: data.correction, severity: "review", detection: "Human review of source artifact and regression examples.", exceptions: data.exceptions } });
      mkdirSync(root, { recursive: true }); writeFileSync(join(root, `${id}.json`), JSON.stringify(proposal), { flag: "wx", flush: true }); return proposal;
    },
    decide(projectId: string, id: string, input: unknown) {
      z.uuid().parse(projectId); z.uuid().parse(id);
      if (!list().some((item) => item.id === id && item.projectId === projectId && !item.decision)) throw new Error("Pending correction required.");
      const bytes = readFileSync(join(root, `${id}.json`), "utf8");
      const decision = decisionSchema.parse({ ...z.object({ confirmedByHuman: z.literal(true), regressionEvidence: z.string(), decision: z.enum(["activate", "reject"]) }).parse(input), proposalHash: hash(bytes), createdAt: new Date().toISOString() });
      writeFileSync(join(root, `${id}.decision.json`), JSON.stringify(decision), { flag: "wx", flush: true });
    },
    snapshot(stage: CreativeStage) {
      const rules = [...creativeRules, ...list().filter((item) => item.decision?.decision === "activate").map((item) => item.rule)].filter((rule) => rule.stages.includes(stage));
      const payload = { version: creativeRulesVersion, stage, rules };
      return creativeSnapshotSchema.parse({ ...payload, sha256: hash(JSON.stringify(payload)) });
    },
  };
}
