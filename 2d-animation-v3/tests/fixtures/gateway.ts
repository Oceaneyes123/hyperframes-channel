import { createServer } from "node:http";
import { once } from "node:events";

export async function fakeGateway(mode = "ok", port = 0) {
  const requests: { messages: { content: string }[] }[] = [];
  const server = createServer(async (request, response) => {
    if (request.url === "/v1/models") {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ data: [{ id: mode === "missing-model" ? "other" : "fixture-model" }] })); return;
    }
    if (request.url !== "/v1/chat/completions") { response.writeHead(404).end(); return; }
    const parts = []; for await (const part of request) parts.push(part);
    const body = JSON.parse(Buffer.concat(parts).toString()); requests.push(body);
    if (mode === "http-error") { response.writeHead(401).end("private upstream detail"); return; }
    response.setHeader("Content-Type", "text/event-stream");
    if (mode === "hang") { response.write(": waiting\n\n"); return; }
    const output = mode === "invalid" ? "not JSON" : mode === "oversized" ? "x".repeat(310_000) : JSON.stringify({ replacement: "A clearer opening.", notes: "Deterministic test fixture; no model was called." });
    const chunk = { choices: [{ index: 0, delta: mode === "tools" ? { tool_calls: [{}] } : { content: output }, finish_reason: null }] };
    const data = `: fixture\r\n\r\ndata: ${JSON.stringify(chunk)}\r\n\r\ndata: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: mode === "length" ? "length" : "stop" }] })}\r\n\r\n${mode === "truncated" ? "" : "data: [DONE]\r\n\r\n"}`;
    const bytes = Buffer.from(data);
    response.write(bytes.subarray(0, 17));
    setImmediate(() => { response.end(bytes.subarray(17)); });
  });
  server.listen(port, "127.0.0.1"); await once(server, "listening");
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Fixture failed");
  return { baseUrl: `http://127.0.0.1:${address.port}/v1`, requests, close: () => { server.closeAllConnections(); return new Promise<void>((resolve) => server.close(() => resolve())); } };
}

if (process.argv.includes("--serve")) {
  const fixture = await fakeGateway("ok", 3105);
  console.log(`Deterministic gateway fixture: ${fixture.baseUrl}`);
}
