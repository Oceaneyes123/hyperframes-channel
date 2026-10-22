import { Composition, registerRoot, getInputProps } from "remotion";
import Motion, { type MotionCompositionProps } from "./motion-composition.tsx";
import { scheduleMotion } from "../workflow/motion.ts";
function Root() {
  const props = getInputProps<MotionCompositionProps>();
  return <Composition id="Production" component={Motion} width={1080} height={1920} fps={30} durationInFrames={scheduleMotion(props.plan).durationFrames} defaultProps={props} />;
}
registerRoot(Root);
