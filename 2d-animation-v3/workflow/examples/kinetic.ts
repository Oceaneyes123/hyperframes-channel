import { connectedProcessExample } from "./connected-process.ts";
import { hydrateMotion, motionBeatSchema, type MotionBeat, type MotionShot } from "../motion.ts";
import { componentParts } from "../components.ts";
import { comparisonSources } from "../comparison.ts";
import { graphicReference } from "../graphic-assets.ts";
import { variableExpressions } from "../variable-type.ts";
import { perspectiveHash, perspectiveScene } from "../perspective.ts";
import { collageHash, editorialCollage } from "../raster.ts";
import { semanticMorphPairs, morphChainSchema } from "../semantic-morphs.ts";
import { morphPairs } from "../morphs.ts";
import { numericData } from "../numeric.ts";
import { uiWorkflowSchema, uiTriggers } from "../ui-workflow.ts";
import { characterRig, characterRigHash, rigReferenceSchema } from "../character-rig.ts";
import { visualArtifactSchema, type Frame } from "../visuals.ts";

export const kineticExamples = [
  {id:"variable-type",name:"Real variable-font expression",purpose:"Measured weight, optical size, genuine width compression, hierarchy and staggered glyph axes preserve five authored phrases."},
  { id: "perspective", name: "Three-plane support camera", purpose: "A bounded camera reveals one inquiry, pans, pushes, reframes and follows that same token into processing." },
  { id: "collage", name: "Editable mixed-media editorial", purpose: "A fictional generated desk photo, original paper/grain, vector and measured text assemble as five editable layers." },
  { id: "question-answer", name: "Question answer", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "document-checklist", name: "Document checklist", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "complaints-problem", name: "Complaints problem", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "problem-product", name: "Problem product", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "blocks-chart", name: "Blocks chart", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "manual-automated", name: "Manual automated", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },
  { id: "morph-chain", name: "Morph chain", purpose: "Curated schematic transformation; no real records, measured chart values or automation results are implied." },

  { id: "character-rig", name: "Owner character: five actions", purpose: "One original owner looks toward a notification, reacts, points, types and passes the same document into a review tray." },
  { id: "ui-workflow", name: "One inquiry through five interfaces", purpose: "The same hypothetical inquiry moves from a form through Sheets, n8n and a draft into human review pending; no external action occurs." },
  { id: "text-layout", name: "Headline recomposition", purpose: "The same two measured words separate vertically, then join into an approved new layout without collisions." },
  { id: "word-to-ui", name: "Words become UI labels", purpose: "One coordinated authored route moves the same words into UI slots; information identity stays intact." },
  { id: "keyword-focus", name: "Keyword focus", purpose: "Supporting words make room for the focal phrase, followed by a bounded camera emphasis and readable hold." },
  { id: "type-match", name: "Typographic match cut", purpose: "The same measured word bridges two contexts with exact content, font, color, geometry and camera identity." },
  { id: "rolling-value", name: "Rolling supplied cost", purpose: "Decorative digit columns settle on an exact supplied hypothetical cost; no claimed saving." },
  { id: "value-transition", name: "Related counter samples", purpose: "Two explicitly related hypothetical counter records show carry across 9,999 to 10,000." },
  { id: "percent", name: "Verified percentage format", purpose: "A hypothetical basis-point source resolves exactly to 32.50%; this is not model accuracy." },
  { id: "typography", name: "Measured typography", purpose: "A pinned local font, two authored lines, measured masks and readable hold." },
  { id: "handoff", name: "Information handoff", purpose: "Fixed words become UI labels while the same message token moves into a review slot." },
  { id: "comparison", name: "Supplied data comparison", purpose: "Hypothetical supplied costs, exact labels and one common scale; no claimed real saving." },
  { id: "depth", name: "Layered depth and assembly", purpose: "An existing illustration uses bounded depth shifts, then its authored layers separate and return exactly." },
  { id: "morph", name: "Curated message-to-record morph", purpose: "One reviewed silhouette pair transforms an inquiry into a record; no model-provided paths." },
] as const;
export type KineticExampleId = typeof kineticExamples[number]["id"];

