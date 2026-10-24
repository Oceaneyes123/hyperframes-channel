import WorkspaceHeader from "../../../workspace-header";
import { notFound } from "next/navigation";
import { z } from "zod";
import { readConfig } from "../../../../server/config.ts";
import { openStudio } from "../../../../server/studio.ts";
import { openVisuals } from "../../../../server/visual-store.ts";
import VisualWorkspace from "./visual-workspace";
import MotionWorkspace from "./motion-workspace";
import { openMotion } from "../../../../server/motion-store.ts";
import { scriptLines } from "../../../../workflow/visuals.ts";
import { openProduction } from "../../../../server/production-store.ts";
import ProductionWorkspace from "./production-workspace";
import { openTiming } from "../../../../server/timing-store.ts";
import TimingWorkspace from "./timing-workspace";
import { resolveBeatTiming } from "../../../../workflow/timing.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function VisualPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ run?: string | string[]; motion?: string | string[] }>;
}) {
  const { id } = await params; const { run, motion: motionId } = await searchParams;
  if (![id, ...[run, motionId].filter((value) => value !== undefined)].every((value) => z.uuid().safeParse(value).success)) notFound();
  const config = readConfig(); const studio = openStudio(config.dataDirectory, config.videosDirectory);
  const store = openVisuals(config.dataDirectory, config.videosDirectory);
  const motions = openMotion(config.dataDirectory, config.videosDirectory);
  const production = openProduction(config.dataDirectory, config.videosDirectory);
  const timings = openTiming(config.dataDirectory, config.videosDirectory);
  try {
    const project = studio.getProject(id); if (!project) notFound();
    const accepted = studio.acceptance(id); const script = accepted ? studio.readRevision(id, accepted.revisionId) : null;
    const chosen = store.selection(id); const latestConcept = store.latest(id, "concepts"); const latestBoard = store.latest(id, "storyboard");
    const selected = typeof run === "string" ? store.read(id, run) : null;
    if (run && !selected) notFound();
    const concepts = selected?.output.kind === "concepts" ? selected : latestConcept ? store.read(id, latestConcept) : null;
    const board = selected?.output.kind === "storyboard" ? selected : latestBoard ? store.read(id, latestBoard) : null;
    const latestMotion = motions.latest(id); const motion = motions.read(id, typeof motionId === "string" ? motionId : latestMotion ?? "00000000-0000-4000-8000-000000000000");
    if (motionId && !motion) notFound();
    const receipt = motions.acceptance(id); const original = receipt && receipt.runId !== motion?.id ? motions.read(id, receipt.runId) : null;
    const boardReceipt = store.acceptance(id);
    const productionStatus = production.status(id);
    const motionTiming = motion?.source.timingId ? timings.read(id, motion.source.timingId)?.artifact : null;
    return <main className="mx-auto max-w-7xl px-6 py-10 sm:px-12">
      <WorkspaceHeader projectId={id} title={project.title} stage="visuals" />
      <details className="workspace-stage"><summary>Narration timing</summary><TimingWorkspace projectId={id} scriptId={accepted && !accepted.stale ? accepted.revisionId : null} timing={timings.latest(id)} /></details>
      <VisualWorkspace projectId={id} script={script} eligible={!!accepted && !accepted.stale} concepts={concepts} board={board} originalBoard={board?.baseId ? store.read(id, board.baseId) : null}
        conceptsCurrent={!!concepts && store.current(id, concepts.id)} boardCurrent={!!board && store.current(id, board.id)}
        latestConceptId={latestConcept} latestBoardId={latestBoard} chosen={chosen} acceptance={store.acceptance(id)} history={store.list(id)} />
      <details className="workspace-stage" open={!!motionId}><summary>Motion</summary>
      <MotionWorkspace projectId={id} storyboardId={board?.id ?? null} eligible={!!board && boardReceipt?.runId === board.id && !boardReceipt.stale}
        latestId={latestMotion} current={!!motion && motions.current(id, motion.id)} motion={motion}
        sourceBoard={motion ? store.read(id, motion.source.storyboardId) : null} original={original}
        originalBoard={original ? store.read(id, original.source.storyboardId) : null} acceptance={receipt}
        narration={motion ? scriptLines(studio.readRevision(id, motion.source.scriptId)!.content) : []} history={motions.list(id)} production={productionStatus}
        timingWarnings={motion && motionTiming ? resolveBeatTiming(motion.plan, motionTiming).warnings : []} />
      </details>
      <details className="workspace-stage"><summary>Export</summary>
      <ProductionWorkspace projectId={id} motionId={receipt && !receipt.stale ? receipt.runId : null} status={productionStatus} reviewingAccepted={!!motion && motion.id === receipt?.runId && !receipt.stale} />
      </details>
    </main>;
  } finally { timings.close(); production.close(); motions.close(); store.close(); studio.close(); }
}
