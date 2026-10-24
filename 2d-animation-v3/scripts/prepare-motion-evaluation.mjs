import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, constants } from "node:fs";
import { join, resolve } from "node:path";
import { createHash, randomUUID, randomInt } from "node:crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { visualArtifactSchema } from "../workflow/visuals.ts";
import { motionPlanSchema, motionBeatSchema, validateMotion } from "../workflow/motion.ts";
import { componentParts, isComponent } from "../workflow/components.ts";
import { validateTiming } from "../workflow/production.ts";
import { hashMotionSource } from "../server/motion-store.ts";
import { hashEngine } from "../server/production-store.ts";
import { verifyExport, verifyAudioSync } from "../server/render.ts";

const frozen = JSON.parse(readFileSync("docs/motion-graphics/baseline/manifest.json", "utf8"));
const comparison = resolve(process.argv[2] ?? ".data/motion-comparison-e27a9e2d-832a-44c6-b8d2-6c1e401ce9c1");
const prior = JSON.parse(readFileSync(join(comparison, "verification.json"), "utf8"));
const digest = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
assert.equal(digest(frozen.script.path), frozen.script.sha256);
assert.equal(digest(frozen.narration.path), frozen.narration.audioHash);
for (const variant of ["A", "B"]) assert.equal(digest(join(comparison, `${variant}.mp4`)), prior.results.find((result) => result.variant === variant).metadata.sha256);
const color = "#9BA7FF", background = "#101114";
const shape = (type, x, y, width, height, parts) => ({ type, x, y, width, height, color, label: "", ...(parts ? { parts } : {}) });
const empty = componentParts("inbox-panel@1", color);
const selected = structuredClone(empty); selected.message.opacity = 1; selected.highlight.opacity = 1;
const extracted = structuredClone(selected); extracted.extracted.opacity = 1; extracted.packet.opacity = 1;
const left = shape("inbox-panel@1", 10, 32, 35, 36, empty), right = shape("inbox-panel@1", 55, 32, 35, 36, empty);
const retained = shape("inbox-panel@1", 32.5, 32, 35, 36, selected), ready = { ...retained, parts: extracted };
const people = [12, 42, 72].map((x) => shape("person", x, 52, 16, 14));
const browser = shape("browser", 30, 16, 40, 20);
const drawing = (lineNumbers, seconds, transition, start, end, purpose) => ({ lineNumbers, seconds, purpose, framing: "Centered phone-size explanatory mechanism", subject: "Illustrative software ideas and working communities", action: purpose, transition, continuity: "Carry the selected software surface through the next idea.", startFrame: { background, shapes: start }, endFrame: { background, shapes: end } });
const board = visualArtifactSchema.parse({ ...frozen.storyboard, id: randomUUID(), selectionId: randomUUID(), baseId: null,
  instruction: "Codex-authored reference variant C for private style evaluation, not a live gateway output or accepted storyboard.",
  output: { kind: "storyboard", shots: [
    drawing([1], 160 / 30, "start", [left, right], [retained], "Introduce two ideas and visibly retain one candidate."),
    drawing([3], 96 / 30, "continuous", [retained], [ready], "Highlight and extract the selected idea before preparing the next step."),
    drawing([5], 232 / 30, "match-cut", [ready], [...people, browser], "Branch into working communities and emphasize their people."),
  ] } });
