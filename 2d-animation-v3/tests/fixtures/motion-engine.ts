import { randomUUID } from "node:crypto";
import { visualArtifactSchema } from "../../workflow/visuals.ts";
import { boardFixture } from "./visuals.ts";
import { motionFixture } from "./motion.ts";

export function motionEngineFixture() {
  const output = boardFixture();
  output.shots[1].transition = "continuous";
  output.shots[1].startFrame = structuredClone(output.shots[0].endFrame);
  output.shots[1].endFrame = structuredClone(output.shots[1].startFrame);
  output.shots[1].endFrame.shapes[0].y = 55;
  output.shots[2].transition = "reveal" as typeof output.shots[2]["transition"];
  const board = visualArtifactSchema.parse({ schemaVersion: 1, id: randomUUID(), projectId: randomUUID(), createdAt: new Date().toISOString(),
    scriptId: randomUUID(), scriptHash: "a".repeat(64), selectionId: randomUUID(), baseId: null, instruction: "Synthetic engine fixture", output: { kind: "storyboard", ...output } });
  const plan = motionFixture(board);
  plan.shots[0].actions.push({ behavior: "transform", targetIds: ["camera"], startFrame: 10, endFrame: 80, staggerFrames: 0, ease: "smooth", to: { x: -4, scale: 1.02 } });
  plan.shots[1].camera = { x: -4, y: 0, scale: 1.02, rotation: 0 };
  plan.shots[1].actions[0].to.y = 55;
  plan.shots[1].incoming.presentation = "shared";
  plan.shots[1].incoming.anchor = { previousObjectId: "object-1", objectId: "object-1" };
  plan.shots[2].incoming.overlapFrames = 15; plan.shots[2].incoming.presentation = "fade";
  return { board, plan };
}
