import { componentParts } from "../../workflow/components.ts";
import { readConfig } from "../../server/config.ts";
import { openVisuals } from "../../server/visual-store.ts";

const projectId = "6f7f6053-5217-4b71-a5cc-79214a20206e";
const scriptId = "8cd530b7-598b-4bf0-946d-d52d65b65e27";
const selectionId = "2a9db5c2-9ee6-4697-a5ee-d7896fec849b";
const ink = "#10202B";
const paper = "#F3EFE5";
const navy = "#091523";
const coral = "#D9633F";
const amber = "#D89B45";
const teal = "#2D8A78";
const mint = "#8DDFC8";
const blue = "#78A6FF";
const white = "#FFF8E9";

function component(type, x, y, width, height, color, active = [], details) {
  const parts = componentParts(type, color, undefined, details);
  for (const [id, state] of Object.entries(parts)) {
    state.opacity = active.length === 0 || active.includes(id) ? 1 : 0;
    if (["payment-terminal@1", "banking-balance@1"].includes(type)) state.reveal = 1;
  }
  return { type, x, y, width, height, color, label: "", parts, ...(details ?? {}) };
}

function diagram(direction, nodes, edges, x, y, width, height, start) {
  const graph = { direction, nodes, edges };
  const parts = componentParts("semantic-diagram@1", ink, undefined, { diagram: graph });
  for (const [id, state] of Object.entries(parts)) {
    state.opacity = 1;
    if (edges.some((edge) => edge.id === id)) state.strokeProgress = start ? 0 : id === "response" ? .62 : 1;
  }
  return { type: "semantic-diagram@1", x, y, width, height, color: ink, label: "", diagram: graph, parts };
}

function text(type, label, x, y, width, height, color = ink) {
  return { type, x, y, width, height, color, label };
}

function clone(value) {
  return structuredClone(value);
}

const terminalStart = component("payment-terminal@1", 20, 14, 60, 64, coral, ["processing", "declined"]);
terminalStart.parts.processing.color = coral;
terminalStart.parts.declined.color = coral;
terminalStart.parts.declined.reveal = 0;
const terminalEnd = component("payment-terminal@1", 20, 14, 60, 64, coral, ["processing", "declined"]);
terminalEnd.parts.processing.color = coral;
terminalEnd.parts.declined.color = coral;
terminalEnd.parts.processing.reveal = 0;
const balanceStart = component("banking-balance@1", 8, 13, 84, 72, white, ["current", "available", "hold"]);
balanceStart.parts.hold.reveal = 0;
const balanceEnd = component("banking-balance@1", 8, 13, 84, 72, white, ["current", "available", "hold"]);

const shot1Start = {
  background: navy,
  environment: { family: "soft-gradient", color: navy, accent: coral, depth: .4 },
  shapes: [
    terminalStart,
    { type: "ellipse", x: 4, y: 7, width: 20, height: 12, color: "#E7A84B", label: "" },
    { type: "ellipse", x: 6.4, y: 8.7, width: 15.2, height: 8.6, color: coral, label: "" },
    { type: "ellipse", x: 9, y: 10.2, width: 2.2, height: 1.7, color: "#782F2D", label: "" },
    { type: "ellipse", x: 13.2, y: 11.5, width: 2.2, height: 1.7, color: "#782F2D", label: "" },
    { type: "ellipse", x: 20.3, y: 5.8, width: 5.5, height: 5.5, color: navy, label: "" },
    { type: "rect", x: 8, y: 80, width: 84, height: 13, color: "#152638", label: "" },
    text("heading", "AVAILABLE", 11, 83, 34, 6, white),
    { type: "rect", x: 56, y: 84, width: 28, height: 3, color: teal, label: "" },
    { type: "ellipse", x: 51, y: 82.5, width: 5, height: 5, color: amber, label: "" },
  ],
};
const shot1End = clone(shot1Start);
shot1End.shapes[0] = terminalEnd;
shot1End.shapes[8] = { ...shot1End.shapes[8], x: 70, width: 14 };
shot1End.shapes[9] = { ...shot1End.shapes[9], x: 73 };

const graph2 = {
  direction: "right",
  nodes: [
    { id: "merchant", icon: "product", label: "Merchant" },
    { id: "network", icon: "processor", label: "" },
    { id: "bank", icon: "database", label: "Bank" },
  ],
  edges: [
    { id: "request", from: "merchant", to: "network", label: "" },
    { id: "authorize", from: "network", to: "bank", label: "" },
    { id: "response", from: "bank", to: "merchant", label: "" },
  ],
};
const shot2Start = {
  background: paper,
  environment: { family: "technical-grid", color: paper, accent: teal, depth: .25 },
  shapes: [
    diagram("right", graph2.nodes, graph2.edges, 4, 13, 92, 72, true),
    { type: "ellipse", x: 9, y: 48, width: 5, height: 3, color: amber, label: "" },
    text("heading", "STATUS UNCLEAR", 9, 87, 82, 6),
  ],
};
shot2Start.shapes[0].parts.response.strokeProgress = .62;
const shot2End = clone(shot2Start);
shot2End.shapes[0] = diagram("right", graph2.nodes, graph2.edges, 4, 13, 92, 72, false);
shot2End.shapes[1] = { ...shot2End.shapes[1], x: 79 };

