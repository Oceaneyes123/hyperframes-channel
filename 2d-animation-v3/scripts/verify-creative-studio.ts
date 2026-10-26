import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { openStudio } from "../server/studio.ts";
import { openVisuals } from "../server/visual-store.ts";
import { conceptFixture, boardFixture } from "../tests/fixtures/visuals.ts";
import { creativeFeedback } from "../server/creative-feedback.ts";

const root = resolve(".data/creative-quality-browser"), directory = join(root, "database"), videos = join(root, "videos");
if (process.argv.includes("--serve")) {
  Object.assign(process.env, { V3_DATA_DIR: directory, V3_VIDEOS_DIR: videos });
  const next = (await import("next")).default, app = next({ dev: false, hostname: "127.0.0.1", port: 3003 });
  await app.prepare(); createServer(app.getRequestHandler()).listen(3003, "127.0.0.1", () => console.log("Synthetic quality review: http://127.0.0.1:3003"));
} else {
  const studio = openStudio(directory, videos), visuals = openVisuals(directory, videos);
  try {
    const project = studio.createProject("SYNTHETIC quality system UI verification"), script = studio.saveScript(project.id, "Start with a container.\nChange its amount.\nCompare the result.", null);
    studio.acceptScript(project.id, script.id);
    const request = { kind: "concepts", scriptId: script.id, baseId: null, selectionId: null, shotIndex: null, instruction: "Synthetic software verification, not human production approval." };
    const feedback = creativeFeedback(directory), rules = feedback.snapshot("graphics");
    const concepts = visuals.begin(project.id, request, "fixture"); visuals.complete(project.id, concepts, conceptFixture, rules);
    const selectionId = visuals.choose(project.id, concepts, 0, null), boardId = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture");
    visuals.complete(project.id, boardId, boardFixture(), rules); const board = visuals.read(project.id, boardId)!;
    feedback.propose(project.id, { artifactId: boardId, shotIndex: 0, stage: "graphics", evidence: "Synthetic repeated container layout.", correction: "Review whether intentional continuity helps teaching.", exceptions: "Preserve a useful comparison." }, createHash("sha256").update(JSON.stringify(board)).digest("hex"));
    mkdirSync(root, { recursive: true }); const receipt = { syntheticOnly: true, humanApproval: false, projectId: project.id, boardId, url: `http://127.0.0.1:3003/projects/${project.id}/visuals` };
    writeFileSync(join(root, `seed-${Date.now()}.json`), JSON.stringify(receipt, null, 2), { flag: "wx" }); console.log(JSON.stringify(receipt));
  } finally { visuals.close(); studio.close(); }
}
