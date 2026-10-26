import { z } from "zod";
import { layerKey } from "./vector-assets.ts";

export const diagramSchema = z.strictObject({
  direction: z.enum(["down", "right"]),
  nodes: z.array(z.strictObject({ id: layerKey, icon: z.enum(["person", "computer", "document", "message", "processor", "database", "cloud", "payment", "product"]), label: z.string().trim().max(24), emphasis: z.boolean().optional(), parent: layerKey.optional() })).min(2).max(8),
  edges: z.array(z.strictObject({ id: layerKey, from: layerKey, to: layerKey, label: z.string().trim().max(20) })).min(1).max(12),
}).superRefine((graph, context) => {
  const ids = graph.nodes.map((node) => node.id), all = [...ids, ...graph.edges.map((edge) => edge.id)];
  if (new Set(all).size !== all.length) context.addIssue({ code: "custom", message: "Diagram node and edge IDs must be unique." });
  for (const node of graph.nodes) if (node.parent && (!ids.includes(node.parent) || node.parent === node.id)) context.addIssue({ code: "custom", message: "Invalid parent group." });
  for (const edge of graph.edges) if (!ids.includes(edge.from) || !ids.includes(edge.to) || edge.from === edge.to) context.addIssue({ code: "custom", message: "Invalid diagram connection." });
  for (const node of graph.nodes) {
    const seen = new Set([node.id]); let parent = node.parent;
    while (parent) { if (seen.has(parent)) { context.addIssue({ code: "custom", message: "Parent groups must be acyclic." }); break; } seen.add(parent); parent = graph.nodes.find((item) => item.id === parent)?.parent; }
  }
});
export type Diagram = z.infer<typeof diagramSchema>;

export function layoutDiagram(input: Diagram) {
  const graph = diagramSchema.parse(input);
  // Stable breadth-first ranks. Back edges remain explicit and route outside the node columns.
  const ranks = new Map<string, number>(), queue = graph.nodes.filter((node) => !graph.edges.some((edge) => edge.to === node.id)).map((node) => node.id);
  if (!queue.length) queue.push(graph.nodes[0].id);
  queue.forEach((id) => ranks.set(id, 0));
  for (let i = 0; i < queue.length; i++) for (const edge of graph.edges.filter((edge) => edge.from === queue[i])) {
    if (!ranks.has(edge.to)) { ranks.set(edge.to, ranks.get(edge.from)! + 1); queue.push(edge.to); }
  }
  for (const node of graph.nodes) if (!ranks.has(node.id)) ranks.set(node.id, 0);
  const maximum = Math.max(...ranks.values());
  const linearDown = graph.direction === "down" && graph.nodes.every((node) => graph.nodes.filter((peer) => ranks.get(peer.id) === ranks.get(node.id)).length === 1);
  const labelWidth = Math.min(430, Math.max(0, ...graph.nodes.map((node) => node.label.length * 36)));
  const nodes = graph.nodes.map((node) => {
    const rank = ranks.get(node.id)!, peers = graph.nodes.filter((item) => ranks.get(item.id) === rank), slot = peers.findIndex((item) => item.id === node.id);
    const primary = (rank + .5) / (maximum + 1) * 800 + 100, secondary = (slot + 1) / (peers.length + 1) * 800 + 100;
    const centeredRoute = linearDown && labelWidth ? 500 - (28 + labelWidth) / 2 : secondary;
    return { ...node, x: graph.direction === "down" ? centeredRoute : primary, y: graph.direction === "down" ? primary : secondary };
  });
  const edges = graph.edges.map((edge, index) => {
    const from = nodes.find((node) => node.id === edge.from)!, to = nodes.find((node) => node.id === edge.to)!;
    const down = graph.direction === "down", forward = down ? to.y > from.y : to.x > from.x;
    const a = { x: from.x + (down ? 0 : 65), y: from.y + (down ? 65 : 0) }, b = { x: to.x - (down ? 0 : 65), y: to.y - (down ? 65 : 0) };
    const detour = 30 + index * 10;
    const d = forward ? down ? `M${a.x} ${a.y}V${(a.y + b.y) / 2}H${b.x}V${b.y}` : `M${a.x} ${a.y}H${(a.x + b.x) / 2}V${b.y}H${b.x}`
      : down ? `M${from.x - 65} ${from.y}H${40 + detour}V${to.y}H${to.x - 65}` : `M${from.x} ${from.y + 65}V${960 - detour}H${to.x}V${to.y + 65}`;
    return { ...edge, d, labelX: (from.x + to.x) / 2, labelY: (from.y + to.y) / 2 - 18 };
  });
  return { nodes, edges };
}
