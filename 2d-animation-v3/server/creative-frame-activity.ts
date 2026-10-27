import { execFile } from "node:child_process";
import { promisify } from "node:util";

const frameBytes = 90 * 160;

export function frameActivity(bytes: Buffer) {
  if (bytes.length < frameBytes * 2 || bytes.length % frameBytes) throw new Error("Invalid sampled video frames");
  const intervals: { startSeconds: number; endSeconds: number }[] = [];
  let quietStart: number | null = null;
  const count = bytes.length / frameBytes;
  for (let frame = 1; frame < count; frame++) {
    let difference = 0;
    for (let pixel = 0; pixel < frameBytes; pixel++) difference += Math.abs(bytes[frame * frameBytes + pixel] - bytes[(frame - 1) * frameBytes + pixel]);
    if (difference / frameBytes < 1.5) quietStart ??= (frame - 1) / 2;
    else if (quietStart !== null) { if ((frame - 1) / 2 - quietStart >= 3) intervals.push({ startSeconds: quietStart, endSeconds: (frame - 1) / 2 }); quietStart = null; }
  }
  if (quietStart !== null && (count - 1) / 2 - quietStart >= 3) intervals.push({ startSeconds: quietStart, endSeconds: (count - 1) / 2 });
  return { samplesPerSecond: 2, samples: count, quietIntervals: intervals, requiresHumanReview: true };
}

export async function inspectFrameActivity(video: string) {
  const { stdout } = await promisify(execFile)("ffmpeg", ["-v", "error", "-i", video, "-vf", "fps=2,scale=90:160", "-pix_fmt", "gray", "-f", "rawvideo", "-"], { encoding: "buffer", maxBuffer: 8 * 1024 * 1024 });
  return frameActivity(stdout);
}
