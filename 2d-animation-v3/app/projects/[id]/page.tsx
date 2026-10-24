import WorkspaceHeader from "../../workspace-header";
import { notFound } from "next/navigation";
import { z } from "zod";
import { withStudio } from "../../../server/workspace.ts";
import ScriptEditor from "./script-editor";
import { readConfig } from "../../../server/config.ts";
import { openWritingJobs } from "../../../server/writing-jobs.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ revision?: string | string[]; proposal?: string | string[] }>;
}) {
  const { id } = await params;
  const { revision: selected, proposal: selectedProposal } = await searchParams;
  if (!z.uuid().safeParse(id).success || [selected, selectedProposal].some((value) => value !== undefined && !z.uuid().safeParse(value).success)) notFound();
  const data = withStudio((studio) => {
    const project = studio.getProject(id);
    if (!project) return null;
    const revisions = studio.listRevisions(id);
    const selectedId = typeof selected === "string" ? selected : revisions[0]?.id;
    const revision = selectedId ? studio.readRevision(id, selectedId) : null;
    if (selectedId && !revision) return null;
    const proposals = studio.listProposals(id);
    const proposalId = typeof selectedProposal === "string" ? selectedProposal : proposals[0]?.id;
    const proposal = proposalId ? studio.readProposal(id, proposalId) : null;
    if (proposalId && !proposal) return null;
    const proposalState = proposals.find((item) => item.id === proposalId);
    const base = proposal ? studio.readRevision(id, proposal.request.baseId) : null;
    return { project, revisions, revision, proposals, acceptance: studio.acceptance(id),
      review: proposal && base && proposalState ? { proposal, base: base.content, status: proposalState.status, resultId: proposalState.resultId } : null };
  });
  if (!data) notFound();
  const store = openWritingJobs(readConfig().dataDirectory);
  let jobs;
  try { jobs = store.list(id); } finally { store.close(); }
  const historical = selected !== undefined;
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-12">
      <WorkspaceHeader projectId={id} title={data.project.title} stage="script" />
      <p className="mb-6 text-sm text-[var(--muted)]" role="status">{data.acceptance?.stale ? "Script acceptance is stale. Review and accept again." : data.acceptance ? "Script accepted" : "Script awaiting acceptance"}</p>
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_15rem]">
        <section aria-label="Script workspace" className="min-w-0">
          {historical && data.revision ? (
            <>
              <h2 className="mb-4 text-xl font-semibold">Revision {data.revision.revision} · Read only</h2>
              <pre className="whitespace-pre-wrap break-words border border-[var(--line)] p-5 font-sans leading-relaxed">{data.revision.content}</pre>
              <p className="mt-5"><a href={`/projects/${id}`}>Return to latest draft</a></p>
            </>
          ) : <ScriptEditor key={`${id}:${data.revision?.id}`} projectId={id} revision={data.revision}
            accepted={!!data.acceptance && !data.acceptance.stale} review={data.review} />}
        </section>
        <aside aria-labelledby="history-heading" className="border-t border-[var(--line)] pt-6 lg:border-t-0 lg:pt-0">
          <details><summary id="history-heading">Revisions ({data.revisions.length})</summary>
          {data.revisions.length === 0 ? <p className="text-sm text-[var(--muted)]">No saved revisions yet.</p> : (
            <ol className="space-y-5">
              {data.revisions.map((revision) => (
                <li key={revision.id}>
                  <a href={revision.id === data.revisions[0]?.id ? `/projects/${id}` : `/projects/${id}?revision=${revision.id}`} aria-current={data.revision?.id === revision.id ? "page" : undefined}>
                    Revision {revision.revision}{revision.id === data.revisions[0]?.id ? " · Latest" : ""}
                  </a>
                  <time dateTime={revision.createdAt} className="mt-1 block text-xs leading-relaxed text-[var(--muted)]">
                    {new Date(revision.createdAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })} PHT
                  </time>
                </li>
              ))}
            </ol>
          )}
          </details><details className="mt-5"><summary>Proposals ({data.proposals.length})</summary>
          <ul className="space-y-3 text-sm">
            {data.proposals.map((proposal, index) => <li key={proposal.id}>
              <a href={`/projects/${id}?proposal=${proposal.id}`} aria-current={data.review?.proposal.id === proposal.id && !historical ? "page" : undefined}>Proposal {data.proposals.length - index} · {proposal.status}</a>
            </li>)}
          </ul>
          {data.proposals.length === 0 && <p className="text-sm text-[var(--muted)]">No proposals.</p>}
          </details><details className="mt-5"><summary>Writing requests ({jobs.length})</summary>
          <ol className="space-y-4 text-sm">
            {jobs.map((job) => <li key={job.id} className="break-words">
              <p className="font-semibold">{job.status}</p><p>{job.request.instruction}</p>
              {job.error && <p className="mt-2 text-[var(--error)]">{job.error}</p>}
              {job.proposalId && <a href={`/projects/${id}?proposal=${job.proposalId}`}>Review result</a>}
            </li>)}
          </ol>
          {jobs.length === 0 && <p className="text-sm text-[var(--muted)]">No writing requests.</p>}
          </details>
        </aside>
      </div>
    </main>
  );
}
