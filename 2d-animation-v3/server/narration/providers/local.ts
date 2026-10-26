import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { NarrationProvider } from "../generation.ts";

const execute = promisify(execFile);
export function windowsSpeechProvider(voice = "Microsoft Zira Desktop"): NarrationProvider {
  return {
    identity: { id: "windows-speech", model: "System.Speech", version: "Windows-installed", voice, license: "Installed Windows voice license; review redistribution rights", licenseUrl: "https://www.microsoft.com/useterms", supportsDelivery: false },
    async generate(input, directory, signal) {
      const request = join(directory, "request.json"), output = join(directory, "raw.wav");
      writeFileSync(request, JSON.stringify({ text: input.text, voice, rate: input.rate }), { flag: "wx" });
      await execute("powershell.exe", ["-NoProfile", "-NonInteractive", "-File", resolve("scripts/local-narration.ps1"), "-RequestJson", request, "-OutputWav", output], { signal, timeout: 180_000, maxBuffer: 4000, windowsHide: true });
      return readFileSync(output);
    },
  };
}

// Host-owned adapter configuration, never model-provided commands or endpoints.
export function pythonNarrationProvider(config: { python: string; provider: "chatterbox-turbo" | "qwen3-tts"; modelPath: string; version: string; voice: string; referenceWav: string; referenceText: string; device: "cpu" | "cuda" }): NarrationProvider {
  const qwen = config.provider === "qwen3-tts";
  return {
    identity: { id: config.provider, model: config.modelPath, version: config.version, voice: config.voice, license: qwen ? "Apache-2.0" : "MIT", licenseUrl: qwen ? "https://github.com/QwenLM/Qwen3-TTS" : "https://github.com/resemble-ai/chatterbox", referenceHash: createHash("sha256").update(readFileSync(config.referenceWav)).digest("hex"), supportsDelivery: false },
    async generate(input, directory, signal) {
      const request = join(directory, "request.json"), output = join(directory, "raw.wav");
      writeFileSync(request, JSON.stringify({ ...config, text: input.text, seed: input.seed }), { flag: "wx" });
      await execute(config.python, [resolve("scripts/local-narration.py"), request, output], { signal, timeout: 600_000, maxBuffer: 16000, windowsHide: true,
        env: { ...process.env, HF_HUB_OFFLINE: "1", TRANSFORMERS_OFFLINE: "1" } });
      return readFileSync(output);
    },
  };
}