function example(shapes: Frame["shapes"], endShapes: Frame["shapes"], beats: MotionBeat[], textMotions?: MotionShot["textMotions"], durationFrames = 120) {
  const { board } = connectedProcessExample();
  if (board.output.kind !== "storyboard") throw new Error("Expected example board.");
  const shot = board.output.shots[0];
  shot.seconds = durationFrames / 30; shot.startFrame.shapes = shapes; shot.endFrame.shapes = endShapes;
  shot.purpose = "Synthetic kinetic capability demonstration.";
  const checked = visualArtifactSchema.parse(board);
  const plan = hydrateMotion({ shots: [{ durationFrames, camera: { x: 0, y: 0, scale: 1, rotation: 0 }, incoming: { type: "start", overlapFrames: 0, presentation: "cut", anchor: null },
    objects: shapes.map((_, index) => ({ id: `object-${index + 1}`, startIndex: index, endIndex: index })), beats, ...(textMotions ? { textMotions } : {}),
  }] }, checked, () => "0".repeat(64), undefined, "3", "balanced");
  return { board: checked, plan };
}

export function exampleBeat(id: string, presetId: MotionBeat["presetId"], targetIds: string[], startFrame: number, endFrame: number, parameters: unknown): MotionBeat {
  return motionBeatSchema.parse({ id, type: presetId === "hold@1" ? "hold" : ["layer-depth@1", "explode-assemble@1", "punch-zoom@1"].includes(presetId) ? "emphasis" : "transformation", purpose: "Demonstrate the named visual capability, then settle.", presetId, targetIds, startFrame, endFrame, parameters, importance: "primary", narrationAnchor: null, continuity: null });
}

