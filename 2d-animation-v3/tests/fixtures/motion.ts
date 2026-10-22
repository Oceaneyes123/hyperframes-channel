import type { VisualArtifact } from "../../workflow/visuals.ts";
import { motionPlanSchema } from "../../workflow/motion.ts";
import { hashMotionSource } from "../../server/motion-store.ts";

export function motionFixture(board: VisualArtifact) {
  if (board.output.kind !== "storyboard") throw new Error("Fixture requires a board");
  return motionPlanSchema.parse({ schemaVersion: 1, width: 1080, height: 1920, fps: 30, interpreterVersion: "1",
    shots: board.output.shots.map((shot, index) => ({
      id: `shot-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(shot), lineNumbers: shot.lineNumbers,
      durationFrames: 120, camera: { x: 0, y: 0, scale: 1, rotation: 0 },
      // Explicit correspondence for the three-shape synthetic fixture only; never infer real identities.
      objects: [[0, 0], [1, 1], [2, 2]].map(([startIndex, endIndex], i) => {
        const shape = shot.startFrame.shapes[startIndex];
        return { id: `object-${i + 1}`, startIndex, endIndex, type: shape.type, label: shape.label,
          initial: { x: shape.x, y: shape.y, width: shape.width, height: shape.height, color: shape.color, opacity: 1, scale: 1, rotation: 0 } };
      }),
      actions: [{ behavior: "transform", targetIds: ["object-1"], startFrame: 10, endFrame: 80, staggerFrames: 0, ease: "smooth", to: { width: shot.endFrame.shapes[0].width } }],
      incoming: { type: shot.transition, overlapFrames: 0, presentation: "cut", anchor: null },
    })),
  });
}

export function fixtureMotion(body: { messages: { content: string }[] }) {
  const context = JSON.parse(body.messages.at(-1)!.content);
  if (context.selectedShot) {
    const { actions, camera, durationFrames, incoming } = context.selectedShot;
    return { actions: actions.map((action: object) => ({ ...action, ease: "linear" })), camera, durationFrames, incoming };
  }
  return { shots: motionFixture(context.storyboard).shots.map(({ durationFrames, camera, actions, incoming, objects }) => ({
    durationFrames, camera, actions, incoming, objects: objects.map(({ id, startIndex, endIndex }) => ({ id, startIndex, endIndex })),
  })) };
}
