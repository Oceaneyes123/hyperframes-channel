export function pcm16Data(bytes: Buffer) {
  inspectWav(bytes);
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const size = bytes.readUInt32LE(offset + 4);
    if (bytes.toString("ascii", offset, offset + 4) === "data") return bytes.subarray(offset + 8, offset + 8 + size);
    offset += 8 + size + size % 2;
  }
  throw new Error("Missing WAV audio data.");
}

export function inspectWav(bytes: Buffer) {
  if (bytes.length > 16_000_000 || bytes.length < 44 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WAVE" || bytes.readUInt32LE(4) + 8 !== bytes.length) throw new Error("Use a complete PCM16 WAV file, at most 16 MB.");
  let format: { channels: number; rate: number; align: number } | undefined, data: Buffer | undefined;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const name = bytes.toString("ascii", offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8;
    if (start + size > bytes.length) throw new Error("Truncated WAV chunk.");
    if (name === "fmt ") {
      if (format || size < 16 || bytes.readUInt16LE(start) !== 1 || bytes.readUInt16LE(start + 14) !== 16) throw new Error("Only PCM16 WAV narration is supported.");
      const channels = bytes.readUInt16LE(start + 2), rate = bytes.readUInt32LE(start + 4), align = bytes.readUInt16LE(start + 12);
      if (![1, 2].includes(channels) || rate < 8000 || rate > 96000 || align !== channels * 2 || bytes.readUInt32LE(start + 8) !== rate * align) throw new Error("Invalid WAV format.");
      format = { channels, rate, align };
    }
    if (name === "data") { if (data) throw new Error("Duplicate WAV audio data."); data = bytes.subarray(start, start + size); }
    offset = start + size + size % 2;
  }
  if (!format || !data?.length || data.length % format.align) throw new Error("Missing or incomplete WAV audio data.");
  const samples = data.length / format.align, durationSeconds = samples / format.rate;
  const waveform = Array.from({ length: 100 }, (_, bin) => {
    let peak = 0;
    for (let i = Math.floor(samples * bin / 100); i < Math.floor(samples * (bin + 1) / 100); i++) for (let channel = 0; channel < format.channels; channel++) peak = Math.max(peak, Math.abs(data.readInt16LE(i * format.align + channel * 2)) / 32768);
    return Math.round(peak * 1000) / 1000;
  });
  if (!waveform.some((peak) => peak > .001)) throw new Error("Narration audio is silent.");
  return { durationSeconds, durationFrames: Math.ceil(durationSeconds * 30), sampleRate: format.rate, channels: format.channels, waveform };
}
