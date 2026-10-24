import { z } from "zod";
import { readConfig } from "../../../../../../server/config.ts";
import { openTiming } from "../../../../../../server/timing-store.ts";
import { mediaResponse } from "../../../../../../server/media-response.ts";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string; timingId: string }> }) {
  const { id, timingId } = await params; if (![id, timingId].every((id) => z.uuid().safeParse(id).success)) return new Response(null, { status: 404 });
  const config = readConfig(), store = openTiming(config.dataDirectory, config.videosDirectory);
  try { return mediaResponse(request, new Uint8Array(store.audio(id, timingId)), "audio/wav"); }
  catch { return new Response(null, { status: 404 }); } finally { store.close(); }
}
export const HEAD = GET;
