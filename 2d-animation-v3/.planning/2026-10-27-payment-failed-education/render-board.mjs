import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readConfig } from "../../server/config.ts";
import { openVisuals } from "../../server/visual-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const config = readConfig();
const store = openVisuals(config.dataDirectory, config.videosDirectory);
const boardId = store.latest(projectId, "storyboard");
if (!boardId) throw new Error("No current storyboard.");
const board = store.read(projectId, boardId);
if (board.output.kind !== "storyboard") throw new Error("Expected storyboard.");
store.close();

const output = resolve("output/playwright/payment-failed-storyboard");
mkdirSync(output, { recursive: true });
const planningImport = JSON.stringify(resolve("app/projects/[id]/visuals/frame.tsx").replaceAll("\\", "/"));
const entry = join(output, "register.tsx");
const frames = board.output.shots.flatMap((shot, index) => [
  { id: `Shot${index + 1}Start`, frame: shot.startFrame, label: `Shot ${index + 1} start` },
  { id: `Shot${index + 1}End`, frame: shot.endFrame, label: `Shot ${index + 1} end` },
]);
writeFileSync(entry, `import {Composition,registerRoot} from 'remotion';import PlanningFrame from ${planningImport};
const Planning=({frame,label})=><div style={{width:1080,height:1920}}><style>{'svg[role="img"]{width:1080px;height:1920px;display:block}'}</style><PlanningFrame frame={frame} label={label}/></div>;
registerRoot(()=> <>${frames.map((item) => `<Composition id="${item.id}" component={Planning} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={${JSON.stringify({ frame: item.frame, label: item.label })}}/>`).join("")}</>);`);

const serveUrl = await bundle({ entryPoint: entry });
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
for (const item of frames) {
  const composition = await selectComposition({ serveUrl, id: item.id, browserExecutable });
  await renderStill({ serveUrl, composition, frame: 0, browserExecutable, imageFormat: "png", output: join(output, `${item.id}.png`) });
}
rmSync(entry, { force: true });
console.log(`BOARD_ID=${boardId}`);
console.log(`FRAMES=${output}`);
