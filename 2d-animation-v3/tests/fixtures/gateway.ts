import { createServer } from "node:http";
import { once } from "node:events";
import { fixtureVisuals } from "./visuals.ts";
import { fixtureMotion } from "./motion.ts";

type Body = { messages: { content: string }[] };

export function fixtureWriting(body: Body) {
  if (body.messages[0].content.includes("Motion proposal contract")) return fixtureMotion(body);
  if (body.messages[0].content.includes("static planning drawings")) return fixtureVisuals(body);
  const context = JSON.parse(body.messages[1].content);
  if (context.script) return { verdict: "ready", summary: "Deterministic editorial fixture, not human review.", findings: [] };
  if (context.original) return context.original;
  if (context.hook) return { lines: [
    { text: context.hook.spoken, claimIds: context.hook.claimIds },
    ...context.brief.claims.map((claim: { statement: string; id: string }) => ({ text: claim.statement, claimIds: [claim.id] })),
    { text: context.brief.payoff, claimIds: [] },
  ] };
  return { hooks: Array.from({ length: 5 }, (_, index) => ({ id: `hook-${index + 1}`, angle: ["Question", "Example", "Mechanism", "Choice", "Comparison"][index],
    spoken: ["How does this work?", "Start with this example.", "Watch what happens next.", "Which choice changes the result?", "Compare these two outcomes."][index],
    openingVisual: "Synthetic teaching diagram, not rendered.", overlay: "", payoffConnection: context.brief.payoff,
    claimIds: [context.brief.claims[0].id] })) };
}

export async function fakeGateway(mode = "ok", port = 0, respond?: (body: Body, index: number) => unknown) {
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
    const output = mode === "invalid" ? "not JSON" : mode === "oversized" ? "x".repeat(310_000) : JSON.stringify(respond ? respond(body, requests.length - 1) : mode === "writing" ? fixtureWriting(body) : { replacement: "A clearer opening.", notes: "Deterministic test fixture; no model was called." });
    const chunk = { choices: [{ index: 0, delta: mode === "tools" ? { tool_calls: [{}] } : { content: output }, finish_reason: null }] };
    const content = mode === "fragmented" ? Array.from(output).map((character) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: character }, finish_reason: null }] })}\r\n\r\n`).join("") : `data: ${JSON.stringify(chunk)}\r\n\r\n`;
    const data = `: fixture\r\n\r\n${content}data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: mode === "length" ? "length" : "stop" }] })}\r\n\r\n${mode === "truncated" ? "" : "data: [DONE]\r\n\r\n"}`;
    const bytes = Buffer.from(data);
    response.write(bytes.subarray(0, 17));
    setImmediate(() => { response.end(bytes.subarray(17)); });
  });
  server.listen(port, "127.0.0.1"); await once(server, "listening");
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Fixture failed");
  return { baseUrl: `http://127.0.0.1:${address.port}/v1`, requests, close: () => { server.closeAllConnections(); return new Promise<void>((resolve) => server.close(() => resolve())); } };
}

if (process.argv.includes("--serve")) {
  const fixture = await fakeGateway(process.argv.includes("--writing") ? "writing" : "ok", 3105);
  console.log(`Deterministic gateway fixture: ${fixture.baseUrl}`);
}
