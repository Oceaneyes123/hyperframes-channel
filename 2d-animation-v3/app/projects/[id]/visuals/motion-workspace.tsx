"use client";
import dynamic from "next/dynamic";
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PlayerRef } from "@remotion/player";
import { decideMotion } from "../../../actions.ts";
import { defaultEnergyProfile, scheduleMotion, type MotionArtifact, type EnergyProfile } from "../../../../workflow/motion.ts";
import type { VisualArtifact } from "../../../../workflow/visuals.ts";
import { inspectMotion, type ProductionView } from "../../../../workflow/production.ts";

const MotionPlayer = dynamic(() => import("./motion-player"), { ssr: false, loading: () => <p role="status">Loading motion preview…</p> });
type Props = {
  production: ProductionView;
  timingWarnings?: string[];
  projectId: string; storyboardId: string | null; eligible: boolean; latestId: string | null; current: boolean;
  motion: MotionArtifact | null; sourceBoard: VisualArtifact | null; original: MotionArtifact | null; originalBoard: VisualArtifact | null;
  acceptance: { runId: string; stale: boolean } | null; narration: { number: number; text: string }[];
  history: { id: string; status: string; decision: string | null; model: string; error: string | null }[];
};

function Decision({ projectId, id, disabled }: { projectId: string; id: string; disabled: boolean }) {
  const [state, action, pending] = useActionState(decideMotion.bind(null, projectId), { error: "" });
  return <form action={action} className="mt-6 flex flex-wrap gap-3">
    <input type="hidden" name="runId" value={id} />
    <label className="flex w-full gap-3"><input name="rhythmReviewed" type="checkbox" required />I watched the whole candidate at normal speed and reviewed its rhythm, reading holds and scene handoffs.</label>
    <label className="flex w-full gap-3"><input name="causeReactionReviewed" type="checkbox" required />I checked the major actions and their visible reactions, including any intentional exceptions.</label>
    <button name="decision" value="accept" disabled={disabled || pending}>Accept motion</button>
    <button name="decision" value="reject" disabled={pending} formNoValidate>Reject</button>
    {state.error && <p role="alert" className="w-full text-[var(--error)]">{state.error}</p>}
  </form>;
}

