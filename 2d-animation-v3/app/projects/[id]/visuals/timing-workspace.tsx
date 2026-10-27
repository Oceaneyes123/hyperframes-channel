"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlanningTiming } from "../../../../workflow/timing.ts";
import type { openNarrationStudio } from "../../../../server/narration/studio.ts";

type Take = ReturnType<ReturnType<typeof openNarrationStudio>["list"]>[number];

export default function TimingWorkspace({ projectId, scriptId, timing, takes }: {
  projectId: string; scriptId: string | null; timing: { artifact: PlanningTiming; stale: boolean } | null; takes: Take[];
}) {
  const router = useRouter(); const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/projects/${projectId}/timing`, { method: "POST", body: data }); const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Planning narration import failed."); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Planning narration import failed."); } finally { setBusy(false); }
  }
  async function takeAction(input: object) {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/projects/${projectId}/narration-takes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const text = await response.text(); if (!response.ok || text.length > 12000) throw new Error("Narration request could not start.");
      const events = text.trim().split("\n").map((line) => JSON.parse(line));
      if (events.some((event) => event.error) || !events.some((event) => event.generated || event.saved)) throw new Error("Narration request failed. Existing takes remain available.");
      router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Narration request failed."); } finally { setBusy(false); }
  }
  return <section aria-labelledby="timing-heading" className="mt-4 space-y-4">
    <h2 id="timing-heading" className="text-xl font-semibold">Plan motion with measured narration</h2>
    <p className="text-sm text-[var(--muted)]">Import after accepting the script. Motion proposals can use these timings; final narration and production approvals still bind to the accepted motion.</p>
    {!scriptId && <p>Accept the current script before importing planning narration.</p>}
    <details><summary>Generate and compare local auditions</summary>
      <p className="my-3 text-sm">Generated takes are not approved narration. Listen and verify every boundary before import. A single-line take is an audition and cannot replace a complete take automatically.</p>
      <form className="space-y-3" onSubmit={(event) => {
        event.preventDefault(); const form = new FormData(event.currentTarget);
        try {
          const pronunciation = JSON.parse(String(form.get("pronunciation") || "[]"));
          void takeAction({ action: "generate", scriptId, provider: form.get("provider"), ...(form.get("lineNumber") ? { lineNumber: Number(form.get("lineNumber")) } : {}), pronunciation, rate: Number(form.get("rate")), seed: Number(form.get("seed")) });
        } catch { setError("Pronunciation dictionary must be valid JSON."); }
      }}>
        <label className="block">Audition provider<select name="provider" required defaultValue="" className="ml-3"><option value="" disabled>Choose a provider</option><option value="windows-speech">Windows Speech</option><option value="qwen3-custom">Qwen 1.7B CustomVoice (requires local configuration)</option></select></label>
        <label className="block">Optional script line number<input className="ml-3" name="lineNumber" type="number" min={1} /></label>
        <label className="block">Pronunciation dictionary (JSON)<textarea name="pronunciation" rows={2} defaultValue="[]" maxLength={8000} className="mt-2 w-full" placeholder={'[{"term":"API","spoken":"A P I"}]'} /></label>
        <label className="block">Windows voice rate (-3 to 3)<input className="ml-3" name="rate" type="number" min={-3} max={3} defaultValue={0} required /></label>
        <label className="block">Seed<input className="ml-3" name="seed" type="number" min={0} max={2147483647} defaultValue={42} required /></label>
        <button disabled={!scriptId || busy}>{busy ? "Working…" : "Generate audition"}</button>
      </form>
      <ul className="my-4 space-y-4">{takes.map((take) => <li key={take.id} className="border border-[var(--line)] p-3 text-sm">
        <p>{take.provider} · {take.voice} · {take.durationSeconds.toFixed(1)}s · {take.complete ? "complete" : "single-line audition"}{take.stale ? " · stale script" : ""}</p>
        <p>{take.supportsDelivery ? "Delivery instructions supported; listening review required." : "This provider does not apply expressive delivery instructions."}</p>
        <audio controls preload="none" src={`/api/projects/${projectId}/narration-takes/${take.id}`} />
        <details><summary>Measured line boundaries</summary><ul>{take.segments.map((segment) => <li key={segment.number}>Line {segment.number}: {(segment.startFrame / 30).toFixed(2)}–{(segment.endFrame / 30).toFixed(2)}s · {segment.sourceText}</li>)}</ul></details>
        <form className="mt-2" onSubmit={(event) => { event.preventDefault(); void takeAction({ action: "import", id: take.id, baseId: timing?.artifact.id ?? null, reviewed: new FormData(event.currentTarget).get("reviewed") === "on" }); }}>
          <label className="flex gap-2"><input name="reviewed" type="checkbox" required disabled={!take.complete || take.stale} />I listened and verified the spoken text and each measured boundary.</label>
          <button className="secondary mt-2" disabled={busy || !take.complete || take.stale}>Import for motion planning</button>
        </form>
      </li>)}</ul>
    </details>
    {timing && <div><p>{timing.artifact.measured.durationSeconds.toFixed(1)}s · {timing.artifact.anchors.length} measured phrase/word spans · {timing.stale ? "stale after script changes" : "current script"}</p><audio controls preload="metadata" src={`/api/projects/${projectId}/timing/${timing.artifact.id}`} /></div>}
    <form onSubmit={upload} className="space-y-3">
      <input type="hidden" name="scriptId" value={scriptId ?? ""} /><input type="hidden" name="baseId" value={timing?.artifact.id ?? ""} />
      <label className="block">Narration (.wav, PCM16, max 16 MB)<input type="file" name="audio" accept="audio/wav,.wav" required className="mt-2 block" /></label>
      <label className="block">Measured line timings (JSON, 30 fps)<textarea name="timing" required rows={3} maxLength={30000} placeholder={'[{"number":1,"startFrame":0,"endFrame":90}]'} className="mt-2 w-full" /></label>
      <label className="block">Optional phrase/word spans (JSON)<textarea name="anchors" rows={3} maxLength={200000} placeholder={'[{"id":"key-word","lineNumber":1,"kind":"word","text":"idea","startFrame":20,"endFrame":30,"provenance":"manual"}]'} className="mt-2 w-full" /></label>
      <label className="block">Timing source<select name="provenance" className="ml-3"><option value="manual">Manually measured/corrected</option><option value="verified-aligner">Verified alignment tool</option></select></label>
      <label className="block">Verified aligner evidence (JSON, required for verified-aligner)<textarea name="alignmentEvidence" rows={3} maxLength={4000} placeholder={'{"engine":"aligner-name","version":"exact-version","audioHash":"sha256","transcriptHash":"accepted-script-sha256","reviewedByHuman":true,"reviewNotes":"Checked against actual audio."}'} className="mt-2 w-full" /></label>
      <label className="flex gap-3"><input type="checkbox" required />I verified these times against this audio. Word times are not estimated from reading speed.</label>
      <button disabled={!scriptId || busy}>{busy ? "Importing…" : timing ? "Save timing correction" : "Import planning narration"}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  </section>;
}
