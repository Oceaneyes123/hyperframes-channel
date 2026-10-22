import { resolve } from "node:path";
import { openStudio } from "../../server/studio.ts";
import { openVisuals } from "../../server/visual-store.ts";
import { conceptFixture, boardFixture } from "./visuals.ts";

const directory = resolve(".data/motion-browser/database"), videos = resolve(".data/motion-browser/videos");
const studio = openStudio(directory, videos), visuals = openVisuals(directory, videos);
try {
  const project = studio.createProject("Synthetic GSAP workflow verification");
  const script = studio.saveScript(project.id, "Start at one hundred.\nNow halve the amount.\nCompare the new amount with the original.", null);
  studio.acceptScript(project.id, script.id);
  const request = { kind: "concepts", scriptId: script.id, selectionId: null, baseId: null, shotIndex: null, instruction: "Synthetic verification only" };
  const concepts = visuals.begin(project.id, request, "fixture-model"); visuals.complete(project.id, concepts, conceptFixture);
  const selectionId = visuals.choose(project.id, concepts, 0, null);
  const boardId = visuals.begin(project.id, { ...request, kind: "storyboard", selectionId }, "fixture-model");
  const board = boardFixture(); board.shots.forEach((shot, i) => { if (i) shot.transition = "hard-cut" as typeof shot.transition; });
  visuals.complete(project.id, boardId, board); visuals.accept(project.id, boardId);
  console.log(`http://127.0.0.1:3003/projects/${project.id}/visuals#motion-review`);
} finally { visuals.close(); studio.close(); }
