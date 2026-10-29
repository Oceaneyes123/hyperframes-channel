import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { NarrationProvider } from "../generation.ts";
import { z } from "zod";
import { PreflightError } from "../../preflight.ts";

const execute = promisify(execFile);
export function configuredNarrationProvider(name: "windows-speech" | "qwen3-custom") {
  if (name === "windows-speech") return windowsSpeechProvider();
  const settings = z.object({ V3_QWEN_PYTHON: z.string().min(1), V3_QWEN_MODEL_DIR: z.string().min(1), V3_QWEN_MODEL_VERSION: z.string().min(1), V3_QWEN_SPEAKER: z.string().min(1), V3_QWEN_DEVICE: z.enum(["cpu", "cuda"]) }).safeParse(process.env);
  if (!settings.success) throw new PreflightError("Configure the local Qwen Python environment, model directory, model version, speaker and device first.");
  const value = settings.data;
  return pythonNarrationProvider({ provider: "qwen3-custom", python: value.V3_QWEN_PYTHON, modelPath: value.V3_QWEN_MODEL_DIR, version: value.V3_QWEN_MODEL_VERSION, voice: value.V3_QWEN_SPEAKER, device: value.V3_QWEN_DEVICE });
}
export function windowsSpeechProvider(voice = "Microsoft Zira Desktop"): NarrationProvider {
  return {
    identity: { id: "windows-speech", model: "System.Speech", version: "Windows-installed", voice, license: "Installed Windows voice license; review redistribution rights", licenseUrl: "https://www.microsoft.com/useterms", supportsDelivery: false },
    async preflight(signal) {
      try { await execute("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "Add-Type -AssemblyName System.Speech; $speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer; try { $speaker.SelectVoice($env:V3_CHECK_VOICE) } finally { $speaker.Dispose() }"], { signal, timeout: 15000, windowsHide: true, maxBuffer: 1000, env: { ...process.env, V3_CHECK_VOICE: voice } }); }
      catch { throw new PreflightError("Windows Speech preflight failed. Install or select an available Windows voice."); }
    },
    async generate(input, directory, signal) {
      const request = join(directory, "request.json"), output = join(directory, "raw.wav");
      writeFileSync(request, JSON.stringify({ text: input.text, voice, rate: input.rate }), { flag: "wx" });
      await execute("powershell.exe", ["-NoProfile", "-NonInteractive", "-File", resolve("scripts/local-narration.ps1"), "-RequestJson", request, "-OutputWav", output], { signal, timeout: 180_000, maxBuffer: 4000, windowsHide: true });
      return readFileSync(output);
    },
  };
}

// Host-owned adapter configuration, never model-provided commands or endpoints.
export function pythonNarrationProvider(config: { python: string; provider: "chatterbox-turbo" | "qwen3-tts" | "qwen3-custom"; modelPath: string; version: string; voice: string; referenceWav?: string; referenceText?: string; device: "cpu" | "cuda" }): NarrationProvider {
  const qwen = config.provider !== "chatterbox-turbo", custom = config.provider === "qwen3-custom";
  if (!custom && (!config.referenceWav || !config.referenceText)) throw new Error("Clone providers require a local reference WAV and transcript.");
  return {
    identity: { id: config.provider, model: config.modelPath, version: config.version, voice: config.voice, license: qwen ? "Apache-2.0" : "MIT", licenseUrl: qwen ? "https://github.com/QwenLM/Qwen3-TTS" : "https://github.com/resemble-ai/chatterbox", ...(config.referenceWav ? { referenceHash: createHash("sha256").update(readFileSync(config.referenceWav)).digest("hex") } : {}), runtimeHash: createHash("sha256").update(JSON.stringify({ python: config.python, device: config.device, referenceText: config.referenceText, adapter: readFileSync(resolve("scripts/local-narration.py"), "utf8") })).digest("hex"), supportsDelivery: custom },
    async preflight(signal) {
      if (!existsSync(config.modelPath)) throw new PreflightError("Local voice model is missing. Configure an installed model before generation.");
      try {
        await execute(config.python, ["-c", "import importlib.util,sys,soundfile; assert importlib.util.find_spec(sys.argv[1]); import torch; assert sys.argv[2] != 'cuda' or torch.cuda.is_available()", qwen ? "qwen_tts" : "chatterbox", config.device], { signal, timeout: 30000, maxBuffer: 1000, windowsHide: true });
      } catch { throw new PreflightError("Local voice preflight failed. Check the Python environment, voice package and selected CPU/CUDA device."); }
    },
    async generate(input, directory, signal) {
      const request = join(directory, "request.json"), output = join(directory, "raw.wav");
      writeFileSync(request, JSON.stringify({ ...config, text: input.text, seed: input.seed, delivery: input.delivery }), { flag: "wx" });
      await execute(config.python, [resolve("scripts/local-narration.py"), request, output], { signal, timeout: 600_000, maxBuffer: 16000, windowsHide: true,
        env: { ...process.env, HF_HUB_OFFLINE: "1", TRANSFORMERS_OFFLINE: "1" } });
      return readFileSync(output);
    },
  };
}
