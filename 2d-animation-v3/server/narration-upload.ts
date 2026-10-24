export async function narrationUpload(request: Request) {
  const reader = request.body?.getReader(); if (!reader) throw new Error("Missing upload.");
  const parts: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 17_000_000) throw new Error("Narration upload exceeds 17 MB."); parts.push(part.value); }
  } finally { await reader.cancel(); reader.releaseLock(); }
  const data = await new Response(Buffer.concat(parts), { headers: { "Content-Type": request.headers.get("Content-Type") ?? "" } }).formData();
  const file = data.get("audio"); if (!(file instanceof File)) throw new Error("Choose a PCM16 WAV narration file.");
  return { data, audio: Buffer.from(await file.arrayBuffer()) };
}
