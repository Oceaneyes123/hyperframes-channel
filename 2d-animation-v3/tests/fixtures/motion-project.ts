import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { TestContext } from "node:test";
import { openStudio } from "../../server/studio.ts";
import { openVisuals } from "../../server/visual-store.ts";
import { openMotion } from "../../server/motion-store.ts";
import { readConfig } from "../../server/config.ts";
import { conceptFixture, boardFixture } from "./visuals.ts";
import { motionFixture } from "./motion.ts";

export function motionProject(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "v3-visual-loop-"));
  const config = readConfig({ V3_DATA_DIR: join(root, "data"), V3_VIDEOS_DIR: join(root, "videos") });
  const studio = openStudio(config.dataDirectory, config.videosDirectory), visuals = openVisuals(config.dataDirectory, config.videosDirectory), motion = openMotion(config.dataDirectory, config.videosDirectory);
  t.after(() => { motion.close(); visuals.close(); studio.close(); rmSync(root, { recursive: true, force: true }); });
  const projectId = studio.createProject("Synthetic visual loop fixture").id;
  const scriptId = studio.saveScript(projectId, "One\nTwo\nThree", null).id; studio.acceptScript(projectId, scriptId);
  const request = { kind: "concepts", scriptId, selectionId: null, baseId: null, shotIndex: null, instruction: "" };
  const concepts = visuals.begin(projectId, request, "fixture"); visuals.complete(projectId, concepts, conceptFixture);
  const selectionId = visuals.choose(projectId, concepts, 0, null);
  const boardId = visuals.begin(projectId, { ...request, kind: "storyboard", selectionId }, "fixture");
  const drawing = boardFixture(); drawing.shots.forEach((shot, index) => { if (index) shot.transition = "hard-cut" as typeof shot.transition; });
  visuals.complete(projectId, boardId, drawing); visuals.accept(projectId, boardId);
  const board = visuals.read(projectId, boardId)!;
  const artifactId = motion.begin(projectId, { storyboardId: boardId, baseId: null, shotId: null, instruction: "" });
  const plan = motionFixture(board); plan.interpreterVersion = "2";
  motion.complete(projectId, artifactId, plan);
  return { root, config, studio, visuals, motion, projectId, scriptId, boardId, board, artifactId };
}
