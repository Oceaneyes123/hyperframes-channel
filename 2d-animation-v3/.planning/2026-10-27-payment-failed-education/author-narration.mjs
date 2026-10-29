import { resolve } from "node:path";
import { scriptLines } from "../../workflow/visuals.ts";
import { readConfig } from "../../server/config.ts";
import { openMotion } from "../../server/motion-store.ts";
import { generateNarrationTake } from "../../server/narration/generation.ts";
import { pythonNarrationProvider } from "../../server/narration/providers/local.ts";
import { openStudio } from "../../server/studio.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const motion = openMotion(config.dataDirectory, config.videosDirectory);
const artifact = motion.read(projectId, motion.latest(projectId));
const studio = openStudio(config.dataDirectory, config.videosDirectory);
const script = artifact ? studio.readRevision(projectId, artifact.source.scriptId) : null;
motion.close();
studio.close();
if (!artifact || !script) throw new Error("Accepted motion source unavailable.");

const deliveryByLine = new Map(artifact.plan.shots.flatMap((shot, index) =>
  shot.lineNumbers.map((number) => [number, index === 0 ? "hook" : index === artifact.plan.shots.length - 1 ? "payoff" : "explanation"]),
));
const requestedLine = process.argv.find((value) => value.startsWith("--line="))?.slice("--line=".length);
const lines = scriptLines(script.content).map((line) => ({
  number: line.number,
  text: line.text,
  delivery: deliveryByLine.get(line.number),
})).filter((line) => !requestedLine || line.number === Number(requestedLine));
const provider = pythonNarrationProvider({
  provider: "qwen3-custom",
  python: resolve(".data/tts-env/qwen/Scripts/python.exe"),
  modelPath: resolve(".data/tts-models/qwen-custom-1.7b"),
  version: "0c0e3051f131929182e2c023b9537f8b1c68adfe",
  voice: "ryan",
  device: "cpu",
});
const result = await generateNarrationTake(config.dataDirectory, provider, {
  lines,
  pronunciation: [],
  seed: 20261027,
  rate: 0,
}, AbortSignal.timeout(1_800_000), { source: { projectId, scriptId: script.id, scriptHash: artifact.source.scriptHash } });
console.log(`NARRATION_ID=${result.manifest.id}`);
console.log(`NARRATION_WAV=${resolve(result.root, "narration.wav")}`);
console.log(`DURATION_SECONDS=${(result.manifest.segments.at(-1).endFrame / 30).toFixed(3)}`);
