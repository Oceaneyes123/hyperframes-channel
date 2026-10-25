import { GraphicBackground } from "./graphics/background.tsx";
import { useMemo } from "react";
import { useCurrentFrame, interpolateColors, Html5Audio } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { SplitScreen } from "./split-screen.tsx";
import VisualSymbol, { isSymbol } from "./visual-symbol.tsx";
import { VisualText } from "./visual-text.tsx";
import { VisualComponent } from "./components/visual-component.tsx";
import { isComponent } from "../workflow/components.ts";
import { textFontSize } from "./text-metrics.ts";
import { isTextType } from "./text-metrics.ts";
import type { TextMotion } from "../workflow/text-motion.ts";
import { useGsapTimeline } from "@remotion/gsap";
import { compileMotion, type MotionGroup } from "./compile-motion.ts";
import type { MotionPlan, MotionState, MotionShot } from "../workflow/motion.ts";
import type { VisualArtifact } from "../workflow/visuals.ts";

export type MotionCompositionProps = { plan: MotionPlan; board: VisualArtifact; narrationUrl?: string };
const ease = (t: number) => t * t * (3 - 2 * t);
const groupVars = (state: Partial<MotionState>) => ({
  ...(state.x === undefined ? {} : { x: state.x * 10.8 }), ...(state.y === undefined ? {} : { y: state.y * 19.2 }),
  ...(state.opacity === undefined ? {} : { opacity: state.opacity }), ...(state.scale === undefined ? {} : { scale: state.scale }),
  ...(state.rotation === undefined ? {} : { rotation: state.rotation }),
});
function shapeVars(type: string, state: Partial<MotionState>) {
  const result: Record<string, number | string> = {};
  if (state.width !== undefined) {
    const width = state.width * 10.8;
    Object.assign(result, type === "ellipse" ? { rx: width / 2, cx: width / 2 } : type === "line" ? { x2: width } : { width });
  }
  if (state.height !== undefined) {
    const height = state.height * 19.2;
    Object.assign(result, type === "ellipse" ? { ry: height / 2, cy: height / 2 } : type === "line" ? { y2: height } : { height });
  }
  if (state.color !== undefined) {
    result[isSymbol(type) || isComponent(type) ? "color" : type === "line" ? "stroke" : "fill"] = state.color;
    if (isTextType(type)) result.color = state.color;
  }
  return result;
}

function Primitive({ object, actorId, textMotion, frame }: { object: MotionShot["objects"][number]; actorId: string; textMotion?: TextMotion; frame: number }) {
  const state = object.initial, width = state.width * 10.8, height = state.height * 19.2;
  if (textMotion) return <VisualText type={object.type} label={object.label} color={state.color} width={width} height={height} motion={textMotion} frame={frame} />;
  if (isComponent(object.type)) return <VisualComponent type={object.type} width={width} height={height} color={state.color} parts={object.initialParts} asset={object.asset} diagram={object.diagram} values={object.values} label={object.label} actorId={actorId} />;
  if (isSymbol(object.type)) return <VisualSymbol type={object.type} width={width} height={height} color={state.color} />;
  if (["centered-text", "heading", "caption", "code"].includes(object.type)) return <VisualText type={object.type} label={object.label} color={state.color} width={width} height={height} />;
  if (object.type === "ellipse") return <ellipse data-shape cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={state.color} />;
  if (object.type === "line") return <line data-shape x1="0" y1="0" x2={width} y2={height} stroke={state.color} strokeWidth="3" />;
  if (object.type === "text") {
    const fontSize = textFontSize("text", object.label, width, height);
    return <text data-shape y={fontSize * .85} fill={state.color} fontSize={fontSize}>{object.label}</text>;
  }
  return <rect data-shape width={width} height={height} rx="12" fill={state.color} />;
}

