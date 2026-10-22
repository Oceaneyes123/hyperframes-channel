import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { openProduction } from "../server/production-store.ts";

const root = resolve(process.argv[2]), receipt = JSON.parse(readFileSync(join(root, "verification.json"), "utf8"));
assert.equal(receipt.syntheticOnly, true);
const store = openProduction(join(root, "database"), join(root, "videos"));
try {
  const snapshot = store.snapshot(receipt.projectId); assert.equal(snapshot.engineHash, receipt.receipt.payload.verification.engineHash);
  const output = join(root, "extra-seeks"); mkdirSync(output, { recursive: false });
  const inputProps = { plan: snapshot.artifact.plan, board: snapshot.board, narrationUrl: `data:audio/wav;base64,${snapshot.voice.bytes.toString("base64")}` };
  const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const serveUrl = await bundle({ entryPoint: resolve("engine/register.tsx") });
  const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable });
  const checked = [305, 230, 270, 299, 309, 220, 290, 0, 305];
  for (const [index, frame] of checked.entries()) {
    const path = join(output, `${index}.png`);
    await renderStill({ serveUrl, composition, inputProps, browserExecutable, frame, imageFormat: "png", output: path });
    assert.ok(readFileSync(path).equals(readFileSync(join(root, "videos", receipt.projectId, "production", receipt.jobId, "frames", `element-${String(frame).padStart(3, "0")}.png`))), `Fresh frame ${frame} differs from sequential reference`);
  }
  const result = { syntheticOnly: true, engineHash: snapshot.engineHash, checkedFrames: checked, exactPngMatch: true };
  writeFileSync(join(root, "seek-verification.json"), JSON.stringify(result, null, 2) + "\n"); console.log(JSON.stringify(result));
} finally { store.close(); }
