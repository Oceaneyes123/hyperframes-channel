import { inspectWav, pcm16Data } from "../../server/wav.ts";

export function inspectNarration(bytes: Buffer) {
  const measured = inspectWav(bytes), data = pcm16Data(bytes);
  let clipped = 0, sum = 0, peak = 0;
  for (let offset = 0; offset < data.length; offset += 2) {
    const value = Math.abs(data.readInt16LE(offset)) / 32768;
    sum += value * value; peak = Math.max(peak, value); if (value >= .999) clipped++;
  }
  const clippedFraction = clipped / (data.length / 2), rms = Math.sqrt(sum / (data.length / 2));
  const findings: { ruleId: string; evidence: string; severity: "review" }[] = [];
  if (clippedFraction > .001) findings.push({ ruleId: "clipping", evidence: `${(clippedFraction * 100).toFixed(3)}% of samples reach the clipping threshold.`, severity: "review" });
  if (peak < .1) findings.push({ ruleId: "quiet", evidence: `Peak amplitude ${peak.toFixed(4)}.`, severity: "review" });
  return { version: "narration-quality@1", measured, peak, rms, clippedFraction, findings, requiresHumanReview: true as const,
    listeningRequired: ["pronunciation", "voice consistency", "expressive delivery", "timing and comprehension"] };
}
