import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { readWorkflowResponse } from "../workflow/stream-events.ts";
import { preflight } from "../server/preflight.ts";
import { readConfig } from "../server/config.ts";
import { runWorkflow } from "../scripts/workflow.ts";

test("workflow progress handles split UTF-8 events, reports messages before completion and rejects errors or truncated results", async () => {
  const encoder = new TextEncoder(), raw = encoder.encode('{"message":"Rendering…"}\n{"jobId":"complete"}\n');
  const response = new Response(new ReadableStream({ start(controller) { for (const byte of raw) controller.enqueue(new Uint8Array([byte])); controller.close(); } }));
  const messages: string[] = [];
  assert.deepEqual(await readWorkflowResponse(response, (message) => messages.push(message)), { jobId: "complete" });
  assert.deepEqual(messages, ["Rendering…"]);
  await assert.rejects(readWorkflowResponse(new Response('{"message":"Working"}\n'), () => {}), /before completion/);
  await assert.rejects(readWorkflowResponse(new Response('{"error":"Failed safely"}\n'), () => {}), /Failed safely/);
  await assert.rejects(readWorkflowResponse(new Response("x".repeat(12001)), () => {}), /event exceeds/);
});

test("gateway preflight uses bounded model discovery only and never generates content or exposes upstream responses", async (t) => {
  const paths: string[] = [];
  const server = createServer((request, response) => {
    paths.push(request.url!); response.setHeader("Content-Type", "application/json");
    if (request.url === "/ok/models") response.end(JSON.stringify({ data: [{ id: "fixture" }] }));
    else { response.statusCode = 402; response.end("sensitive upstream response"); }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve)); t.after(() => new Promise<void>((resolve) => server.close(() => resolve())));
  const address = server.address(); assert.ok(address && typeof address === "object");
  const config = readConfig({ CLIPROXYAPI_BASE_URL: `http://127.0.0.1:${address.port}/ok`, CLIPROXYAPI_MODEL: "fixture" });
  const result = await preflight("gateway", new AbortController().signal, config); assert.equal(result.ready, true); assert.match(result.limitation, /credit/);
  assert.equal((await preflight("gateway", new AbortController().signal, { ...config, visualModel: "fixture", gateway: { ...config.gateway, model: undefined } })).ready, true);
  await assert.rejects(preflight("gateway", new AbortController().signal, { ...config, gateway: { ...config.gateway, baseUrl: `http://127.0.0.1:${address.port}/fail` } }), (error: Error) => !error.message.includes("sensitive") && error.message.includes("preflight failed"));
  assert.deepEqual(paths, ["/ok/models", "/ok/models", "/fail/models"]);
});

test("reusable workflow help and command validation do not create projects or run generation", async () => {
  assert.match(String(await runWorkflow(["--help"], new AbortController().signal)), /review-motion/);
  await assert.rejects(runWorkflow(["unknown", "anything"], new AbortController().signal), /Unknown workflow/);
  await assert.rejects(runWorkflow(["narrate", "invalid"], new AbortController().signal));
});
