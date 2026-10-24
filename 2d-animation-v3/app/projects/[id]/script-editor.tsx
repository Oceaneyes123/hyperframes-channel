"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveScript } from "../../actions";
import type { ScriptRevision } from "../../../workflow/project.ts";
import { ScriptAcceptance, ProposalReview, type Review } from "./script-review";

export default function ScriptEditor({ projectId, revision, accepted, review }: {
  projectId: string; revision: ScriptRevision | null; accepted: boolean; review: Review | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState(revision?.content ?? "");
  const [state, action, pending] = useActionState(saveScript.bind(null, projectId), {
    parentId: revision?.id ?? null, savedContent: revision?.content ?? "", error: "", message: "",
  });
  const dirty = content !== state.savedContent;
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [instruction, setInstruction] = useState("");
  const [working, setWorking] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [progress, setProgress] = useState("");
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function requestChanges(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!revision || dirty || working || pending || reviewBusy) return;
    setWorking(true); setProgress("Starting writing request…");
    try {
      const response = await fetch(`/api/projects/${projectId}/revise`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseId: state.parentId, ...selection, instruction }),
      });
      if (!response.ok || !response.body) throw new Error();
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let finished = false;
      try {
        while (true) {
          const part = await reader.read(); if (part.done) break;
          buffer += decoder.decode(part.value, { stream: true });
          let boundary: number;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const message = JSON.parse(buffer.slice(0, boundary)); buffer = buffer.slice(boundary + 1);
            if (message.error) { setProgress(message.error); finished = true; router.refresh(); }
            if (message.message) setProgress(message.message);
            if (typeof message.proposalId === "string") {
              finished = true;
              router.push(`/projects/${projectId}?proposal=${encodeURIComponent(message.proposalId)}`);
            }
          }
        }
        if (!finished) throw new Error();
      } finally { await reader.cancel(); reader.releaseLock(); }
    } catch { setProgress("Request failed or disconnected. Reload to inspect saved request history before retrying."); }
    finally { setWorking(false); }
  }

  return (
    <div className="space-y-8">
    <form action={action} className="space-y-4">
      <label htmlFor="content" className="block font-semibold">Script draft</label>
      <textarea id="content" name="content" value={content} onChange={(event) => setContent(event.target.value)}
        onSelect={(event) => setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd })}
        rows={14} required maxLength={50_000} readOnly={pending || working || reviewBusy} aria-describedby="script-status"
        className="w-full resize-y leading-relaxed" />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || working || reviewBusy || !dirty || !content.trim()}>{pending ? "Saving…" : "Save revision"}</button>
        <p id="script-status" role="status" className="text-sm text-[var(--muted)]">
          {dirty ? "Unsaved changes" : state.message || "Saved"}
        </p>
      </div>
      {state.error && <p role="alert" className="text-[var(--error)]">{state.error}</p>}
    </form>
    {revision && <>
      <ScriptAcceptance projectId={projectId} revisionId={revision.id} disabled={dirty || pending || working || reviewBusy} accepted={accepted} onBusyChange={setReviewBusy} />
      <form onSubmit={requestChanges} className="space-y-4 border-t border-[var(--line)] pt-6">
        <h2 className="text-xl font-semibold">Revise selection</h2>
        <p className="text-sm text-[var(--muted)]">Select saved text to revise.</p>
        <p className="text-sm" role="status">{dirty ? "Save your draft before requesting or accepting changes." : selection.end > selection.start ? `Selected ${selection.end - selection.start} characters.` : "No text selected."}</p>
        {selection.end > selection.start && <blockquote className="max-h-40 overflow-y-auto whitespace-pre-wrap border-l-2 border-[var(--ink)] pl-4">{content.slice(selection.start, selection.end)}</blockquote>}
        <label htmlFor="instruction" className="block font-semibold">Revision instruction</label>
        <textarea id="instruction" rows={3} required maxLength={2_000} value={instruction} onChange={(event) => setInstruction(event.target.value)} readOnly={working} className="w-full" />
        <button disabled={dirty || pending || working || reviewBusy || selection.end <= selection.start || !instruction.trim()}>{working ? "Writing…" : "Request AI revision"}</button>
        <p role="status" className="text-sm text-[var(--muted)]">{progress}</p>
      </form>
      {review && <ProposalReview key={review.proposal.id} projectId={projectId} review={review} latestId={revision.id} disabled={dirty || pending || working || reviewBusy} onBusyChange={setReviewBusy} />}
    </>}
    </div>
  );
}
