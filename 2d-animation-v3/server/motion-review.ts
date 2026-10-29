import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const hash = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const reportSchema = z.object({ projectId: z.uuid(), artifactId: z.uuid(), kind: z.literal("motion"), sourceHash: digest, engineHash: digest, audioHash: digest.nullable(), scope: z.enum(["selected-shot", "all-shots"]), files: z.array(z.object({ file: z.literal("review.mp4"), sha256: digest })).length(1) });
const decisionSchema = z.strictObject({ reviewId: z.uuid(), watchedNormalSpeed: z.literal(true), causeReactionReviewed: z.literal(true), rhythmReviewed: z.literal(true), notes: z.string().trim().min(10).max(2000) });
export class MotionReviewError extends Error {}

export function motionReviewStore(directory: string) {
  const root = join(directory, "workflow-reviews");
  function read(reviewId: string) {
    const path = join(root, z.uuid().parse(reviewId)), bytes = readFileSync(join(path, "review.json"));
    const report = reportSchema.parse(JSON.parse(bytes.toString("utf8")));
    if (report.files.some((file) => hash(readFileSync(join(path, file.file))) !== file.sha256)) throw new Error("Motion review media integrity failed.");
    return { path, report, reportHash: hash(bytes) };
  }
  return {
    read,
    approve(projectId: string, input: unknown, expected: { artifactId: string; sourceHash: string; engineHash: string }) {
      const request = decisionSchema.parse(input), review = read(request.reviewId), { report, reportHash, path } = review;
      if (report.projectId !== z.uuid().parse(projectId) || report.artifactId !== expected.artifactId || report.sourceHash !== expected.sourceHash || report.engineHash !== expected.engineHash) throw new Error("Motion review inputs changed. Review the current candidate.");
      if (report.scope === "all-shots" && !report.audioHash) throw new Error("Full rhythm review requires the motion-bound narration.");
      const bytes = JSON.stringify({ ...request, projectId, ...expected, reportHash, scope: report.scope, createdAt: new Date().toISOString() });
      writeFileSync(join(path, "approval.json"), bytes, { flag: "wx", flush: true });
      writeFileSync(join(path, "approval.sha256"), hash(bytes), { flag: "wx", flush: true });
      return { reviewId: request.reviewId, scope: report.scope, approvalHash: hash(bytes) };
    },
    hasSceneApproval(projectId: string, artifactId: string, sourceHash: string, engineHash: string) {
      if (!existsSync(root)) return false;
      for (const id of readdirSync(root).filter((id) => z.uuid().safeParse(id).success)) {
        const file = join(root, id, "approval.json"); if (!existsSync(file)) continue;
        const approvalBytes = readFileSync(file), approval = JSON.parse(approvalBytes.toString("utf8"));
        if (approval.projectId !== projectId || approval.artifactId !== artifactId || approval.sourceHash !== sourceHash || approval.engineHash !== engineHash || approval.scope !== "selected-shot") continue;
        if (hash(approvalBytes) !== readFileSync(join(root, id, "approval.sha256"), "utf8")) throw new MotionReviewError("Motion review approval integrity failed.");
        decisionSchema.parse({ reviewId: approval.reviewId, watchedNormalSpeed: approval.watchedNormalSpeed, causeReactionReviewed: approval.causeReactionReviewed, rhythmReviewed: approval.rhythmReviewed, notes: approval.notes });
        const review = read(id);
        if (approval.reviewId !== id || review.reportHash !== approval.reportHash || review.report.sourceHash !== sourceHash || review.report.engineHash !== engineHash || review.report.projectId !== projectId || review.report.artifactId !== artifactId || review.report.scope !== "selected-shot") throw new Error("Motion review approval integrity failed.");
        return true;
      }
      return false;
    },
  };
}
