import type { MotionAction, MotionShot, MotionState } from "../../workflow/motion.ts";

// Preset IDs are immutable: changes to motion semantics require a new version.
export function expandBeats(shot: MotionShot): MotionAction[] {
  const states = new Map<string, MotionState>(shot.objects.map((object) => [object.id, { ...object.initial }]));
  for (const object of shot.objects) for (const [part, state] of Object.entries(object.initialParts ?? {})) states.set(`${object.id}.${part}`, { ...object.initial, ...state });
  const actions: MotionAction[] = [];
  const reservations: { id: string; start: number; end: number; properties: string[] }[] = [];
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
    if (actions.some((action) => action.targetIds.includes(reservation.id) && action.startFrame < reservation.end && action.endFrame > reservation.start && Object.keys(action.to).some((property) => reservation.properties.includes(property)))) throw new Error("A geometric preset depends on an actor that is moving during its handoff or focus interval.");
  }
  return actions.sort((a, b) => a.startFrame - b.startFrame);
}
