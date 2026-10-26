"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { VisualArtifact } from "../../../../workflow/visuals.ts";
import { creativeReviewSchema } from "../../../../workflow/art-direction.ts";
import { frameAssets, inspectGraphics } from "../../../../engine/quality/inspect-graphics.ts";
import PlanningFrame from "./frame";
import { RuleProposal } from "./creative-review";

export default function GraphicReview({ projectId, board, original, shotIndex, current, onInstruction }: {
  projectId: string; board: VisualArtifact; original: VisualArtifact | null; shotIndex: number; current: boolean; onInstruction: (instruction: string) => void;
}) {
  const quality = useMemo(() => inspectGraphics(board), [board]);
  const [findings, setFindings] = useState<ReturnType<typeof creativeReviewSchema.parse>["findings"]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]), [status, setStatus] = useState(""), [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  if (board.output.kind !== "storyboard") return null;
  const shot = board.output.shots[shotIndex]; if (!shot) return null;
  const previous = original?.output.kind === "storyboard" ? original.output.shots[shotIndex] : null;
  async function review() {
    const abort = new AbortController(); controller.current = abort; setBusy(true); setFindings([]); setDismissed([]); setStatus("Rendering phone-size frames…");
    try {
      const response = await fetch(`/api/projects/${projectId}/graphics-review`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal, body: JSON.stringify({ runId: board.id, shotIndex }) });
      if (!response.ok || !response.body) throw new Error("Graphic review could not start.");
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = "", size = 0, received = false;
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          size += chunk.value.byteLength; if (size > 100_000) throw new Error("Graphic review response exceeds the limit.");
          buffer += decoder.decode(chunk.value, { stream: true });
          let newline: number;
          while ((newline = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, newline)); buffer = buffer.slice(newline + 1);
            if (event.error) throw new Error(event.error);
            if (event.message) setStatus(event.message);
            if (event.review) { const report = JSON.parse(event.review); if (report.runId !== board.id || report.shotIndex !== shotIndex) throw new Error("Review source changed."); setFindings(creativeReviewSchema.parse({ findings: report.findings }).findings); received = true; }
          }
        }
      } finally { await reader.cancel(); reader.releaseLock(); }
      if (!received) throw new Error("Review ended without a saved report.");
      setStatus("Rendered review saved. Suggestions need human judgment; no design was accepted.");
    } catch (error) { setStatus(abort.signal.aborted ? "Graphic review cancelled." : error instanceof Error ? error.message : "Graphic review failed."); }
    finally { setBusy(false); controller.current = null; }
  }
  return <details className="mt-5 border-t border-[var(--line)] pt-4">
    <summary className="text-sm font-semibold">Graphic design review</summary>
    {shot.design ? <dl className="my-4 space-y-2 text-sm">
      <div><dt className="font-semibold">Art direction · {shot.design.family}</dt><dd>{shot.design.meaning}</dd></div>
      <div><dt className="font-semibold">Focal point / layout</dt><dd>{shot.design.focalPoint} · {shot.design.layout}</dd></div>
      <div><dt className="font-semibold">Metaphor / density</dt><dd>{shot.design.metaphor} · {shot.design.density}</dd></div>
      {shot.design.continuityReason && <div><dt className="font-semibold">Intentional repetition</dt><dd>{shot.design.continuityReason}</dd></div>}
    </dl> : <p className="my-4 text-sm">This storyboard predates per-scene art direction.</p>}
    <details><summary className="text-sm">Assets and animation layers</summary>
      {frameAssets(shot.endFrame).map((asset, index) => <div key={index} className="my-3 text-sm">
        <p className="font-semibold">{asset.id}</p><p>{asset.metadata?.purpose}</p>
        <p>{asset.metadata?.license} · layers: {asset.metadata?.layers.join(", ")}</p><code className="break-all text-xs">{asset.contentHash}</code>
      </div>)}
      {shot.endFrame.shapes.filter((shape) => shape.diagram).map((shape, index) => <p key={index} className="my-3 text-sm">Semantic diagram: {shape.diagram!.nodes.length} nodes, {shape.diagram!.edges.length} directed connections. Layers: {[...shape.diagram!.nodes, ...shape.diagram!.edges].map((item) => item.id).join(", ")}.</p>)}
    </details>
    <p className="my-3 text-xs text-[var(--muted)]">{quality.version}. Automated findings do not establish design quality.</p>
    <ul className="space-y-3 text-sm">{quality.findings.filter((finding) => finding.shotIndex === shotIndex).map((finding) => <li key={finding.id}>
      <p>{finding.state} · {finding.rule}: {finding.evidence}</p><p>{finding.suggestion}</p>
      <button type="button" className="secondary mt-1" disabled={!current} onClick={() => onInstruction(`${finding.suggestion} Address: ${finding.evidence}`)}>Use for shot revision</button>
    </li>)}</ul>
    {previous && <details className="my-4"><summary className="text-sm">Before / proposed artwork</summary><div className="grid max-w-2xl grid-cols-2 gap-4">
      <figure><PlanningFrame frame={previous.endFrame} label="Previous artwork" /><figcaption className="text-xs">Previous version</figcaption></figure>
      <figure><PlanningFrame frame={shot.endFrame} label="Proposed artwork" /><figcaption className="text-xs">Proposed version</figcaption></figure>
    </div></details>}
    <div className="my-4 flex gap-2"><button type="button" className="secondary" disabled={!current || busy} onClick={review}>Review rendered shot {shotIndex + 1}</button>{busy && <button type="button" className="secondary" onClick={() => controller.current?.abort()}>Cancel review</button>}</div>
    {status && <p role="status" className="my-3 text-sm">{status}</p>}
    <ul className="space-y-3 text-sm">{findings.map((finding, index) => dismissed.includes(index) ? null : <li key={index}>
      <p>{finding.dimension}: {finding.evidence}</p><p>{finding.suggestion}</p>
      <RuleProposal projectId={projectId} artifactId={board.id} shotIndex={shotIndex} stage="graphics" evidence={finding.evidence} correction={finding.suggestion} />
      <div className="mt-2 flex gap-2"><button type="button" className="secondary" disabled={!current} onClick={() => onInstruction(`${finding.suggestion} Address visible issue: ${finding.evidence}`)}>Use for shot revision</button><button type="button" className="secondary" onClick={() => setDismissed([...dismissed, index])}>Dismiss suggestion</button></div>
    </li>)}</ul>
    <details className="my-4"><summary className="text-sm">Scene contact sheet</summary><div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">{board.output.shots.map((item, index) => <figure key={index}>
      <PlanningFrame frame={item.endFrame} label={`Shot ${index + 1} final drawing`} /><figcaption className="text-xs">Shot {index + 1} · {item.design?.family ?? "Legacy"}</figcaption>
    </figure>)}</div></details>
    <p className="text-xs text-[var(--muted)]">Use the existing storyboard acceptance button after review. Graphic suggestions never replace storyboard, motion or production approval.</p>
  </details>;
}
