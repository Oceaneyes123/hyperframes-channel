import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { readConfig } from "../server/config.ts";
import { preflight, PreflightError } from "../server/preflight.ts";
import { openStudio } from "../server/studio.ts";
import { openTiming } from "../server/timing-store.ts";
import { openVisuals } from "../server/visual-store.ts";
import { openMotion } from "../server/motion-store.ts";
import { openProduction } from "../server/production-store.ts";
import { openNarrationStudio, studioNarrationRequestSchema } from "../server/narration/studio.ts";
import { configuredNarrationProvider } from "../server/narration/providers/local.ts";
import { generateVisuals } from "../server/visuals.ts";
import { generateMotion } from "../server/motion.ts";
import { approveWorkflowReview, renderWorkflowReview } from "../server/review-render.ts";
import { renderProduction } from "../server/render.ts";
import { MotionReviewError } from "../server/motion-review.ts";
import { iterateMotion } from "../server/motion-iteration.ts";
import { registerCreativeExample } from "../server/creative-direction.ts";

export const workflowHelp = `Usage: npm run workflow -- <command> <arguments>
preflight <gateway|render|windows-speech|qwen3-custom>
status <project-id>
narrate <project-id> <request.json>             # optional resumeTakeId
import-take <project-id> <reviewed-import.json>
visuals <project-id> <request.json>              # existing concepts/storyboard/shot schema
motion <project-id> <request.json>
improve-motion <project-id> <request.json>       # artifactId, shotIndex; maxRounds:0..2
register-example <project-id> <request.json>     # accepted artifactId, shotIndex, reason
review-board <project-id> <board-id> [shot-index]
review-motion <project-id> <motion-id> [shot-index]
approve-review <project-id> <review-confirmation.json>
approve-production <project-id> <review.json>    # explicit plan + moving/audio confirmations
export <project-id> <authorization.json>        # binding + authorize:true
Reviews never approve artifacts. Shot indices are zero-based. Export retains all verification.`;

export async function runWorkflow(args: string[], signal: AbortSignal, progress: (message: string) => void = console.error) {
  const [command, projectId, argument, index] = args;
  if (!command || command === "--help") return workflowHelp;
  const config = readConfig();
  if (command === "preflight") {
    if (projectId === "windows-speech" || projectId === "qwen3-custom") { await configuredNarrationProvider(projectId).preflight!(signal); return { stage: projectId, ready: true }; }
    return preflight(z.enum(["gateway", "render"]).parse(projectId), signal, config);
  }
  const commands = ["status", "narrate", "import-take", "visuals", "motion", "improve-motion", "register-example", "review-board", "review-motion", "approve-review", "approve-production", "export"];
  if (!commands.includes(command)) throw new Error("Unknown workflow command. Run npm run workflow -- --help.");
  z.uuid().parse(projectId);
  const data = config.dataDirectory, videos = config.videosDirectory;
  if (command === "status") {
    const studio = openStudio(data, videos), timings = openTiming(data, videos), visuals = openVisuals(data, videos), motion = openMotion(data, videos), production = openProduction(data, videos), narration = openNarrationStudio(data, videos);
    try { return { script: studio.acceptance(projectId), timing: timings.latest(projectId), storyboard: visuals.acceptance(projectId), motion: motion.acceptance(projectId), production: production.status(projectId), takes: narration.list(projectId), interrupted: narration.interrupted(projectId) }; }
    finally { narration.close(); production.close(); motion.close(); visuals.close(); timings.close(); studio.close(); }
  }
  if (command === "review-board" || command === "review-motion") return renderWorkflowReview(projectId, { kind: command === "review-board" ? "board" : "motion", artifactId: argument, ...(index !== undefined ? { shotIndex: Number(index) } : {}) }, signal, progress, config);
  if (!argument) throw new Error("A JSON request file is required.");
  const bytes = readFileSync(argument); if (bytes.length > 32000) throw new Error("Workflow request exceeds 32 KB.");
  const input = JSON.parse(bytes.toString("utf8"));
  if (command === "improve-motion") return iterateMotion(projectId, input, signal, progress, config);
  if (command === "register-example") return registerCreativeExample(projectId, input, signal, config);
  if (command === "approve-review") return approveWorkflowReview(projectId, input, config);
  if (command === "narrate" || command === "import-take") {
    const store = openNarrationStudio(data, videos);
    try {
      if (command === "import-take") {
        const request = z.strictObject({ id: z.uuid(), baseId: z.uuid().nullable(), reviewed: z.literal(true) }).parse(input);
        return { timingId: store.import(projectId, request.id, request.baseId, request.reviewed) };
      }
      const request = studioNarrationRequestSchema.parse(input);
      return { takeId: await store.generate(projectId, configuredNarrationProvider(request.provider), request, signal, progress) };
    } finally { store.close(); }
  }
  if (command === "visuals") return { artifactId: await generateVisuals(projectId, input, signal, progress, config) };
  if (command === "motion") return { artifactId: await generateMotion(projectId, input, signal, progress, config) };
  if (command === "approve-production") {
    const store = openProduction(data, videos); try { return store.approveReview(projectId, input); } finally { store.close(); }
  }
  const request = z.strictObject({ binding: z.string().regex(/^[a-f0-9]{64}$/), authorize: z.literal(true) }).parse(input);
  return { jobId: await renderProduction(projectId, request.binding, request.authorize, signal, config, progress) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const controller = new AbortController(); process.once("SIGINT", () => controller.abort());
  try { const result = await runWorkflow(process.argv.slice(2), controller.signal); console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2)); }
  catch (error) { console.error(error instanceof PreflightError || error instanceof MotionReviewError ? error.message : "Workflow failed. Check request values, dependency preflight and saved history before retrying. Existing artifacts are preserved."); process.exitCode = 1; }
}
