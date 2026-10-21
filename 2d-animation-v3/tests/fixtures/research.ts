import type { WritingBrief } from "../../workflow/scriptwriting.ts";

export const researchFixture: WritingBrief = {
  topic: "Doubling a synthetic example", audience: "Beginners", viewerProblem: "Connect a number to its doubled result.",
  payoff: "You can explain the two-times mapping in this synthetic example.", format: "explainer", targetSeconds: 30,
  boundaries: "Synthetic test data only. No financial claims or real research is represented.",
  sources: [{ id: "source-1", title: "Synthetic fixture", url: "https://example.test/synthetic", notes: "For this synthetic fixture, input 7 doubled gives 14." }],
  claims: [{ id: "claim-1", statement: "In this synthetic example, 7 doubled is 14.", sourceIds: ["source-1"], caveat: "Synthetic teaching example." }],
};
