import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { creativeHumanReviewSchema, evaluateHumanReview } from "../server/creative-evaluation.ts";

const input = z.strictObject({ report: z.string().min(1), output: z.string().min(1), review: creativeHumanReviewSchema }).parse(JSON.parse(readFileSync(process.argv[2], "utf8")));
const reportBytes = readFileSync(input.report), report = z.object({ version: z.literal("creative-evaluation@1"), sources: z.object({ baseline: z.record(z.string(), z.string()), candidate: z.record(z.string(), z.string()) }), inputHashes: z.array(z.record(z.string(), z.string())).length(2) }).parse(JSON.parse(reportBytes.toString("utf8")));
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
for (const [index, source] of [report.sources.baseline, report.sources.candidate].entries()) for (const key of ["storyboard", "motion", "narration", "video"]) {
  if (!source[key] || hash(readFileSync(source[key])) !== report.inputHashes[index][key]) throw new Error(`Comparison ${key} changed. Re-evaluate before review.`);
}
const record = { version: "creative-human-review@1", reportHash: hash(reportBytes), createdAt: new Date().toISOString(), ...evaluateHumanReview(input.review) };
writeFileSync(input.output, JSON.stringify(record, null, 2), { flag: "wx", flush: true });
console.log(`Human review record saved to ${input.output}; production approvals remain separate.`);
