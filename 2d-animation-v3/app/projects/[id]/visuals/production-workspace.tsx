"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { approveProduction } from "../../../actions.ts";
import type { ProductionView } from "../../../../workflow/production.ts";

function Gate({ projectId, status, gate }: { projectId: string; status: ProductionView; gate: "gate1" | "gate2" }) {
  const [state, action, pending] = useActionState(approveProduction.bind(null, projectId), { error: "" });
  return <form action={action} className="mt-5 space-y-3 border border-white/15 p-4">
    <input type="hidden" name="binding" value={status.binding ?? ""} /><input type="hidden" name="gate" value={gate} />
    <label className="flex items-start gap-3"><input name="reviewed" type="checkbox" required />{gate === "gate1" ? "Gate 1: I reviewed this exact creative plan, source accuracy, visual assets, narration and motion direction." : "Gate 2: I independently watched this exact moving preview, listened to its narration and checked timing, seams and phone-size readability."}</label>
    <label className="block">Review findings and accepted limitations<textarea name="notes" required minLength={10} maxLength={2000} rows={2} className="mt-2 w-full" /></label>
    <button disabled={pending || !status.ready || gate === "gate2" && !status.gate1}>Record {gate === "gate1" ? "Gate 1" : "Gate 2"} approval</button>
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
  return <section aria-labelledby="production-heading" className="mt-12 border-t border-white/15 pt-8">
    <h2 id="production-heading" className="text-2xl font-semibold">4. Narration and production gates</h2>
    {motionId && !reviewingAccepted && <p className="mt-4 text-[#e1ba77]"><a href={`/projects/${projectId}/visuals?motion=${motionId}#motion-review`}>Open the accepted motion with narration</a> before recording production review or rendering. These gates apply to that exact accepted version.</p>}
    <p className="mt-3 text-sm text-[#aeb4b0]">Import measured PCM16 WAV narration (16 MB maximum) and line timings at 30 fps. Audio must match the accepted motion duration within one frame. Timings are supplied measurements; the app does not transcribe or align speech automatically.</p>
    <form onSubmit={upload} className="mt-5 space-y-3">
      <input type="hidden" name="motionId" value={motionId ?? ""} />
      <label className="block">Narration WAV<input name="audio" type="file" accept="audio/wav,.wav" required className="mt-2 block" /></label>
      <label className="block">Measured line timing JSON<textarea name="timing" required rows={3} maxLength={30000} placeholder={'[{"number":1,"startFrame":0,"endFrame":90}]'} className="mt-2 w-full" /></label>
      <button disabled={!motionId || busy}>Import measured narration</button>
    </form>
    {!status.ready && <p className="mt-4 text-[#e1ba77]">{status.reason}</p>}
    {status.narration && <div className="mt-5"><p>{status.narration.measured.durationSeconds.toFixed(3)} seconds measured · preview audio follows the main Player clock.</p>
      <svg role="img" aria-label="Narration peak waveform" viewBox="0 0 500 60" className="mt-3 h-16 w-full"><path d={status.narration.measured.waveform.map((value, index) => `M${index * 5} ${30 - value * 28}V${30 + value * 28}`).join("")} stroke="#b9d8c2" strokeWidth="3" /></svg>
    </div>}
    {status.quality && <div className="mt-5"><h3 className="font-semibold">Independent motion diagnostics</h3><p className="text-sm">Deterministic checks are separate from the motion generator. Human moving/audio review remains required.</p>
      <ul className="mt-3 list-inside list-disc">{status.quality.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
    </div>}
    <p className="mt-5">Gate 1: {status.gate1 ? "approved for exact current inputs" : "pending"} · Gate 2: {status.gate2 ? "approved for exact current inputs" : "pending"}</p>
    <Gate projectId={projectId} status={{ ...status, ready: status.ready && reviewingAccepted }} gate="gate1" /><Gate projectId={projectId} status={{ ...status, ready: status.ready && reviewingAccepted }} gate="gate2" />
    <form onSubmit={render} className="mt-6 space-y-3"><label className="flex items-start gap-3"><input type="checkbox" required disabled={!status.gate2 || busy || !reviewingAccepted} />I explicitly authorize a local production video render of these approved inputs.</label>
      <button disabled={!status.gate2 || busy || !reviewingAccepted}>{busy ? "Working…" : "Render approved video locally"}</button><p className="text-xs text-[#aeb4b0]">Rendering never publishes. Interrupted jobs retain outputs and expire after 30 minutes; retry explicitly.</p>
    </form>
    {error && <p role="alert" className="mt-4 text-[#f5b5a6]">{error}</p>}
    <details className="mt-5"><summary>Render history ({status.history.length})</summary><ul className="mt-3 space-y-3">{status.history.map((item) => <li key={item.id}>{item.kind}{item.payload.error && ` · ${item.payload.error}`}{item.kind === "rendered" && <a className="ml-3" href={`/api/projects/${projectId}/export/${item.payload.jobId}`}>Download verified local export</a>}</li>)}</ul></details>
  </section>;
}
