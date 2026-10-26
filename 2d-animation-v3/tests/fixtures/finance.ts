import { componentParts } from "../../workflow/components.ts";
import { comparisonSources } from "../../workflow/comparison.ts";
import { motionBeatSchema, motionPlanSchema } from "../../workflow/motion.ts";
import { hashMotionSource } from "../../server/motion-store.ts";
import { frameSchema, visualArtifactSchema, type Frame } from "../../workflow/visuals.ts";
import { presetScene } from "./motion-presets.ts";

const source = comparisonSources.find((entry) => entry.source.id === "card-declined-example@1")!;
const base = { background: "#F5F3ED", shapes: [] } satisfies Frame;

function financeParts(type: "payment-terminal@1" | "banking-balance@1", selected?: string) {
  const parts = componentParts(type, "#9BA7FF");
  if (selected) { parts[selected].opacity = 1; parts[selected].reveal = 0; }
  return parts;
}

function number(recordId: string, y: number, x = 48, width = 27, color = "#F0F4F7"): Frame["shapes"][number] {
  return { type: "numeric-display@1", x, y, width, height: 5, color, label: "",
    numeric: { sourceId: source.source.id, contentHash: source.contentHash, recordId },
    parts: { digits: { x: 0, y: 0, scale: 1, opacity: 1, color: "#F0F4F7", numericProgress: 1 } } };
}

export function financeFrame(kind: "terminal" | "balance", active = false): Frame {
  const type = kind === "terminal" ? "payment-terminal@1" : "banking-balance@1";
  const parts = financeParts(type, active ? (kind === "terminal" ? "declined" : "current") : undefined);
  if (active && kind === "terminal") parts.declined.reveal = 1;
  if (active && kind === "balance") {
    for (const state of Object.values(parts)) { state.opacity = 1; state.reveal = 1; }
  }
  const shapes: Frame["shapes"] = [
    { type: "heading", x: 8, y: 6, width: 84, height: 9, color: "#173B39", label: "A small balance gap" },
    { type, x: 15, y: 18, width: 70, height: 64, color: "#9BA7FF", label: kind === "terminal" ? "Arc Payments" : "Arc Bank", parts },
  ];
  if (kind === "balance") shapes.push(number("current", 36, 54, 21), number("available", 49, 54, 21), number("hold", 62, 54, 21));
  return frameSchema.parse({ ...base, shapes });
}

export const styleDirections = [
  { title: "Ledger gap", frame: financeFrame("balance", true) },
  { title: "The terminal moment", frame: financeFrame("terminal", true) },
  { title: "Two balances, one purchase", frame: frameSchema.parse({ background: "#101A26", shapes: [
    { type: "heading", x: 8, y: 6, width: 84, height: 9, color: "#F5F3ED", label: "Same account, two views" },
    { type: "caption", x: 10, y: 31, width: 34, height: 6, color: "#F5F3ED", label: "Current balance" },
    number("current", 40, 10, 34),
    { type: "caption", x: 56, y: 31, width: 34, height: 6, color: "#8DDFC8", label: "Available" },
    number("available", 40, 56, 34, "#8DDFC8"),
    { type: "caption", x: 24, y: 62, width: 52, height: 6, color: "#F1A16D", label: "Purchase" },
    number("purchase", 72, 32, 36, "#F1A16D"),
  ] }) },
];

export function financeFixture() {
  const terminalStart = financeFrame("terminal", true).shapes;
  terminalStart[1].parts!.declined.reveal = 0;
  const terminalEnd = structuredClone(terminalStart);
  terminalEnd[1].parts!.declined.reveal = 1;
  const balanceStart = financeFrame("balance", true).shapes;
  const balanceEnd = structuredClone(balanceStart);
  balanceEnd[1].parts!.current.reveal = 1;
  const first = presetScene(terminalStart, terminalEnd, [[0, 0], [1, 1]], {
    presetId: "mask-reveal@1", parameters: { reveal: 1 }, targetIds: ["object-2.declined"],
  });
  const second = presetScene(balanceStart, balanceEnd, [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]], {
    presetId: "mask-reveal@1", parameters: { reveal: 1 }, targetIds: ["object-2.current"],
  });
  const board = structuredClone(first.board);
  const firstOutput = first.board.output, secondOutput = second.board.output;
  if (board.output.kind !== "storyboard" || firstOutput.kind !== "storyboard" || secondOutput.kind !== "storyboard") throw new Error("Expected finance storyboards.");
  const drawings = [firstOutput.shots[0], secondOutput.shots[0]];
  const boardShots = drawings.map((shot, index) => ({ ...shot, lineNumbers: [index + 1], seconds: 4, transition: index ? "hard-cut" as const : "start" as const }));
  board.output.shots = boardShots;
  const plan = structuredClone(first.plan);
  plan.energyProfile = "energetic";
  plan.shots = [first.plan.shots[0], second.plan.shots[0]].map((shot, index) => {
    const next = structuredClone(shot);
    Object.assign(next, { id: `finance-${index + 1}`, sourceIndex: index, sourceHash: hashMotionSource(boardShots[index]), lineNumbers: [index + 1], durationFrames: 120 });
    next.incoming.type = index ? "hard-cut" : "start";
    const startShapes = index ? balanceStart : terminalStart;
    next.objects.forEach((object, objectIndex) => { object.initialParts = startShapes[objectIndex].parts; });
    next.beats = [
      ...(index ? [] : [motionBeatSchema.parse({ id: "finance-reveal", purpose: "Reveal the supplied finance state.", type: "transformation", presetId: "mask-reveal@1", parameters: { reveal: 1 }, targetIds: ["object-2.declined"], startFrame: 3, endFrame: 24, importance: "primary", narrationAnchor: null, continuity: null })]),
      motionBeatSchema.parse({ id: "finance-hold", purpose: "Hold the exact state for reading.", type: "hold", presetId: "hold@1", parameters: {}, targetIds: ["object-1", "object-2"], startFrame: 30, endFrame: 118, importance: "primary", narrationAnchor: null, continuity: null }),
    ];
    return next;
  });
  return { board: visualArtifactSchema.parse(board), plan: motionPlanSchema.parse(plan) };
}
