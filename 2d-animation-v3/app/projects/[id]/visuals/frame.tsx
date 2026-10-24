import { GraphicBackground } from "../../../../engine/graphics/background.tsx";
import { useId } from "react";
import type { Frame } from "../../../../workflow/visuals.ts";
import VisualSymbol, { isSymbol } from "../../../../engine/visual-symbol.tsx";
import { VisualText } from "../../../../engine/visual-text.tsx";
import { VisualComponent } from "../../../../engine/components/visual-component.tsx";
import { isComponent } from "../../../../workflow/components.ts";

export default function PlanningFrame({ frame, label }: { frame: Frame; label: string }) {
  const titleId = useId();
  return <svg style={frame.environment ? { fontFamily: "Arial" } : undefined} viewBox="0 0 360 640" role="img" aria-labelledby={titleId} className="aspect-[9/16] w-full rounded border border-[var(--line)]">
    <title id={titleId}>{label}</title>
    <rect width="360" height="640" fill={frame.background} />
    {frame.environment && <GraphicBackground environment={frame.environment} width={360} height={640} />}
    {frame.shapes.map((shape, index) => {
      const x = shape.x * 3.6, y = shape.y * 6.4, width = shape.width * 3.6, height = shape.height * 6.4;
      if (isComponent(shape.type)) return <g key={index} transform={`translate(${x} ${y})`}><VisualComponent type={shape.type} width={width} height={height} color={shape.color} parts={shape.parts} asset={shape.asset} diagram={shape.diagram} values={shape.values} label={shape.label} coordinateScale={1 / 3} /></g>;
      if (isSymbol(shape.type)) return <VisualSymbol key={index} type={shape.type} x={x} y={y} width={width} height={height} color={shape.color} />;
      if (["centered-text", "heading", "caption", "code"].includes(shape.type)) return <g key={index} transform={`translate(${x} ${y})`}><VisualText type={shape.type} label={shape.label} color={shape.color} width={width} height={height} scale={1 / 3} /></g>;
      if (shape.type === "text") {
        const fontSize = Math.min(24, height);
        return <text key={index} x={x} y={y + fontSize * .85} fill={shape.color} fontSize={fontSize}
          {...(shape.label.length * fontSize * .6 > width ? { textLength: width, lengthAdjust: "spacingAndGlyphs" as const } : {})}>{shape.label}</text>;
      }
      if (shape.type === "line") return <line key={index} x1={x} y1={y} x2={x + width} y2={y + height} stroke={shape.color} strokeWidth="3" />;
      if (shape.type === "ellipse") return <ellipse key={index} cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} fill={shape.color} />;
      return <rect key={index} x={x} y={y} width={width} height={height} rx="5" fill={shape.color} />;
    })}
  </svg>;
}