function GroupScene({ group }: { group: MotionGroup }) {
  const frame = useCurrentFrame();
  const scope = useGsapTimeline<SVGSVGElement>(({ timeline, selector }) => {
    for (const actor of group.actors) {
      const target = selector(`[data-actor="${actor.id}"]`);
      timeline.set(target, { ...groupVars(actor.object.initial), opacity: actor.startFrame === 0 ? actor.object.initial.opacity : 0, svgOrigin: "0 0" }, 0);
      timeline.set(target, { opacity: actor.object.initial.opacity }, actor.startFrame / 30);
      timeline.set(target, { opacity: 0 }, actor.endFrame / 30);
      for (const [part, state] of Object.entries(actor.object.initialParts ?? {})) {
        timeline.set(selector(`[data-actor="${actor.id}.${part}"]`), { ...groupVars(state), svgOrigin: "0 0", attr: { color: state.color } }, 0);
        timeline.set(selector(`[data-reveal="${actor.id}.${part}"]`), { attr: { width: actor.object.initial.width * 10.8 * (state.reveal ?? 1) } }, 0);
      }
    }
    for (const item of group.shots) {
      timeline.set(selector("[data-camera]"), { ...groupVars(item.shot.camera), svgOrigin: "0 0" }, item.startFrame / 30);
      for (const action of item.shot.actions) {
        if (action.behavior === "hold") continue;
        for (const [offset, id] of action.targetIds.entries()) {
          const start = (item.startFrame + action.startFrame + offset * action.staggerFrames) / 30;
          const options = { duration: (action.endFrame - action.startFrame) / 30, ease: action.ease === "smooth" ? ease : action.ease === "linear" ? "none" : action.ease };
          const vars = groupVars(action.to);
          const target = id === "camera" ? selector("[data-camera]") : selector(`[data-actor="${item.targets[id]}"]`);
          if (Object.keys(vars).length) timeline.to(target, { ...vars, ...options }, start);
          if (id !== "camera") {
            if (id.includes(".")) {
              if (action.to.color !== undefined) timeline.to(target, { attr: { color: action.to.color }, ...options }, start);
              if (action.to.reveal !== undefined) {
                const object = item.shot.objects.find((object) => object.id === id.split(".")[0])!;
                timeline.to(selector(`[data-reveal="${item.targets[id]}"]`), { attr: { width: object.initial.width * 10.8 * action.to.reveal }, ...options }, start);
              }
            } else {
              const object = item.shot.objects.find((object) => object.id === id)!; const attrs = shapeVars(object.type, action.to);
              if (Object.keys(attrs).length) timeline.to(selector(`[data-actor="${item.targets[id]}"]${isComponent(object.type) ? " >" : ""} [data-shape]`), { attr: attrs, ...options }, start);
            }
          }
        }
      }
    }
  }, { dependencies: [group] });
  const active = group.shots.find((item) => frame < item.endFrame) ?? group.shots.at(-1)!;
  const background = interpolateColors(frame - active.startFrame, [0, active.shot.durationFrames - 1], [active.background.start, active.background.end]);
  return <svg ref={scope} data-motion-frame={frame} data-motion-group={group.id} viewBox="0 0 1080 1920" width="1080" height="1920" style={{ fontFamily: "Arial" }}>
    <rect width="1080" height="1920" fill={background} />
    {active.environment && <GraphicBackground environment={active.environment} width={1080} height={1920} progress={(frame - active.startFrame) / Math.max(1, active.shot.durationFrames - 1)} />}
    <g data-camera>{group.actors.map((actor) => {
      const owner = group.shots.find((item) => item.startFrame === actor.startFrame)!;
      const textMotion = owner.shot.textMotions?.find((motion) => owner.targets[motion.targetId] === actor.id);
      return <g key={actor.id} data-actor={actor.id} opacity="0"><Primitive object={actor.object} actorId={actor.id} textMotion={textMotion} frame={frame - actor.startFrame} /></g>;
    })}</g>
  </svg>;
}

export default function MotionComposition({ plan, board, narrationUrl }: MotionCompositionProps) {
  const compiled = useMemo(() => compileMotion(plan, board), [plan, board]);
  return <>{narrationUrl && <Html5Audio src={narrationUrl} />}<TransitionSeries>{compiled.groups.flatMap((group) => {
    const timing = linearTiming({ durationInFrames: Math.max(1, group.incoming.overlapFrames) });
    const transition = group.incoming.overlapFrames > 0 ? group.incoming.presentation === "split"
      ? <TransitionSeries.Transition key={`${group.id}-arrival`} timing={timing} presentation={{ component: SplitScreen, props: {} }} />
      : group.incoming.presentation === "slide"
      ? <TransitionSeries.Transition key={`${group.id}-arrival`} timing={timing} presentation={slide({ direction: "from-right" })} />
      : group.incoming.presentation === "wipe"
      ? <TransitionSeries.Transition key={`${group.id}-arrival`} timing={timing} presentation={wipe({ direction: "from-left" })} />
      : <TransitionSeries.Transition key={`${group.id}-arrival`} timing={timing} presentation={fade()} /> : null;
    return [transition, <TransitionSeries.Sequence key={group.id} durationInFrames={group.durationFrames}><GroupScene group={group} /></TransitionSeries.Sequence>];
  })}</TransitionSeries></>;
}
