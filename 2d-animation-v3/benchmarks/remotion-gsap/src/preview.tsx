import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, type PlayerRef } from "@remotion/player";
import { gsap } from "gsap";
import { Film, type FilmProps } from "./Film";

function Preview() {
  const player = useRef<PlayerRef>(null);
  const [engine, setEngine] = useState<FilmProps["engine"]>("gsap"); const [variant, setVariant] = useState(false);
  const [target, setTarget] = useState(0); const [frame, setFrame] = useState(0); const [mount, setMount] = useState(0); const [visible, setVisible] = useState(true);
  const [inspection, setInspection] = useState("");
  const [ready, setReady] = useState("");
  const [seekSerial, setSeekSerial] = useState(0);
  const seekStart = useRef<number | null>(null); const [seekMs, setSeekMs] = useState<number | null>(null);
  useEffect(() => {
    const instance = player.current; if (!instance) return;
    const changed = () => setFrame(instance.getCurrentFrame());
    instance.addEventListener("frameupdate", changed); return () => instance.removeEventListener("frameupdate", changed);
  }, [mount, visible]);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      setReady(`${engine}:${variant}:${frame}:${mount}`);
      if (seekStart.current !== null) { setSeekMs(performance.now() - seekStart.current); seekStart.current = null; }
    }); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [engine, variant, frame, mount, visible, seekSerial]);
  return <main style={{ fontFamily: "Arial", padding: 18, maxWidth: 900 }}>
    <h1>Remotion + GSAP · isolated adapter proof</h1><p>Synthetic · 1080×1920 · 30fps · 360 frames · silent</p>
    <label>Engine <select value={engine} onChange={(event) => { setReady(""); setEngine(event.target.value as FilmProps["engine"]); }}><option value="gsap">GSAP adapter</option><option value="native">Frame baseline</option></select></label>
    <label style={{ marginLeft: 16 }}><input type="checkbox" checked={variant} onChange={(event) => { setReady(""); setVariant(event.target.checked); }} />Shot 2 color variant</label>
    <div id="film" data-ready={ready} data-seek-ms={seekMs} style={{ width: 270, height: 480, marginTop: 18 }}>{visible && <Player key={mount} ref={player} component={Film} inputProps={{ engine, variant }} compositionWidth={1080} compositionHeight={1920} durationInFrames={360} fps={30} style={{ width: 270, height: 480 }} />}</div>
    <p><button onClick={() => { player.current?.seekTo(0); player.current?.play(); }}>Play from start</button> <button onClick={() => player.current?.pause()}>Pause</button></p>
    <label>Frame <input type="number" min="0" max="359" value={target} onChange={(event) => setTarget(Math.max(0, Math.min(359, Math.round(Number(event.target.value)))))} /></label>
    <button onClick={() => { seekStart.current = performance.now(); setReady(""); setSeekSerial((value) => value + 1); player.current?.pause(); player.current?.seekTo(target); }}>Seek</button>
    <p role="status">Current frame: {frame}</p>
    <button onClick={() => { setReady(""); setMount((value) => value + 1); setFrame(0); }}>Remount Player</button>
    <button onClick={() => { setReady(""); setFrame(0); setVisible((value) => !value); }}>{visible ? "Unmount Player" : "Mount Player"}</button>
    <button onClick={() => setInspection(JSON.stringify({ timelines: gsap.globalTimeline.getChildren(true, false, true).length, tweens: gsap.globalTimeline.getChildren(true, true, false).length,
      transforms: Array.from(document.querySelectorAll("#film [data-camera]")).map((element) => element.getAttribute("transform")),
      frame: player.current?.getCurrentFrame() ?? null }))}>Inspect resources</button>
    <pre id="inspection">{inspection}</pre>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
