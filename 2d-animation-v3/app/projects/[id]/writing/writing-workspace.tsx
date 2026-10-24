"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { importWritingDraft, saveResearchBrief } from "../../../actions";
import type { WritingArtifact, WritingBrief } from "../../../../workflow/scriptwriting.ts";

type Run = { id: string; kind: "brief" | "hooks" | "draft"; status: "running" | "complete" | "failed"; error: string | null; importedRevisionId: string | null; model: string | null; createdAt: string };
const blank: WritingBrief = {
  topic: "", audience: "Beginners", viewerProblem: "", payoff: "", format: "explainer", targetSeconds: 60,
  boundaries: "No unsupported claims or income promises. Label hypothetical examples and retain important limitations.",
  sources: [{ id: "source-1", title: "", url: "", notes: "" }],
  claims: [{ id: "claim-1", statement: "", sourceIds: ["source-1"], caveat: "" }],
};

export default function WritingWorkspace({ projectId, briefId, brief: saved, selected, current, runs }: {
  projectId: string; briefId: string | null; brief: WritingBrief | null; selected: WritingArtifact | null; parent: WritingArtifact | null; current: boolean; runs: Run[];
}) {
  const router = useRouter();
  const [brief, setBrief] = useState<WritingBrief>(saved ?? blank);
  const [instruction, setInstruction] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [state, save, saving] = useActionState(saveResearchBrief.bind(null, projectId), { error: "" });
  const [importState, importDraft, importing] = useActionState(importWritingDraft.bind(null, projectId), { error: "" });
  const dirty = JSON.stringify(brief) !== JSON.stringify(saved ?? blank);
  const busy = working || saving || importing;
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function generate(kind: "hooks" | "draft", parentId: string, hookId?: string) {
    if (busy || dirty) return;
    setWorking(true); setMessage("Starting writing request…");
    try {
      const response = await fetch(`/api/projects/${projectId}/writing`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, parentId, instruction, ...(hookId ? { hookId } : {}) }) });
      if (!response.ok || !response.body) throw new Error();
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let finished = false;
      try {
        while (true) {
          const part = await reader.read(); if (part.done) break;
          buffer += decoder.decode(part.value, { stream: true }); let boundary: number;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, boundary)); buffer = buffer.slice(boundary + 1);
            if (event.message) setMessage(event.message);
            if (event.error) { setMessage(event.error); finished = true; router.refresh(); }
            if (typeof event.runId === "string") { finished = true; setMessage("Result saved for your review."); router.push(`/projects/${projectId}/writing?run=${encodeURIComponent(event.runId)}#result-heading`); }
          }
        }
        if (!finished) throw new Error();
      } finally { await reader.cancel(); reader.releaseLock(); }
    } catch { setMessage("Request failed or disconnected. Reload saved history before retrying."); }
    finally { setWorking(false); }
  }
  const output = selected?.output;
  return <div className="space-y-10">
    <section aria-labelledby="brief-heading" className="border-b border-[var(--line)] pb-8">
      <h2 id="brief-heading" className="mb-4 text-2xl font-semibold">Brief</h2>

      {saved && <p className="mb-4">{saved.topic} · {saved.payoff}</p>}
      <details open={!briefId}><summary className="mb-5 cursor-pointer text-[var(--ink)]">{briefId ? "Edit brief" : "Add brief"}</summary>
      <form action={save} className="space-y-5">
        <input type="hidden" name="brief" value={JSON.stringify(brief)} />
        <input type="hidden" name="expectedBriefId" value={briefId ?? ""} />
        <fieldset disabled={busy} className="space-y-5">
          {([
            ["topic", "Topic", 300], ["audience", "Intended viewer", 300], ["viewerProblem", "Viewer problem", 1_000],
            ["payoff", "Concrete payoff", 1_000], ["boundaries", "Limits and claims to avoid", 2_000],
          ] as const).map(([key, label, maxLength]) => <label key={key} className="block space-y-2"><span className="block font-semibold">{label}</span>
            <textarea rows={key === "boundaries" ? 3 : 2} required maxLength={maxLength} value={brief[key]} onChange={(event) => setBrief({ ...brief, [key]: event.target.value })} className="w-full" />
          </label>)}
          <div className="flex flex-wrap gap-6">
            <label className="space-y-2"><span className="block font-semibold">Video format</span>
              <select value={brief.format} onChange={(event) => setBrief({ ...brief, format: event.target.value as WritingBrief["format"] })} className="border border-[var(--line)] bg-[var(--surface)] p-3">
                <option value="explainer">Explainer</option><option value="tutorial">Tutorial</option>
              </select>
            </label>
            <label className="space-y-2"><span className="block font-semibold">Target seconds</span>
              <input type="number" min={15} max={180} required value={brief.targetSeconds} onChange={(event) => setBrief({ ...brief, targetSeconds: Number(event.target.value) })} />
            </label>
          </div>
          <h3 className="pt-4 text-xl font-semibold">Sources</h3>
          {brief.sources.map((source, index) => <fieldset key={source.id} className="space-y-3 border border-[var(--line)] p-5"><legend className="px-2">Source {index + 1}</legend>
            {([ ["title", "Title", 200], ["url", "URL", 2_000], ["notes", "Checked source notes", 4_000] ] as const).map(([field, label, maxLength]) => <label key={field} className="block space-y-2"><span className="block">{label} · Source {index + 1}</span>
              <textarea rows={field === "notes" ? 4 : 1} required maxLength={maxLength} value={source[field]} onChange={(event) => setBrief({ ...brief, sources: brief.sources.map((item) => item.id === source.id ? { ...item, [field]: event.target.value } : item) })} className="w-full" />
            </label>)}
            <button type="button" disabled={brief.sources.length === 1} onClick={() => setBrief({ ...brief, sources: brief.sources.filter((item) => item.id !== source.id), claims: brief.claims.map((claim) => ({ ...claim, sourceIds: claim.sourceIds.filter((id) => id !== source.id) })) })}>Remove source {index + 1}</button>
          </fieldset>)}
          <button type="button" disabled={brief.sources.length >= 12} onClick={() => setBrief({ ...brief, sources: [...brief.sources, { id: `source-${crypto.randomUUID().slice(0, 8)}`, title: "", url: "", notes: "" }] })}>Add source</button>
          <h3 className="pt-4 text-xl font-semibold">Supported claims</h3>
          {brief.claims.map((claim, index) => <fieldset key={claim.id} className="space-y-3 border border-[var(--line)] p-5"><legend className="px-2">Claim {index + 1} · {claim.id}</legend>
            <label className="block space-y-2"><span className="block">Statement · Claim {index + 1}</span>
              <textarea required rows={2} maxLength={1_000} value={claim.statement} onChange={(event) => setBrief({ ...brief, claims: brief.claims.map((item) => item.id === claim.id ? { ...item, statement: event.target.value } : item) })} className="w-full" />
            </label>
            <button type="button" disabled={brief.claims.length === 1} onClick={() => setBrief({ ...brief, claims: brief.claims.filter((item) => item.id !== claim.id) })}>Remove claim {index + 1}</button>
            <fieldset className="space-y-2"><legend className="mb-2">Supported by</legend>
              {brief.sources.map((source, sourceIndex) => <label key={source.id} className="mr-5 inline-flex items-center gap-2">
                <input type="checkbox" checked={claim.sourceIds.includes(source.id)} onChange={(event) => setBrief({ ...brief, claims: brief.claims.map((item) => item.id === claim.id ? { ...item, sourceIds: event.target.checked ? [...item.sourceIds, source.id] : item.sourceIds.filter((id) => id !== source.id) } : item) })} />Source {sourceIndex + 1}
              </label>)}
            </fieldset>
            <label className="block space-y-2"><span className="block">Important caveat · Claim {index + 1}</span>
              <textarea rows={2} maxLength={1_000} value={claim.caveat} onChange={(event) => setBrief({ ...brief, claims: brief.claims.map((item) => item.id === claim.id ? { ...item, caveat: event.target.value } : item) })} className="w-full" />
            </label>
          </fieldset>)}
          <button type="button" disabled={brief.claims.length >= 20} onClick={() => setBrief({ ...brief, claims: [...brief.claims, { id: `claim-${crypto.randomUUID().slice(0, 8)}`, statement: "", caveat: "", sourceIds: [] }] })}>Add supported claim</button>
          <p><button disabled={!dirty || busy}>{saving ? "Saving brief…" : "Save research brief"}</button></p>
        </fieldset>
        {state.error && <p role="alert">{state.error}</p>}
      </form>
      </details>
    </section>
    <section aria-labelledby="generate-heading" className="space-y-4">
      <h2 id="generate-heading" className="text-2xl font-semibold">Writing</h2>
      <label className="block space-y-2"><span className="block">Direction (optional)</span>
        <textarea rows={3} maxLength={2_000} value={instruction} disabled={busy} onChange={(event) => setInstruction(event.target.value)} className="w-full" />
      </label>

      <button disabled={!briefId || dirty || busy} onClick={() => briefId && generate("hooks", briefId)}>Generate hooks</button>
      <p role="status">{dirty ? "Save brief changes before generating or importing results." : message}</p>
    </section>
    {selected && <section aria-labelledby="result-heading" className="space-y-5 border-t border-[var(--line)] pt-8">
      <h2 id="result-heading" className="text-2xl font-semibold">Saved {output?.kind} result</h2>
      {!current && <p role="status">A newer research brief exists. This result is read-only.</p>}
      {output?.kind === "brief" && <div className="space-y-3"><h3 className="text-xl font-semibold">{output.brief.topic}</h3><p>{output.brief.payoff}</p>
        {output.brief.sources.map((source) => <p key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>: {source.notes}</p>)}
      </div>}
      {output?.kind === "hooks" && <div className="grid gap-5 lg:grid-cols-2">{output.hooks.map((hook, index) => <article key={hook.id} className="space-y-3 border border-[var(--line)] p-5">
        <h3 className="text-xl font-semibold">Hook {index + 1}: {hook.angle}</h3><p className="text-lg">{hook.spoken}</p>
        <details><summary>Hook details</summary><p className="mt-3"><strong>Opening visual:</strong> {hook.openingVisual}</p>{hook.overlay && <p><strong>Suggested overlay:</strong> {hook.overlay}</p>}
        <p><strong>Payoff connection:</strong> {hook.payoffConnection}</p><p className="text-sm text-[var(--muted)]">Evidence: {hook.claimIds.join(", ")}</p></details>
        <button disabled={busy || dirty || !current} onClick={() => generate("draft", selected.id, hook.id)}>Choose hook {index + 1} and write draft</button>
      </article>)}</div>}
      {output?.kind === "draft" && <>
        <div className="grid gap-6 lg:grid-cols-2">{([["Writer draft", output.original], ["Refined narration", output.refined]] as const).map(([label, script]) => <section key={label} aria-label={label}>
          <h3 className="mb-4 text-xl font-semibold">{label}</h3><ol className="list-inside list-decimal space-y-3 border border-[var(--line)] p-5">{script.lines.map((line, index) => <li key={index}><span>{line.text}</span><span className="mt-1 block text-xs text-[var(--muted)]">Evidence: {line.claimIds.join(", ") || "connective line"}</span></li>)}</ol>
        </section>)}</div>
        <h3 className="text-xl font-semibold">Editorial review · {output.review.verdict === "ready" ? "Ready for your review" : "Revision needed"}</h3>
        <p>{output.review.summary}</p><ul className="space-y-4">{output.review.findings.map((finding, index) => <li key={index}><strong>{finding.line ? `Line ${finding.line}` : "Whole script"}:</strong> {finding.reason}<p>Suggested change: {finding.change}</p></li>)}</ul>
        {output.review.verdict === "ready" && <form action={importDraft} className="space-y-3">
          <input type="hidden" name="runId" value={selected.id} />
          <button disabled={busy || dirty || !current || !!runs.find((run) => run.id === selected.id)?.importedRevisionId}>Use reviewed draft</button>

          {importState.error && <p role="alert">{importState.error}</p>}
        </form>}
        {output.review.verdict === "revise" && <p>Address the findings in your brief or writing direction, then choose the hook again to request a new draft.</p>}
        <details><summary>Installed skill evidence</summary><ul className="mt-3 space-y-2 break-all text-xs">{output.skills.map((skill) => <li key={skill.name}>{skill.name}: {skill.sha256}</li>)}</ul></details>
      </>}
    </section>}
    <details className="border-t border-[var(--line)] pt-6"><summary>Writing history ({runs.length})</summary>

      <ol className="space-y-4">{runs.map((run) => <li key={run.id}>{run.status === "complete" ? <a href={`/projects/${projectId}/writing?run=${run.id}`}>{run.kind} · {run.status}</a> : <span>{run.kind} · {run.status}</span>}
        {run.model && <span className="ml-3 text-sm text-[var(--muted)]">{run.model}</span>}{run.error && <p className="mt-2">{run.error}</p>}
        {run.importedRevisionId && <p><a href={`/projects/${projectId}?revision=${run.importedRevisionId}`}>Imported script revision</a></p>}
      </li>)}</ol>
    </details>
  </div>;
}