const shot3Start = {
  background: paper,
  environment: { family: "editorial", color: paper, accent: amber, depth: .3 },
  shapes: [
    balanceStart,
    { type: "coin", x: 47, y: 48, width: 10, height: 7, color: amber, label: "" },
    text("heading", "AVAILABLE GOES DOWN", 7, 87, 86, 6),
  ],
};
const shot3End = clone(shot3Start);
shot3End.shapes[0] = balanceEnd;
shot3End.shapes[1] = { ...shot3End.shapes[1], y: 61 };

const graph4 = {
  direction: "right",
  nodes: [
    { id: "record", icon: "document", label: "", emphasis: true },
    { id: "release", icon: "payment", label: "Release", emphasis: true },
    { id: "check", icon: "processor", label: "Reconcile" },
    { id: "refund", icon: "document", label: "Refund" },
  ],
  edges: [
    { id: "release-edge", from: "record", to: "release", label: "" },
    { id: "check-edge", from: "record", to: "check", label: "" },
    { id: "refund-edge", from: "record", to: "refund", label: "" },
  ],
};
const shot4Start = {
  background: paper,
  environment: { family: "geometric", color: paper, accent: blue, depth: .35 },
  shapes: [
    diagram("right", graph4.nodes, graph4.edges, 3, 12, 94, 76, true),
    text("heading", "NO SINGLE TIMING", 7, 89, 86, 6),
  ],
};
for (const [id, color] of [["record", ink], ["release", mint], ["check", blue], ["refund", "#F0A084"]]) {
  shot4Start.shapes[0].parts[id].color = color;
}
for (const [id, color] of [["release-edge", mint], ["check-edge", blue], ["refund-edge", "#F0A084"]]) {
  shot4Start.shapes[0].parts[id].color = color;
}
const shot4End = clone(shot4Start);
shot4End.shapes[0] = diagram("right", graph4.nodes, graph4.edges, 3, 12, 94, 76, false);
for (const [id, color] of [["record", ink], ["release", mint], ["check", blue], ["refund", "#F0A084"]]) {
  shot4End.shapes[0].parts[id].color = color;
}
for (const [id, color] of [["release-edge", mint], ["check-edge", blue], ["refund-edge", "#F0A084"]]) {
  shot4End.shapes[0].parts[id].color = color;
}

const phone5 = component("payment-terminal@1", 6, 9, 40, 46, coral, ["declined"]);
const bank5 = component("banking-balance@1", 54, 9, 40, 46, white, ["current", "available", "hold"]);
const record = [
  { type: "rect", x: 6, y: 60, width: 88, height: 35, color: ink, label: "" },
  { type: "rect", x: 10, y: 67, width: 25, height: 10, color: "#26445B", label: "" },
  { type: "rect", x: 37, y: 67, width: 25, height: 10, color: "#26445B", label: "" },
  { type: "rect", x: 64, y: 67, width: 25, height: 10, color: "#26445B", label: "" },
  text("heading", "AMOUNT • DATE • REFERENCE", 8, 61, 84, 6, white),
  { type: "person", x: 14, y: 81, width: 15, height: 12, color: mint, label: "" },
  { type: "line", x: 31, y: 86, width: 38, height: 1, color: mint, label: "" },
  { type: "database", x: 71, y: 80, width: 15, height: 13, color: mint, label: "" },
];
const shot5Start = {
  background: paper,
  environment: { family: "soft-gradient", color: paper, accent: mint, depth: .35 },
  shapes: [phone5, bank5, ...record],
};
const shot5End = clone(shot5Start);
shot5End.shapes[7] = { ...shot5End.shapes[7], color: coral };
shot5End.shapes[8] = { ...shot5End.shapes[8], color: coral };
shot5End.shapes[9] = { ...shot5End.shapes[9], color: coral };

