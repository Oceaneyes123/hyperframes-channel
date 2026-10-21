import { notFound } from "next/navigation";
import { z } from "zod";
import { readConfig } from "../../../../server/config.ts";
import { withStudio } from "../../../../server/workspace.ts";
import { openScriptwriting } from "../../../../server/scriptwriting-store.ts";
import WritingWorkspace from "./writing-workspace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function WritingPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ run?: string | string[] }>;
}) {
  const { id } = await params; const { run } = await searchParams;
  if (!z.uuid().safeParse(id).success || run !== undefined && !z.uuid().safeParse(run).success) notFound();
  const project = withStudio((studio) => studio.getProject(id));
  if (!project) notFound();
  const config = readConfig(); const store = openScriptwriting(config.dataDirectory, config.videosDirectory);
  let data;
  try {
    const runs = store.list(id); const briefId = store.latestBrief(id) ?? null;
    const brief = briefId ? store.read(id, briefId) : null;
    const selectedId = typeof run === "string" ? run : runs.find((item) => item.status === "complete")?.id;
    const selected = selectedId ? store.read(id, selectedId) : null;
    if (selectedId && !selected) notFound();
    const parent = selected?.parentId ? store.read(id, selected.parentId) : null;
    const root = selected?.output.kind === "draft" ? parent?.parentId : selected?.output.kind === "hooks" ? selected.parentId : selected?.id;
    data = { runs, briefId, brief: brief?.output.kind === "brief" ? brief.output.brief : null, selected, parent,
      current: root === briefId };
  } finally { store.close(); }
  return <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-12">
    <nav aria-label="Workspace"><a href={`/projects/${id}`}>Return to script review</a></nav>
    <header className="border-b border-white/15 pb-8"><p className="mb-3 text-sm uppercase tracking-widest text-[#b9d8c2]">V3 / Research and writing</p>
      <h1 className="text-3xl font-semibold">{project.title}</h1>
      <p className="mt-4 text-[#aeb4b0]">Start with source notes and the lesson worth teaching. Choose a hook, inspect the draft and editorial findings, then decide whether to use it.</p>
    </header>
    <WritingWorkspace key={data.briefId ?? id} projectId={id} {...data} />
  </main>;
}
