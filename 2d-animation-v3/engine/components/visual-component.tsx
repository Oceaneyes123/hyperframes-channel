import { LayeredGraphic } from "../graphics/layered-graphic.tsx";
import type { ComponentDetails } from "../../workflow/components.ts";
import { useId } from "react";
import { ComplaintWorkflow } from "../graphics/complaint-workflow.tsx";
import { componentParts, type ComponentType, type PartState } from "../../workflow/components.ts";
import VisualSymbol from "../visual-symbol.tsx";
import { textFontSize } from "../text-metrics.ts";

export function VisualComponent({ type, width, height, color, parts, values, label = "", actorId, coordinateScale = 1, asset, diagram }: ComponentDetails & {
  type: ComponentType; width: number; height: number; color: string; parts?: Record<string, PartState>; values?: [number, number]; label?: string; actorId?: string; coordinateScale?: number;
}) {
  const clip = useId(); const states = componentParts(type, color, parts, { asset, diagram });
  if (type === "graphic-asset@2" || type === "semantic-diagram@1") return <LayeredGraphic type={type} width={width} height={height} color={color} parts={parts} asset={asset} diagram={diagram} actorId={actorId} coordinateScale={coordinateScale} />;
  if (type === "complaint-workflow@1") return <ComplaintWorkflow width={width} height={height} color={color} parts={parts} actorId={actorId} coordinateScale={coordinateScale} />;
  const part = (id: string, children: React.ReactNode) => {
    const state = states[id];
    const mask = `${clip}-${id}`;
    return <g key={id}><defs><clipPath id={mask}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
      <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={state.opacity} color={state.color} clipPath={`url(#${mask})`}
        transform={`translate(${state.x * 10.8 * coordinateScale} ${state.y * 19.2 * coordinateScale}) scale(${state.scale})`}>{children}</g></g>;
  };
  return <svg data-shape width={width} height={height} viewBox={`0 0 ${width} ${height}`} color={color}>
    <defs><clipPath id={clip}><rect width={width} height={height} rx={width * .04} /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      {!["kinetic-phrase@1", "funnel@1"].includes(type) && <><rect width={width} height={height} rx={width * .04} fill="#F5F3ED" /><rect x={width * .06} y={height * .07} width={width * .28} height={height * .04} rx="3" fill="currentColor" /></>}
      {type === "inbox-panel@1" && <>
      {[.24, .44, .64].map((y) => <rect key={y} x={width * .06} y={height * y} width={width * .88} height={height * .14} rx="5" fill="#D9DCE5" />)}
      {part("message", <><rect x={width * .08} y={height * .44} width={width * .84} height={height * .14} rx="5" fill="currentColor" /><path d={`M${width * .14} ${height * .48} H${width * .55} M${width * .14} ${height * .53} H${width * .72}`} stroke="#101114" strokeWidth={Math.max(1, width * .012)} /></>)}
      {part("highlight", <rect x={width * .06} y={height * .42} width={width * .88} height={height * .18} rx="6" fill="none" stroke="currentColor" strokeWidth={Math.max(1, width * .015)} />)}
      {part("extracted", <rect x={width * .48} y={height * .73} width={width * .44} height={height * .19} rx="5" fill="currentColor" />)}
      {part("packet", <circle cx={width * .76} cy={height * .82} r={Math.min(width, height) * .045} fill="#101114" />)}
      </>}
      {type === "approval-flow@1" && <>
        <VisualSymbol type="document" x={width * .08} y={height * .22} width={width * .4} height={height * .64} color="#222638" />
        <path d={`M${width * .49} ${height * .55} H${width * .76}`} stroke="#A8ADBC" strokeWidth={width * .018} />
        <circle cx={width * .8} cy={height * .55} r={Math.min(width, height) * .15} fill="#D9DCE5" />
        {part("request", <rect x={width * .18} y={height * .39} width={width * .2} height={height * .06} rx="3" fill="currentColor" />)}
        {part("approved", <path d={`M${width * .73} ${height * .55} L${width * .78} ${height * .61} L${width * .88} ${height * .46}`} fill="none" stroke="currentColor" strokeWidth={width * .025} strokeLinecap="round" />)}
        {part("handoff", <path d={`M${width * .52} ${height * .76} H${width * .85} L${width * .79} ${height * .69} M${width * .85} ${height * .76} L${width * .79} ${height * .83}`} fill="none" stroke="currentColor" strokeWidth={width * .018} />)}
      </>}
      {type === "api-flow@1" && <>
        <VisualSymbol type="server" x={width * .06} y={height * .29} width={width * .28} height={height * .48} color="#222638" />
        <VisualSymbol type="database" x={width * .66} y={height * .29} width={width * .28} height={height * .48} color="#222638" />
        <path d={`M${width * .36} ${height * .43} H${width * .64} M${width * .36} ${height * .64} H${width * .64}`} stroke="#A8ADBC" strokeWidth={width * .012} />
        {part("request", <path d={`M${width * .38} ${height * .43} H${width * .61} L${width * .56} ${height * .37} M${width * .61} ${height * .43} L${width * .56} ${height * .49}`} fill="none" stroke="currentColor" strokeWidth={width * .02} />)}
        {part("response", <path d={`M${width * .62} ${height * .64} H${width * .39} L${width * .44} ${height * .58} M${width * .39} ${height * .64} L${width * .44} ${height * .7}`} fill="none" stroke="currentColor" strokeWidth={width * .02} />)}
        {part("cache", <circle cx={width * .8} cy={height * .83} r={Math.min(width, height) * .045} fill="currentColor" />)}
      </>}
      {type === "cost-chart@1" && (() => {
        const numbers = values ?? [0, 0], maximum = Math.max(1, ...numbers);
        return <>
          <path d={`M${width * .12} ${height * .22} V${height * .8} H${width * .9}`} fill="none" stroke="#A8ADBC" strokeWidth={width * .01} />
          {part("bar-one", <rect x={width * .24} y={height * (.78 - .5 * numbers[0] / maximum)} width={width * .2} height={height * .5 * numbers[0] / maximum} fill="currentColor" />)}
          {part("bar-two", <rect x={width * .58} y={height * (.78 - .5 * numbers[1] / maximum)} width={width * .2} height={height * .5 * numbers[1] / maximum} fill="currentColor" />)}
          {part("total", <text x={width * .5} y={height * .94} textAnchor="middle" fontSize={textFontSize(type, "", width, height)} fill="#101114">{numbers[0] + numbers[1]}</text>)}
        </>;
      })()}
      {type === "kinetic-phrase@1" && (() => {
        const words = label.trim().split(/\s+/), keyword = words.pop() ?? "", lead = words.join(" ");
        const size = textFontSize(type, label, width, height);
        return <>
          {part("lead", <text x={width * .5} y={height * .4} textAnchor="middle" fontSize={size} fill="currentColor">{lead}</text>)}
          {part("keyword", <text x={width * .5} y={height * .66} textAnchor="middle" fontSize={size} fontWeight="700" fill="currentColor">{keyword}</text>)}
          {part("underline", <path d={`M${width * .15} ${height * .76} H${width * .85}`} stroke="currentColor" strokeWidth={width * .018} />)}
        </>;
      })()}
      {type === "funnel@1" && <>
        <path d={`M${width * .1} ${height * .28} H${width * .9} L${width * .6} ${height * .63} V${height * .86} H${width * .4} V${height * .63} Z`} fill="none" stroke="currentColor" strokeWidth={width * .018} strokeLinejoin="round" />
        {part("inputs", <>{[.28, .5, .72].map((x) => <circle key={x} cx={width * x} cy={height * .15} r={Math.min(width, height) * .045} fill="currentColor" />)}</>)}
        {part("bottleneck", <rect x={width * .4} y={height * .57} width={width * .2} height={height * .09} fill="currentColor" />)}
        {part("output", <circle cx={width * .5} cy={height * .94} r={Math.min(width, height) * .04} fill="currentColor" />)}
      </>}
    </g>
  </svg>;
}
