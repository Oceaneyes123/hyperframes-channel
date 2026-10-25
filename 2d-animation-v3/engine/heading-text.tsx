"use client";

import { useEffect, useState } from "react";
import { staticFile, getRemotionEnvironment, useDelayRender } from "remotion";
import { headingFont, verifyHeadingFont, fitHeading } from "../workflow/typography.ts";
import { TextMotionContent } from "./text-motion.tsx";
import type { TextMotion } from "../workflow/text-motion.ts";

let fontReady: Promise<void> | undefined;
function loadFont() {
  return fontReady ??= (async () => {
    const url = getRemotionEnvironment().isRendering ? staticFile(headingFont.path) : `/${headingFont.path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Approved heading font could not be loaded.");
    const bytes = await response.arrayBuffer(); await verifyHeadingFont(bytes);
    const font = new FontFace(headingFont.family, bytes, { weight: "100 900" });
    await font.load(); document.fonts.add(font);
  })();
}

export function HeadingText({ label, color, width, height, scale, centered, motion, frame }: {
  label: string; color: string; width: number; height: number; scale: number; centered: boolean; motion?: TextMotion; frame: number;
}) {
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Load and measure approved heading font"));
  const [layout, setLayout] = useState<ReturnType<typeof fitHeading> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true, released = false;
    const release = () => { if (!released) { continueRender(handle); released = true; } };
    loadFont().then(() => {
      if (!active) return;
      const context = document.createElement("canvas").getContext("2d");
      if (!context) throw new Error("Text measurement is unavailable.");
      setLayout(fitHeading(label, width, height, scale, (text, size) => {
        context.font = `700 ${size}px "${headingFont.family}"`;
        const metrics = context.measureText(text);
        return Math.max(metrics.width, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
      }));
      release();
    }).catch((failure: unknown) => { if (active) { setError(failure instanceof Error ? failure : new Error("Heading layout failed.")); release(); } });
    return () => { active = false; release(); };
  }, [label, width, height, scale, handle, continueRender]);
  if (error) throw error;
  if (!layout) return null;
  return <g data-shape data-typography={headingFont.id} role="img" aria-label={label} fill={color} color={color} fontFamily={headingFont.family} fontSize={layout.size} fontWeight="700">
    {layout.lines.map((line, index) => <g key={index} aria-hidden="true" transform={`translate(${centered ? (width - line.width) / 2 : 0} ${index * layout.size * 1.4})`}>
      {motion ? <TextMotionContent label={line.text} fontSize={layout.size} width={line.width} motion={motion} frame={frame} /> : <text data-shape y={layout.size * .85}>{line.text}</text>}
    </g>)}
  </g>;
}