// Synthetic catalog only. Proof tools bind the actual storyboard hash before source validation.
export function kineticExample(id: KineticExampleId) {
  if (id === "variable-type") {
    const scenes = variableExpressions.map(entry => {
      const variableType = {id:entry.id,contentHash:entry.contentHash} as import("../variable-type.ts").VariableTypeReference;
      const parts = componentParts("variable-type@1", "#244E42"); Object.assign(parts.glyphs,{opacity:1,axisProgress:0});
      const shapes: Frame["shapes"] = [{type:"variable-type@1",variableType,label:entry.label,parts,x:10,y:34,width:80,height:24,color:"#244E42"}];
      const end = structuredClone(shapes); end[0].parts!.glyphs.axisProgress=1;
      return example(shapes,end,[exampleBeat("axes","font-expression@1",["object-1.glyphs"],12,72,{}),exampleBeat("read","hold@1",["object-1"],78,118,{})]);
    });
    const combined = structuredClone(scenes[0]); if(combined.board.output.kind!=="storyboard")throw Error();
    combined.board.output.shots = scenes.map((scene,index)=>{if(scene.board.output.kind!=="storyboard")throw Error();return {...scene.board.output.shots[0],lineNumbers:[index+1],transition:index?"hard-cut":"start"};});
    combined.plan.shots = scenes.map((scene,index)=>({...scene.plan.shots[0],id:`shot-${index+1}`,sourceIndex:index,lineNumbers:[index+1],incoming:{...scene.plan.shots[0].incoming,type:index?"hard-cut":"start"}}));
    return combined;
  }
  if (["question-answer", "document-checklist", "complaints-problem", "problem-product", "blocks-chart", "manual-automated", "morph-chain"].includes(id)) {
    const ids = id === "morph-chain" ? ["message-record@1", "document-checklist@1"] : [`${id}@1`];
    const morphChain = morphChainSchema.parse({ pairs: ids.map((id) => { const entry = semanticMorphPairs.find((entry) => entry.pair.id === id)!; return { pairId: id, contentHash: entry.contentHash }; }) });
    const parts = componentParts("morph-chain@1", "#244E42"); Object.assign(parts.outline, { opacity: 1, morphStage: 0 });
    const shapes: Frame["shapes"] = [{ type: "morph-chain@1", morphChain, parts, x: 15, y: 30, width: 70, height: 39.375, color: "#244E42", label: "" }];
    const end = structuredClone(shapes); end[0].parts!.outline.morphStage = ids.length;
    const beats = ids.map((_, i) => exampleBeat(`morph-${i}`, "morph-chain-step@1", ["object-1.outline"], 12 + i * 72, 66 + i * 72, {}));
    const duration = ids.length === 2 ? 180 : 120;
    beats.push(exampleBeat("read", "hold@1", ["object-1"], duration - 42, duration - 2, {}));
    return example(shapes, end, beats, undefined, duration);
  }
  if (id === "perspective") {
    const perspective={id:perspectiveScene.id,contentHash:perspectiveHash} as const,parts=componentParts("perspective-scene@1","#244E42");Object.assign(parts.camera,{opacity:1,cameraX:0,cameraY:0,cameraZ:0,depthProgress:0});
    const shapes:Frame["shapes"]=[{type:"perspective-scene@1",perspective,parts,label:"",x:5,y:22,width:90,height:50.625,color:"#244E42"}];
    const end=structuredClone(shapes);end[0].x=8;Object.assign(end[0].parts!.camera,{cameraX:220,cameraY:0,cameraZ:120,depthProgress:1});
    return example(shapes,end,[exampleBeat("reveal","depth-reveal@1",["object-1.camera"],12,60,{subject:"inquiry"}),exampleBeat("reveal-read","hold@1",["object-1"],64,80,{}),exampleBeat("pan","parallax-pan@1",["object-1.camera"],84,132,{toX:180,toY:10}),exampleBeat("root-move","snap-overshoot@1",["object-1"],84,132,{to:{x:8},anticipation:.95,overshoot:1.04}),exampleBeat("pan-read","hold@1",["object-1"],136,152,{}),exampleBeat("push","depth-push@1",["object-1.camera"],156,204,{focus:"processing",toZ:120}),exampleBeat("push-read","hold@1",["object-1"],208,224,{}),exampleBeat("reframe","perspective-reframe@1",["object-1.camera"],228,276,{focus:"inquiry"}),exampleBeat("reframe-read","hold@1",["object-1"],280,296,{}),exampleBeat("handoff","depth-handoff@1",["object-1.camera"],300,372,{from:"inquiry",to:"processing"}),exampleBeat("read","hold@1",["object-1"],378,418,{})],undefined,420);
  }
  if (id === "collage") {
    const collage = { id: editorialCollage.id, contentHash: collageHash } as const, parts = componentParts("editorial-collage@1", "#244E42");
    for (const state of Object.values(parts)) state.opacity = 1;
    parts.paper.reveal = 0; parts.texture.reveal = 0; parts.type.reveal = 0; parts.vector.x = -12; parts.vector.opacity = 0;
    const shapes: Frame["shapes"] = [{ type: "editorial-collage@1", collage, parts, label: "Review", x: 5, y: 12, width: 90, height: 67.5, color: "#244E42" }];
    const end = structuredClone(shapes); for (const state of Object.values(end[0].parts!)) { state.reveal = 1; state.x = 0; state.opacity = 1; }
    return example(shapes, end, [exampleBeat("paper", "mask-reveal@1", ["object-1.paper", "object-1.texture"], 12, 36, { reveal: 1 }), exampleBeat("icon", "snap-overshoot@1", ["object-1.vector"], 38, 64, {to:{x:0,opacity:1},anticipation:.95,overshoot:1.04}), exampleBeat("label", "mask-reveal@1", ["object-1.type"], 66, 90, {reveal:1}), exampleBeat("read", "hold@1", ["object-1"], 94, 118, {})]);
  }
  if (id === "character-rig") {
    const rig = rigReferenceSchema.parse({ id: characterRig.id, contentHash: characterRigHash }), parts = componentParts("character-rig@1", "#D9633F");
    for (const state of Object.values(parts)) state.opacity = 1;
    parts.body.rigProgress = 0; parts.document.handoffProgress = 0;
    const shapes: Frame["shapes"] = [{ type: "character-rig@1", rig, parts, label: "", x: 7, y: 17, width: 86, height: 86 * 1080 * characterRig.height / characterRig.width / 1920, color: "#D9633F" }];
    const end = structuredClone(shapes); end[0].parts!.document.handoffProgress = 1;
    const beats = [
      exampleBeat("look", "character-look@1", ["object-1.body"], 12, 60, { direction: "left" }), exampleBeat("look-read", "hold@1", ["object-1"], 64, 80, {}),
      exampleBeat("react", "character-react@1", ["object-1.body"], 84, 132, { trigger: "new-inquiry" }), exampleBeat("react-read", "hold@1", ["object-1"], 136, 152, {}),
      exampleBeat("point", "character-point@1", ["object-1.body"], 156, 204, { prop: "laptop" }), exampleBeat("point-read", "hold@1", ["object-1"], 208, 224, {}),
      exampleBeat("type", "character-type@1", ["object-1.body"], 228, 288, { prop: "laptop" }), exampleBeat("type-read", "hold@1", ["object-1"], 292, 308, {}),
      exampleBeat("deliver", "character-hand-off@1", ["object-1.body"], 312, 384, { from: "desk", to: "review-tray" }), exampleBeat("read", "hold@1", ["object-1"], 388, 418, {}),
    ];
    return example(shapes, end, beats, undefined, 420);
  }
  if (id === "ui-workflow") {
    const ui = uiWorkflowSchema.parse({ schema: "inquiry-workflow@1", inquiry: { id: "question-1", value: "Is Friday available?", lines: ["Is Friday", "available?"] }, category: { id: "category-1", from: "question-1", value: "Availability", lines: ["Availability"] }, draft: { id: "draft-1", from: "question-1", value: "Ask owner to confirm.", lines: ["Ask owner to", "confirm."] } });
    const parts = componentParts("ui-workflow@1", "#244E42");
    for (const state of Object.values(parts)) state.opacity = 1;
    parts.surface.uiStage = 0;
    for (const id of ["category", "draft", "focus"]) parts[id].reveal = 0;
    const shapes: Frame["shapes"] = [{ type: "ui-workflow@1", ui, parts, label: "", x: 6, y: 18, width: 88, height: 62, color: "#244E42" }];
    const end = structuredClone(shapes); end[0].parts!.surface.uiStage = 4;
    for (const id of ["category", "draft", "focus"]) end[0].parts![id].reveal = 1;
    const beats = [exampleBeat("focus", "mask-reveal@1", ["object-1.focus"], 6, 18, { reveal: 1 }), ...uiTriggers.map((trigger, index) => exampleBeat(`state-${index + 1}`, "ui-state-transition@1", ["object-1.surface"], 18 + index * 52, 48 + index * 52, { trigger })),
      exampleBeat("category", "mask-reveal@1", ["object-1.category"], 154, 166, { reveal: 1 }), exampleBeat("draft", "mask-reveal@1", ["object-1.draft"], 158, 172, { reveal: 1 }),
      exampleBeat("expand", "punch-zoom@1", ["camera"], 208, 220, { focusId: "object-1", zoom: 1.04 }), exampleBeat("read", "hold@1", ["object-1"], 222, 238, {})];
    beats.sort((a, b) => a.startFrame - b.startFrame);
    const scene = example(shapes, end, beats, undefined, 240);
    if (scene.board.output.kind !== "storyboard") throw Error("Expected storyboard");
    const firstDrawing = scene.board.output.shots[0], first = scene.plan.shots[0], next = structuredClone(first), nextDrawing = structuredClone(firstDrawing);
    const middle = structuredClone(firstDrawing.startFrame); middle.shapes[0].parts!.surface.uiStage = 2; middle.shapes[0].parts!.focus.reveal = 1;
    firstDrawing.seconds = 4; firstDrawing.endFrame = middle; first.durationFrames = 120;
    first.beats = first.beats!.filter((beat) => beat.endFrame < 120);
    first.beats.push(exampleBeat("intermediate-read", "hold@1", ["object-1"], 104, 118, {}));
    nextDrawing.seconds = 4; nextDrawing.transition = "continuous"; nextDrawing.startFrame = structuredClone(middle); nextDrawing.lineNumbers = [2];
    next.id = "shot-2"; next.sourceIndex = 1; next.lineNumbers = [2]; next.durationFrames = 120;
    next.incoming = { type: "continuous", presentation: "shared", overlapFrames: 0, anchor: { previousObjectId: "object-1", objectId: "object-1" } };
    next.objects[0].initialParts = structuredClone(middle.shapes[0].parts);
    next.beats = next.beats!.filter((beat) => beat.startFrame >= 120).map((beat) => ({ ...beat, startFrame: beat.startFrame - 120, endFrame: beat.endFrame - 120 }));
    scene.board.output.shots.push(nextDrawing); scene.plan.shots.push(next); return scene;
  }
  if (id === "text-layout" || id === "keyword-focus") {
    const focus = id === "keyword-focus";
    const shapes: Frame["shapes"] = (focus ? ["AI", "Draft", "Review"] : ["Customer", "Inquiry"]).map((label, i) => ({ type: "heading", typography: "inter-heading@1", label, x: focus ? 10 + i * 30 : 10 + i * 42, y: focus ? 35 : 32, width: focus ? i === 2 ? 30 : 20 : 38, height: focus ? i === 2 ? 8 : 4 : 8, color: "#244E42" }));
    const end = structuredClone(shapes);
    if (focus) [{ x: 10, y: 18 }, { x: 10, y: 65 }, { x: 35, y: 35 }].forEach((position, i) => Object.assign(end[i], position));
    else [{ x: 10, y: 30 }, { x: 10, y: 44 }].forEach((position, i) => Object.assign(end[i], position));
    const targets = shapes.map((_, i) => `object-${i + 1}`), destinations = Object.fromEntries(end.map((shape, i) => [targets[i], { x: shape.x, y: shape.y }]));
    const beats = [exampleBeat("recompose", "text-layout-morph@1", targets, 12, 60, { route: "vertical-first", destinations })];
    if (focus) beats.push(exampleBeat("focus", "punch-zoom@1", ["camera"], 64, 92, { focusId: "object-3", zoom: 1.12 }));
    beats.push(exampleBeat("read", "hold@1", targets, focus ? 96 : 66, 118, {}));
    return example(shapes, end, beats);
  }
  if (id === "type-match") {
    const shape = (label: string, y: number): Frame["shapes"][number] => ({ type: "heading", typography: "inter-heading@1", label, x: 20, y, width: 60, height: 9, color: "#244E42" });
    const first = example([shape("Review", 46), shape("AI draft", 28)], [shape("Review", 46), shape("AI draft", 28)], [exampleBeat("read", "hold@1", ["object-1", "object-2"], 6, 58, {})]);
    const next = example([shape("Review", 46), shape("Owner checks", 28)], [shape("Review", 46), shape("Owner checks", 28)], [exampleBeat("read", "hold@1", ["object-1", "object-2"], 6, 58, {})]);
    if (first.board.output.kind !== "storyboard" || next.board.output.kind !== "storyboard") throw Error("Expected storyboard");
    first.board.output.shots[0].seconds = 2; next.board.output.shots[0].seconds = 2;
    first.plan.shots[0].durationFrames = 60; next.plan.shots[0].durationFrames = 60;
    const drawing = next.board.output.shots[0], shot = next.plan.shots[0]; drawing.transition = "match-cut"; drawing.lineNumbers = [2];
    shot.id = "shot-2"; shot.sourceIndex = 1; shot.lineNumbers = [2];
    shot.incoming = { type: "match-cut", presentation: "cut", overlapFrames: 0, anchor: { previousObjectId: "object-1", objectId: "object-1" }, textMatch: "typographic-match-cut@1" };
    first.board.output.shots.push(drawing); first.plan.shots.push(shot); return first;
  }
  if (id === "rolling-value" || id === "value-transition" || id === "percent") {
    const sourceId = id === "rolling-value" ? "synthetic-costs@1" : id === "percent" ? "synthetic-rate@1" : "synthetic-volume@1";
    const entry = comparisonSources.find((entry) => entry.source.id === sourceId)!;
    const numeric = { sourceId, contentHash: entry.contentHash, recordId: id === "rolling-value" ? "candidate" : id === "percent" ? "part" : "current", ...(id === "value-transition" ? { previousRecordId: "previous", relationshipId: "next-sample" } : {}) };
    const parts = componentParts("numeric-display@1", "#244E42");
    Object.assign(parts.digits, { opacity: 1, numericProgress: 0 });
    const shapes: Frame["shapes"] = [{ type: "numeric-display@1", numeric, parts, x: 12, y: 39, width: 76, height: 18, color: "#244E42", label: "" }];
    const end = structuredClone(shapes); end[0].parts!.digits.numericProgress = 1;
    if (!numericData(numeric).final) throw new Error("Missing supplied numeric value.");
    return example(shapes, end, [exampleBeat("roll", id === "value-transition" ? "value-transition@1" : "odometer-roll@1", ["object-1.digits"], 12, 66, {}), exampleBeat("read", "hold@1", ["object-1"], 72, 118, {})]);
  }
  if (id === "typography") {
    const shapes: Frame["shapes"] = [{ type: "centered-text", label: "Review first\nPublish later", typography: "inter-heading@1", x: 10, y: 36, width: 80, height: 20, color: "#244E42" }];
    return example(shapes, structuredClone(shapes), [exampleBeat("read", "hold@1", ["object-1"], 44, 118, {})], [{ targetId: "object-1", presetId: "mask-rise@1", startFrame: 6, endFrame: 36 }]);
  }
  if (id === "handoff" || id === "word-to-ui") {
    const parts = componentParts("inbox-panel@1", "#B8D3C8");
    parts.message.opacity = 1; parts.highlight.opacity = 1;
    Object.assign(parts.packet, { opacity: 1, x: -20.8, y: -13.64 });
    const shapes: Frame["shapes"] = [
      { type: "inbox-panel@1", x: 10, y: 32, width: 80, height: 44, color: "#B8D3C8", label: "", parts },
      ...["Request", "Category", "Review"].map((label, index) => ({ type: "heading" as const, label, typography: "inter-heading@1" as const, x: 10 + index * 30, y: 18, width: 20, height: 4, color: "#244E42" })),
    ];
    const end = structuredClone(shapes);
    end[0].parts!.extracted.opacity = 1;
    end[0].parts!.message.opacity = 0;
    Object.assign(end[0].parts!.packet, { x: 0, y: 0 });
    for (let index = 1; index < end.length; index++) Object.assign(end[index], { x: 18, y: 42 + (index - 1) * 9 });
    const beats = id === "word-to-ui" ? [exampleBeat("layout", "text-layout-morph@1", ["object-2", "object-3", "object-4"], 24, 54, { route: "vertical-first", destinations: Object.fromEntries(end.slice(1).map((shape, index) => [`object-${index + 2}`, { x: shape.x, y: shape.y }])) })] : end.slice(1).map((shape, index) => exampleBeat(`layout-${index}`, "snap-overshoot@1", [`object-${index + 2}`], 24 + index * 5, 44 + index * 5, { to: { x: shape.x, y: shape.y }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("clear-placeholder", "snap-overshoot@1", ["object-1.message"], 18, 24, { to: { opacity: 0 }, anticipation: .95, overshoot: 1.04 }));
    // Slot visibility and the token path reuse the existing bounded part transform contract.
    beats.push(exampleBeat("show-slot", "snap-overshoot@1", ["object-1.extracted"], 54, 62, { to: { opacity: 1 }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("carry-request", "snap-overshoot@1", ["object-1.packet"], 64, 88, { to: { x: 0, y: 0 }, anticipation: .95, overshoot: 1.04 }));
    beats.push(exampleBeat("read", "hold@1", ["object-1", "object-2", "object-3", "object-4"], 92, 118, {}));
    beats.sort((a, b) => a.startFrame - b.startFrame);
    return example(shapes, end, beats);
  }
  if (id === "comparison") {
    const entry = comparisonSources.find((entry) => entry.source.id === "synthetic-costs@1")!;
    const comparison = { sourceId: entry.source.id, contentHash: entry.contentHash, recordIds: ["baseline", "candidate"] as [string, string] };
    const parts = componentParts("data-comparison@1", "#244E42");
    for (const state of Object.values(parts)) Object.assign(state, { opacity: 1, reveal: 0 });
    const shapes: Frame["shapes"] = [{ type: "data-comparison@1", comparison, x: 10, y: 25, width: 80, height: 52, color: "#244E42", label: "", parts }];
    const end = structuredClone(shapes); for (const state of Object.values(end[0].parts!)) state.reveal = 1;
    return example(shapes, end, [exampleBeat("baseline", "mask-reveal@1", ["object-1.bar-one"], 6, 30, { reveal: 1 }), exampleBeat("candidate", "mask-reveal@1", ["object-1.bar-two"], 34, 58, { reveal: 1 }), exampleBeat("read", "hold@1", ["object-1"], 64, 118, {})]);
  }
  if (id === "depth") {
    const asset = graphicReference("service-handover-desk@1"), parts = componentParts("graphic-asset@2", "#D9633F", undefined, { asset });
    for (const state of Object.values(parts)) state.opacity = 1;
    const shapes: Frame["shapes"] = [{ type: "graphic-asset@2", asset, parts, x: 5, y: 24, width: 90, height: 50.625, color: "#D9633F", label: "" }];
    return example(shapes, structuredClone(shapes), [
      exampleBeat("parallax", "layer-depth@1", ["object-1"], 6, 44, { offsetX: 1.2, offsetY: -.6 }),
      exampleBeat("camera", "punch-zoom@1", ["camera"], 6, 44, { focusId: "object-1", zoom: 1.04 }),
      exampleBeat("assemble", "explode-assemble@1", ["object-1"], 48, 86, { offsets: { documentation: { x: -2, y: 0 }, "test-cards": { x: 2, y: -2 } } }),
      exampleBeat("read", "hold@1", ["object-1"], 92, 118, {}),
    ]);
  }
  if (id === "morph") {
    const entry = morphPairs[0], morph = { pairId: entry.pair.id, contentHash: entry.contentHash }, parts = componentParts("morph-shape@1", "#244E42");
    Object.assign(parts.outline, { opacity: 1, morphProgress: 0 });
    const shapes: Frame["shapes"] = [{ type: "morph-shape@1", morph, parts, x: 15, y: 30, width: 70, height: 39.375, color: "#244E42", label: "" }];
    const end = structuredClone(shapes); end[0].parts!.outline.morphProgress = 1;
    return example(shapes, end, [exampleBeat("message-record", "morph-shape@1", ["object-1.outline"], 12, 66, {}), exampleBeat("read", "hold@1", ["object-1"], 72, 118, {})]);
  }
  throw new Error("Unknown kinetic example.");
}

export function capabilityDirection(id: KineticExampleId, direction = "") {
  const entry = kineticExamples.find(entry => entry.id === id);
  if (!entry) throw new Error("Unknown motion library capability.");
  const purpose = `Propose ${entry.name} for only this selected shot. Teaching purpose: ${entry.purpose} Use current registered source/asset references and supported fields. Preserve narration, factual content, source values and unselected shots. Never copy hypothetical gallery numbers or replace source wording to fit a registered phrase. If incompatible with this source, explain that in the shot action and preserve its drawings. New actor identity/layout belongs in this visual proposal before motion planning. `;
  if (purpose.length + direction.length > 2000) throw new Error("Shorten the direction to leave room for the selected capability guidance.");
  return purpose + direction;
}
