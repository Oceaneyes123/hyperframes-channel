import { z } from "zod";

const key = z.string().regex(/^[a-z][a-z0-9-]{0,39}$/);
const field = z.strictObject({ id: key, value: z.string().trim().min(1).max(70), lines: z.array(z.string().trim().min(1).max(35)).min(1).max(2) });
const derived = field.extend({ from: key });
export const uiWorkflowSchema = z.strictObject({
  schema: z.literal("inquiry-workflow@1"), inquiry: field, category: derived, draft: derived,
}).refine((data) => new Set([data.inquiry.id, data.category.id, data.draft.id]).size === 3 && data.category.from === data.inquiry.id && data.draft.from === data.inquiry.id && [data.inquiry, data.category, data.draft].every((item) => item.value === item.lines.join(" ")), "UI fields need unique identities, exact authored lines and a shared inquiry origin.");
export type UIWorkflow = z.infer<typeof uiWorkflowSchema>;
export const uiStages = ["customer-form", "sheet-record", "automation-trigger", "ai-draft", "human-review"] as const;
export const uiTriggers = ["submit-form", "row-added", "model-returned", "request-review"] as const;
export const uiTriggerSchema = z.enum(uiTriggers);
export const uiMotionGuidance = "ui-workflow@1 is an explanatory reconstruction, never a live service action. ui:{schema:inquiry-workflow@1,inquiry:{id,value,lines},category:{id,value,lines,from},draft:{id,value,lines,from}} preserves exact source field identities and authored lines. Both derived from IDs must equal inquiry.id. Named fixed parts:surface,inquiry,category,draft,focus. surface has explicit uiStage:0..4; stages are customer form, Sheets record, n8n trigger, DeepSeek draft, human review pending. ui-state-transition@1 {trigger:submit-form|row-added|model-returned|request-review} targets surface for 18..60 frames and only advances one valid next state. Inquiry/surface stay visible and unmasked; never rewrite values, duplicate the inquiry, skip states or imply human approval. ui-focus is the focus mask recipe, ui-field-transfer uses the persistent inquiry token during a valid state transition, ui-panel-expand uses bounded root/camera emphasis afterward, and ui-result-assemble reveals the source category/draft after the model-returned transition. Use only supplied or explicitly hypothetical approved examples; preserve all fields in the review state.";
