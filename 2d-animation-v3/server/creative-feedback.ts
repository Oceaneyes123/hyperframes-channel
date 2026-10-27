import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { creativeDetectors, creativeRuleSchema, creativeRules, creativeRulesVersion, creativeSnapshotSchema, type CreativeStage } from "../workflow/creative-rules.ts";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const feedbackInputSchema = z.strictObject({
  artifactId: z.uuid(), shotIndex: z.number().int().min(0).max(39),
  stage: z.enum(["graphics", "motion", "narration", "writing"]),
  evidence: z.string().trim().min(1).max(1000), correction: z.string().trim().min(1).max(1000),
  exceptions: z.string().trim().min(1).max(500),
  detectorId: z.string().trim().min(1).max(80).optional(),
});
const proposalSchema = z.strictObject({ id: z.uuid(), projectId: z.uuid(), artifactId: z.uuid(), shotIndex: z.number().int().min(0).max(39), sourceHash: z.string().regex(/^[a-f0-9]{64}$/), createdAt: z.iso.datetime(), rule: creativeRuleSchema });
const digestSchema = z.string().regex(/^[a-f0-9]{64}$/);
const regressionSchema = z.strictObject({ id: z.uuid(), proposalId: z.uuid(), proposalHash: digestSchema, createdAt: z.iso.datetime(), examples: z.array(z.strictObject({ artifactId: z.uuid(), sourceHash: digestSchema, findings: z.array(z.string().max(1000)).max(1000) })).min(1).max(10) });
const decisionSchema = z.strictObject({ proposalHash: digestSchema, confirmedByHuman: z.literal(true), regressionEvidence: z.string().trim().min(1).max(2000), regressionId: z.uuid().optional(), regressionHash: digestSchema.optional(), decision: z.enum(["activate", "reject"]), createdAt: z.iso.datetime() });
const withdrawalSchema = z.strictObject({ decisionHash: digestSchema, confirmedByHuman: z.literal(true), reason: z.string().trim().min(1).max(2000), createdAt: z.iso.datetime() });

