import { creativeQualityReport } from "./creative-quality.ts";
import { validateMotion, scheduleMotion, type MotionArtifact } from "../workflow/motion.ts";
import type { VisualArtifact } from "../workflow/visuals.ts";
import { hashMotionSource } from "./motion-store.ts";
import { z } from "zod";

export const creativeHumanReviewSchema = z.strictObject({
  reviewedByHuman: z.literal(true), reviewer: z.string().trim().min(1).max(120),
  desktop: z.enum(["pass", "fail"]), mobile: z.enum(["pass", "fail"]), listening: z.enum(["pass", "fail"]), comprehension: z.enum(["pass", "fail"]),
  comparison: z.enum(["improved", "not-improved", "inconclusive"]), blinded: z.boolean(), criticalIssuesOpen: z.boolean(), notes: z.string().trim().min(10).max(4000),
});
export function evaluateHumanReview(input: unknown) {
  const review = creativeHumanReviewSchema.parse(input);
  const comparisonPassed = [review.desktop, review.mobile, review.listening, review.comprehension].every((outcome) => outcome === "pass") && review.comparison === "improved" && !review.criticalIssuesOpen;
  return { review, comparisonPassed, releaseEligible: false as const, reason: "Existing production gates and explicit render authorization remain required." };
}

export type CreativeEvaluationInput = { board: VisualArtifact; storyboardHash: string; motion: MotionArtifact; narration: { id: string; bytes: Buffer } };
export function evaluateCreativePair(baseline: CreativeEvaluationInput, candidate: CreativeEvaluationInput) {
  const reports = [baseline, candidate].map((input) => {
    if (input.motion.source.storyboardId !== input.board.id || input.motion.source.storyboardHash !== input.storyboardHash || input.motion.source.scriptId !== input.board.scriptId || input.motion.source.scriptHash !== input.board.scriptHash) throw new Error("Evaluation sources do not match.");
    validateMotion(input.motion.plan, input.board, hashMotionSource);
    const durationFrames = scheduleMotion(input.motion.plan).durationFrames;
    if (durationFrames < 1500 || durationFrames > 2250) throw new Error("Release comparison requires a complete 50–75-second timeline.");
    const report = creativeQualityReport(input.board, input.motion, input.narration);
    if (Math.abs(report.narration!.measured.durationSeconds * 30 - durationFrames) > 1) throw new Error("Comparison narration must match its complete timeline.");
    return report;
  });
  if (baseline.motion.source.scriptHash !== candidate.motion.source.scriptHash) throw new Error("Freeze identical facts and narration text for this controlled comparison.");
  const summary = (report: typeof reports[number]) => Object.fromEntries(["graphics", "motion", "narration"].map((stage) => [stage, report.issues.filter((issue) => issue.stage === stage).length]));
  return { version: "creative-evaluation@1", baseline: reports[0], candidate: reports[1], findings: { baseline: summary(reports[0]), candidate: summary(reports[1]) },
    humanReview: { desktop: "pending", mobile: "pending", listening: "pending", comprehension: "pending", blindedPreference: "pending" },
    releaseEligible: false, note: "Finding counts are regression evidence, not aesthetic scores or proof of improvement. Existing production approvals remain authoritative." };
}
