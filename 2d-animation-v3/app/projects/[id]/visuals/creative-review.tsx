"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreativeQualityReport } from "../../../../server/creative-quality.ts";
import type { creativeFeedback } from "../../../../server/creative-feedback.ts";
import { creativeDetectors } from "../../../../workflow/creative-rules.ts";

type Correction = ReturnType<ReturnType<typeof creativeFeedback>["list"]>[number];
const detectorFor = (stage: "graphics" | "motion" | "narration", evidence: string) => {
  const id = evidence.split(":", 1)[0]; return (creativeDetectors[stage] as readonly string[]).includes(id) ? id : undefined;
};
export function RuleProposal({ projectId, artifactId, shotIndex, stage, evidence: initialEvidence = "", correction: initialCorrection = "" }: {
  projectId: string; artifactId: string; shotIndex: number; stage: "graphics" | "motion" | "narration"; evidence?: string; correction?: string;
}) {
  const router = useRouter(), [evidence, setEvidence] = useState(initialEvidence), [correction, setCorrection] = useState(initialCorrection), [exceptions, setExceptions] = useState("");
  const [busy, setBusy] = useState(false), [status, setStatus] = useState("");
  return <details className="my-3"><summary className="text-sm">Save correction as proposed rule</summary>
    <form className="my-3 space-y-2 text-sm" onSubmit={async (event) => {
      event.preventDefault(); setBusy(true);
      try {
        const response = await fetch(`/api/projects/${projectId}/creative-feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "propose", feedback: { artifactId, shotIndex, stage, evidence, correction, exceptions, detectorId: detectorFor(stage, evidence) } }) });
        const text = await response.text(); if (!response.ok || text.length > 12000) throw new Error("Correction could not be saved.");
        const events = text.trim().split("\n").map((line) => JSON.parse(line)); if (events.some((item) => item.error)) throw new Error("Correction could not be saved.");
        setStatus("Proposed rule saved. Activate only after human regression review in Creative quality review."); router.refresh();
      } catch { setStatus("Correction could not be saved; prior records preserved."); } finally { setBusy(false); }
    }}>
      <label className="block">Observed evidence<textarea className="mt-2 block w-full" rows={3} required maxLength={1000} value={evidence} onChange={(event) => setEvidence(event.target.value)} /></label>
      <label className="block">Reusable correction<textarea className="mt-2 block w-full" rows={3} required maxLength={1000} value={correction} onChange={(event) => setCorrection(event.target.value)} /></label>
      <label className="block">Exceptions<textarea className="mt-2 block w-full" rows={3} required maxLength={500} value={exceptions} onChange={(event) => setExceptions(event.target.value)} /></label>
      <button className="secondary" disabled={busy}>Save proposed rule</button>{status && <p role="status">{status}</p>}
    </form>
  </details>;
}
export default function CreativeReview({ projectId, report, corrections }: { projectId: string; report: CreativeQualityReport; corrections: Correction[] }) {
  const router = useRouter(), [stage, setStage] = useState("graphics"), [selected, setSelected] = useState<string | null>(null);
  const [correction, setCorrection] = useState(""), [exceptions, setExceptions] = useState("Intentional continuity or a source-required teaching choice."), [regressionEvidence, setRegressionEvidence] = useState("");
  const [confirmed, setConfirmed] = useState(false), [busy, setBusy] = useState(false), [status, setStatus] = useState(""), [dismissed, setDismissed] = useState<string[]>([]);
  const [regressions, setRegressions] = useState<Record<string, { id: string; text: string }>>({});
  const issue = report.issues.find((item) => item.id === selected);
  async function submit(input: object) {
    setBusy(true); setStatus("");
    try {
      const response = await fetch(`/api/projects/${projectId}/creative-feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const text = await response.text(); if (!response.ok || text.length > 12000) throw new Error("Correction could not be saved.");
      const events = text.trim().split("\n").map((line) => JSON.parse(line));
      if (events.some((event) => event.error)) throw new Error("Correction failed; earlier records preserved.");
      const event = events.find((item) => item.regression);
      if (event) { const result = JSON.parse(event.regression); setRegressions((previous) => ({ ...previous, [result.proposalId]: { id: result.id, text: JSON.stringify(result.examples, null, 2) } })); }
      setStatus(events.at(-1)?.message ?? "Saved."); setSelected(null); setConfirmed(false); router.refresh();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Correction failed."); } finally { setBusy(false); }
  }
  return <details className="workspace-stage"><summary>Creative quality review</summary>
    <p className="my-3 text-sm">Review actual phone-size frames and full playback with narration. Automated findings do not establish creative quality.</p>
    <div className="my-3 flex gap-2" role="group" aria-label="Review category">{["graphics", "motion", "narration"].map((category) => <button key={category} className="secondary" type="button" aria-pressed={stage === category} onClick={() => setStage(category)}>{category}</button>)}</div>
    {stage === "narration" && <p className="my-3 text-sm">Compare actual takes in Narration timing. Voice identity, pronunciation, timing and expressive delivery require listening. Local generation never approves or replaces imported narration.</p>}
    {(stage === "graphics" && report.boardId || stage === "motion" && report.motionId || stage === "narration" && report.narrationId) && <RuleProposal key={stage} projectId={projectId} artifactId={(stage === "graphics" ? report.boardId : stage === "motion" ? report.motionId : report.narrationId)!} shotIndex={0} stage={stage as "graphics" | "motion" | "narration"} />}
    <ul className="space-y-4 text-sm">{report.issues.filter((item) => item.stage === stage && !dismissed.includes(item.id)).map((item) => <li key={item.id}>
      <p><a className="underline" href={item.stage === "narration" ? "#narration-review" : `?${item.stage === "motion" ? `motion=${item.artifactId}&` : `run=${item.artifactId}&`}shot=${item.shotIndex}`} onClick={item.stage === "narration" ? () => document.getElementById("narration-review")?.setAttribute("open", "") : undefined}>{item.stage === "narration" ? "Full narration" : `Shot ${item.shotIndex + 1}`}</a>{item.startFrame !== null && ` · ${(item.startFrame / 30).toFixed(2)}–${(item.endFrame! / 30).toFixed(2)}s`}</p>
      <p>{item.evidence}</p><p>{item.correction}</p>
      {item.ruleIds.length > 0 && <p>Related rules: {item.ruleIds.join(", ")}</p>}
      <div className="my-2 flex gap-2"><button className="secondary" type="button" disabled={busy || item.shotIndex < 0} onClick={() => { setSelected(item.id); setCorrection(item.correction); }}>Save as rule</button><button className="secondary" type="button" onClick={() => setDismissed([...dismissed, item.id])}>Dismiss for this view</button></div>
    </li>)}</ul>
    {issue && <form className="my-4 space-y-2" onSubmit={(event) => { event.preventDefault(); void submit({ action: "propose", feedback: { artifactId: issue.artifactId, shotIndex: issue.shotIndex, stage: issue.stage, evidence: issue.evidence, correction, exceptions, detectorId: detectorFor(issue.stage, issue.evidence) } }); }}>
      <label className="block text-sm">Reusable correction<textarea className="mt-2 block w-full" rows={3} required maxLength={1000} value={correction} onChange={(event) => setCorrection(event.target.value)} /></label>
      <label className="block text-sm">Exceptions<textarea className="mt-2 block w-full" rows={3} required maxLength={500} value={exceptions} onChange={(event) => setExceptions(event.target.value)} /></label>
      <button className="secondary" disabled={busy}>Save proposed rule</button>
    </form>}
    <details className="my-4"><summary>Correction proposals and decisions</summary>
      <p className="my-2 text-sm">Activation applies to future generation across projects. Existing artifacts retain their rule snapshots. Before/after artwork remains in Graphic design review; motion comparisons remain in Motion.</p>
      <label className="block text-sm">Regression review evidence<textarea className="mt-2 block w-full" rows={3} maxLength={2000} value={regressionEvidence} onChange={(event) => setRegressionEvidence(event.target.value)} placeholder="Record the projects/examples reviewed, outcome, and exceptions." /></label>
      <label className="my-2 flex gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />I reviewed the examples and confirm this general rule decision.</label>
      <ul className="space-y-3 text-sm">{corrections.map((item) => <li key={item.id}><p className="break-all">{item.rule.id} v{item.rule.version} · {item.withdrawal ? "withdrawn" : item.decision?.decision ?? "proposed"}</p><p>{item.rule.correction}</p><p>Exceptions: {item.rule.exceptions}</p>
        {!item.decision && <><button className="secondary my-2" type="button" disabled={busy} onClick={() => { const current = item.rule.stages[0] === "graphics" ? report.boardId : item.rule.stages[0] === "motion" ? report.motionId : report.narrationId; void submit({ action: "regress", id: item.id, artifactIds: current ? [current] : [item.artifactId] }); }}>Inspect source and current example</button>
          {regressions[item.id] && <details><summary>Saved inspector results — review applicability and exceptions</summary><pre className="max-h-60 overflow-auto whitespace-pre-wrap text-xs">{regressions[item.id].text}</pre></details>}
          <div className="my-2 flex gap-2">{["activate", "reject"].map((decision) => <button key={decision} className="secondary" type="button" disabled={busy || !confirmed || !regressionEvidence.trim() || decision === "activate" && !regressions[item.id]} onClick={() => void submit({ action: "decide", id: item.id, decision, confirmedByHuman: confirmed, regressionEvidence, ...(regressions[item.id] ? { regressionId: regressions[item.id].id } : {}) })}>{decision}</button>)}</div></>}
        {item.decision?.decision === "activate" && !item.withdrawal && <button className="secondary my-2" type="button" disabled={busy || !confirmed || !regressionEvidence.trim()} onClick={() => void submit({ action: "withdraw", id: item.id, confirmedByHuman: confirmed, reason: regressionEvidence })}>Withdraw rule</button>}
      </li>)}</ul>
    </details>
    <details className="my-4"><summary>Full-video report and provenance</summary><pre className="max-h-80 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(report, null, 2)}</pre></details>
    {status && <p role="status" className="my-3 text-sm">{status}</p>}
  </details>;
}
