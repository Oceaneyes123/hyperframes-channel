import { AbsoluteFill } from "remotion";
import type { TransitionPresentationComponentProps } from "@remotion/transitions";
import { splitPanel } from "../workflow/motion.ts";

// Both full compositions remain visible during the middle comparison hold.
export function SplitScreen({ children, presentationProgress, presentationDirection }: TransitionPresentationComponentProps<Record<string, never>>) {
  const panel = splitPanel(presentationProgress, presentationDirection === "entering");
  return <AbsoluteFill style={{ left: `${panel.left * 100}%`, width: `${panel.width * 100}%`, overflow: "hidden", background: "#111817" }}>
    <div style={{ position: "absolute", width: 1080, height: 1920, top: 1920 * (1 - panel.width) / 2, transform: `scale(${panel.width})`, transformOrigin: "0 0" }}>{children}</div>
  </AbsoluteFill>;
}
