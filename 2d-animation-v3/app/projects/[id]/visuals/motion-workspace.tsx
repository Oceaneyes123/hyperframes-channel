"use client";
import dynamic from "next/dynamic";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PlayerRef } from "@remotion/player";
import { decideMotion } from "../../../actions.ts";
import { scheduleMotion, type MotionArtifact } from "../../../../workflow/motion.ts";
import type { VisualArtifact } from "../../../../workflow/visuals.ts";

const MotionPlayer = dynamic(() => import("./motion-player"), { ssr: false, loading: () => <p role="status">Loading motion preview…</p> });
type Props = {
  projectId: string; storyboardId: string | null; eligible: boolean; latestId: string | null; current: boolean;
  motion: MotionArtifact | null; sourceBoard: VisualArtifact | null; original: MotionArtifact | null; originalBoard: VisualArtifact | null;
  acceptance: { runId: string; stale: boolean } | null; narration: { number: number; text: string }[];
  history: { id: string; status: string; decision: string | null; model: string; error: string | null }[];
};

function Decision({ projectId, id, disabled }: { projectId: string; id: string; disabled: boolean }) {
  const [state, action, pending] = useActionState(decideMotion.bind(null, projectId), { error: "" });
  return <form action={action} className="mt-6 flex flex-wrap gap-3">
    <input type="hidden" name="runId" value={id} />
    <button name="decision" value="accept" disabled={disabled || pending}>Accept exact motion</button>
    <button name="decision" value="reject" disabled={pending}>Reject motion proposal</button>
    {state.error && <p role="alert" className="w-full text-[#f5b5a6]">{state.error}</p>}
  </form>;
}