const mappings = [[[0, 0], [1, null]], [[0, 0]], [[0, null], [null, 0], [null, 1], [null, 2], [null, 3]]];
const shots = board.output.shots.map((source, index) => ({ id: `shot-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(source), lineNumbers: source.lineNumbers,
  durationFrames: [160, 96, 232][index], actions: [], beats: [], camera: { x: 0, y: 0, scale: 1, rotation: 0 },
  incoming: { type: source.transition, overlapFrames: 0, presentation: index === 1 ? "shared" : "cut", anchor: index ? { previousObjectId: "object-1", objectId: "object-1" } : null },
  objects: mappings[index].map(([startIndex, endIndex], i) => {
    const item = startIndex === null ? source.endFrame.shapes[endIndex] : source.startFrame.shapes[startIndex];
    return { id: `object-${i + 1}`, startIndex, endIndex, type: item.type, label: item.label,
      initial: { x: item.x, y: item.y, width: item.width, height: item.height, color: item.color, opacity: startIndex === null ? 0 : 1, scale: 1, rotation: 0 },
      ...(isComponent(item.type) ? { initialParts: componentParts(item.type, item.color, item.parts) } : {}) };
  }),
}));
function beat(index, start, end, targets, purpose, presetId, parameters, type = "emphasis", narrationAnchor = null) {
  shots[index].beats.push(motionBeatSchema.parse({ id: `beat-${shots[index].beats.length + 1}`, startFrame: start, endFrame: end, targetIds: targets, purpose, type, presetId, parameters, importance: "primary", narrationAnchor, continuity: null }));
}
const snap = (i, start, end, targets, to, purpose, anchor = null) => beat(i, start, end, targets, purpose, "snap-overshoot@1", { to, anticipation: .92, overshoot: 1.08 }, "transformation", anchor);
const hold = (i, start, end) => beat(i, start, end, shots[i].objects.map((object) => object.id), "Read the established result.", "hold@1", {}, "hold");
snap(0, 12, 28, ["object-1.message"], { opacity: 1 }, "Introduce one software idea.", { kind: "line", lineNumber: 1 });
snap(0, 34, 50, ["object-2.message"], { opacity: 1 }, "Introduce the comparison idea.");
snap(0, 70, 86, ["object-1.highlight"], { opacity: 1 }, "Make the selected candidate visible."); hold(0, 86, 112);
snap(0, 112, 130, ["object-2"], { opacity: 0 }, "Remove a candidate instead of keeping every idea.");
snap(0, 130, 148, ["object-1"], { x: 32.5 }, "Retain one candidate as the focus.");
snap(1, 8, 24, ["object-1.extracted"], { opacity: 1 }, "Extract the useful idea.", { kind: "line", lineNumber: 3, offsetFrames: 8 });
snap(1, 28, 44, ["object-1.packet"], { opacity: 1 }, "Prepare the handoff into community research.");
beat(1, 50, 62, ["camera"], "Briefly focus the extracted result.", "punch-zoom@1", { focusId: "object-1", zoom: 1.12 }); hold(1, 64, 94);
beat(2, 6, 42, ["object-1"], "Move from one candidate into working-community choices.", "split-disperse@1", { childIds: ["object-2", "object-3", "object-4"] }, "transformation", { kind: "line", lineNumber: 5, offsetFrames: 6 }); hold(2, 42, 60);
beat(2, 60, 82, ["object-5"], "Establish the community software surface.", "cascade@1", { staggerFrames: 2, offsetY: 5, overshoot: 1.08 }, "entry");
beat(2, 90, 106, ["camera"], "Focus the community context.", "punch-zoom@1", { focusId: "object-5", zoom: 1.08 }); hold(2, 108, 120);
snap(2, 120, 134, ["object-2"], {}, "Emphasize a working-community option."); hold(2, 136, 150);
snap(2, 150, 164, ["object-3"], {}, "Emphasize the next working-community option."); hold(2, 166, 180);
snap(2, 180, 194, ["object-4"], {}, "Emphasize the remaining working-community option."); hold(2, 196, 230);
const plan = motionPlanSchema.parse({ schemaVersion: 1, width: 1080, height: 1920, fps: 30, interpreterVersion: "3", energyProfile: "energetic", shots });
validateMotion(plan, board, hashMotionSource);
const lines = frozen.narration.timing.filter((line) => [1, 3, 5].includes(line.number)); validateTiming(lines, plan, lines);
const output = resolve(`.data/motion-evaluation-${randomUUID()}`), review = join(output, "review"); mkdirSync(output); mkdirSync(review);
const engineHash = hashEngine(), voice = readFileSync(frozen.narration.path), inputProps = { plan, board, narrationUrl: `data:audio/wav;base64,${voice.toString("base64")}` };
writeFileSync(join(output, "C-inputs.json"), JSON.stringify({ plan, board, lines, audioHash: frozen.narration.audioHash, provenance: "Codex-authored reference; live gateway generation not tested; no production approval." }, null, 2) + "\n");
const browserExecutable = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", serveUrl = await bundle({ entryPoint: resolve("engine/register.tsx") });
const composition = await selectComposition({ serveUrl, id: "Production", inputProps, browserExecutable }), pathC = join(output, "C.mp4");
await renderMedia({ serveUrl, composition, inputProps, browserExecutable, codec: "h264", crf: 18, pixelFormat: "yuv420p", concurrency: 1, outputLocation: pathC });
const verification = { metadata: await verifyExport(pathC, 488), audioSync: await verifyAudioSync(frozen.narration.path, pathC) };
assert.equal(hashEngine(), engineHash, "Engine changed while preparing evaluation.");
const variants = [{ label: "A", path: join(comparison, "A.mp4"), engineHash: prior.engineHash }, { label: "B", path: join(comparison, "B.mp4"), engineHash: prior.engineHash }, { label: "C", path: pathC, engineHash }];
for (let i = variants.length - 1; i > 0; i--) { const j = randomInt(i + 1); [variants[i], variants[j]] = [variants[j], variants[i]]; }
const key = variants.map((variant, index) => { const file = `clip-${index + 1}.mp4`; copyFileSync(variant.path, join(review, file), constants.COPYFILE_EXCL); return { clip: index + 1, variant: variant.label, sha256: digest(join(review, file)), engineHash: variant.engineHash }; });
writeFileSync(join(output, "private-key.json"), JSON.stringify({ key, referenceProvenance: "C is Codex-authored, not a live backend-model sample.", narrationHash: frozen.narration.audioHash, productionApproval: false, independentReview: "pending", verification }, null, 2) + "\n");
writeFileSync(join(review, "index.html"), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Motion review</title><style>body{font:16px Arial,sans-serif;margin:32px;color:#18181b;background:#fafafa}main{max-width:1100px;margin:auto}.clips{display:flex;gap:24px;flex-wrap:wrap}figure{margin:0}video{display:block;width:270px;max-width:100%;height:auto;background:#101114}figcaption{margin:12px 0;font-weight:bold}p{max-width:75ch;line-height:1.5}</style><main><h1>Motion review</h1><p>Watch all three clips with sound at phone size. Compare clarity, energy, pacing, variation and whether movement helps explain the same narration. Record prior exposure to this project. Filenames do not identify the implementation.</p><div class="clips">${key.map((item) => `<figure><figcaption>Clip ${item.clip}</figcaption><video controls preload="metadata" playsinline src="clip-${item.clip}.mp4" aria-label="Clip ${item.clip}"></video></figure>`).join("")}</div><p>Record findings in REVIEW.md. This review does not grant production approval.</p></main></html>`);
writeFileSync(join(review, "REVIEW.md"), "# Independent motion review\n\nReviewer/date:\nPrior exposure to this project or versions:\n\n| Clip | Clarity | Energy | Pacing | Variation | Helps explain | Notes |\n| --- | --- | --- | --- | --- | --- | --- |\n| 1 | | | | | | |\n| 2 | | | | | | |\n| 3 | | | | | | |\n\nPreferred clip and reason:\nAny clarity or listening problem:\n\nScores may use 1–5, but describe concrete moments. No winner or approval is inferred from an empty form.\n");
console.log(`Review packet ready; private key is outside the review folder: ${review}`);
