import { readConfig } from "../../../../../server/config.ts";
import { isLocalRequest } from "../../../../../server/local-request.ts";
import { openProduction } from "../../../../../server/production-store.ts";
import { lineTimingSchema } from "../../../../../workflow/production.ts";
import { z } from "zod";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return Response.json({ error: "Local Studio origin required." }, { status: 403 });
  const { id } = await params; if (!z.uuid().safeParse(id).success) return Response.json({ error: "Invalid project." }, { status: 400 });
  const config = readConfig(); const store = openProduction(config.dataDirectory, config.videosDirectory);
  try {
    const reader = request.body?.getReader(); if (!reader) throw new Error("Missing upload."); const parts: Uint8Array[] = []; let size = 0;
    try { while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 17_000_000) throw new Error("Narration upload exceeds 17 MB."); parts.push(part.value); } } finally { await reader.cancel(); reader.releaseLock(); }
    const data = await new Response(Buffer.concat(parts), { headers: { "Content-Type": request.headers.get("Content-Type") ?? "" } }).formData();
    const file = data.get("audio"); if (!(file instanceof File)) throw new Error("Choose a PCM16 WAV narration file.");
    store.importNarration(id, z.uuid().parse(data.get("motionId")), Buffer.from(await file.arrayBuffer()), lineTimingSchema.parse(JSON.parse(z.string().max(30_000).parse(data.get("timing")))));
    return Response.json({ saved: true });
  } catch (error) { return Response.json({ error: error instanceof Error && !(error instanceof z.ZodError) ? error.message : "Invalid narration or timing." }, { status: 400 }); }
  finally { store.close(); }
}