export default function MotionWorkspace(props: Props) {
  const router = useRouter(); const primary = useRef<PlayerRef>(null); const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false), [instruction, setInstruction] = useState(""), [message, setMessage] = useState(""), [error, setError] = useState("");
  const [frameState, setFrame] = useState(0), [selectedId, setSelectedId] = useState(""), [loop, setLoop] = useState(false);
  useEffect(() => () => controller.current?.abort(), []);
  const { motion, sourceBoard } = props;
  const schedule = motion ? scheduleMotion(motion.plan) : null; const duration = schedule?.durationFrames ?? 1; const frame = Math.min(frameState, duration - 1);
  const selected = motion?.plan.shots.find((shot) => shot.id === selectedId) ?? motion?.plan.shots[0];
  const selectedTime = schedule?.shots.find((shot) => shot.shotId === selected?.id);
  const windowStart = Math.max(0, (selectedTime?.startFrame ?? 0) - 30);
  const windowEnd = Math.min(duration - 1, (selectedTime?.startFrame ?? 0) + Math.max(30, (selected?.incoming.overlapFrames ?? 0) + 30));
  const changedFrame = useCallback((value: number) => {
    if (loop && value > windowEnd) { primary.current?.seekTo(windowStart); setFrame(windowStart); }
    else setFrame(value);
  }, [loop, windowStart, windowEnd]);
  const running = props.history.some((item) => item.status === "running");
  const historical = !!motion && motion.id !== props.latestId;
  const decision = props.history.find((item) => item.id === motion?.id)?.decision;
  function seek(value: number) { primary.current?.pause(); setLoop(false); setFrame(Math.max(0, Math.min(duration - 1, value))); }
  async function generate(shotId: string | null) {
    if (!props.storyboardId) return; primary.current?.pause(); setLoop(false); setBusy(true); setError(""); setMessage("Starting motion request…");
    const abort = new AbortController(); controller.current = abort;
    try {
      const response = await fetch(`/api/projects/${props.projectId}/motion`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal,
        body: JSON.stringify({ storyboardId: props.storyboardId, baseId: props.latestId, shotId, instruction }) });
      if (!response.ok || !response.body) throw new Error("Could not start motion request.");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let id: string | null = null;
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break; buffer += decoder.decode(chunk.value, { stream: true }); let boundary: number;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, boundary)); buffer = buffer.slice(boundary + 1);
            if (event.error) throw new Error(event.error); if (event.message) setMessage(event.message); if (event.runId) id = event.runId;
          }
        }
      } finally { await reader.cancel(); reader.releaseLock(); }
      if (!id) throw new Error("Request ended without a saved motion proposal.");
      router.push(`/projects/${props.projectId}/visuals?motion=${id}#motion-review`); router.refresh(); setMessage("Motion proposal saved for explicit review.");
    } catch (failure) { setError(abort.signal.aborted ? "Request cancelled. Check saved history before retrying." : failure instanceof Error ? failure.message : "Motion request failed."); router.refresh(); }
    finally { controller.current = null; setBusy(false); }
  }
  return <section id="motion-review" aria-labelledby="motion-heading" className="mt-12 border-t border-white/15 pt-8">
    <h2 id="motion-heading" className="text-2xl font-semibold">3. Motion preview and review</h2>
    <p className="mt-3 text-sm text-[#aeb4b0]">Remotion controls time; GSAP animates validated objects. Preview is silent and timing is estimated. Artifact acceptance does not approve production.</p>
    {!props.eligible && <p className="mt-4 text-[#e1ba77]">Accept the exact current storyboard to unlock motion proposals.</p>}
    {historical && <p className="mt-4 text-[#e1ba77]">Historical motion. <a href={`/projects/${props.projectId}/visuals#motion-review`}>Return to latest motion</a> before editing.</p>}
    {motion && !props.current && <p className="mt-4 text-[#e1ba77]">This motion is stale or rejected. Earlier previews remain readable; generate from the current accepted storyboard.</p>}
    <fieldset disabled={busy} className="mt-6 min-w-0">
      <legend className="sr-only">Motion proposal controls</legend>
      <label htmlFor="motion-instruction" className="block text-sm font-semibold">Motion direction</label>
      <textarea id="motion-instruction" maxLength={2000} rows={2} value={instruction} onChange={(event) => setInstruction(event.target.value)} className="mt-2 w-full" />
      <p className="mt-2 text-xs text-[#aeb4b0]">Shot revisions change actions, camera and estimated duration. Teaching content, object correspondence and transition type come from the accepted storyboard.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button disabled={!props.eligible || historical || running} onClick={() => generate(null)}>{motion ? "Propose new motion plan" : "Generate motion proposal"}</button>
        {selected && <button disabled={!props.eligible || historical || !props.current || running} onClick={() => generate(selected.id)}>Revise selected motion shot</button>}
      </div>
      {message && <p role="status" className="mt-4 text-sm">{message}</p>}
      {error && <p role="alert" className="mt-4 text-[#f5b5a6]">{error}</p>}
      {running && !busy && <p className="mt-4 text-sm">A motion request is running. <a href={`/projects/${props.projectId}/visuals#motion-review`}>Refresh status</a>. Interrupted requests expire after three minutes.</p>}
      {motion && sourceBoard && schedule && <>
        <div className="mt-7 grid items-start gap-8 md:grid-cols-2">
          <figure><figcaption className="mb-3 font-semibold">{decision === "accepted" ? "Accepted motion" : decision === "rejected" ? "Rejected proposal" : "Proposed motion"}</figcaption>
            <div className="max-w-[300px] border border-white/15"><MotionPlayer artifact={motion} board={sourceBoard} frame={frame} playerRef={primary} onFrame={changedFrame} /></div>
          </figure>
          {props.original && props.originalBoard && props.original.id !== motion.id && <figure><figcaption className="mb-3 font-semibold">Previously accepted · same global frame</figcaption>
            <div className="max-w-[300px] border border-white/15"><MotionPlayer artifact={props.original} board={props.originalBoard} frame={frame} /></div>
            <p className="mt-2 text-xs text-[#aeb4b0]">A shorter version holds its last frame. Changed durations shift downstream timing.</p>
          </figure>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => primary.current?.play()}>Play motion</button><button onClick={() => { primary.current?.pause(); setLoop(false); }}>Pause motion</button>
          <button onClick={() => seek(frame - 1)}>Previous frame</button><button onClick={() => seek(frame + 1)}>Next frame</button>
          <button onClick={() => { setFrame(windowStart); primary.current?.seekTo(windowStart); setLoop(true); primary.current?.play(); }}>Review selected boundary</button>
        </div>
        <label htmlFor="motion-frame" className="mt-5 block text-sm">Timeline frame {frame} / {duration - 1} · {(frame / 30).toFixed(2)}s</label>
        <input id="motion-frame" type="range" min="0" max={duration - 1} step="1" value={frame} onChange={(event) => seek(Number(event.target.value))} className="mt-2 w-full" />
        <p role="status" className="text-sm">{loop ? `Looping boundary frames ${windowStart}–${windowEnd}` : "Boundary loop off"} · {duration} frames total</p>
        <div className="mt-5 flex flex-wrap gap-3">{motion.plan.shots.map((shot, index) => <button key={shot.id} aria-pressed={selected?.id === shot.id} onClick={() => { setSelectedId(shot.id); seek(schedule.shots[index].startFrame); }}>Motion shot {index + 1}</button>)}</div>
        <details className="mt-6"><summary className="cursor-pointer">Narration links</summary><ol className="mt-3 space-y-2">{props.narration.map((line) => {
          const index = motion.plan.shots.findIndex((shot) => shot.lineNumbers.includes(line.number));
          return <li key={line.number}><button className="text-left text-sm" onClick={() => { setSelectedId(motion.plan.shots[index].id); seek(schedule.shots[index].startFrame); }}>{line.number}. {line.text}</button></li>;
        })}</ol></details>
        {selected && <details className="mt-5"><summary className="cursor-pointer">Selected shot mapping and actions</summary>
          <p className="mt-3 text-sm">{selected.durationFrames} frames · {selected.incoming.type} · {selected.incoming.overlapFrames} overlap frames</p>
          <ul className="mt-3 space-y-2 text-sm">{selected.objects.map((object) => <li key={object.id}>{object.id} · {object.type} · start shape {object.startIndex === null ? "new" : object.startIndex + 1} → end shape {object.endIndex === null ? "removed" : object.endIndex + 1}</li>)}</ul>
          <pre className="mt-4 overflow-auto whitespace-pre-wrap break-all rounded border border-white/15 p-4 text-xs">{JSON.stringify(selected.actions, null, 2)}</pre>
        </details>}
        {decision === "pending" && <Decision projectId={props.projectId} id={motion.id} disabled={!props.current || historical} />}
        {decision === "accepted" && <p className="mt-6 text-[#b9d8c2]">Exact motion artifact accepted{props.acceptance?.stale ? " · acceptance is stale" : ""}. Production gates remain separate.</p>}
      </>}
    </fieldset>
    {busy && <button className="mt-4" onClick={() => controller.current?.abort()}>Cancel motion request</button>}
    <details className="mt-7"><summary className="cursor-pointer font-semibold">Motion request history ({props.history.length})</summary>
      <ol className="mt-4 space-y-4 text-sm">{props.history.map((item) => <li key={item.id}><p>{item.status} · {item.decision ?? "undecided"} · {item.model}</p>
        {item.status === "complete" && <a href={`/projects/${props.projectId}/visuals?motion=${item.id}#motion-review`}>Review saved motion</a>}{item.error && <p className="mt-2 text-[#f5b5a6]">{item.error}</p>}
      </li>)}</ol>
    </details>
  </section>;
}
