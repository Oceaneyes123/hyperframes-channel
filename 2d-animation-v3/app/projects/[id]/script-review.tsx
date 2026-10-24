"use client";

import { useActionState } from "react";
import { acceptScript, decideProposal } from "../../actions";
import type { ScriptProposal } from "../../../workflow/review.ts";

export type Review = { proposal: ScriptProposal; base: string; status: "pending" | "accepted" | "rejected"; resultId: string | null };

export function ScriptAcceptance({ projectId, revisionId, disabled, accepted, onBusyChange }: {
  projectId: string; revisionId: string; disabled: boolean; accepted: boolean; onBusyChange: (busy: boolean) => void;
}) {
  const [state, action, pending] = useActionState(async (previous: { error: string }, form: FormData) => {
    onBusyChange(true);
    try { return await acceptScript(projectId, previous, form); } finally { onBusyChange(false); }
  }, { error: "" });
  return <form action={action} className="space-y-3 border-t border-[var(--line)] pt-5">
    <input type="hidden" name="revisionId" value={revisionId} />
    <button disabled={disabled || pending || accepted}>{accepted ? "Script accepted" : pending ? "Accepting…" : "Accept saved script"}</button>
    {state.error && <p role="alert">{state.error}</p>}
  </form>;
}

export function ProposalReview({ projectId, review, latestId, disabled, onBusyChange }: {
  projectId: string; review: Review; latestId: string; disabled: boolean; onBusyChange: (busy: boolean) => void;
}) {
  const { proposal, base } = review;
  const [state, action, pending] = useActionState(async (previous: { error: string }, form: FormData) => {
    onBusyChange(true);
    try { return await decideProposal(projectId, proposal.id, previous, form); } finally { onBusyChange(false); }
  }, { error: "" });
  const { start, end } = proposal.request;
  const stale = proposal.request.baseId !== latestId;
  return <section aria-labelledby="proposal-heading" className="space-y-5 border-t border-[var(--line)] pt-6">
    <h2 id="proposal-heading" className="text-xl font-semibold">Proposed revision · {review.status}</h2>
    <p className="text-sm text-[var(--muted)]">Instruction: {proposal.request.instruction}</p>
    <p className="text-sm text-[var(--muted)]">{proposal.notes}</p>
    <div className="grid gap-5 xl:grid-cols-2">
      <section aria-label="Original script"><h3 className="mb-3 font-semibold">Original</h3>
        <pre className="whitespace-pre-wrap break-words border border-[var(--line)] p-4 font-sans leading-relaxed">{base.slice(0, start)}<del className="bg-[var(--error)]/15 no-underline">{base.slice(start, end)}</del>{base.slice(end)}</pre>
      </section>
      <section aria-label="Proposed script"><h3 className="mb-3 font-semibold">Proposed</h3>
        <pre className="whitespace-pre-wrap break-words border border-[var(--line)] p-4 font-sans leading-relaxed">{base.slice(0, start)}<ins className="bg-[var(--selected)] no-underline">{proposal.replacement}</ins>{base.slice(end)}</pre>
      </section>
    </div>
    {stale && review.status === "pending" && <p role="status">A newer script exists. This proposal cannot be accepted; request a revision from the latest script.</p>}
    {review.status === "pending" && <form action={action} className="flex flex-wrap gap-3">
      <button name="decision" value="accept" disabled={disabled || pending || stale}>Accept proposal</button>
      <button name="decision" value="reject" disabled={disabled || pending}>Reject proposal</button>
      {state.error && <p role="alert" className="w-full">{state.error}</p>}
    </form>}
    {review.resultId && <p>Accepted as a <a href={`/projects/${projectId}?revision=${review.resultId}`}>saved revision</a>.</p>}
  </section>;
}
