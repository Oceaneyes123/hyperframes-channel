"use client";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import MotionComposition from "../../../../engine/motion-composition.tsx";
import { scheduleMotion, type MotionArtifact } from "../../../../workflow/motion.ts";
import type { VisualArtifact } from "../../../../workflow/visuals.ts";

export default function MotionPlayer({ artifact, board, frame, playerRef, onFrame, narrationUrl, onReady }: {
  artifact: MotionArtifact; board: VisualArtifact; frame: number; playerRef?: RefObject<PlayerRef | null>; onFrame?: (frame: number) => void; narrationUrl?: string; onReady?: (id: string) => void;
}) {
  const ownRef = useRef<PlayerRef>(null); const ref = playerRef ?? ownRef;
  const duration = useMemo(() => scheduleMotion(artifact.plan).durationFrames, [artifact.plan]);
  const inputProps = useMemo(() => ({ plan: artifact.plan, board, narrationUrl }), [artifact.plan, board, narrationUrl]);
  useEffect(() => { onReady?.(artifact.id); }, [artifact.id, onReady]);
  useEffect(() => {
    const instance = ref.current; if (!instance || !onFrame) return;
    const changed = () => onFrame(instance.getCurrentFrame());
    instance.addEventListener("frameupdate", changed); return () => instance.removeEventListener("frameupdate", changed);
  }, [ref, onFrame, artifact.id]);
  useEffect(() => {
    const instance = ref.current; const target = Math.max(0, Math.min(duration - 1, frame));
    if (instance && !(onFrame && instance.isPlaying()) && instance.getCurrentFrame() !== target) instance.seekTo(target);
  }, [frame, ref, duration, artifact.id, onFrame]);
  return <Player key={artifact.id} ref={ref} component={MotionComposition} inputProps={inputProps}
    compositionWidth={1080} compositionHeight={1920} durationInFrames={duration} fps={30}
    autoPlay={false} controls={false} clickToPlay={false} doubleClickToFullscreen={false}
    style={{ width: "100%", aspectRatio: "9/16" }} />;
}
