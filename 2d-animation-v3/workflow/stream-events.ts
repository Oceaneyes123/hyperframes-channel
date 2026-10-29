import { z } from "zod";

// Bound the transport, including incomplete lines, while showing progress as it arrives.
export async function readWorkflowResponse(response: Response, progress: (message: string) => void) {
  if (!response.ok || !response.body) throw new Error("Workflow request could not start.");
  const reader = response.body.getReader(), decoder = new TextDecoder();
  let pending = "", bytes = 0, result: Record<string, string> = {};
  function event(line: string) {
    if (!line.trim()) return;
    const value = z.record(z.string(), z.string().max(4000)).parse(JSON.parse(line));
    if (value.error) throw new Error(value.error);
    if (value.message) progress(value.message);
    else result = value;
  }
  try {
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      bytes += chunk.value.byteLength; if (bytes > 1_000_000) throw new Error("Workflow response exceeds its limit.");
      pending += decoder.decode(chunk.value, { stream: true });
      let boundary: number;
      while ((boundary = pending.indexOf("\n")) >= 0) { event(pending.slice(0, boundary)); pending = pending.slice(boundary + 1); }
      if (pending.length > 12000) throw new Error("Workflow event exceeds its limit.");
    }
    pending += decoder.decode(); event(pending);
    if (!Object.keys(result).length) throw new Error("Workflow ended before completion. Check saved history before retrying.");
    return result;
  } finally { await reader.cancel(); reader.releaseLock(); }
}
