import { Composition, registerRoot } from "remotion";
import { Film } from "./Film";
registerRoot(() => <Composition id="MixedShots" component={Film} width={1080} height={1920} fps={30} durationInFrames={360} defaultProps={{ engine: "gsap" as const, variant: false }} />);
