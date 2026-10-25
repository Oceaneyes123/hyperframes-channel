"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import MotionComposition from "../../engine/motion-composition.tsx";
import { connectedProcessExample } from "../../workflow/examples/connected-process.ts";

export default function ConnectedProcessPlayer() {
  const props = useMemo(() => connectedProcessExample(), []);
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const instance = player.current;
    const changed = () => setFrame(instance?.getCurrentFrame() ?? 0);
    instance?.addEventListener("frameupdate", changed);
    return () => instance?.removeEventListener("frameupdate", changed);
  }, []);
  return <section aria-label="Connected process preview" className="mx-auto max-w-sm">
    <Player ref={player} component={MotionComposition} inputProps={props} compositionWidth={1080} compositionHeight={1920} durationInFrames={180} fps={30} controls autoPlay={false} style={{ width: "100%", aspectRatio: "9/16" }} />
    <label htmlFor="process-frame" className="mt-4 block">Inspect frame</label>
    <input id="process-frame" type="range" min={0} max={179} step={1} value={frame} className="w-full" onChange={(event) => {
      const value = Number(event.target.value); setFrame(value); player.current?.pause(); player.current?.seekTo(value);
    }} />
    <p className="text-xs text-[var(--muted)]">Frame {frame} / 179. Use the slider to inspect forward or backward.</p>
  </section>;
}
