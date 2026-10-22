import { randomUUID } from "node:crypto";
import { boardFixture } from "./visuals.ts";
import { motionFixture } from "./motion.ts";
import { visualArtifactSchema } from "../../workflow/visuals.ts";

export function motionWorkflowFixture() {
  const types = ["start", "continuous", "hard-cut", "match-cut", "camera", "reveal", "split-screen"] as const;
  const output = boardFixture(types.map((_, index) => index + 1));
  for (const [index, shot] of output.shots.entries()) {
    shot.transition = types[index] as typeof shot.transition; shot.seconds = 2;
    shot.startFrame = structuredClone(shot.startFrame); shot.endFrame = structuredClone(shot.endFrame);
    shot.startFrame.shapes[0].type = shot.endFrame.shapes[0].type = "document";
    shot.startFrame.shapes[1].type = shot.endFrame.shapes[1].type = index > 3 ? "server" : "cloud";
    shot.startFrame.shapes[2].type = shot.endFrame.shapes[2].type = index > 3 ? "code" : "heading";
    if (index === 1 || index === 3) { shot.startFrame = structuredClone(output.shots[index - 1].endFrame); shot.endFrame = structuredClone(shot.startFrame); }
    if (index === 1) shot.endFrame.shapes[0].y = 55;
  }
  const board = visualArtifactSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId: randomUUID(), createdAt: new Date().toISOString(), scriptId: randomUUID(), scriptHash: "a".repeat(64), selectionId: randomUUID(), baseId: null, instruction: "Synthetic transition fixture", output: { kind: "storyboard", ...output } });
  const plan = motionFixture(board); plan.interpreterVersion = "2";
  for (const [index, shot] of plan.shots.entries()) {
    shot.durationFrames = 60; shot.actions[0].endFrame = 40;
    if (index === 1) shot.actions[0].to.y = 55;
    shot.actions.push({ behavior: "hold", targetIds: ["object-1", "object-2", "object-3"], startFrame: 42, endFrame: 58, staggerFrames: 0, ease: "linear", to: {} });
    if (index === 1 || index === 3) shot.incoming.anchor = { previousObjectId: "object-1", objectId: "object-1" };
    if (index === 1) shot.incoming.presentation = "shared";
    if (index >= 4) { shot.incoming.presentation = index === 4 ? "slide" : index === 5 ? "wipe" : "split"; shot.incoming.overlapFrames = index === 6 ? 30 : 20; }
  }
  return { board, plan };
}
