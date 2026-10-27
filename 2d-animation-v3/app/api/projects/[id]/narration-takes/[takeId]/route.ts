import { z } from "zod";
import { readConfig } from "../../../../../../server/config.ts";
import { openNarrationStudio } from "../../../../../../server/narration/studio.ts";
import { mediaResponse } from "../../../../../../server/media-response.ts";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string; takeId: string }> }) {
  const { id, takeId } = await params; if (![id, takeId].every((value) => z.uuid().safeParse(value).success)) return new Response(null, { status: 404 });
  const config = readConfig(), store = openNarrationStudio(config.dataDirectory, config.videosDirectory);
  try { return mediaResponse(request, new Uint8Array(store.read(id, takeId).audio), "audio/wav"); }
  catch { return new Response(null, { status: 404 }); } finally { store.close(); }
}
export const HEAD = GET;
