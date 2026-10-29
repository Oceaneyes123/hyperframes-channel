import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("local ASR mapping never invents timestamps for unmatched script words", () => {
  const result = spawnSync("python", ["scripts/align-local.py", "--self-test"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /self-test passed/);
});