export default function MotionWorkspace(props: Props) {
  const router = useRouter(); const primary = useRef<PlayerRef>(null); const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false), [instruction, setInstruction] = useState(""), [message, setMessage] = useState(""), [error, setError] = useState("");
  const [frameState, setFrame] = useState(0), [selectedId, setSelectedId] = useState(""), [loop, setLoop] = useState(false);
  const [readyId, setReadyId] = useState("");
  const [visualFindings, setVisualFindings] = useState<{ frame: number; evidence: string; suggestion: string }[]>([]);
  const [energyProfile, setEnergyProfile] = useState<EnergyProfile>(props.motion?.plan.energyProfile ?? defaultEnergyProfile);
  useEffect(() => () => controller.current?.abort(), []);
  const { motion, sourceBoard } = props;
  const quality = useMemo(() => motion ? inspectMotion(motion.plan, sourceBoard) : null, [motion, sourceBoard]);
  const acceptedQuality = useMemo(() => props.original ? inspectMotion(props.original.plan, props.originalBoard) : null, [props.original, props.originalBoard]);
  const ready = !!motion && readyId === motion.id;
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
  async function generate(shotId: string | null, iterate = false) {
    setVisualFindings([]);
    if (!props.storyboardId) return; primary.current?.pause(); setLoop(false); setBusy(true); setError(""); setMessage("Starting motion request…");
    const abort = new AbortController(); controller.current = abort;
    try {
      const response = await fetch(`/api/projects/${props.projectId}/motion${iterate ? "/iterate" : ""}`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal,
        body: JSON.stringify(iterate ? { artifactId: motion?.id, shotIndex: motion?.plan.shots.findIndex((shot) => shot.id === shotId), maxRounds: 2, instruction } : { storyboardId: props.storyboardId, baseId: props.latestId, shotId, instruction, interpreterVersion: shotId && motion?.plan.interpreterVersion !== "3" ? "2" : "3", energyProfile }) });
      if (!response.ok || !response.body) throw new Error("Could not start motion request.");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let id: string | null = null; let stop = "";
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break; buffer += decoder.decode(chunk.value, { stream: true }); let boundary: number;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, boundary)); buffer = buffer.slice(boundary + 1);
            if (event.error) throw new Error(event.error); if (event.message) setMessage(event.message); if (event.runId) id = event.runId;
            if (event.stop) stop = event.stop; if (event.findings) setVisualFindings(JSON.parse(event.findings));
          }
        }
      } finally { await reader.cancel(); reader.releaseLock(); }
      if (!id) throw new Error("Request ended without a saved motion proposal.");
      router.push(`/projects/${props.projectId}/visuals?motion=${id}#motion-review`); router.refresh(); setMessage(iterate ? stop === "no-sampled-findings" ? "No actionable issues found in the sampled frames. Watch the full motion before accepting." : "Visual review stopped with findings below. The saved candidate needs your review." : "Motion proposal saved for explicit review.");
    } catch (failure) { setError(abort.signal.aborted ? "Request cancelled. Check saved history before retrying." : failure instanceof Error ? failure.message : "Motion request failed."); router.refresh(); }
    finally { controller.current = null; setBusy(false); }
  }
  return <section id="motion-review" aria-labelledby="motion-heading" className="mt-12 border-t border-[var(--line)] pt-8">
    <h2 id="motion-heading" className="text-2xl font-semibold">Motion preview</h2>

    {!props.eligible && <p className="mt-4 text-[var(--warning)]">Accept the exact current storyboard to unlock motion proposals.</p>}
    {historical && <p className="mt-4 text-[var(--warning)]">Historical motion. <a href={`/projects/${props.projectId}/visuals#motion-review`}>Return to latest motion</a> before editing.</p>}
    {motion && !props.current && <p className="mt-4 text-[var(--warning)]">This motion is stale or rejected. Earlier previews remain readable; generate from the current accepted storyboard.</p>}
    {motion?.plan.interpreterVersion === "1" && <p className="mt-4 text-sm text-[var(--warning)]">Legacy transition interpretation. New revisions use interpreter 2; request a full plan if old camera, reveal or split-screen presentations need upgrading.</p>}
    <fieldset disabled={busy} className="mt-6 min-w-0">
      <legend className="sr-only">Motion proposal controls</legend>
      <label htmlFor="motion-instruction" className="block text-sm font-semibold">Motion direction</label>
      <textarea id="motion-instruction" maxLength={2000} rows={2} value={instruction} onChange={(event) => setInstruction(event.target.value)} className="mt-2 w-full" />
      <label className="mt-3 block text-sm">Energy for next proposal<select value={energyProfile} onChange={(event) => setEnergyProfile(event.target.value as typeof energyProfile)} className="ml-3"><option value="calm">Calm</option><option value="balanced">Balanced</option><option value="energetic">Energetic</option><option value="intense">Intense — punchy (default for new plans)</option></select></label>
      <p className="mt-2 text-sm text-[var(--muted)]">Review at normal speed for fast impacts, connected reactions and purposeful handoffs. Passing diagnostics alone does not establish energetic animation.</p>
      <p className="mt-2 text-sm text-[var(--muted)]">Energy shapes meaningful actions and emphasis. Reading time and measured narration take priority.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button disabled={!props.eligible || historical || running} onClick={() => generate(null)}>{motion ? "New motion plan" : "Generate motion"}</button>
        {selected && <button disabled={!props.eligible || historical || !props.current || running} onClick={() => generate(selected.id)}>Revise shot</button>}
        {selected && <button disabled={!props.eligible || historical || !props.current || running || instruction.length > 500} onClick={() => generate(selected.id, true)}>Review and improve shot</button>}
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">Visual review samples the selected shot and neighboring boundaries, then makes at most two revisions. Watch the result at normal speed before accepting.</p>
      {instruction.length > 500 && <p className="mt-2 text-sm">Shorten direction to 500 characters to use automatic visual review.</p>}
      {message && <p role="status" className="mt-4 text-sm">{message}</p>}
      {!!visualFindings.length && <ul aria-label="Visual review findings" className="mt-3 space-y-2 text-sm">{visualFindings.map((finding, index) => <li key={index}><button onClick={() => seek(finding.frame)}>Review frame {finding.frame}</button><p>{finding.evidence}</p><p>{finding.suggestion}</p></li>)}</ul>}
      {error && <p role="alert" className="mt-4 text-[var(--error)]">{error}</p>}
      {running && !busy && <p className="mt-4 text-sm">A motion request is running. <a href={`/projects/${props.projectId}/visuals#motion-review`}>Refresh status</a>. Interrupted requests expire after three minutes.</p>}
      {motion && sourceBoard && schedule && <>
        <div role="group" aria-label="Shot timeline" className="relative mt-6 h-14 overflow-hidden border border-[var(--line)]">
          {schedule.shots.map((shot, index) => <button key={shot.shotId} aria-label={`Shot ${index + 1}, ${(shot.startFrame / 30).toFixed(1)} to ${(shot.endFrame / 30).toFixed(1)} seconds`} aria-pressed={selected?.id === shot.shotId}
            onClick={() => { setSelectedId(shot.shotId); seek(shot.startFrame); }} className="absolute h-6 truncate border border-[var(--line)] px-1 text-xs"
            style={{ left: `${shot.startFrame / duration * 100}%`, width: `${shot.durationFrames / duration * 100}%`, top: index % 2 * 26 }}>Shot {index + 1}</button>)}
        </div>
        <div className={`mt-7 grid items-start gap-8 md:grid-cols-2 ${props.original && props.originalBoard ? "xl:grid-cols-3" : ""}`}>
          <figure><figcaption className="mb-3 font-semibold">{decision === "accepted" ? "Accepted motion" : decision === "rejected" ? "Rejected proposal" : "Proposed motion"}</figcaption>
            <div className="max-w-[300px] border border-[var(--line)]"><MotionPlayer artifact={motion} board={sourceBoard} frame={frame} playerRef={primary} onFrame={changedFrame} onReady={setReadyId} narrationUrl={props.production.narration?.motionId === motion.id ? `/api/projects/${props.projectId}/narration/${props.production.narration.id}` : undefined} /></div>
          </figure>
          {props.original && props.originalBoard && props.original.id !== motion.id && <figure><figcaption className="mb-3 font-semibold">Previously accepted · same global frame</figcaption>
            <div className="max-w-[300px] border border-[var(--line)]"><MotionPlayer artifact={props.original} board={props.originalBoard} frame={frame} /></div>
            <p className="mt-2 text-xs text-[var(--muted)]">A shorter version holds its last frame. Changed durations shift downstream timing.</p>
          </figure>}
        {quality && <details className={`min-w-0 border border-[var(--line)] p-4 ${props.original && props.originalBoard ? "md:col-span-2 xl:col-span-1" : ""}`} open={quality.findings.length > 0}>
          <summary className="cursor-pointer font-semibold">Motion Quality · {quality.findings.length} findings</summary>
          <p className="mt-3 text-sm text-[var(--muted)]">Findings guide review. Inspect the moving preview and listen to narration before accepting changes.</p>
          {acceptedQuality && <p className="mt-2 text-sm">Accepted version: {acceptedQuality.findings.length} findings · proposed version: {quality.findings.length} findings</p>}
          <p className="mt-3 text-sm">Preset usage: {Object.entries(quality.presetUsage).map(([preset, count]) => `${preset.split("@")[0].replace(/-/g, " ")} × ${count}`).join(" · ") || "Direct actions"}</p>
          <details className="mt-3 text-sm"><summary>Whole-video rhythm review</summary><p className="my-2">Compare the progression across every scene. Counts guide review; they do not score visual energy or prove causality.</p><ol className="space-y-2">{quality.rhythm.shots.map((shot, index) => <li key={shot.shotId}><button onClick={() => { setSelectedId(shot.shotId); seek(shot.startFrame); }}>Shot {index + 1} · {((shot.endFrame - shot.startFrame + 1) / 30).toFixed(1)}s · {shot.causalBeats} declared causal beats · {shot.developmentGaps} development gaps · {shot.missingReactions} reaction checks</button></li>)}</ol></details>
          {!!props.timingWarnings?.length && <ul className="mt-3 space-y-2 text-sm">{props.timingWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
          <ul className="mt-4 max-h-96 space-y-4 overflow-auto">{quality.findings.map((finding) => <li key={finding.id} className="border-t border-[var(--line)] pt-3 text-sm">
            <p className="font-semibold">{finding.message}</p><p>{(finding.startFrame / 30).toFixed(1)}–{(finding.endFrame / 30).toFixed(1)}s · {finding.heuristic ? "Heuristic review" : "Measured check"}</p>
            <p className="mt-2 text-[var(--muted)]">{finding.evidence}</p><p className="mt-2">{finding.suggestion}</p>
            <button className="mt-2" onClick={() => { setSelectedId(finding.shotId); seek(finding.startFrame); setInstruction(`${finding.message} ${finding.suggestion} Keep the final result readable and preserve unrelated shots.`); }}>Review moment and use suggestion</button>
          </li>)}</ul>
        </details>}
        </div>
        <fieldset disabled={!ready} className="mt-6 min-w-0"><legend className="sr-only">Motion playback controls</legend><div className="flex flex-wrap gap-3">
          <button onClick={() => primary.current?.play()}>Play</button><button onClick={() => { primary.current?.pause(); setLoop(false); }}>Pause</button>
          <button onClick={() => seek(frame - 1)}>Previous frame</button><button onClick={() => seek(frame + 1)}>Next frame</button>
          <button onClick={() => { setFrame(windowStart); primary.current?.seekTo(windowStart); setLoop(true); primary.current?.play(); }}>Loop boundary</button>
        </div>
        <label htmlFor="motion-frame" className="mt-5 block text-sm">Timeline frame {frame} / {duration - 1} · {(frame / 30).toFixed(2)}s</label>
        <input id="motion-frame" type="range" min="0" max={duration - 1} step="1" value={frame} onChange={(event) => seek(Number(event.target.value))} className="mt-2 w-full" />
        <p role="status" className="text-sm">{loop ? `Looping boundary frames ${windowStart}–${windowEnd}` : "Boundary loop off"} · {duration} frames total</p>
        {props.production.narration?.motionId === motion.id && <p className="mt-3 text-sm">Measured narration: {(() => { const line = props.production.narration.timing.find((line) => frame >= line.startFrame && frame < line.endFrame); return line ? `line ${line.number} · ${props.narration.find((item) => item.number === line.number)?.text}` : "pause"; })()}</p>}
        <div className="mt-5 flex flex-wrap gap-3">{motion.plan.shots.map((shot, index) => <button key={shot.id} aria-pressed={selected?.id === shot.id} onClick={() => { setSelectedId(shot.id); seek(schedule.shots[index].startFrame); }}>Shot {index + 1}</button>)}</div></fieldset>
        <details className="mt-6"><summary className="cursor-pointer">Narration links</summary><ol className="mt-3 space-y-2">{props.narration.map((line) => {
          const index = motion.plan.shots.findIndex((shot) => shot.lineNumbers.includes(line.number));
          return <li key={line.number}><button className="text-left text-sm" onClick={() => { setSelectedId(motion.plan.shots[index].id); seek(schedule.shots[index].startFrame); }}>{line.number}. {line.text}</button></li>;
        })}</ol></details>
        {selected && <details className="mt-5"><summary className="cursor-pointer">Selected shot mapping and actions</summary>
          <p className="mt-3 text-sm">{selected.durationFrames} frames · {selected.incoming.type} · {selected.incoming.overlapFrames} overlap frames</p>
          <ul className="mt-3 space-y-2 text-sm">{selected.objects.map((object) => <li key={object.id}>{object.id} · {object.type} · start shape {object.startIndex === null ? "new" : object.startIndex + 1} → end shape {object.endIndex === null ? "removed" : object.endIndex + 1}</li>)}</ul>
          <pre className="mt-4 overflow-auto whitespace-pre-wrap break-all rounded border border-[var(--line)] p-4 text-xs">{JSON.stringify(selected.beats ?? selected.actions, null, 2)}</pre>
        </details>}
        {decision === "pending" && <Decision projectId={props.projectId} id={motion.id} disabled={!props.current || historical} />}
        {decision === "accepted" && <p className="mt-6 text-[var(--ink)]">Motion accepted{props.acceptance?.stale ? " · acceptance is stale" : ""}.</p>}
      </>}
    </fieldset>
    {busy && <button className="mt-4" onClick={() => controller.current?.abort()}>Cancel motion request</button>}
    <details className="mt-7"><summary className="cursor-pointer font-semibold">History ({props.history.length})</summary>
      <ol className="mt-4 space-y-4 text-sm">{props.history.map((item) => <li key={item.id}><p>{item.status} · {item.decision ?? "undecided"} · {item.model}</p>
        {item.status === "complete" && <a href={`/projects/${props.projectId}/visuals?motion=${item.id}#motion-review`}>Review saved motion</a>}{item.error && <p className="mt-2 text-[var(--error)]">{item.error}</p>}
      </li>)}</ol>
    </details>
  </section>;
}
