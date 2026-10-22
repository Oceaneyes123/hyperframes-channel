import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { readConfig } from "../../../../../../server/config.ts";
import { openProduction } from "../../../../../../server/production-store.ts";
import { mediaResponse } from "../../../../../../server/media-response.ts";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string; jobId: string }> }) {
  const { id, jobId } = await params; if (![id, jobId].every((value) => z.uuid().safeParse(value).success)) return new Response(null, { status: 404 });
  const config = readConfig(), store = openProduction(config.dataDirectory, config.videosDirectory);
  try {
    const receipt = store.exportRecord(id, jobId); if (!receipt) return new Response(null, { status: 404 });
    const bytes = readFileSync(join(config.videosDirectory, id, "production", jobId, "export.mp4"));
    if (createHash("sha256").update(bytes).digest("hex") !== receipt.payload.verification.sha256) throw new Error("Export integrity failed.");
    return mediaResponse(request, new Uint8Array(bytes), "video/mp4", `${jobId}.mp4`);
  } catch { return new Response(null, { status: 404 }); } finally { store.close(); }
}
export const HEAD = GET;
