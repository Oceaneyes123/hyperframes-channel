import { useId } from "react";
import { HeadingText } from "../heading-text.tsx";
import { uiStages, type UIWorkflow as UIData } from "../../workflow/ui-workflow.ts";
import type { PartState } from "../../workflow/components.ts";

const slots = [.32, .28, .44, .22, .22];
const titles = ["Customer form", "Google Sheets", "n8n workflow", "DeepSeek draft", "Owner review"];

export function UIWorkflow({ data, width: w, height: h, states, actorId, stage = states.surface.uiStage ?? 0 }: { data: UIData; width: number; height: number; states: Record<string, PartState>; actorId?: string; stage?: number }) {
  const uid = useId(), current = Math.floor(stage), next = Math.min(4, current + 1), mix = stage - current;
  const questionY = (slots[current] + (slots[next] - slots[current]) * mix) * h;
  const part = (id: string, content: React.ReactNode) => <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={states[id].opacity} color={states[id].color}>
    <defs><clipPath id={`${uid}-${id}`}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={w * (states[id].reveal ?? 1)} height={h} /></clipPath></defs>
    <g clipPath={`url(#${uid}-${id})`}>{content}</g>
  </g>;
  const label = (text: string, x: number, y: number, size = .047, color = "#244E42") => <text x={x * w} y={y * h} fontFamily="Arial" fontSize={w * size} fill={color}>{text}</text>;
  const box = (x: number, y: number, width: number, height: number, fill = "#F1F5F2") => <rect x={x * w} y={y * h} width={width * w} height={height * h} rx={w * .015} fill={fill} stroke="#D0DDD5" strokeWidth={w * .002} />;
  const field = (id: "category" | "draft", y: number) => part(id, <g data-field-id={data[id].id} data-field-value={data[id].value} data-from={data[id].from} visibility={stage >= 3 ? "visible" : "hidden"}>
    {label(id === "category" ? "Category" : "Prepared response", .1, y - .025, .043)}
    {box(.1, y, .8, id === "draft" ? .18 : .1, "#EDF5EE")}
    <g transform={`translate(${w * .13} ${h * (y + .02)})`}><HeadingText label={data[id].lines.join("\n")} color="#244E42" width={w * .74} height={h * (id === "draft" ? .14 : .065)} scale={1} centered={false} frame={0} /></g>
  </g>);
  const surface = (index: number) => <g key={index} data-ui-state={uiStages[index]} opacity={index === current ? 1 - mix : mix}>
    {label(titles[index], .1, .135, .065)}
    {index === 0 && <>
      {label("New inquiry", .1, .235, .052)}{label("Customer question", .1, .285, .043)}
      {box(.1, .59, .8, .07)}{label("Reply email", .13, .635, .04, "#64776C")}
      {box(.57, .74, .33, .09, "#244E42")}{label("Submit", .64, .8, .052, "#FFFFFF")}
    </>}
    {index === 1 && <>
      {label("Inquiry records", .1, .205, .047)}
      {[.25, .45, .65].map((y) => <g key={y}>{box(.07, y, .86, .18, "#FAFCFA")}<path d={`M${w * .07} ${h * y}H${w * .93}`} stroke="#C8D8CC" strokeWidth="2" /></g>)}
      {label("1", .025, .365, .045, "#64776C")}{label("Question", .1, .255, .04)}
    </>}
    {index === 2 && <>
      {box(.08, .23, .36, .14)}{box(.56, .23, .36, .14)}
      <path d={`M${w * .44} ${h * .3}H${w * .56}`} stroke="#49856A" strokeWidth={w * .008} />
      <circle cx={w * .44} cy={h * .3} r={w * .008} fill="#49856A" /><circle cx={w * .56} cy={h * .3} r={w * .008} fill="#49856A" />
      {label("Sheets", .13, .285, .052)}{label("Trigger", .13, .33, .042)}
      {label("DeepSeek", .59, .285, .052)}{label("Request", .59, .33, .042)}
      {label("Request payload", .1, .41, .043)}
    </>}
    {index === 3 && <>{label("Original question", .1, .195, .043)}{label("Draft needs human review", .1, .91, .045, "#64776C")}</>}
    {index === 4 && <>{label("Customer question", .1, .195, .043)}{box(.1, .87, .8, .085, "#F6E8CB")}{label("Review pending", .21, .928, .055, "#694F25")}</>}
  </g>;
  return <g data-shape data-ui-stage={stage} role="img" aria-label={`Simulated ${uiStages[current].replaceAll("-", " ")}. Question: ${data.inquiry.value}${stage >= 3 ? `. Category: ${data.category.value}. Draft: ${data.draft.value}` : ""}${current === 4 ? ". Human review pending." : ""}`}>
    {part("surface", <>
      <rect width={w} height={h} rx={w * .035} fill="#FFFFFF" stroke="#C8D8CC" strokeWidth={w * .004} />
      <path d={`M0 ${h * .065}H${w}`} stroke="#DCE6DF" strokeWidth={w * .002} />
      {[.06, .095, .13].map((x, i) => <circle key={x} cx={w * x} cy={h * .033} r={w * .009} fill={["#D28473", "#D3B969", "#8AAE98"][i]} />)}
      {surface(current)}{next !== current && surface(next)}
    </>)}
    {part("inquiry", <g data-field-id={data.inquiry.id} data-field-value={data.inquiry.value} transform={`translate(${w * .1} ${questionY})`}>
      <rect width={w * .8} height={h * .16} rx={w * .015} fill="#FFFFFF" stroke="#B7D3C3" strokeWidth={w * .003} />
      <g transform={`translate(${w * .03} ${h * .018})`}><HeadingText label={data.inquiry.lines.join("\n")} color="#244E42" width={w * .74} height={h * .125} scale={1} centered={false} frame={0} /></g>
    </g>)}
    {field("category", .48)}{field("draft", .65)}
    {part("focus", <rect x={w * .09} y={questionY - h * .008} width={w * .82} height={h * .176} rx={w * .02} fill="none" stroke="#4D9372" strokeWidth={w * .005} />)}
  </g>;
}
