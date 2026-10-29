import { z } from "zod";
import { isLocalRequest } from "./local-request.ts";
import { PreflightError } from "./preflight.ts";

export async function streamWriting<T>(request: Request, projectId: string, parse: (input: unknown) => T,
  execute: (input: T, signal: AbortSignal, progress: (message: string) => void) => Promise<Record<string, string>>) {
  if (!isLocalRequest(request.headers.get("host"), request.headers.get("origin"))) return new Response("Local request required", { status: 403 });
  let input: T;
  try {
    z.uuid().parse(projectId);
    if (!request.headers.get("content-type")?.includes("application/json") || !request.body) throw new Error();
    const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        size += chunk.value.byteLength; if (size > 12_000) throw new Error();
        chunks.push(chunk.value);
      }
    } finally { await reader.cancel(); reader.releaseLock(); }
    input = parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return Response.json({ error: "Invalid writing request." }, { status: 400 }); }
  const controller = new AbortController();
  const signal = AbortSignal.any([request.signal, controller.signal]);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(output) {
      const send = (event: object) => { if (!signal.aborted) output.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); };
      try { send(await execute(input, signal, (message) => send({ message }))); }
      catch (error) { send({ error: error instanceof PreflightError ? error.message : "Request failed. Earlier saved artifacts preserved. Check request history and gateway access before retrying." }); }
      finally { if (!signal.aborted) output.close(); }
    },
    cancel() { controller.abort(); },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
