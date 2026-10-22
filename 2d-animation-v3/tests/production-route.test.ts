import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { POST } from "../app/api/projects/[id]/render/route.ts";

test("render route rejects foreign origins, oversized bodies and missing explicit authorization before creating jobs", async () => {
  const context = { params: Promise.resolve({ id: randomUUID() }) };
  for (const [origin, body, status] of [["https://example.test", "{}", 403], ["http://127.0.0.1:3003", "x".repeat(501), 400], ["http://127.0.0.1:3003", JSON.stringify({ binding: "a".repeat(64), authorize: false }), 400]] as const) {
    const response = await POST(new Request("http://127.0.0.1:3003/api/projects/fixture/render", { method: "POST", headers: { host: "127.0.0.1:3003", origin, "content-type": "application/json" }, body }), context);
    assert.equal(response.status, status);
  }
});
