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
      {/* Full navigation invokes the editor's unsaved-draft unload protection. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <nav aria-label="Workspace" className="mb-8 text-sm"><a href="/">All projects</a></nav>
      <header className="mb-10 border-b border-white/15 pb-8">
        <p className="mb-3 text-sm uppercase tracking-widest text-[#b9d8c2]">V3 / Script review</p>
        <h1 className="break-words text-3xl font-semibold sm:text-4xl">{data.project.title}</h1>
        <p className="mt-4 text-sm text-[#aeb4b0]">{data.acceptance ? data.acceptance.stale ? "Script acceptance is stale after a newer edit. Review and accept again." : "Exact saved script accepted. Visual concepts are eligible; their workflow is not implemented yet." : "Script awaiting your editorial acceptance."} Production gates and video generation remain disabled.</p>
      </header>
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_15rem]">
        <section aria-label="Script workspace" className="min-w-0">
          {historical && data.revision ? (
            <>
              <h2 className="mb-4 text-xl font-semibold">Revision {data.revision.revision} · Read only</h2>
              <pre className="whitespace-pre-wrap break-words border border-white/15 p-5 font-sans leading-relaxed">{data.revision.content}</pre>
              <p className="mt-5"><a href={`/projects/${id}`}>Return to latest draft</a></p>
            </>
          ) : <ScriptEditor key={`${id}:${data.revision?.id}`} projectId={id} revision={data.revision}
            accepted={!!data.acceptance && !data.acceptance.stale} review={data.review} />}
        </section>
        <aside aria-labelledby="history-heading" className="border-t border-white/15 pt-6 lg:border-t-0 lg:pt-0">
          <h2 id="history-heading" className="mb-5 text-lg font-semibold">Revision history</h2>
          {data.revisions.length === 0 ? <p className="text-sm text-[#aeb4b0]">No saved revisions yet.</p> : (
            <ol className="space-y-5">
              {data.revisions.map((revision) => (
                <li key={revision.id}>
                  <a href={revision.id === data.revisions[0]?.id ? `/projects/${id}` : `/projects/${id}?revision=${revision.id}`} aria-current={data.revision?.id === revision.id ? "page" : undefined}>
                    Revision {revision.revision}{revision.id === data.revisions[0]?.id ? " · Latest" : ""}
                  </a>
                  <time dateTime={revision.createdAt} className="mt-1 block text-xs leading-relaxed text-[#aeb4b0]">
                    {new Date(revision.createdAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })} PHT
                  </time>
                </li>
              ))}
            </ol>
          )}
          <h2 className="mb-4 mt-8 text-lg font-semibold">Proposals</h2>
          <ul className="space-y-3 text-sm">
            {data.proposals.map((proposal, index) => <li key={proposal.id}>
              <a href={`/projects/${id}?proposal=${proposal.id}`} aria-current={data.review?.proposal.id === proposal.id && !historical ? "page" : undefined}>Proposal {data.proposals.length - index} · {proposal.status}</a>
            </li>)}
          </ul>
          {data.proposals.length === 0 && <p className="text-sm text-[#aeb4b0]">No proposals.</p>}
          <h2 className="mb-4 mt-8 text-lg font-semibold">Writing requests</h2>
          <p className="mb-4 text-xs text-[#aeb4b0]">Last 20 requests in this project’s writing session. Interrupted requests expire after two minutes; retries are explicit.</p>
          <ol className="space-y-4 text-sm">
            {jobs.map((job) => <li key={job.id} className="break-words">
              <p className="font-semibold">{job.status}</p><p>{job.request.instruction}</p>
              {job.error && <p className="mt-2 text-[#f5b5a6]">{job.error}</p>}
              {job.proposalId && <a href={`/projects/${id}?proposal=${job.proposalId}`}>Review result</a>}
            </li>)}
          </ol>
          {jobs.length === 0 && <p className="text-sm text-[#aeb4b0]">No writing requests.</p>}
        </aside>
      </div>
    </main>
  );
}
