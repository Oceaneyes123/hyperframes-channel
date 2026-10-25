import { useId, type ReactNode } from "react";
import { componentParts, type ComponentDetails, type PartState } from "../../workflow/components.ts";
import { graphicTheme } from "../../workflow/graphic-assets.ts";
import { vectorLibrary } from "../../workflow/graphic-library.ts";
import type { VectorNode } from "../../workflow/vector-assets.ts";
import { layoutDiagram } from "../../workflow/diagram.ts";

export function VectorNodes({ nodes, prefix, defsId = prefix, strokeScale = 1 }: { nodes: VectorNode[]; prefix: string; defsId?: string; strokeScale?: number }) {
  const paint = (role: string) => role === "none" ? "none" : role === "wash" || role === "grid" ? `url(#${defsId}-${role})` : role === "accent" ? "currentColor" : role === "surface" ? graphicTheme.light : graphicTheme[role as "ink" | "paper" | "mint" | "muted" | "line"];
  return nodes.map((node, index) => {
    const style = { fill: paint(node.fill), stroke: paint(node.stroke), strokeWidth: node.strokeWidth * strokeScale, opacity: node.opacity, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    if (node.kind === "rect") return <rect key={index} {...style} x={node.x} y={node.y} width={node.width} height={node.height} rx={node.radius} />;
    if (node.kind === "ellipse") return <ellipse key={index} {...style} cx={node.cx} cy={node.cy} rx={node.rx} ry={node.ry} />;
    if (node.kind === "path") return <path key={index} {...style} d={node.d} />;
    const clipId = `${prefix}-clip-${index}`;
    return <g key={index} {...style} transform={`translate(${node.x} ${node.y}) scale(${node.scale}) rotate(${node.rotation})`} style={{ mixBlendMode: node.blend }}>
      {node.clip && <defs><clipPath id={clipId}><rect x={node.clip.x} y={node.clip.y} width={node.clip.width} height={node.clip.height} /></clipPath></defs>}
      <g clipPath={node.clip ? `url(#${clipId})` : undefined}><VectorNodes nodes={node.children} prefix={`${prefix}-${index}`} defsId={defsId} strokeScale={strokeScale} /></g>
    </g>;
  });
}

export function LayeredGraphic({ type, width, height, color, parts, asset, diagram, actorId, coordinateScale = 1 }: ComponentDetails & {
  type: "graphic-asset@2" | "semantic-diagram@1"; width: number; height: number; color: string; parts?: Record<string, PartState>; actorId?: string; coordinateScale?: number;
}) {
  const uid = useId(), details = { asset, diagram }, states = componentParts(type, color, parts, details);
  const layer = (id: string, children: ReactNode, viewBox: string) => {
    const state = states[id], clip = `${uid}-${id}`;
    return <g key={id}>
      <defs><clipPath id={clip}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
      <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={state.opacity} color={state.color}
        transform={`translate(${state.x * 10.8 * coordinateScale} ${state.y * 19.2 * coordinateScale}) scale(${state.scale})`} clipPath={`url(#${clip})`}>
        <svg width={width} height={height} viewBox={viewBox}>{children}</svg>
      </g>
    </g>;
  };
  const artwork = asset && vectorLibrary[asset.id]?.asset;
  const graph = diagram && layoutDiagram(diagram);
  return <svg data-shape data-graphic={asset?.id ?? "semantic-diagram@1"} width={width} height={height} color={color}>
    <defs>
      <linearGradient id={`${uid}-wash`} x2="1" y2="1"><stop stopColor={graphicTheme.mint} /><stop offset="1" stopColor={graphicTheme.paper} /></linearGradient>
      <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke={graphicTheme.line} /></pattern>
      <marker id={`${uid}-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1 1L10 6 1 11" fill="none" stroke="currentColor" strokeWidth="2" /></marker>
    </defs>
    {artwork?.layers.map((item) => layer(item.id, <VectorNodes nodes={item.nodes} prefix={`${uid}-${item.id}`} defsId={uid} />, `0 0 ${artwork.width} ${artwork.height}`))}
    {graph?.nodes.filter((node) => graph.nodes.some((child) => child.parent === node.id)).map((parent) => {
      const children = graph.nodes.filter((node) => node.parent === parent.id), xs = [parent.x, ...children.map((node) => node.x)], ys = [parent.y, ...children.map((node) => node.y)];
      return <svg key={`group-${parent.id}`} width={width} height={height} viewBox="0 0 1000 1000"><rect x={Math.min(...xs) - 100} y={Math.min(...ys) - 100} width={Math.max(...xs) - Math.min(...xs) + 200} height={Math.max(...ys) - Math.min(...ys) + 200} rx="32" fill={graphicTheme.mint} opacity=".3" /></svg>;
    })}
    {graph?.edges.map((edge) => {
      const progress = states[edge.id].strokeProgress, target = actorId ? `${actorId}.${edge.id}` : undefined;
      return layer(edge.id, <>
        <path data-edge-path={target} d={edge.d} fill="none" stroke="currentColor" strokeWidth="5" {...(progress === undefined ? { markerEnd: `url(#${uid}-arrow)` } : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress })} />
        {progress !== undefined && <path data-edge-arrow={target} d={edge.d} fill="none" stroke="none" markerEnd={`url(#${uid}-arrow)`} opacity={progress === 1 ? 1 : 0} />}
        {edge.label && <text x={edge.labelX} y={edge.labelY} textAnchor="middle" fontSize="32" fill={graphicTheme.ink}>{edge.label}</text>}
        <circle data-edge-signal={target} r="14" fill={graphicTheme.accent} stroke={graphicTheme.paper} strokeWidth="3" opacity="0" />
      </>, "0 0 1000 1000");
    })}
    {graph?.nodes.map((node) => layer(node.id, <>
      <circle cx={node.x} cy={node.y} r="80" fill={node.emphasis ? graphicTheme.mint : graphicTheme.light} stroke={node.emphasis ? graphicTheme.ink : graphicTheme.line} strokeWidth={node.emphasis ? 6 : 3} />
      <circle data-arrival={actorId ? `${actorId}.${node.id}` : undefined} cx={node.x} cy={node.y} r="92" fill="none" stroke={graphicTheme.accent} strokeWidth="8" opacity="0" />
      <svg x={node.x - 64} y={node.y - 64} width="128" height="128" viewBox="0 0 300 300"><VectorNodes nodes={vectorLibrary[`${node.icon}-editorial@1`].asset.layers[0].nodes} prefix={uid} strokeScale={2.5} /></svg>
      {node.label && <text x={diagram?.direction === "down" ? node.x + 108 : node.x} y={diagram?.direction === "down" ? node.y + 12 : node.y + 125} textAnchor={diagram?.direction === "down" ? "start" : "middle"} fontFamily="Arial" fontSize="60" fill={graphicTheme.ink}
        {...(node.label.length * 36 > (diagram?.direction === "down" ? 980 - node.x - 108 : Math.min(node.x, 1000 - node.x) * 2 - 20) ? { textLength: Math.max(40, diagram?.direction === "down" ? 980 - node.x - 108 : Math.min(node.x, 1000 - node.x) * 2 - 20), lengthAdjust: "spacingAndGlyphs" as const } : {})}>{node.label}</text>}
    </>, "0 0 1000 1000"))}
  </svg>;
}
