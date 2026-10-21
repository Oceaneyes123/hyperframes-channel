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
    {state.error && <p role="alert" className="mt-3 text-sm text-[#f5b5a6]">{state.error}</p>}
  </form>;
}

export default function VisualWorkspace(props: Props) {
  const { projectId, script, eligible, concepts, board, chosen } = props; const router = useRouter();
  const [instruction, setInstruction] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const [error, setError] = useState(""); const [selectedLine, setSelectedLine] = useState<number | null>(null);
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
  return <>
    {!eligible && <p role="status" className="mb-6 border border-[#e1ba77] p-4">Accept the current script and research in script review to unlock visual planning. Earlier visual artifacts remain readable.</p>}
    <fieldset disabled={busy || running} className="min-w-0">
      <legend className="sr-only">Visual planning controls</legend>
      <label htmlFor="visual-instruction" className="block text-sm font-semibold">Direction or revision notes</label>
      <textarea id="visual-instruction" maxLength={2000} rows={2} value={instruction} onChange={(event) => setInstruction(event.target.value)} className="mt-2 w-full" placeholder="Optional direction. For a shot revision, describe only the selected shot’s change." />
      <div className="my-5 flex flex-wrap gap-3">
        <button disabled={!eligible} onClick={() => generate("concepts")}>{props.latestConceptId ? "Propose three new concepts" : "Generate three concepts"}</button>
        <button disabled={!eligible || !hasConcept} onClick={() => generate("storyboard")}>{props.latestBoardId ? "Propose new storyboard" : "Generate storyboard"}</button>
      </div>
      {(busy || message) && <p role="status" className="my-4 text-sm">{message}</p>}
      {running && <p role="status" className="my-4">A saved request is running. <a href={`/projects/${projectId}/visuals`}>Refresh its status</a>. Interrupted requests expire after three minutes; retries are explicit.</p>}
      {error && <p role="alert" className="my-4 text-[#f5b5a6]">{error}</p>}
      <section aria-labelledby="concept-heading" className="mt-10">
        <h2 id="concept-heading" className="text-2xl font-semibold">1. Choose a visual concept</h2>
        {concepts && !props.conceptsCurrent && <p className="mt-3 text-[#e1ba77]">Historical or stale concepts. Generate from the current accepted script.</p>}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {concepts?.output.kind === "concepts" && concepts.output.concepts.map((concept, index) => <article key={`${concepts.id}:${index}`} className="min-w-0 rounded border border-white/15 p-5">
            <h3 className="mb-4 text-xl font-semibold">{index + 1}. {concept.title}</h3>
            <div className="mx-auto max-w-[220px]"><PlanningFrame frame={concept.frame} label={`${concept.title}: representative planning image`} /></div>
            <p className="mt-4 font-semibold">{concept.metaphor}</p><p className="mt-3 text-sm leading-relaxed">{concept.teachingApproach}</p>
            <p className="mt-3 text-sm text-[#aeb4b0]">{concept.visualLanguage}</p>
            <Decision projectId={projectId} runId={concepts.id} optionIndex={index} selectionId={chosen?.id} disabled={!eligible || !props.conceptsCurrent || chosen?.runId === concepts.id && chosen.optionIndex === index}>
              {chosen?.runId === concepts.id && chosen.optionIndex === index ? "Selected concept" : `Choose concept ${index + 1}`}
            </Decision>
          </article>)}
        </div>
        {!concepts && <p className="mt-4 text-[#aeb4b0]">No visual concepts yet.</p>}
      </section>
      <section aria-labelledby="board-heading" className="mt-12">
        <h2 id="board-heading" className="text-2xl font-semibold">2. Review the storyboard</h2>
        {board && <>
          <p className="mt-3 text-sm">{shots.length} shots · {shots.reduce((total, shot) => total + shot.seconds, 0).toFixed(1)} seconds estimated</p>
          {!props.boardCurrent && <p className="mt-3 text-[#e1ba77]">Historical or stale storyboard. Script, research, concept choice or latest proposal has changed.</p>}
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[16rem_1fr]">
            <aside className="lg:sticky lg:top-6"><h3 className="font-semibold">Narration → shot</h3>
              <p className="mt-2 text-xs text-[#aeb4b0]">Click a line to find its shot. Historical boards retain their original narration references.</p>
              {board.scriptId === script?.id ? <ol className="mt-4 space-y-2">{scriptLines(script.content).map((line) => {
                const index = shots.findIndex((shot) => shot.lineNumbers.includes(line.number));
                return <li key={line.number}><a href={`#shot-${index}`} onClick={() => setSelectedLine(line.number)} className="block border-l border-white/20 py-2 pl-3 text-sm leading-relaxed">{line.number}. {line.text}</a></li>;
              })}</ol> : <p className="mt-4 text-sm">This board belongs to an earlier script. <a href={`/projects/${projectId}?revision=${board.scriptId}`}>Read that revision</a>.</p>}
            </aside>
            <div className="space-y-8">{shots.map((shot, index) => <article id={`shot-${index}`} key={`${board.id}:${index}`} className={`scroll-mt-6 rounded border p-5 ${selectedLine !== null && shot.lineNumbers.includes(selectedLine) ? "border-[#b9d8c2]" : "border-white/15"}`}>
              <h3 className="text-xl font-semibold">Shot {index + 1} · {shot.seconds}s</h3>
              <p className="mt-2 text-sm text-[#aeb4b0]">Narration lines {shot.lineNumbers.join(", ")} · {shot.transition}</p>
              <p className="mt-4 font-semibold">{shot.purpose}</p>
              <div className="mt-5 grid grid-cols-2 gap-4">{[shot.startFrame, shot.endFrame].map((frame, frameIndex) => <figure key={frameIndex} className="mx-auto w-full max-w-[210px]">
                <PlanningFrame frame={frame} label={`Shot ${index + 1}, ${frameIndex ? "end" : "start"} planning state`} /><figcaption className="mt-2 text-center text-xs">{frameIndex ? "End state" : "Start state"}</figcaption>
              </figure>)}</div>
              <dl className="mt-5 space-y-3 text-sm leading-relaxed">
                <div><dt className="font-semibold">Framing / subject</dt><dd>{shot.framing} · {shot.subject}</dd></div>
                <div><dt className="font-semibold">Action</dt><dd>{shot.action}</dd></div>
                <div><dt className="font-semibold">Connection from previous shot</dt><dd>{shot.continuity}</dd></div>
              </dl>
              <button className="mt-5" disabled={!eligible || !props.boardCurrent} onClick={() => generate("shot", index)}>Revise shot {index + 1} only</button>
            </article>)}</div>
          </div>
          <Decision projectId={projectId} runId={board.id} disabled={!eligible || !props.boardCurrent || props.acceptance?.runId === board.id && !props.acceptance.stale}>
            {props.acceptance?.runId === board.id && !props.acceptance.stale ? "Exact storyboard accepted" : "Accept this exact storyboard"}
          </Decision>
          {props.acceptance?.stale && <p className="mt-3 text-[#e1ba77]">Earlier storyboard acceptance is stale. Review the current proposal before accepting again.</p>}
        </>}
        {!board && <p className="mt-4 text-[#aeb4b0]">Choose a concept before requesting the shot sequence.</p>}
      </section>
    </fieldset>
    <details className="mt-10 border-t border-white/15 pt-5"><summary className="cursor-pointer font-semibold">Visual request history ({props.history.length})</summary>
      <ol className="mt-5 space-y-4 text-sm">{props.history.map((item) => <li key={item.id}>
        <p>{item.kind} · {item.status} · <time dateTime={item.createdAt}>{item.createdAt}</time> · {item.model}</p>
        {item.status === "complete" && <a href={`/projects/${projectId}/visuals?run=${item.id}`}>Review saved proposal</a>}
        {item.error && <p className="mt-2 text-[#f5b5a6]">{item.error}</p>}
      </li>)}</ol>
    </details>
  </>;
}
