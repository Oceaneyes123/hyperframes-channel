import { readConfig } from "../../../../../server/config.ts";
import { isLocalRequest } from "../../../../../server/local-request.ts";
import { openProduction } from "../../../../../server/production-store.ts";
import { lineTimingSchema } from "../../../../../workflow/production.ts";
import { z } from "zod";
import { narrationUpload } from "../../../../../server/narration-upload.ts";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return Response.json({ error: "Local Studio origin required." }, { status: 403 });
  const { id } = await params; if (!z.uuid().safeParse(id).success) return Response.json({ error: "Invalid project." }, { status: 400 });
  const config = readConfig(); const store = openProduction(config.dataDirectory, config.videosDirectory);
  try {
    const { data, audio } = await narrationUpload(request);
    store.importNarration(id, z.uuid().parse(data.get("motionId")), audio, lineTimingSchema.parse(JSON.parse(z.string().max(30_000).parse(data.get("timing")))));
    return Response.json({ saved: true });
  } catch (error) { return Response.json({ error: error instanceof Error && !(error instanceof z.ZodError) ? error.message : "Invalid narration or timing." }, { status: 400 }); }
  finally { store.close(); }
}