const shots = [
  {
    lineNumbers: [1], seconds: 4, purpose: "Make the failed screen conflict with the depleted available balance visible.", framing: "Portrait phone with a pizza-order object entering from the upper left.", subject: "A declined payment and a shrinking available-balance meter.", action: "The terminal changes from processing to declined while the available meter shortens.", transition: "start", continuity: "The phone and balance meter establish the persistent objects used again at the close.",
    design: { theme: "editorial-workflow@1", family: "interface-demonstration", meaning: "The failed screen and the missing available money are different observations.", metaphor: "The phone is a window onto a larger financial ledger.", focalPoint: "The declined terminal beside the shrinking available balance.", layout: "Large terminal, small pizza object, one wide balance strip.", density: "sparse", continuityReason: "" },
    startFrame: shot1Start, endFrame: shot1End,
  },
  {
    lineNumbers: [3], seconds: 11, purpose: "Show the request and response crossing different participants, with no confirmed return.", framing: "Wide three-stage route across a portrait canvas.", subject: "Merchant, processor and bank exchanging one transaction.", action: "One token moves through the route while the return path remains incomplete.", transition: "camera", continuity: "The payment leaves the phone and enters a connected financial route.",
    design: { theme: "editorial-workflow@1", family: "technical-cutaway", meaning: "A timeout can leave the final status unknown because the reply is incomplete.", metaphor: "The failed message is a missing reply inside a larger exchange.", focalPoint: "The incomplete return path from the bank.", layout: "Three connected participants with one forward token and a partial return path.", density: "balanced", continuityReason: "The payment object from the opening continues through the route." },
    startFrame: shot2Start, endFrame: shot2End,
  },
  {
    lineNumbers: [5], seconds: 14, purpose: "Distinguish available funds from a pending hold without showing invented amounts.", framing: "Full banking surface centered on the canvas.", subject: "Current, available and pending-hold surfaces.", action: "The amber token moves from available funds into the pending-hold surface.", transition: "hard-cut", continuity: "The same account surface returns from the opening balance strip.",
    design: { theme: "editorial-workflow@1", family: "interface-demonstration", meaning: "A hold can reduce available money before payment completion.", metaphor: "Reserved money sits temporarily outside the available pool.", focalPoint: "The pending-hold surface at the lower edge of the bank screen.", layout: "Large account screen with one amber token and restrained bottom caption.", density: "sparse", continuityReason: "The same available-balance surface returns from the opening hook." },
    startFrame: shot3Start, endFrame: shot3End,
  },
  {
    lineNumbers: [7], seconds: 15, purpose: "Separate release, reconciliation and refund as alternative outcomes.", framing: "One record branching into three distinct resolutions.", subject: "A transaction record and three different paths.", action: "The authored record reveals three independent routes with no single timing.", transition: "reveal", continuity: "The held transaction from the bank becomes the record under review.",
    design: { theme: "editorial-workflow@1", family: "visual-comparison", meaning: "Different transaction states resolve through different processes.", metaphor: "One record opens three different resolution desks.", focalPoint: "The three colored endpoints.", layout: "Single source on the left, three outcomes on the right.", density: "balanced", continuityReason: "The record is the same transaction introduced by the hold." },
    startFrame: shot4Start, endFrame: shot4End,
  },
  {
    lineNumbers: [9], seconds: 16, purpose: "Return to the record and show the practical checks and contact path.", framing: "Two account views above a three-field transaction record.", subject: "Declined screen, bank detail and saved transaction fields.", action: "The reference field and contact path become the final focal state.", transition: "hard-cut", continuity: "The opening phone and bank screen return together, now connected to the record.",
    design: { theme: "editorial-workflow@1", family: "illustrated-workflow", meaning: "The failed screen is a clue; the record and provider determine the next step.", metaphor: "The phone and bank ledger meet in one saved record.", focalPoint: "Amount, date and reference fields followed by the contact path.", layout: "Two surfaces above one wide record with three readable fields.", density: "balanced", continuityReason: "The opening phone, balance surface and review record close the loop." },
    startFrame: shot5Start, endFrame: shot5End,
  },
];

const request = {
  kind: "storyboard", scriptId, selectionId, baseId: null, shotIndex: null,
  instruction: "Codex-authored fallback while the visual gateway is cooling down. Five concise shots based on the selected phone-window concept. Keep sources and uncertainty explicit; no invented amounts, dates, references or universal timing.",
};

const config = readConfig();
const store = openVisuals(config.dataDirectory, config.videosDirectory);
try {
  let latest = store.latest(projectId, "storyboard");
  if (!latest) {
    const id = store.begin(projectId, request, "codex-authored");
    console.log(`AUTHORED_RUN=${id}`);
    latest = store.complete(projectId, id, { shots });
    console.log(`BOARD_ID=${latest}`);
  } else {
    for (const [shotIndex, shot] of shots.entries()) {
      const id = store.begin(projectId, {
        ...request, kind: "shot", baseId: latest, shotIndex,
        instruction: `${request.instruction} Revise only shot ${shotIndex + 1} for phone-size readability.`,
      }, "codex-authored");
      latest = store.complete(projectId, id, shot);
      console.log(`REVISED_SHOT_${shotIndex + 1}=${id}`);
    }
    console.log(`BOARD_ID=${latest}`);
  }
} finally {
  store.close();
}
