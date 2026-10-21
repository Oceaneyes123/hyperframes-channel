import { useId } from "react";
import type { Frame } from "../../../../workflow/visuals.ts";

export default function PlanningFrame({ frame, label }: { frame: Frame; label: string }) {
  const titleId = useId();
  return <svg viewBox="0 0 360 640" role="img" aria-labelledby={titleId} className="aspect-[9/16] w-full rounded border border-white/15">
    <title id={titleId}>{label}</title>
    <rect width="360" height="640" fill={frame.background} />
    {frame.shapes.map((shape, index) => {
      const x = shape.x * 3.6, y = shape.y * 6.4, width = shape.width * 3.6, height = shape.height * 6.4;
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
