import { Player, Stage, Renderer, RendererResult, Vector2 } from "@motion-canvas/core";
import project from "./project?project";

const settings = { ...project.meta.getFullPreviewSettings(), fps: 30, size: new Vector2(1080, 1920), resolutionScale: 1, range: [0, 12] as [number, number] };
const player = new Player(project, settings, { paused: true, loop: false, muted: true });
const stage = new Stage();
stage.configure({ size: settings.size, resolutionScale: 1, background: "#121b21" });
stage.finalBuffer.style.width = "270px";
stage.finalBuffer.style.height = "480px";
document.getElementById("stage")!.append(stage.finalBuffer);
const status = document.getElementById("status")!;
player.onRender.subscribe(() => stage.render(player.playback.currentScene, player.playback.previousScene));
player.onFrameChanged.subscribe((frame) => { status.textContent = `Current frame: ${frame}`; });
document.getElementById("play")!.onclick = () => { player.requestSeek(0); player.togglePlayback(true); };
document.getElementById("pause")!.onclick = () => player.togglePlayback(false);
document.getElementById("seek")!.onclick = () => { player.togglePlayback(false); player.requestSeek(Number((document.getElementById("frame") as HTMLInputElement).value)); };

const renderer = new Renderer(project);
let result = RendererResult.Error;
renderer.onFinished.subscribe((value) => { result = value; });
document.getElementById("render")!.onclick = async () => {
  const button = document.getElementById("render") as HTMLButtonElement;
  button.disabled = true;
  player.deactivate();
  const metrics: object[] = [];
  try {
    for (const label of ["cold", "warm-1", "warm-2", "warm-3"]) {
      status.textContent = `Rendering ${label}`;
      const started = performance.now();
      await renderer.render({ ...project.meta.getFullRenderingSettings(), name: label, fps: 30, size: settings.size, resolutionScale: 1,
        range: [0, 359 / 30], exporter: { name: "@motion-canvas/ffmpeg", options: { fastStart: true, includeAudio: false } } });
      if (result !== RendererResult.Success) throw new Error(`Renderer failed: ${label}`);
      metrics.push({ label, elapsedMs: performance.now() - started, memoryScope: "unavailable; browser/encoder memory not attributed" });
      document.getElementById("metrics")!.textContent = JSON.stringify(metrics, null, 2);
    }
    status.textContent = "Four exports complete";
  } catch (error) { status.textContent = String(error); }
  finally { button.disabled = false; player.activate(); }
};

document.getElementById("stills")!.onclick = async () => {
  player.deactivate();
  try {
    for (const variant of [false, true]) {
      project.variables = { variant };
      project.name = variant ? "variant" : "base";
      for (const frame of [0, 59, 60, 89, 90, 179, 180, 269, 270, 359]) {
        await renderer.renderFrame({ ...project.meta.getFullRenderingSettings(), name: project.name, fps: 30, size: settings.size, resolutionScale: 1 }, frame / 30);
      }
    }
    status.textContent = "20 native stills captured";
  } finally { project.variables = { variant: false }; project.name = "project"; player.activate(); }
};

document.getElementById("seek-test")!.onclick = async () => {
  player.togglePlayback(false);
  const hashes: { frame: number; sha256: string }[] = [];
  for (const target of [359, 0, 180, 89, 270, 90, 179, 0]) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { player.onRender.unsubscribe(capture); reject(new Error(`Seek timeout: ${target}`)); }, 10000);
      const capture = async () => {
        if (player.playback.frame !== target) return;
        player.onRender.unsubscribe(capture);
        await stage.render(player.playback.currentScene, player.playback.previousScene);
        const bytes = new TextEncoder().encode(stage.finalBuffer.toDataURL("image/png"));
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        hashes.push({ frame: target, sha256: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("") });
        clearTimeout(timer); resolve();
      };
      player.onRender.subscribe(capture);
      player.requestSeek(target); player.requestRender();
    });
  }
  if (hashes[1].sha256 !== hashes[7].sha256) throw new Error("Repeated frame 0 is not deterministic");
  document.getElementById("seek-results")!.textContent = JSON.stringify({ status: "PASS", scope: "Canvas PNG data", hashes }, null, 2);
};
