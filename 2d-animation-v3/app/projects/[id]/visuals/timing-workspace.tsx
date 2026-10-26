"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlanningTiming } from "../../../../workflow/timing.ts";

export default function TimingWorkspace({ projectId, scriptId, timing }: {
  projectId: string; scriptId: string | null; timing: { artifact: PlanningTiming; stale: boolean } | null;
}) {
  const router = useRouter(); const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/projects/${projectId}/timing`, { method: "POST", body: data }); const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Planning narration import failed."); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Planning narration import failed."); } finally { setBusy(false); }
  }
  return <section aria-labelledby="timing-heading" className="mt-4 space-y-4">
    <h2 id="timing-heading" className="text-xl font-semibold">Plan motion with measured narration</h2>
    <p className="text-sm text-[var(--muted)]">Import after accepting the script. Motion proposals can use these timings; final narration and production approvals still bind to the accepted motion.</p>
    {!scriptId && <p>Accept the current script before importing planning narration.</p>}
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