// Immutable proposals and one exclusive decision per proposal; no project files or approvals are rewritten.
export function creativeFeedback(directory: string) {
  const root = join(directory, "creative-feedback");
  function regression(id: string, regressionId: string, proposalHash: string) {
    const bytes = readFileSync(join(root, `${z.uuid().parse(id)}.${z.uuid().parse(regressionId)}.regression.json`), "utf8");
    const report = regressionSchema.parse(JSON.parse(bytes));
    if (report.id !== regressionId || report.proposalId !== id || report.proposalHash !== proposalHash) throw new Error("Creative regression integrity failed.");
    return { report, hash: hash(bytes) };
  }
  function list() {
    if (!existsSync(root)) return [];
    return readdirSync(root).filter((name) => /^[a-f0-9-]{36}\.json$/.test(name)).sort().map((name) => {
      const bytes = readFileSync(join(root, name), "utf8"), proposal = proposalSchema.parse(JSON.parse(bytes));
      if (name !== `${proposal.id}.json`) throw new Error("Creative feedback identity mismatch.");
      const path = join(root, `${proposal.id}.decision.json`);
      const decision = existsSync(path) ? decisionSchema.parse(JSON.parse(readFileSync(path, "utf8"))) : null;
      if (decision && decision.proposalHash !== hash(bytes)) throw new Error("Creative feedback integrity failed.");
      if (decision && (!!decision.regressionId !== !!decision.regressionHash || decision.regressionId && regression(proposal.id, decision.regressionId, hash(bytes)).hash !== decision.regressionHash)) throw new Error("Creative regression integrity failed.");
      const withdrawalPath = join(root, `${proposal.id}.withdrawal.json`);
      const withdrawal = existsSync(withdrawalPath) ? withdrawalSchema.parse(JSON.parse(readFileSync(withdrawalPath, "utf8"))) : null;
      if (withdrawal && (!decision || decision.decision !== "activate" || withdrawal.decisionHash !== hash(readFileSync(path, "utf8")))) throw new Error("Creative withdrawal integrity failed.");
      return { ...proposal, decision, withdrawal };
    });
  }
  return {
    list,
    propose(projectId: string, input: unknown, sourceHash: string) {
      z.uuid().parse(projectId); const data = feedbackInputSchema.parse(input), id = randomUUID();
      if (data.detectorId && !(creativeDetectors[data.stage] as readonly string[]).includes(data.detectorId)) throw new Error("Unknown detector for this stage.");
      const proposal = proposalSchema.parse({ id, projectId, artifactId: data.artifactId, shotIndex: data.shotIndex, sourceHash, createdAt: new Date().toISOString(),
        rule: { id: `CQ-USER-${id.toUpperCase()}`, version: 1, stages: [data.stage], evidence: data.evidence, correction: data.correction, severity: "review", detection: data.detectorId ? `Existing ${data.stage} inspector: ${data.detectorId}; human review required.` : "Human review of source artifact and regression examples.", exceptions: data.exceptions, detectorId: data.detectorId } });
      mkdirSync(root, { recursive: true }); writeFileSync(join(root, `${id}.json`), JSON.stringify(proposal), { flag: "wx", flush: true }); return proposal;
    },
    recordRegression(projectId: string, id: string, examples: z.infer<typeof regressionSchema>["examples"]) {
      const proposal = list().find((item) => item.id === z.uuid().parse(id) && item.projectId === z.uuid().parse(projectId) && !item.decision);
      if (!proposal) throw new Error("Pending correction required.");
      if (examples[0]?.artifactId !== proposal.artifactId || examples[0]?.sourceHash !== proposal.sourceHash) throw new Error("Regression must include the exact original source first.");
      if (proposal.rule.detectorId && !examples[0].findings.some((finding) => finding.startsWith(`${proposal.rule.detectorId}:`))) throw new Error("The selected detector did not identify the original example.");
      const bytes = readFileSync(join(root, `${id}.json`), "utf8");
      const report = regressionSchema.parse({ id: randomUUID(), proposalId: id, proposalHash: hash(bytes), createdAt: new Date().toISOString(), examples });
      writeFileSync(join(root, `${id}.${report.id}.regression.json`), JSON.stringify(report), { flag: "wx", flush: true });
      return report;
    },
    decide(projectId: string, id: string, input: unknown) {
      z.uuid().parse(projectId); z.uuid().parse(id);
      if (!list().some((item) => item.id === id && item.projectId === projectId && !item.decision)) throw new Error("Pending correction required.");
      const bytes = readFileSync(join(root, `${id}.json`), "utf8");
      const data = z.object({ confirmedByHuman: z.literal(true), regressionEvidence: z.string(), regressionId: z.uuid().optional(), decision: z.enum(["activate", "reject"]) }).parse(input);
      if (data.decision === "activate" && !data.regressionId) throw new Error("Run and review a regression report before activation.");
      const report = data.regressionId ? regression(id, data.regressionId, hash(bytes)) : null;
      const decision = decisionSchema.parse({ ...data, ...(report ? { regressionHash: report.hash } : {}), proposalHash: hash(bytes), createdAt: new Date().toISOString() });
      writeFileSync(join(root, `${id}.decision.json`), JSON.stringify(decision), { flag: "wx", flush: true });
    },
    withdraw(projectId: string, id: string, input: unknown) {
      const proposal = list().find((item) => item.id === z.uuid().parse(id) && item.projectId === z.uuid().parse(projectId) && item.decision?.decision === "activate" && !item.withdrawal);
      if (!proposal) throw new Error("Active correction required.");
      const decisionBytes = readFileSync(join(root, `${id}.decision.json`), "utf8");
      const data = z.object({ confirmedByHuman: z.literal(true), reason: z.string() }).parse(input);
      const withdrawal = withdrawalSchema.parse({ ...data, decisionHash: hash(decisionBytes), createdAt: new Date().toISOString() });
      writeFileSync(join(root, `${id}.withdrawal.json`), JSON.stringify(withdrawal), { flag: "wx", flush: true });
    },
    snapshot(stage: CreativeStage) {
      const rules = [...creativeRules, ...list().filter((item) => item.decision?.decision === "activate" && !item.withdrawal).map((item) => item.rule)].filter((rule) => rule.stages.includes(stage));
      const payload = { version: creativeRulesVersion, stage, rules };
      return creativeSnapshotSchema.parse({ ...payload, sha256: hash(JSON.stringify(payload)) });
    },
  };
}
