import type { Frame } from "../../workflow/visuals.ts";

export const planningFrame: Frame = { background: "#172020", shapes: [
  { type: "rect", x: 12, y: 35, width: 30, height: 25, color: "#b9d8c2", label: "" },
  { type: "ellipse", x: 58, y: 35, width: 30, height: 25, color: "#e1ba77", label: "" },
  { type: "text", x: 12, y: 18, width: 76, height: 8, color: "#ffffff", label: "Compare the states" },
] };
export const conceptFixture = { concepts: ["Connected containers", "Number line", "Comparison cards"].map((title, index) => ({
  title, metaphor: ["Transfer between containers", "Travel along a measured path", "Side-by-side state comparison"][index],
  teachingApproach: ["Follow quantity as it changes containers.", "Track an amount against a fixed reference.", "Compare the same object before and after."][index],
  visualLanguage: "Large geometric shapes with sparse labels. Synthetic software fixture.",
  frame: { ...planningFrame, shapes: planningFrame.shapes.map((shape, i) => ({ ...shape, type: i === 0 && index === 1 ? "ellipse" as const : shape.type, y: shape.y + index * 5 })) },
})) };
export function boardFixture(lines = [1, 2, 3]) {
  return { shots: lines.map((number, index) => ({
    lineNumbers: [number], seconds: 4, purpose: `Explain narration line ${number}.`, framing: "Centered portrait close view", subject: "An amount and its comparison state",
    action: "The container changes width to demonstrate the narrated change.", transition: index ? "continuous" as const : "start" as const,
    continuity: index ? "Carry the same container forward, retaining its reference marker." : "Establish the reference quantity before changing it.",
    startFrame: planningFrame, endFrame: { ...planningFrame, shapes: planningFrame.shapes.map((shape, i) => i ? shape : { ...shape, width: 42 }) },
  })) };
}
export function fixtureVisuals(body: { messages: { content: string }[] }) {
  const context = JSON.parse(body.messages.at(-1)!.content);
  if (context.board) {
    const index = Number(body.messages[0].content.match(/shotIndex (\d+)/)?.[1]);
    return { ...context.board.shots[index], action: "Revised fixture action: hold the reference marker while the amount changes." };
  }
  if (context.concept) return boardFixture(context.narration.map((line: { number: number }) => line.number));
  return conceptFixture;
}
