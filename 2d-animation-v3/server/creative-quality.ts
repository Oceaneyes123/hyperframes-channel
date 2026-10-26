import { createHash } from "node:crypto";
import type { VisualArtifact } from "../workflow/visuals.ts";
import { scheduleMotion, type MotionArtifact } from "../workflow/motion.ts";
import { inspectGraphics } from "../engine/quality/inspect-graphics.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";
import { inspectNarration } from "../engine/quality/inspect-narration.ts";

export function creativeQualityReport(board: VisualArtifact | null, motion: MotionArtifact | null, narration?: { id: string; bytes: Buffer }) {
  const graphics = board ? inspectGraphics(board) : null;
  const animation = motion ? inspectCreativeMotion(motion.plan, board?.id === motion.source.storyboardId ? board : null) : null;
  const schedule = motion ? scheduleMotion(motion.plan) : null;
  const voice = narration ? inspectNarration(narration.bytes) : null;
  const issues = [
    ...(graphics?.findings ?? []).map((item) => ({ id: `graphics:${item.id}`, stage: "graphics" as const, artifactId: board!.id, shotIndex: item.shotIndex, startFrame: null, endFrame: null, evidence: `${item.rule}: ${item.evidence}`, correction: item.suggestion })),
    ...(animation?.findings ?? []).map((item) => ({ id: `motion:${item.id}`, stage: "motion" as const, artifactId: motion!.id, shotIndex: motion!.plan.shots.findIndex((shot) => shot.id === item.shotId), startFrame: item.startFrame, endFrame: item.endFrame, evidence: `${item.ruleId}: ${item.evidence}`, correction: item.suggestion })),
    ...(voice?.findings ?? []).map((item) => ({ id: `narration:${item.ruleId}`, stage: "narration" as const, artifactId: narration!.id, shotIndex: 0, startFrame: 0, endFrame: voice!.measured.durationFrames, evidence: `${item.ruleId}: ${item.evidence}`, correction: "Review the raw take and revise voice generation settings before reimporting; listen for pronunciation and delivery." })),
  ];
  return { version: "creative-quality-report@1", requiresHumanReview: true, boardId: board?.id ?? null, motionId: motion?.id ?? null,
    sourceHash: createHash("sha256").update(JSON.stringify({ board, motion, narrationHash: narration ? createHash("sha256").update(narration.bytes).digest("hex") : null })).digest("hex"), durationFrames: schedule?.durationFrames ?? null, narration: voice, narrationId: narration?.id ?? null,
    ruleSnapshots: { graphics: board?.creativeRules ?? null, motion: motion?.creativeRules ?? null },
    issues, reviewRequired: ["Graphics at phone size", "Full moving video with synchronized narration", "Pronunciation, expressive delivery and voice consistency", "Comprehension and factual continuity"],
  };
}
export type CreativeQualityReport = ReturnType<typeof creativeQualityReport>;
