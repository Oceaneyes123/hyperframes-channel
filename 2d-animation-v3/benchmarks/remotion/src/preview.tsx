import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, type PlayerRef } from "@remotion/player";
import { Film } from "./Film";

function Preview() {
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [target, setTarget] = useState(0);
  const [seekResults, setSeekResults] = useState("");
  useEffect(() => {
    const instance = player.current!;
    const changed = () => setFrame(instance.getCurrentFrame());
    instance.addEventListener("frameupdate", changed);
    return () => instance.removeEventListener("frameupdate", changed);
  }, []);
  return <main>
    <h1>Remotion · isolated 12-second benchmark</h1>
    <p>30 fps · 1080 × 1920 · no audio · synthetic assets</p>
    <div id="film"><Player ref={player} component={Film} inputProps={{ variant: false }} compositionWidth={1080} compositionHeight={1920} durationInFrames={360} fps={30} style={{ width: 270, height: 480 }} /></div>
    <p><button onClick={() => { player.current?.seekTo(0); player.current?.play(); }}>Play from start</button> <button onClick={() => player.current?.pause()}>Pause</button></p>
    <label>Frame <input type="number" min="0" max="359" value={target} onChange={(event) => setTarget(Number(event.target.value))} /></label>
    <button onClick={() => { player.current?.pause(); player.current?.seekTo(target); }}>Seek</button>
    <p role="status">Current frame: {frame}</p>
    <button onClick={async () => {
      player.current?.pause();
      const hashes: { frame: number; sha256: string }[] = [];
      for (const target of [359, 0, 180, 89, 270, 90, 179, 0]) {
        player.current!.seekTo(target);
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        if (player.current!.getCurrentFrame() !== target) throw new Error(`Seek failed: ${target}`);
        const bytes = new TextEncoder().encode(document.querySelector("#film svg")!.outerHTML);
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        hashes.push({ frame: target, sha256: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("") });
      }
      if (hashes[1].sha256 !== hashes[7].sha256) throw new Error("Repeated frame 0 is not deterministic");
      setSeekResults(JSON.stringify({ status: "PASS", scope: "React SVG DOM", hashes }, null, 2));
    }}>Test nonsequential seek</button>
    <pre id="seek-results">{seekResults}</pre>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
