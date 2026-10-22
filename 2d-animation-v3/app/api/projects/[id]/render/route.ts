import { z } from "zod";
import { isLocalRequest } from "../../../../../server/local-request.ts";
import { renderProduction } from "../../../../../server/render.ts";
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return Response.json({ error: "Local Studio origin required." }, { status: 403 });
  try {
    const { id } = await params; z.uuid().parse(id);
    const reader = request.body?.getReader(); if (!reader || !request.headers.get("content-type")?.includes("application/json")) throw new Error("Invalid render request.");
    const parts: Uint8Array[] = []; let size = 0;
    try { while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 500) throw new Error("Invalid render request."); parts.push(part.value); } } finally { await reader.cancel(); reader.releaseLock(); }
    const input = z.strictObject({ binding: z.string().regex(/^[a-f0-9]{64}$/), authorize: z.literal(true) }).parse(JSON.parse(Buffer.concat(parts).toString("utf8")));
    const jobId = await renderProduction(id, input.binding, input.authorize, request.signal); return Response.json({ jobId });
  } catch { return Response.json({ error: "Render unavailable, failed or inputs changed. Both exact gates and explicit authorization are required. Check history before retrying." }, { status: 400 }); }
}
