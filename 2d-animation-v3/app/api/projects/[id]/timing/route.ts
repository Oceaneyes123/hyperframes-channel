import { z } from "zod";
import { readConfig } from "../../../../../server/config.ts";
import { isLocalRequest } from "../../../../../server/local-request.ts";
import { narrationUpload } from "../../../../../server/narration-upload.ts";
import { openTiming } from "../../../../../server/timing-store.ts";
import { ConflictError } from "../../../../../server/studio.ts";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return Response.json({ error: "Local Studio origin required." }, { status: 403 });
  const { id } = await params; if (!z.uuid().safeParse(id).success) return Response.json({ error: "Invalid project." }, { status: 400 });
  let store: ReturnType<typeof openTiming> | undefined;
  try {
    const { data, audio } = await narrationUpload(request), config = readConfig(); store = openTiming(config.dataDirectory, config.videosDirectory);
    const saved = store.import(id, { scriptId: data.get("scriptId"), baseId: data.get("baseId") || null,
      timing: JSON.parse(z.string().max(30_000).parse(data.get("timing"))), anchors: JSON.parse(z.string().max(200_000).parse(data.get("anchors") || "[]")), provenance: data.get("provenance") }, audio);
    return Response.json({ saved: true, id: saved });
  } catch (error) { return Response.json({ error: error instanceof ConflictError ? error.message : "Invalid planning narration or measured timing. Prior inputs preserved." }, { status: error instanceof ConflictError ? 409 : 400 }); }
  finally { store?.close(); }
}
