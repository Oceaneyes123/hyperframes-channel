import { createHash } from "node:crypto";
import { z } from "zod";
import { creativeFeedback, feedbackInputSchema } from "../../../../../server/creative-feedback.ts";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { readConfig } from "../../../../../server/config.ts";
import { openVisuals } from "../../../../../server/visual-store.ts";
import { openMotion } from "../../../../../server/motion-store.ts";
import { openStudio } from "../../../../../server/studio.ts";
import { openProduction } from "../../../../../server/production-store.ts";

const inputSchema = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("propose"), feedback: feedbackInputSchema }),
  z.strictObject({ action: z.literal("decide"), id: z.uuid(), decision: z.enum(["activate", "reject"]), confirmedByHuman: z.literal(true), regressionEvidence: z.string().trim().min(1).max(2000) }),
]);
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => inputSchema.parse(input), async (input) => {
    const config = readConfig(), feedback = creativeFeedback(config.dataDirectory), studio = openStudio(config.dataDirectory, config.videosDirectory);
    try { if (!studio.getProject(id)) throw new Error("Project unavailable."); } finally { studio.close(); }
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
