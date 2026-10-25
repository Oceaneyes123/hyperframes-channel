import type { MotionAction, MotionShot, MotionState } from "../../workflow/motion.ts";
import { vectorLibrary } from "../../workflow/graphic-library.ts";
import { depthSceneRegistry } from "../../workflow/graphic-assets.ts";
import { perspectiveTarget, requireVisibleFocus } from "../../workflow/perspective.ts";
import { semanticPair } from "../../workflow/semantic-morphs.ts";
import { morphPair } from "../../workflow/morphs.ts";
import { numericData } from "../../workflow/numeric.ts";
import { uiTriggers } from "../../workflow/ui-workflow.ts";

// Preset IDs are immutable: changes to motion semantics require a new version.
export function expandBeats(shot: MotionShot): MotionAction[] {
  const states = new Map<string, MotionState>(shot.objects.map((object) => [object.id, { ...object.initial }]));
  for (const object of shot.objects) for (const [part, state] of Object.entries(object.initialParts ?? {})) states.set(`${object.id}.${part}`, { ...object.initial, ...state });
  const actions: MotionAction[] = [];
  const reservations: { id: string; start: number; end: number; properties: string[]; owned?: MotionAction[] }[] = [];
  const reserve = (id: string, start: number, end: number, properties = ["x", "y", "width", "height", "scale", "rotation", "opacity"]) => {
    const state = states.get(id);
    if (!state || state.scale !== 1 || state.rotation !== 0) throw new Error("Geometric presets require settled, unrotated unit-scale actors.");
    reservations.push({ id, start, end, properties });
  };
  const tween = (id: string, startFrame: number, endFrame: number, to: MotionAction["to"], ease: MotionAction["ease"] = "power3.out") => {
    actions.push({ behavior: "transform", targetIds: [id], startFrame, endFrame, staggerFrames: 0, ease, to });
  };
  const ids = new Set<string>(); let previousStart = -1;
  for (const beat of shot.beats ?? []) {
    if (ids.has(beat.id)) throw new Error("Duplicate beat ID.");
    ids.add(beat.id);
    if (beat.startFrame < previousStart || beat.endFrame <= beat.startFrame || beat.endFrame >= shot.durationFrames || new Set(beat.targetIds).size !== beat.targetIds.length) throw new Error("Invalid or unordered beat interval.");
    previousStart = beat.startFrame;
    for (const id of beat.targetIds) {
      if (!states.has(id) && !(id === "camera" && ["punch-zoom@1", "hold@1"].includes(beat.presetId))) throw new Error("Unknown beat target; this preset requires an object actor.");
    }
    if (beat.presetId === "hold@1") {
      actions.push({ behavior: "hold", targetIds: beat.targetIds, startFrame: beat.startFrame, endFrame: beat.endFrame, staggerFrames: 0, ease: "linear", to: {} });
      continue;
    }
    if (beat.type === "hold") throw new Error("A reading hold requires the hold preset.");
    const duration = beat.endFrame - beat.startFrame;
    if (duration < 6) throw new Error("Choreography needs at least six frames for its phases.");
    if (beat.presetId === "character-look@1" || beat.presetId === "character-react@1" || beat.presetId === "character-point@1" || beat.presetId === "character-type@1" || beat.presetId === "character-hand-off@1") {
      const id = beat.targetIds[0], [rootId, part] = id.split("."), object = shot.objects.find((object) => object.id === rootId), state = states.get(id);
      if (beat.targetIds.length !== 1 || object?.type !== "character-rig@1" || !object.rig || part !== "body" || state?.rigProgress !== 0 || states.get(rootId)?.opacity !== 1 || duration < 48 || duration > 120 || ["body", "document", "laptop"].some((part) => states.get(`${rootId}.${part}`)?.opacity !== 1 || (states.get(`${rootId}.${part}`)?.reveal ?? 1) !== 1)) throw new Error("Character action needs one visible neutral reviewed rig, its props and 48..120 frames.");
      const first = beat.startFrame + Math.round(duration * .25), last = beat.endFrame - Math.round(duration * .25);
      tween(id, beat.startFrame, first, { rigProgress: 1 }, "power2.inOut");
      tween(id, first, last, { rigProgress: 1 }, "linear");
      tween(id, last, beat.endFrame, { rigProgress: 0 }, "power2.inOut");
      reservations.push({ id: rootId, start: beat.startFrame, end: beat.endFrame, properties: ["opacity"] });
      for (const name of ["body", "document", "laptop"]) reservations.push({ id: `${rootId}.${name}`, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal", "x", "y", "scale"] });
      if (beat.presetId === "character-hand-off@1") {
        const paper = states.get(`${rootId}.document`)!;
        if (paper.handoffProgress !== 0) throw new Error("The registered document can be delivered only once.");
        tween(`${rootId}.document`, beat.startFrame + Math.round(duration * .4), beat.startFrame + Math.round(duration * .75), { handoffProgress: 1 }, "power2.inOut");
        paper.handoffProgress = 1;
      }
      continue;
    }
    if (beat.presetId === "ui-state-transition@1") {
      const id = beat.targetIds[0], [rootId, part] = id.split("."), object = shot.objects.find((object) => object.id === rootId), state = states.get(id), inquiry = states.get(`${rootId}.inquiry`);
      if (beat.targetIds.length !== 1 || object?.type !== "ui-workflow@1" || !object.ui || part !== "surface" || state?.uiStage === undefined || uiTriggers[state.uiStage] !== beat.parameters.trigger || states.get(rootId)?.opacity !== 1 || state.opacity !== 1 || (state.reveal ?? 1) !== 1 || inquiry?.opacity !== 1 || (inquiry.reveal ?? 1) !== 1 || duration < 18 || duration > 60) throw new Error("UI transition needs the exact next trigger, a visible inquiry/surface and 18..60 frames.");
      reservations.push({ id: rootId, start: beat.startFrame, end: beat.endFrame, properties: ["opacity"] }, { id, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal"] }, { id: `${rootId}.inquiry`, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal"] });
      tween(id, beat.startFrame, beat.endFrame, { uiStage: state.uiStage + 1 }, "power2.inOut");
      state.uiStage++;
      continue;
    }
    if (beat.presetId === "text-layout-morph@1") {
      const destinations = beat.parameters.destinations, targets = new Set(beat.targetIds);
      if (targets.size < 2 || targets.size > 8 || Object.keys(destinations).length !== targets.size || Object.keys(destinations).some((id) => !targets.has(id)) || duration < 18 || duration > 90) throw new Error("Text layout needs 2..8 exact destinations and 18..90 frames.");
      const actors = shot.objects.filter((object) => ["text", "heading", "caption", "centered-text", "code"].includes(object.type) && states.get(object.id)?.opacity === 1);
      if (beat.targetIds.some((id) => !actors.some((object) => object.id === id && object.typography === "inter-heading@1")) || shot.textMotions?.some((motion) => targets.has(motion.targetId) && motion.startFrame < beat.endFrame && motion.endFrame > beat.startFrame)) throw new Error("Layout requires visible measured text roots with completed inner entrances.");
      if (beat.targetIds.filter((id) => states.get(id)!.x !== destinations[id].x || states.get(id)!.y !== destinations[id].y).length < 2) throw new Error("A coordinated layout must move at least two words.");
      if (actors.some((actor) => states.get(actor.id)!.scale !== 1 || states.get(actor.id)!.rotation !== 0) || shot.camera.x !== 0 || shot.camera.y !== 0 || shot.camera.scale !== 1 || shot.camera.rotation !== 0) throw new Error("Text layout box proof requires a settled unit-scale scene; emphasize with the camera afterward.");
      const first = beat.parameters.route === "vertical-first" ? "y" : "x", second = first === "x" ? "y" : "x", middle = beat.startFrame + Math.round(duration / 2);
      const ease = (p: number) => p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
      for (let frame = beat.startFrame; frame <= beat.endFrame; frame++) {
        const boxes = actors.map((actor) => {
          const state = states.get(actor.id)!, box = { x: state.x, y: state.y, width: state.width, height: state.height };
          if (targets.has(actor.id)) {
            box[first] += (destinations[actor.id][first] - box[first]) * ease(Math.min(1, (frame - beat.startFrame) / (middle - beat.startFrame)));
            box[second] += (destinations[actor.id][second] - box[second]) * ease(Math.max(0, (frame - middle) / (beat.endFrame - middle)));
          }
          if (box.x < 0 || box.y < 0 || box.x + box.width > 100 || box.y + box.height > 100) throw new Error("Text layout leaves the portrait frame.");
          return box;
        });
        if (boxes.some((a, i) => boxes.slice(i + 1).some((b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > .001 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > .001))) throw new Error("Text layout has an authored-box collision; choose another route or layout.");
      }
      reservations.push({ id: "camera", start: beat.startFrame, end: beat.endFrame, properties: ["x", "y", "scale", "rotation"] });
      const ownedStart = actions.length;
      for (const id of beat.targetIds) {
        reserve(id, beat.startFrame, beat.endFrame, ["scale", "rotation", "opacity", "width", "height"]);
        const state = states.get(id)!, to = destinations[id];
        if (state[first] !== to[first]) tween(id, beat.startFrame, middle, { [first]: to[first] }, "power2.inOut");
        if (state[second] !== to[second]) tween(id, middle, beat.endFrame, { [second]: to[second] }, "power2.inOut");
        Object.assign(state, to);
      }
      const owned = actions.slice(ownedStart);
      for (const actor of actors) reservations.push({ id: actor.id, start: beat.startFrame, end: beat.endFrame, properties: ["x", "y", "width", "height", "scale", "rotation", "opacity"], owned });
      continue;
    }
    if (beat.presetId === "odometer-roll@1" || beat.presetId === "value-transition@1") {
      const id = beat.targetIds[0], [rootId, part] = id.split("."), object = shot.objects.find((object) => object.id === rootId), state = states.get(id);
      if (beat.targetIds.length !== 1 || object?.type !== "numeric-display@1" || !object.numeric || part !== "digits" || !state || state.numericProgress !== 0 || state.opacity !== 1 || (state.reveal ?? 1) !== 1 || states.get(rootId)?.opacity !== 1 || duration < 18 || duration > 90) throw new Error("Numeric roll needs one visible unmasked digits part, explicit progress 0 and 18..90 frames.");
      if (beat.presetId === "value-transition@1" && !numericData(object.numeric).previous) throw new Error("Value transition needs two explicitly related supplied records.");
      reservations.push({ id: rootId, start: beat.startFrame, end: beat.endFrame, properties: ["opacity"] }, { id, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal"] });
      tween(id, beat.startFrame, beat.endFrame, { numericProgress: 1 }, "power3.out");
      state.numericProgress = 1;
      continue;
    }
    if (beat.presetId === "depth-push@1" || beat.presetId === "parallax-pan@1" || beat.presetId === "depth-reveal@1" || beat.presetId === "perspective-reframe@1" || beat.presetId === "depth-handoff@1") {
      const id=beat.targetIds[0],[root,part]=id.split("."),object=shot.objects.find(o=>o.id===root),state=states.get(id);
      if(beat.targetIds.length!==1||!object?.perspective||part!=="camera"||!state||state.cameraX===undefined||state.cameraY===undefined||state.cameraZ===undefined||state.depthProgress===undefined||state.opacity!==1||(state.reveal??1)!==1||states.get(root)?.opacity!==1||duration<18||duration>90)throw new Error("Depth action requires one visible reviewed camera pose and18..90 frames.");
      let camera={x:state.cameraX,y:state.cameraY,z:state.cameraZ};
      if(beat.presetId==="depth-reveal@1") {if(camera.x!==0||camera.y!==0||camera.z!==0||state.depthProgress!==0)throw new Error("Depth reveal begins at the authored occluded rest pose.");camera=perspectiveTarget("inquiry");}
      if(beat.presetId==="perspective-reframe@1")camera=perspectiveTarget(beat.parameters.focus);
      if(beat.presetId==="depth-push@1")camera={...perspectiveTarget("processing"),z:beat.parameters.toZ};
      if(beat.presetId==="parallax-pan@1")camera={...camera,x:beat.parameters.toX,y:beat.parameters.toY};
      if(beat.presetId==="depth-handoff@1") {if(state.depthProgress!==0||camera.x!==160||camera.y!==0||camera.z!==0)throw new Error("Depth handoff requires the revealed inquiry and undelivered token.");camera=perspectiveTarget("processing");}
      const focus=beat.presetId==="depth-reveal@1"?"inquiry":beat.presetId==="perspective-reframe@1"?beat.parameters.focus:"processing";
      requireVisibleFocus(focus,camera);
      const to={cameraX:camera.x,cameraY:camera.y,cameraZ:camera.z,...(beat.presetId==="depth-handoff@1"?{depthProgress:1}:{})};
      tween(id,beat.startFrame,beat.endFrame,to,"power2.inOut");Object.assign(state,to);
      reservations.push({id:root,start:beat.startFrame,end:beat.endFrame,properties:["opacity"]});reservations.push({id,start:beat.startFrame,end:beat.endFrame,properties:["opacity","reveal","x","y","scale"]});continue;
    }
    if (beat.presetId === "morph-chain-step@1") {
      const id = beat.targetIds[0], [rootId, part] = id.split("."), object = shot.objects.find((object) => object.id === rootId), state = states.get(id);
      if (beat.targetIds.length !== 1 || !object?.morphChain || part !== "outline" || state?.morphStage === undefined || state.morphStage >= object.morphChain.pairs.length || state.opacity !== 1 || (state.reveal ?? 1) !== 1 || states.get(rootId)?.opacity !== 1 || duration < 18 || duration > 90) throw new Error("Morph step requires one visible curated outline, the next stage and 18..90 frames.");
      semanticPair(object.morphChain.pairs[state.morphStage]);
      tween(id, beat.startFrame, beat.endFrame, { morphStage: state.morphStage + 1 }, "power2.inOut"); state.morphStage++;
      reservations.push({ id: rootId, start: beat.startFrame, end: beat.endFrame, properties: ["opacity"] });
      reservations.push({ id, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal"] });
      continue;
    }
    if (beat.presetId === "morph-shape@1") {
      const id = beat.targetIds[0], [rootId, part] = id.split("."), object = shot.objects.find((object) => object.id === rootId), state = states.get(id);
      if (beat.targetIds.length !== 1 || object?.type !== "morph-shape@1" || !object.morph || part !== "outline" || !state || state.opacity !== 1 || (state.reveal ?? 1) !== 1 || state.morphProgress !== 0 || states.get(rootId)?.opacity !== 1 || duration < 12) throw new Error("Morph requires one visible curated outline, explicit progress 0 and twelve frames.");
      morphPair(object.morph);
      reservations.push({ id: rootId, start: beat.startFrame, end: beat.endFrame, properties: ["opacity"] }, { id, start: beat.startFrame, end: beat.endFrame, properties: ["opacity", "reveal"] });
      tween(id, beat.startFrame, beat.endFrame, { morphProgress: 1 }, "power2.inOut");
      state.morphProgress = 1;
      continue;
    }
    if (beat.presetId === "layer-depth@1" || beat.presetId === "explode-assemble@1") {
      const object = shot.objects.find((object) => object.id === beat.targetIds[0]), artwork = object?.asset && vectorLibrary[object.asset.id]?.asset;
      if (beat.targetIds.length !== 1 || object?.type !== "graphic-asset@2" || !artwork || object.asset?.contentHash !== depthSceneRegistry[artwork.id] || states.get(object.id)?.opacity !== 1 || duration < 12) throw new Error("Layer choreography needs one visible depth-approved vector actor and twelve frames.");
      const layers = artwork.layers.filter((layer) => states.get(`${object.id}.${layer.id}`)?.opacity === 1 && (states.get(`${object.id}.${layer.id}`)?.reveal ?? 1) === 1);
      if (layers.length < 3 || new Set(layers.map((layer) => layer.role)).size < 3) throw new Error("Layer depth requires three visible authored depth roles.");
      if (beat.presetId === "explode-assemble@1" && (Object.keys(beat.parameters.offsets).length < 2 || Object.keys(beat.parameters.offsets).some((id) => !layers.some((layer) => layer.id === id)))) throw new Error("Exploded offsets require at least two known visible layers.");
      const weights = { background: .15, subject: .5, detail: .75, packet: 1 };
      const middle = beat.startFrame + Math.floor(duration / 2);
      for (const layer of layers) {
        const id = `${object.id}.${layer.id}`, state = states.get(id)!;
        const offset = beat.presetId === "layer-depth@1" ? { x: beat.parameters.offsetX * weights[layer.role], y: beat.parameters.offsetY * weights[layer.role] } : beat.parameters.offsets[layer.id];
        if (!offset) continue;
        tween(id, beat.startFrame, middle, { x: state.x + offset.x, y: state.y + offset.y }, "smooth");
        tween(id, middle, beat.endFrame, { x: state.x, y: state.y }, "smooth");
      }
      continue;
    }
    if (beat.presetId === "edge-draw@1" || beat.presetId === "edge-trace@1") {
      if (beat.targetIds.length !== 1) throw new Error("Edge presets require one diagram edge target.");
      const id = beat.targetIds[0], [rootId, edgeId] = id.split(".");
      const object = shot.objects.find((object) => object.id === rootId), edge = object?.diagram?.edges.find((edge) => edge.id === edgeId), state = states.get(id);
      if (!edge || !state || states.get(rootId)?.opacity !== 1 || state.opacity !== 1 || (state.reveal ?? 1) !== 1) throw new Error("Edge presets require a visible, unmasked diagram edge.");
      if (beat.presetId === "edge-draw@1") {
        if (state.strokeProgress !== 0) throw new Error("Edge draw requires explicit initial strokeProgress 0.");
        tween(id, beat.startFrame, beat.endFrame, { strokeProgress: 1 }, "linear");
        state.strokeProgress = 1;
      } else {
        if (duration < 12 || (state.strokeProgress ?? 1) !== 1) throw new Error("Edge trace needs a fully drawn edge and twelve frames.");
        const arrival = beat.startFrame + Math.floor(duration * .7), peak = arrival + Math.floor((beat.endFrame - arrival) / 2);
        for (const part of [edge.id, edge.from, edge.to]) {
          const target = `${rootId}.${part}`, dependency = states.get(target);
          if (!dependency || dependency.opacity !== 1 || (dependency.reveal ?? 1) !== 1) throw new Error("Edge trace endpoints must be visible and unmasked.");
          reservations.push({ id: target, start: beat.startFrame, end: arrival, properties: ["opacity", "reveal", "strokeProgress"] });
        }
        reservations.push({ id: rootId, start: beat.startFrame, end: arrival, properties: ["opacity"] });
        tween(id, beat.startFrame, arrival, { traceProgress: 1 }, "linear");
        tween(`${rootId}.${edge.to}`, arrival, peak, { arrivalPulse: 1 });
        tween(`${rootId}.${edge.to}`, peak, beat.endFrame, { arrivalPulse: 0 }, "smooth");
      }
      continue;
    }
    if (beat.presetId === "mask-reveal@1") {
      if (beat.targetIds.some((id) => !id.includes("."))) throw new Error("Mask reveals require registered component parts.");
      for (const id of beat.targetIds) { tween(id, beat.startFrame, beat.endFrame, { reveal: beat.parameters.reveal }); states.get(id)!.reveal = beat.parameters.reveal; }
      continue;
    }
    // shortcut: cross-actor geometry uses root actors; add part world bounds before enabling part-to-part handoffs.
    if (["converge-assemble@1", "flow-handoff@1", "split-disperse@1", "punch-zoom@1"].includes(beat.presetId) && (beat.targetIds.some((id) => id.includes(".")) || Object.values(beat.parameters).some((value) => typeof value === "string" ? value.includes(".") : Array.isArray(value) && value.some((id) => id.includes("."))))) throw new Error("This preset requires root actors with known world geometry.");
    if (beat.presetId === "punch-zoom@1") {
      const focus = states.get(beat.parameters.focusId), camera = shot.camera;
      if (!focus || focus.opacity !== 1 || beat.targetIds.length !== 1 || beat.targetIds[0] !== "camera") throw new Error("Punch zoom needs camera ownership and a visible focus actor.");
      const zoom = beat.parameters.zoom, peak = beat.startFrame + Math.floor(duration * .4);
      reserve(beat.parameters.focusId, beat.startFrame, beat.endFrame);
      const angle = camera.rotation * Math.PI / 180, x = (focus.x + focus.width / 2) * 10.8, y = (focus.y + focus.height / 2) * 19.2;
      const focusX = (x * Math.cos(angle) - y * Math.sin(angle)) / 10.8, focusY = (x * Math.sin(angle) + y * Math.cos(angle)) / 19.2;
      tween("camera", beat.startFrame, peak, { scale: camera.scale * zoom, x: camera.x + camera.scale * (1 - zoom) * focusX, y: camera.y + camera.scale * (1 - zoom) * focusY });
      tween("camera", peak, beat.endFrame, { ...camera }, "smooth");
      continue;
    }
    if (beat.presetId === "cascade@1") {
      const span = duration - beat.parameters.staggerFrames * (beat.targetIds.length - 1);
      if (span < 6) throw new Error("Cascade stagger leaves too few frames for each actor.");
      for (const [index, id] of beat.targetIds.entries()) {
        const state = states.get(id)!;
        if (state.opacity !== 0) throw new Error("Cascade requires explicitly hidden entering actors.");
        const start = beat.startFrame + index * beat.parameters.staggerFrames, end = start + span;
        tween(id, start, start + 1, { y: state.y + beat.parameters.offsetY, opacity: 0, scale: state.scale * .9 }, "linear");
        tween(id, start + 1, end - 2, { y: state.y, opacity: 1, scale: state.scale * beat.parameters.overshoot });
        tween(id, end - 2, end, { scale: state.scale }, "smooth");
        state.opacity = 1;
      }
      continue;
    }
    if (beat.presetId === "converge-assemble@1") {
      const result = states.get(beat.parameters.resultId);
      if (!result || result.opacity !== 0 || beat.targetIds.includes(beat.parameters.resultId) || beat.targetIds.length < 2) throw new Error("Convergence needs distinct source actors and a hidden result actor.");
      const meet = beat.startFrame + Math.floor(duration * .55), impact = beat.endFrame - 2;
      reserve(beat.parameters.resultId, beat.startFrame, meet);
      for (const id of beat.targetIds) {
        const state = states.get(id)!;
        const to = { x: result.x + (result.width - state.width) / 2, y: result.y + (result.height - state.height) / 2, scale: state.scale * .8 };
        tween(id, beat.startFrame, meet, to, "power2.inOut");
        tween(id, meet, impact, { opacity: 0 }, "smooth");
        Object.assign(state, to, { opacity: 0 });
      }
      tween(beat.parameters.resultId, meet, impact, { opacity: 1, scale: result.scale * beat.parameters.overshoot });
      tween(beat.parameters.resultId, impact, beat.endFrame, { scale: result.scale }, "smooth");
      result.opacity = 1;
      continue;
    }
    if (beat.presetId === "flow-handoff@1") {
      const id = beat.targetIds[0], packet = states.get(id)!, destination = states.get(beat.parameters.destinationId);
      if (beat.targetIds.length !== 1 || !destination || destination.opacity !== 1 || id === beat.parameters.destinationId || duration < 8) throw new Error("Flow requires one packet, a distinct visible destination and eight frames.");
      const arrival = beat.startFrame + Math.floor(duration * .6);
      reserve(beat.parameters.destinationId, beat.startFrame, arrival);
      const to = { x: destination.x + (destination.width - packet.width) / 2, y: destination.y + (destination.height - packet.height) / 2 };
      tween(id, beat.startFrame, beat.startFrame + 1, { opacity: 1 }, "linear");
      tween(id, beat.startFrame + 1, arrival, to, "power2.inOut");
      tween(id, arrival, beat.endFrame, { opacity: 0 }, "smooth");
      tween(beat.parameters.destinationId, arrival, beat.endFrame - 2, { scale: destination.scale * beat.parameters.reactionScale });
      tween(beat.parameters.destinationId, beat.endFrame - 2, beat.endFrame, { scale: destination.scale }, "smooth");
      Object.assign(packet, to, { opacity: 0 });
      continue;
    }
    if (beat.presetId === "split-disperse@1") {
      const source = states.get(beat.targetIds[0])!, children = beat.parameters.childIds;
      if (beat.targetIds.length !== 1 || source.opacity !== 1 || new Set(children).size !== children.length || children.includes(beat.targetIds[0]) || children.some((id) => !states.has(id) || states.get(id)!.opacity !== 0)) throw new Error("Split requires one visible source and distinct hidden child actors.");
      const fork = beat.startFrame + Math.floor(duration * .3);
      reserve(beat.targetIds[0], beat.startFrame, fork, ["x", "y", "width", "height", "rotation"]);
      tween(beat.targetIds[0], beat.startFrame, fork, { opacity: 0, scale: source.scale * .8 }, "smooth");
      for (const id of children) {
        const child = states.get(id)!;
        tween(id, beat.startFrame, fork, { x: source.x + (source.width - child.width) / 2, y: source.y + (source.height - child.height) / 2, opacity: 0, scale: child.scale * .8 }, "linear");
        tween(id, fork, beat.endFrame - 2, { x: child.x, y: child.y, opacity: 1, scale: child.scale * 1.08 });
        tween(id, beat.endFrame - 2, beat.endFrame, { scale: child.scale }, "smooth");
        child.opacity = 1;
      }
      source.opacity = 0; source.scale *= .8;
      continue;
    }
    const anticipationEnd = beat.startFrame + Math.floor(duration / 4);
    const impactEnd = beat.startFrame + Math.floor(duration * .65);
    for (const id of beat.targetIds) {
      const state = states.get(id)!;
      const to = { ...beat.parameters.to, scale: beat.parameters.to.scale ?? state.scale };
      tween(id, beat.startFrame, anticipationEnd, { scale: state.scale * beat.parameters.anticipation }, "power2.inOut");
      tween(id, anticipationEnd, impactEnd, { ...to, scale: to.scale * beat.parameters.overshoot });
      tween(id, impactEnd, beat.endFrame, { scale: to.scale }, "smooth");
      Object.assign(state, to);
    }
  }
  for (const reservation of reservations) {
    if (actions.some((action) => !reservation.owned?.includes(action) && action.targetIds.includes(reservation.id) && action.startFrame < reservation.end && action.endFrame > reservation.start && Object.keys(action.to).some((property) => reservation.properties.includes(property)))) throw new Error("A geometric preset depends on an actor that is moving during its handoff or focus interval.");
  }
  return actions.sort((a, b) => a.startFrame - b.startFrame);
}
