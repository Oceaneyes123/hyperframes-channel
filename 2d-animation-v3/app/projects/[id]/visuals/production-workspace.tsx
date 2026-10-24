"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { approveProduction } from "../../../actions.ts";
import type { ProductionView } from "../../../../workflow/production.ts";

function Gate({ projectId, status, gate }: { projectId: string; status: ProductionView; gate: "gate1" | "gate2" }) {
  const [state, action, pending] = useActionState(approveProduction.bind(null, projectId), { error: "" });
  return <form action={action} className="mt-5 space-y-3 border border-[var(--line)] p-4">
    <input type="hidden" name="binding" value={status.binding ?? ""} /><input type="hidden" name="gate" value={gate} />
    <label className="flex items-start gap-3"><input name="reviewed" type="checkbox" required />{gate === "gate1" ? "Gate 1: I reviewed this exact creative plan, source accuracy, visual assets, narration and motion direction." : "Gate 2: I independently watched this exact moving preview, listened to its narration and checked timing, seams and phone-size readability."}</label>
    <label className="block">Review findings and accepted limitations<textarea name="notes" required minLength={10} maxLength={2000} rows={2} className="mt-2 w-full" /></label>
    <button disabled={pending || !status.ready || gate === "gate2" && !status.gate1}>Approve {gate === "gate1" ? "Gate 1" : "Gate 2"}</button>
    {state.error && <p role="alert">{state.error}</p>}
  </form>;
}

export default function ProductionWorkspace({ projectId, motionId, status, reviewingAccepted }: { projectId: string; motionId: string | null; status: ProductionView; reviewingAccepted: boolean }) {
  const router = useRouter(); const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setError("");
    try { const response = await fetch(`/api/projects/${projectId}/production`, { method: "POST", body: data }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.refresh(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Narration import failed."); } finally { setBusy(false); }
  }
  async function render(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { const response = await fetch(`/api/projects/${projectId}/render`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ binding: status.binding, authorize: true }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.refresh(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Render failed. Check history before retrying."); router.refresh(); } finally { setBusy(false); }
  }
  return <section aria-labelledby="production-heading" className="mt-12 border-t border-[var(--line)] pt-8">
    <h2 id="production-heading" className="text-2xl font-semibold">Narration & approvals</h2>
    {motionId && !reviewingAccepted && <p className="mt-4 text-[var(--warning)]"><a href={`/projects/${projectId}/visuals?motion=${motionId}#motion-review`}>Open the accepted motion with narration</a> before recording production review or rendering. These gates apply to that exact accepted version.</p>}

    <form onSubmit={upload} className="mt-5 space-y-3">
      <input type="hidden" name="motionId" value={motionId ?? ""} />
      <label className="block">Narration (.wav, PCM16, max 16 MB)<input name="audio" type="file" accept="audio/wav,.wav" required className="mt-2 block" /></label>
      <label className="block">Line timings (JSON, 30 fps)<textarea name="timing" required rows={3} maxLength={30000} placeholder={'[{"number":1,"startFrame":0,"endFrame":90}]'} className="mt-2 w-full" /></label>
      <button disabled={!motionId || busy}>Import narration</button>
    </form>
    {!status.ready && <p className="mt-4 text-[var(--warning)]">{status.reason}</p>}
    {status.narration && <div className="mt-5"><p>{status.narration.measured.durationSeconds.toFixed(1)}s narration</p>
      <svg role="img" aria-label="Narration peak waveform" viewBox="0 0 500 60" className="mt-3 h-16 w-full"><path d={status.narration.measured.waveform.map((value, index) => `M${index * 5} ${30 - value * 28}V${30 + value * 28}`).join("")} stroke="currentColor" strokeWidth="3" /></svg>
    </div>}
    {!!status.quality?.warnings.length && <div className="mt-5"><h3 className="font-semibold">Review warnings</h3>
      <ul className="mt-3 list-inside list-disc">{status.quality.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
    </div>}
    <p className="mt-5">Gate 1: {status.gate1 ? "approved for exact current inputs" : "pending"} · Gate 2: {status.gate2 ? "approved for exact current inputs" : "pending"}</p>
    <Gate projectId={projectId} status={{ ...status, ready: status.ready && reviewingAccepted }} gate="gate1" /><Gate projectId={projectId} status={{ ...status, ready: status.ready && reviewingAccepted }} gate="gate2" />
    <form onSubmit={render} className="mt-6 space-y-3"><label className="flex items-start gap-3"><input type="checkbox" required disabled={!status.gate2 || busy || !reviewingAccepted} />I explicitly authorize a local production video render of these approved inputs.</label>
      <button disabled={!status.gate2 || busy || !reviewingAccepted}>{busy ? "Working…" : "Render video"}</button>
    </form>
    {error && <p role="alert" className="mt-4 text-[var(--error)]">{error}</p>}
    <details className="mt-5"><summary>Render history ({status.history.length})</summary><ul className="mt-3 space-y-3">{status.history.map((item) => <li key={item.id}>{item.kind}{item.payload.error && ` · ${item.payload.error}`}{item.kind === "rendered" && <a className="ml-3" href={`/api/projects/${projectId}/export/${item.payload.jobId}`}>Download export</a>}</li>)}</ul></details>
  </section>;
}
