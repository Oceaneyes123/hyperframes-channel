import { notFound } from "next/navigation";
import { z } from "zod";
import { readConfig } from "../../../../server/config.ts";
import { openStudio } from "../../../../server/studio.ts";
import { openVisuals } from "../../../../server/visual-store.ts";
import VisualWorkspace from "./visual-workspace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function VisualPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ run?: string | string[] }>;
}) {
  const { id } = await params; const { run } = await searchParams;
  if (!z.uuid().safeParse(id).success || run !== undefined && !z.uuid().safeParse(run).success) notFound();
  const config = readConfig(); const studio = openStudio(config.dataDirectory, config.videosDirectory);
  const store = openVisuals(config.dataDirectory, config.videosDirectory);
  try {
    const project = studio.getProject(id); if (!project) notFound();
    const accepted = studio.acceptance(id); const script = accepted ? studio.readRevision(id, accepted.revisionId) : null;
    const chosen = store.selection(id); const latestConcept = store.latest(id, "concepts"); const latestBoard = store.latest(id, "storyboard");
    const selected = typeof run === "string" ? store.read(id, run) : null;
    if (run && !selected) notFound();
    const concepts = selected?.output.kind === "concepts" ? selected : latestConcept ? store.read(id, latestConcept) : null;
    const board = selected?.output.kind === "storyboard" ? selected : latestBoard ? store.read(id, latestBoard) : null;
    return <main className="mx-auto max-w-7xl px-6 py-10 sm:px-12">
      <nav aria-label="Workspace" className="mb-8 text-sm"><a href={`/projects/${id}`}>Back to script review</a></nav>
      <header className="mb-8 border-b border-white/15 pb-6">
        <p className="mb-3 text-sm uppercase tracking-widest text-[#b9d8c2]">V3 / Visual planning</p>
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-[#aeb4b0]">Compare three visual directions, choose one, then review the teaching sequence shot by shot. Images are static planning drawings. Durations are estimates.</p>
      </header>
      <VisualWorkspace projectId={id} script={script} eligible={!!accepted && !accepted.stale} concepts={concepts} board={board}
        conceptsCurrent={!!concepts && store.current(id, concepts.id)} boardCurrent={!!board && store.current(id, board.id)}
        latestConceptId={latestConcept} latestBoardId={latestBoard} chosen={chosen} acceptance={store.acceptance(id)} history={store.list(id)} />
      <p className="mt-10 border-t border-white/15 pt-5 text-sm text-[#aeb4b0]">Storyboard acceptance records this planning artifact only. Production gates, animation playback, voice and video export remain unavailable.</p>
    </main>;
  } finally { store.close(); studio.close(); }
}
