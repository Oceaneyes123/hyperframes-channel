import { z } from "zod";
import { readConfig } from "../../../../../../server/config.ts";
import { openProduction } from "../../../../../../server/production-store.ts";
import { mediaResponse } from "../../../../../../server/media-response.ts";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string; audioId: string }> }) {
  const { id, audioId } = await params; if (![id, audioId].every((id) => z.uuid().safeParse(id).success)) return new Response(null, { status: 404 });
  const config = readConfig(), store = openProduction(config.dataDirectory, config.videosDirectory);
  try { const voice = store.audio(id, audioId); return mediaResponse(request, new Uint8Array(voice.mixedBytes ?? voice.bytes), "audio/wav"); }
  catch { return new Response(null, { status: 404 }); } finally { store.close(); }
}
export const HEAD = GET;
