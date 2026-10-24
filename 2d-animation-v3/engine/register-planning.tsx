import { Composition, registerRoot, getInputProps } from "remotion";
import PlanningFrame from "../app/projects/[id]/visuals/frame.tsx";
import type { Frame } from "../workflow/visuals.ts";

function Planning({ frame }: { frame: Frame }) {
  return <div style={{ width: 1080, height: 1920 }}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label="Graphic design review frame" /></div>;
}
registerRoot(() => <Composition id="Planning" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={getInputProps<{ frame: Frame }>()} />);
