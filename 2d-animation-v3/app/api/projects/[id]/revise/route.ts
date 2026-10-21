import "server-only";
import { z } from "zod";
import { isLocalRequest } from "../../../../../server/local-request.ts";
import { reviseScript } from "../../../../../server/writer.ts";
import { revisionRequestSchema } from "../../../../../workflow/review.ts";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return new Response("Local request required", { status: 403 });
  const { id } = await params;
  let input;
  try {
    z.uuid().parse(id);
    if (!request.headers.get("content-type")?.includes("application/json") || !request.body) throw new Error();
    const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        size += chunk.value.byteLength; if (size > 12_000) throw new Error();
        chunks.push(chunk.value);
      }
    } finally { await reader.cancel(); reader.releaseLock(); }
    input = revisionRequestSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return Response.json({ error: "Invalid revision request." }, { status: 400 }); }
  const controller = new AbortController();
  const signal = AbortSignal.any([request.signal, controller.signal]);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(output) {
      const send = (event: object) => { if (!signal.aborted) output.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); };
      try {
        const proposalId = await reviseScript(id, input, signal, (message) => send({ message }));
        send({ proposalId });
      } catch { send({ error: "Request failed. No script changes applied. Check saved request history and gateway access before retrying." }); }
      finally { if (!signal.aborted) output.close(); }
    },
    cancel() { controller.abort(); },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
