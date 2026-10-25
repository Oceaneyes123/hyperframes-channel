import { useId } from "react";
import { characterRig as rig, characterPose, type CharacterCue } from "../../workflow/character-rig.ts";
import { graphicTheme as paint } from "../../workflow/graphic-assets.ts";
import { VectorNodes } from "../graphics/layered-graphic.tsx";
import type { PartState } from "../../workflow/components.ts";

const angle = (value: number) => Number(value.toFixed(5));
export function CharacterRig({ width, height, states, actorId, cues = [], frame = 0, documentProgress = states.document.handoffProgress ?? 0 }: { width: number; height: number; states: Record<string, PartState>; actorId?: string; cues?: CharacterCue[]; frame?: number; documentProgress?: number }) {
  const uid = useId(), pose = characterPose(cues, frame, documentProgress);
  const torso = `translate(0 ${pose.lift}) rotate(${pose.lean} ${rig.torsoPivot.join(" ")})`, inverse = `rotate(${-pose.lean} ${rig.torsoPivot.join(" ")}) translate(0 ${-pose.lift})`;
  const part = (id: string) => ({ "data-actor": actorId ? `${actorId}.${id}` : undefined, "data-part": id, opacity: states[id].opacity, color: states[id].color });
  const arm = (side: "left" | "right") => {
    const bone = pose[side], pointing = side === "right" ? pose.pointing : 0;
    const finger = Math.atan2(rig.point.target[1] - rig.point.wrist[1], rig.point.target[0] - rig.point.wrist[0]) * 180 / Math.PI - bone.upper - bone.lower - pose.lean;
    const fingerLength = 12 + (Math.hypot(rig.point.target[0] - rig.point.wrist[0], rig.point.target[1] - rig.point.wrist[1]) - 12) * pointing;
    return <g key={side} data-joint={`${side}-shoulder`} transform={`translate(${bone.shoulder.join(" ")}) rotate(${angle(bone.upper)})`}>
      <path d={`M0 0H${rig.upperLength}`} stroke={paint.ink} strokeWidth="27" strokeLinecap="round" />
      <path d={`M0 0H${rig.upperLength}`} stroke="currentColor" strokeWidth="21" strokeLinecap="round" />
      <g data-joint={`${side}-elbow`} transform={`translate(${rig.upperLength} 0) rotate(${angle(bone.lower)})`}>
        <path d={`M0 0H${rig.lowerLength}`} stroke={paint.ink} strokeWidth="23" strokeLinecap="round" />
        <path d={`M0 0H${rig.lowerLength}`} stroke={paint.paper} strokeWidth="17" strokeLinecap="round" />
        <g data-joint={`${side}-hand`} data-hand-x={bone.hand[0]} data-hand-y={bone.hand[1]} transform={`translate(${rig.lowerLength} 0)`}>
          <ellipse rx="13" ry="9" fill={paint.paper} stroke={paint.ink} strokeWidth="2.5" />
          {pointing > 0 && <g transform={`rotate(${angle(finger)})`}><path d={`M0 0H${fingerLength}`} stroke={paint.ink} strokeWidth="10" strokeLinecap="round" /><path d={`M0 0H${fingerLength}`} stroke={paint.paper} strokeWidth="6" strokeLinecap="round" /></g>}
        </g>
      </g>
    </g>;
  };
  // A single paint surface keeps rotated stroke rasterization stable across backward seeks.
  return <g style={{ filter: "opacity(1)" }} shapeRendering="geometricPrecision" data-shape data-character-action={pose.action} role="img" aria-label={`Business owner: ${pose.action === "neutral" ? "at rest" : pose.action.replace("character-", "").replace("@1", "")}${documentProgress === 1 ? "; document delivered to review tray" : ""}`}>
    <svg key={JSON.stringify(pose)} width={width} height={height} viewBox={`0 0 ${rig.width} ${rig.height}`}>
      <g transform={`translate(${rig.offset.join(" ")})`}>
        <ellipse cx="160" cy="485" rx="190" ry="13" fill={paint.ink} opacity=".1" />
        <rect x="52" y="235" width="142" height="190" rx="38" fill={paint.mint} stroke={paint.ink} strokeWidth="3" />
        <path d={`M-60 380H${rig.width - rig.offset[0]}V405H-60ZM-40 405H380V480H-40Z`} fill={paint.mint} stroke={paint.ink} strokeWidth="3" />
        <g {...part("body")}><g data-joint="torso" transform={torso}>
          <VectorNodes nodes={rig.artwork.body} prefix={`${uid}-body`} />
          <g data-joint="head" transform={`rotate(${pose.head} ${rig.headPivot.join(" ")})`}>
            <VectorNodes nodes={rig.artwork.head} prefix={`${uid}-head`} />
            <g data-joint="brows" stroke={paint.ink} strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M82 94Q94 90 105 94" transform={`rotate(${-10 * pose.concern} 94 94) translate(0 ${-3 * pose.concern})`} />
              <path d="M133 94Q145 90 157 94" transform={`rotate(${10 * pose.concern} 145 94) translate(0 ${-3 * pose.concern})`} />
            </g>
            {[94, 146].map((x) => <ellipse key={x} data-joint="eye" cx={x + pose.gaze} cy="115" rx={3 + pose.concern} ry={(5 + 2 * pose.concern) * pose.blink} fill={paint.ink} />)}
            <path data-joint="mouth" d={`M104 154Q119 ${162 - 20 * pose.concern} 136 154`} fill="none" stroke={paint.ink} strokeWidth="3" strokeLinecap="round" />
          </g>
          <g transform={inverse}>
            <g {...part("laptop")} data-prop="laptop">
              <rect x="110" y="280" width="135" height="78" rx="7" fill={paint.ink} stroke={paint.paper} strokeWidth="3" />
              <rect x="119" y="289" width="117" height="59" rx="3" fill={paint.paper} />
              <path d="M130 305H220M130 319H202M130 333H214" stroke={paint.muted} strokeWidth="4" strokeLinecap="round" />
              <path d="M105 355H245L252 373H95Z" fill={paint.paper} stroke={paint.ink} strokeWidth="3" />
              {[0, 1, 2].map((i) => <path key={i} d={`M${110 + i * 42} 361H${141 + i * 42}`} stroke={pose.typing * (i % 2 ? -1 : 1) > 1 ? paint.accent : paint.muted} strokeWidth="3" />)}
            </g>
            <rect x="5" y="325" width="34" height="55" rx="7" fill={paint.ink} /><rect x="10" y="331" width="24" height="39" rx="2" fill={paint.paper} />
            <circle data-prop="new-inquiry" cx="22" cy="345" r={5 + 2 * pose.notify} fill={paint.accent} opacity={.3 + .7 * pose.notify} />
            <path d="M310 340H380V375H310Z" fill={paint.paper} stroke={paint.ink} strokeWidth="3" />
          </g>
          {arm("left")}{arm("right")}
          <g transform={inverse}>
            <g {...part("document")}><g data-prop="document" data-document-x={pose.document[0]} data-document-y={pose.document[1]} transform={`translate(${pose.document.join(" ")})`}>
              <path d="M0 0H37L50 13V65H0Z" fill={paint.paper} stroke={paint.ink} strokeWidth="3" strokeLinejoin="round" />
              <path d="M37 0V13H50M10 25H39M10 36H35M10 47H39" fill="none" stroke={paint.muted} strokeWidth="2.5" />
            </g></g>
            <path d="M308 356H382V383H308Z" fill={paint.accent} stroke={paint.ink} strokeWidth="3" />
          </g>
        </g></g>
      </g>
    </svg>
  </g>;
}
