"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { decideVisual } from "../../../actions.ts";
import { scriptLines, type VisualArtifact } from "../../../../workflow/visuals.ts";
import type { ScriptRevision } from "../../../../workflow/project.ts";
import PlanningFrame from "./frame";

type Props = {
  projectId: string; script: ScriptRevision | null; eligible: boolean; concepts: VisualArtifact | null; board: VisualArtifact | null;
  conceptsCurrent: boolean; boardCurrent: boolean; latestConceptId: string | null; latestBoardId: string | null;
  chosen: { id: string; runId: string; optionIndex: number } | null;
  acceptance: { runId: string; acceptedAt: string; stale: boolean } | null;
  history: { id: string; kind: string; status: string; error: string | null; model: string; createdAt: string }[];
};

function Decision({ projectId, runId, optionIndex, selectionId, disabled, children }: {
  projectId: string; runId: string; optionIndex?: number; selectionId?: string; disabled: boolean; children: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(decideVisual.bind(null, projectId), { error: "" });
  return <form action={action} className="mt-5">
    <input type="hidden" name="runId" value={runId} /><input type="hidden" name="decision" value={optionIndex === undefined ? "accept" : "choose"} />
    <input type="hidden" name="optionIndex" value={optionIndex ?? ""} /><input type="hidden" name="selectionId" value={selectionId ?? ""} />
    <button disabled={disabled || pending}>{pending ? "Saving…" : children}</button>
    {state.error && <p role="alert" className="mt-3 text-sm text-[var(--error)]">{state.error}</p>}
  </form>;
}

export default function VisualWorkspace(props: Props) {
  const { projectId, script, eligible, concepts, board, chosen } = props; const router = useRouter();
  const [instruction, setInstruction] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const [error, setError] = useState(""); const [selectedShot, setSelectedShot] = useState(0);
  const running = props.history.some((item) => item.status === "running");
  const hasConcept = props.conceptsCurrent && !!chosen && chosen.runId === props.latestConceptId;
  async function generate(kind: "concepts" | "storyboard" | "shot", shotIndex: number | null = null) {
    if (!script) return; setBusy(true); setError(""); setMessage("Starting visual request…");
    try {
      const response = await fetch(`/api/projects/${projectId}/visuals`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        kind, scriptId: script.id, selectionId: kind === "concepts" ? null : chosen?.id ?? null,
        baseId: kind === "concepts" ? props.latestConceptId : props.latestBoardId, shotIndex, instruction,
      }) });
      if (!response.ok || !response.body) throw new Error("Could not start visual request.");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let result: string | null = null;
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break; buffer += decoder.decode(chunk.value, { stream: true });
          let boundary: number;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, boundary)); buffer = buffer.slice(boundary + 1);
            if (event.error) throw new Error(event.error); if (event.message) setMessage(event.message); if (event.runId) result = event.runId;
          }
        }
      } finally { await reader.cancel(); reader.releaseLock(); }
      if (!result) throw new Error("Request ended without a saved visual proposal.");
      router.push(`/projects/${projectId}/visuals?run=${result}`); router.refresh(); setMessage("Visual proposal saved for review.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Visual request failed."); router.refresh(); }
    finally { setBusy(false); }
  }
  const shots = board?.output.kind === "storyboard" ? board.output.shots : [];
  const shotIndex = Math.min(selectedShot, shots.length - 1);
  const shot = shots[shotIndex];
  return <>
    {!eligible && <p role="status" className="mb-6 border border-[var(--warning)] p-4">Accept the current script to unlock visual planning.</p>}
    <fieldset disabled={busy || running} className="min-w-0">
      <legend className="sr-only">Visual planning controls</legend>
      <details open={!board}>
      <summary>Create or revise</summary>
      <label htmlFor="visual-instruction" className="block text-sm font-semibold">Direction (optional)</label>
      <textarea id="visual-instruction" maxLength={2000} rows={2} value={instruction} onChange={(event) => setInstruction(event.target.value)} className="mt-2 w-full" placeholder="Describe a direction or a change…" />
      <div className="my-5 flex flex-wrap gap-3">
        <button disabled={!eligible} onClick={() => generate("concepts")}>{props.latestConceptId ? "New concepts" : "Generate concepts"}</button>
        <button className="secondary" disabled={!eligible || !hasConcept} onClick={() => generate("storyboard")}>{props.latestBoardId ? "New storyboard" : "Create storyboard"}</button>
      </div>
      </details>
      {(busy || message) && <p role="status" className="my-4 text-sm">{message}</p>}
      {running && <p role="status" className="my-4">Request running. <a href={`/projects/${projectId}/visuals`}>Refresh its status</a>.</p>}
      {error && <p role="alert" className="my-4 text-[var(--error)]">{error}</p>}
      <details className="mt-8" open={!board}>
        <summary id="concept-heading" className="font-semibold">Concepts{chosen && concepts?.output.kind === "concepts" && chosen.runId === concepts.id ? ` · ${concepts.output.concepts[chosen.optionIndex].title}` : ""}</summary>
        {concepts && !props.conceptsCurrent && <p className="mt-3 text-[var(--warning)]">Historical or stale concepts. Generate from the current accepted script.</p>}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {concepts?.output.kind === "concepts" && concepts.output.concepts.map((concept, index) => <article key={`${concepts.id}:${index}`} className="min-w-0 rounded border border-[var(--line)] p-5">
            <h3 className="mb-4 text-xl font-semibold">{index + 1}. {concept.title}</h3>
            <div className="mx-auto max-w-[220px]"><PlanningFrame frame={concept.frame} label={`${concept.title}: representative planning image`} /></div>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer">Concept details</summary>
              <p className="mt-3">{concept.metaphor}</p><p className="mt-3 leading-relaxed">{concept.teachingApproach}</p>
              <p className="mt-3 text-[var(--muted)]">{concept.visualLanguage}</p>
            </details>
            <Decision projectId={projectId} runId={concepts.id} optionIndex={index} selectionId={chosen?.id} disabled={!eligible || !props.conceptsCurrent || chosen?.runId === concepts.id && chosen.optionIndex === index}>
              {chosen?.runId === concepts.id && chosen.optionIndex === index ? "Selected" : "Choose concept"}
            </Decision>
          </article>)}
        </div>
        {!concepts && <p className="mt-4 text-[var(--muted)]">No visual concepts yet.</p>}
      </details>
      <section aria-labelledby="board-heading" className="mt-12">
        <h2 id="board-heading" className="text-xl font-semibold">Storyboard</h2>
        {board && <>
          <p className="mt-3 text-sm">{shots.length} shots · {shots.reduce((total, shot) => total + shot.seconds, 0).toFixed(1)} seconds estimated</p>
          {!props.boardCurrent && <p className="mt-3 text-[var(--warning)]">Historical or stale storyboard. Script, research, concept choice or latest proposal has changed.</p>}
          <nav aria-label="Storyboard shots" className="shot-strip mt-5">
            {shots.map((shot, index) => <button key={`${board.id}:${index}`} aria-label={`View shot ${index + 1}`} aria-pressed={shotIndex === index} onClick={() => setSelectedShot(index)}>
              <PlanningFrame frame={shot.startFrame} label={`Shot ${index + 1} thumbnail`} />
              <span className="mt-1 block">{String(index + 1).padStart(2, "0")}</span>
            </button>)}
          </nav>
          {shot && <article id={`shot-${shotIndex}`} key={board.id} className="shot-viewer mt-3">
            <div className="section-toolbar">
              <h3 className="text-base font-semibold">Shot {shotIndex + 1} <span className="ml-2 text-xs font-normal text-[var(--muted)]">{shot.seconds.toFixed(1)}s · {shot.transition}</span></h3>
              <div className="flex gap-2">
                <button className="secondary" aria-label="Previous shot" disabled={shotIndex === 0} onClick={() => setSelectedShot(shotIndex - 1)}>Previous</button>
                <button className="secondary" aria-label="Next shot" disabled={shotIndex === shots.length - 1} onClick={() => setSelectedShot(shotIndex + 1)}>Next</button>
              </div>
            </div>
            <div className="shot-frames">{[shot.startFrame, shot.endFrame].map((frame, frameIndex) => <figure key={frameIndex}>
              <PlanningFrame frame={frame} label={`Shot ${shotIndex + 1}, ${frameIndex ? "end" : "start"} planning state`} /><figcaption>{frameIndex ? "End" : "Start"}</figcaption>
            </figure>)}</div>
            <div className="shot-caption">
              {board.scriptId === script?.id ? <p>{scriptLines(script.content).filter((line) => shot.lineNumbers.includes(line.number)).map((line) => line.text).join(" ")}</p> : <a href={`/projects/${projectId}?revision=${board.scriptId}`}>Read original narration</a>}
            </div>
            <details className="border-t border-[var(--line)] pt-4">
              <summary className="text-sm">Shot details</summary>
              <dl className="space-y-3 text-sm leading-relaxed">
                <div><dt className="font-semibold">Purpose</dt><dd>{shot.purpose}</dd></div>
                <div><dt className="font-semibold">Framing / subject</dt><dd>{shot.framing} · {shot.subject}</dd></div>
                <div><dt className="font-semibold">Action</dt><dd>{shot.action}</dd></div>
                <div><dt className="font-semibold">Continuity</dt><dd>{shot.continuity}</dd></div>
              </dl>
            </details>
            <button className="secondary mt-5" disabled={!eligible || !props.boardCurrent} onClick={() => generate("shot", shotIndex)}>Revise shot {shotIndex + 1}</button>
          </article>}
          <Decision projectId={projectId} runId={board.id} disabled={!eligible || !props.boardCurrent || props.acceptance?.runId === board.id && !props.acceptance.stale}>
            {props.acceptance?.runId === board.id && !props.acceptance.stale ? "Storyboard accepted" : "Accept storyboard"}
          </Decision>
          {props.acceptance?.stale && <p className="mt-3 text-[var(--warning)]">Storyboard changed. Review and accept again.</p>}
        </>}
        {!board && <p className="mt-4 text-[var(--muted)]">Choose a concept to create a storyboard.</p>}
      </section>
    </fieldset>
    <details className="mt-10 border-t border-[var(--line)] pt-5"><summary className="cursor-pointer font-semibold">History ({props.history.length})</summary>
      <ol className="mt-5 space-y-4 text-sm">{props.history.map((item) => <li key={item.id}>
        <p>{item.kind} · {item.status} · <time dateTime={item.createdAt}>{item.createdAt}</time> · {item.model}</p>
        {item.status === "complete" && <a href={`/projects/${projectId}/visuals?run=${item.id}`}>Review saved proposal</a>}
        {item.error && <p className="mt-2 text-[var(--error)]">{item.error}</p>}
      </li>)}</ol>
    </details>
  </>;
}
