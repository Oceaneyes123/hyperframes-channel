import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { motionPlanSchema, scheduleMotion } from "../workflow/motion.ts";
import { rhythmProfileSchema } from "../workflow/rhythm-profile.ts";
import { inspectCreativeMotion } from "../engine/quality/inspect-motion.ts";

export function compareRhythm(profileInput: unknown, input: unknown) {
  const profile = rhythmProfileSchema.parse(profileInput);
  const plan = motionPlanSchema.parse(input && typeof input === "object" && "plan" in input ? input.plan : input);
  const schedule = scheduleMotion(plan);
  const review = inspectCreativeMotion(plan, null, profile.reviewTargets);
  return { basis: profile.basis, measuredReference: profile.measuredReference, reviewTargets: profile.reviewTargets,
    durationSeconds: schedule.durationFrames / plan.fps,
    shotLengthsSeconds: schedule.shots.map((shot) => shot.durationFrames / plan.fps),
    primaryPresetUsage: review.primaryPresetUsage,
    reviewFindings: review.findings.filter((finding) => ["rhythm-inactivity", "primary-preset-share", "neighbor-illustration-reuse", "text-element-budget", "audience-disclaimer-label"].includes(finding.ruleId)),
    limitation: "Review hypotheses only. No reference statistics, decoded-video measurements, audio analysis or quality score.",
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [profileFile, ...files] = process.argv.slice(2);
    if (!profileFile || !files.length) throw new Error("Usage: node scripts/rhythm-compare.ts <profile.json> <motion.json> [...motion.json]");
    const profile = JSON.parse(readFileSync(profileFile, "utf8"));
    console.log(JSON.stringify(files.map((file) => ({ file, ...compareRhythm(profile, JSON.parse(readFileSync(file, "utf8"))) })), null, 2));
  } catch (error) { console.error(error instanceof Error ? error.message : "Rhythm comparison failed."); process.exitCode = 1; }
}
