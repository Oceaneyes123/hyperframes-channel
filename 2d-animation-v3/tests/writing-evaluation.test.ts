import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { blindReview, evaluationBriefs } from "../scripts/evaluate-writing.ts";

test("evaluation briefs retain all five topics, supplied claims and synthetic boundaries", () => {
  const packet = JSON.parse(readFileSync("docs/phase0/scripting-briefs.json", "utf8"));
  const entries = evaluationBriefs(packet);
  assert.equal(entries.length, 5);
  for (const [index, entry] of entries.entries()) {
    assert.deepEqual(entry.brief.claims.map((claim) => claim.statement), packet.briefs[index].facts);
    assert.equal(entry.brief.targetSeconds, 55);
    assert.doesNotMatch(entry.brief.boundaries, /Record actual model\//);
    for (const limit of packet.briefs[index].boundaries) assert.ok(entry.brief.boundaries.includes(limit));
  }
  assert.ok(entries.find((entry) => entry.id === "ai-invoice-check")!.brief.sources[0].notes.includes("fictional"));
  assert.throws(() => evaluationBriefs({ ...packet, briefs: [...packet.briefs.slice(0, 4), packet.briefs[0]] }));
  assert.equal(100 * 0.5 * 1.5, 75); assert.equal((100 - 50) / 50, 1);
  assert.equal(100 + 5, 105); assert.equal(200 - 10 - 20, 170);
});

test("blind packet follows its private key, preserves exact text, and omits condition metadata", () => {
  const entries = evaluationBriefs(JSON.parse(readFileSync("docs/phase0/scripting-briefs.json", "utf8")));
  const script = (text: string) => ({ lines: [1, 2, 3].map((i) => ({ text: `${text} ${i}`, claimIds: [] })) });
  const pairs = entries.map((entry) => ({ ...entry, baseline: script("First text"), trial: script("Second text") }));
  const packet = blindReview(pairs, [true, false, true, false, false]);
  assert.equal(packet.key[0].A, "baseline"); assert.equal(packet.key[1].A, "trial");
  const sections = packet.markdown.split(/^## \d+\./m).slice(1);
  assert.equal(sections.length, 5);
  for (const [index, section] of sections.entries()) {
    const a = section.split("### A\n\n")[1].split("### B")[0];
    assert.ok(a.includes(packet.key[index].A === "baseline" ? "First text 1" : "Second text 1"));
    assert.ok(section.includes("Read both aloud"));
  }
  assert.doesNotMatch(packet.markdown, /baseline|trial|gpt-|sha256|"verdict"/i);
  assert.throws(() => blindReview(pairs.slice(1), [true, false, true, false, true]));
});
