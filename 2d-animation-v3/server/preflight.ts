import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, statfsSync } from "node:fs";
import { dirname } from "node:path";
import { readConfig } from "./config.ts";
import { verifyModel } from "./gateway.ts";

const execute = promisify(execFile);
export class PreflightError extends Error {}
export async function preflight(stage: "gateway" | "render", signal: AbortSignal, config = readConfig()) {
  signal.throwIfAborted();
  if (stage === "gateway") {
    const model = config.visualModel ?? config.gateway.model;
    if (!config.gateway.baseUrl || !model) throw new PreflightError("Configure the gateway URL and model before generation.");
    try {
      await verifyModel({ ...config.gateway, baseUrl: config.gateway.baseUrl, model }, AbortSignal.any([signal, AbortSignal.timeout(10000)]));
    } catch { throw new PreflightError("Gateway preflight failed. Check that the gateway is running, authorized and advertising the selected model."); }
    return { stage, ready: true, limitation: "Model discovery does not verify account credit or browser playback permissions." };
  }
  const browser = process.env.V3_CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
  if (!existsSync(browser)) throw new PreflightError("Render preflight failed. Configure an installed Chrome executable with V3_CHROME_PATH.");
  for (const command of ["ffmpeg", "ffprobe"]) {
    try { await execute(command, ["-version"], { signal, timeout: 10000, maxBuffer: 16000, windowsHide: true }); }
    catch { throw new PreflightError(`Render preflight failed. Install ${command} on PATH.`); }
  }
  let storage = config.videosDirectory;
  while (!existsSync(storage) && dirname(storage) !== storage) storage = dirname(storage);
  const disk = statfsSync(storage), freeBytes = disk.bavail * disk.bsize;
  if (freeBytes < 512 * 1024 * 1024) throw new PreflightError("Render preflight failed. Free at least 512 MB on the output drive; longer renders need more.");
  return { stage, ready: true, freeBytes, limitation: "512 MB is a minimum, not an estimate of full frame storage. Browser review permissions require a separate playback check." };
}
