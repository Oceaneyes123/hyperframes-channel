import { useId, type ReactNode } from "react";
import type { PartState } from "../../workflow/components.ts";
import { perspectiveScene as scene, projectPoint, projectedBox, tokenPoint, type PerspectiveCamera } from "../../workflow/perspective.ts";

export function PerspectiveScene({ width, height, state, actorId, camera = { x: state.cameraX ?? 0, y: state.cameraY ?? 0, z: state.cameraZ ?? 0 }, progress = state.depthProgress ?? 0 }: {
  width: number; height: number; state: PartState; actorId?: string; camera?: PerspectiveCamera; progress?: number;
}) {
  const uid = useId(), token = tokenPoint(progress);
  // Project geometry itself: browser caches of scaled SVG strokes changed pixels after backward seeks.
  const rect = (x: number, y: number, width: number, height: number, z: number, fill: string, radius = 20, strokeWidth = 8, stroke = "#203B3A") => {
    const b = projectedBox({ x, y, width, height, z }, camera), scale = projectPoint({ x, y, z }, camera).scale;
    return <rect {...b} rx={radius * scale} fill={fill} stroke={stroke} strokeWidth={strokeWidth * scale} />;
  };
  const line = (points: number[][], z: number, color = "#607570", thickness = 8) => {
    const projected = points.map(([x, y]) => projectPoint({ x, y, z }, camera));
    return <polyline points={projected.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={color} strokeWidth={thickness * projected[0].scale} strokeLinejoin="round" />;
  };
  const circle = (x: number, y: number, radius: number, z: number, fill: string) => {
    const p = projectPoint({ x, y, z }, camera); return <circle cx={p.x} cy={p.y} r={radius * p.scale} fill={fill} />;
  };
  const plane = (id: string, z: number, children: ReactNode) => <g data-depth-plane={id} data-depth={z} data-projected-scale={projectPoint({ x: 0, y: 0, z }, camera).scale}>{children}</g>;
  const tokenNode = <g data-depth-token data-token-progress={progress} data-token-depth={token.z}>
    {rect(token.x - 35, token.y - 25, 70, 50, token.z, "#D9633F", 6, 5)}
    {line([[token.x - 30, token.y - 18], [token.x, token.y + 3], [token.x + 30, token.y - 18]], token.z, "#FFFDF8", 5)}
  </g>;
  // Alpha coverage stays seek-exact when the root scales; SVG clip coverage retained raster history.
  return <g data-shape data-perspective={scene.id} data-camera-x={camera.x} data-camera-y={camera.y} data-camera-z={camera.z} role="img" aria-label="Schematic layered customer-support environment; one inquiry moves into processing">
    <g data-actor={actorId ? `${actorId}.camera` : undefined} data-part="camera" opacity={state.opacity}>
      <svg width={width} height={height} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
        <defs><mask id={uid} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" style={{ maskType: "alpha" }}><rect width="1000" height="1000" rx="24" fill="white" /></mask></defs>
        <g mask={`url(#${uid})`}>
          <rect width="1000" height="1000" fill="#F7F3E9" />
          {plane("processing", 300, <>
            {rect(-800, -800, 2600, 2600, 300, "#C6DED3", 0, 0)}
            {line([[-800, 800], [1800, 800]], 300, "#607570", 10)}
            {rect(600, 330, 240, 300, 300, "#FFFDF8", 22)}
            {[380, 440, 500].map(y => <g key={y}>{rect(630, y, 180, 36, 300, "#203B3A", 8, 0)}{circle(787, y + 18, 7, 300, "#C6DED3")}</g>)}
            {line([[650, 590], [790, 590]], 300)}
          </>)}
          {token.z > 0 && tokenNode}
          {plane("inquiry", 0, <>
            {rect(300, 330, 180, 240, 0, "#FFFDF8")}
            {line([[330, 365], [450, 365]], 0, "#607570", 12)}
            {circle(390, 535, 9, 0, "#607570")}
          </>)}
          {token.z <= 0 && tokenNode}
          {plane("foreground", -450, <>
            {rect(-500, 70, 950, 860, -450, "#FFFDF8", 24)}
            {rect(330, 180, 80, 490, -450, "#D9633F", 12, 0)}
            {line([[340, 740], [405, 740]], -450, "#607570", 9)}
            {line([[340, 780], [405, 780]], -450, "#607570", 9)}
          </>)}
        </g>
      </svg>
    </g>
  </g>;
}
