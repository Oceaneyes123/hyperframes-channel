import { createHash } from "node:crypto";
import { z } from "zod";
import { creativeFeedback, feedbackInputSchema } from "../../../../../server/creative-feedback.ts";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { readConfig } from "../../../../../server/config.ts";
import { openVisuals } from "../../../../../server/visual-store.ts";
import { openMotion } from "../../../../../server/motion-store.ts";
import { openStudio } from "../../../../../server/studio.ts";
import { openProduction } from "../../../../../server/production-store.ts";
import { inspectGraphics } from "../../../../../engine/quality/inspect-graphics.ts";
import { inspectCreativeMotion } from "../../../../../engine/quality/inspect-motion.ts";
import { inspectNarration } from "../../../../../engine/quality/inspect-narration.ts";

const inputSchema = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("propose"), feedback: feedbackInputSchema }),
  z.strictObject({ action: z.literal("regress"), id: z.uuid(), artifactIds: z.array(z.uuid()).min(1).max(10) }),
  z.strictObject({ action: z.literal("decide"), id: z.uuid(), decision: z.enum(["activate", "reject"]), confirmedByHuman: z.literal(true), regressionEvidence: z.string().trim().min(1).max(2000), regressionId: z.uuid().optional() }),
  z.strictObject({ action: z.literal("withdraw"), id: z.uuid(), confirmedByHuman: z.literal(true), reason: z.string().trim().min(1).max(2000) }),
]);
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => inputSchema.parse(input), async (input): Promise<Record<string, string>> => {
    const config = readConfig(), feedback = creativeFeedback(config.dataDirectory), studio = openStudio(config.dataDirectory, config.videosDirectory);
    try { if (!studio.getProject(id)) throw new Error("Project unavailable."); } finally { studio.close(); }
    if (input.action === "withdraw") {
      feedback.withdraw(id, input.id, input); return { message: "Rule withdrawn for future requests. Existing artifacts remain unchanged." };
    }
    if (input.action === "regress") {
      const proposal = feedback.list().find((item) => item.id === input.id && item.projectId === id && !item.decision);
      if (!proposal) throw new Error("Pending correction required.");
      const stage = proposal.rule.stages[0], ids = [...new Set([proposal.artifactId, ...input.artifactIds])];
      if (ids.length > 10) throw new Error("Too many regression examples.");
      const examples = [];
      for (const artifactId of ids) {
        if (stage === "graphics") {
          const store = openVisuals(config.dataDirectory, config.videosDirectory);
          try {
            const board = store.read(id, artifactId); if (!board || board.output.kind !== "storyboard") throw new Error("Storyboard unavailable.");
            examples.push({ artifactId, sourceHash: createHash("sha256").update(JSON.stringify(board)).digest("hex"), findings: inspectGraphics(board).findings.map((item) => `${item.rule}: ${item.evidence}`) });
          } finally { store.close(); }
        } else if (stage === "motion") {
          const store = openMotion(config.dataDirectory, config.videosDirectory);
          try {
            const motion = store.read(id, artifactId); if (!motion) throw new Error("Motion unavailable.");
            examples.push({ artifactId, sourceHash: createHash("sha256").update(JSON.stringify(motion)).digest("hex"), findings: inspectCreativeMotion(motion.plan).findings.map((item) => `${item.ruleId}: ${item.evidence}`) });
          } finally { store.close(); }
        } else if (stage === "narration") {
          const store = openProduction(config.dataDirectory, config.videosDirectory);
          try { const voice = store.audio(id, artifactId); examples.push({ artifactId, sourceHash: voice.audioHash, findings: inspectNarration(voice.bytes).findings.map((item) => `${item.ruleId}: ${item.evidence}`) }); }
          finally { store.close(); }
        } else throw new Error("Writing regression is unavailable in this panel.");
      }
      if (examples[0].sourceHash !== proposal.sourceHash) throw new Error("Original feedback source changed.");
      const report = feedback.recordRegression(id, input.id, examples);
      return { regression: JSON.stringify(report), message: "Inspector results saved. Review whether the proposed rule applies and preserves exceptions; no rule has been activated." };
    }
    if (input.action === "decide") {
      feedback.decide(id, input.id, input); return { message: "Correction decision saved. Existing artifacts and approvals preserved." };
    }
    if (input.feedback.stage === "narration") {
      const production = openProduction(config.dataDirectory, config.videosDirectory);
      try {
        const source = production.audio(id, input.feedback.artifactId);
        feedback.propose(id, input.feedback, source.audioHash);
        return { message: "Narration correction proposed. Listening and regression review are required before activation." };
      } finally { production.close(); }
    }
    // UI feedback is bound to an actual saved source; a proposal cannot fabricate evidence identity.
    const store = input.feedback.stage === "graphics" ? openVisuals(config.dataDirectory, config.videosDirectory) : input.feedback.stage === "motion" ? openMotion(config.dataDirectory, config.videosDirectory) : null;
    if (!store) throw new Error("Use a saved graphics or motion finding for this review panel.");
    try {
      const artifact = store.read(id, input.feedback.artifactId);
      if (!artifact || !("plan" in artifact) && (artifact.output.kind !== "storyboard" || !artifact.output.shots[input.feedback.shotIndex]) || "plan" in artifact && !artifact.plan.shots[input.feedback.shotIndex]) throw new Error("Review source unavailable.");
      feedback.propose(id, input.feedback, createHash("sha256").update(JSON.stringify(artifact)).digest("hex"));
      return { message: "Correction saved as a proposed rule. Review regressions before activating it." };
    } finally { store.close(); }
  });
}
