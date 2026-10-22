export function mediaResponse(request: Request, bytes: Uint8Array, type: string, filename?: string) {
  const headers = new Headers({ "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" });
  if (filename) headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  const range = request.headers.get("range"); let start = 0, end = bytes.length - 1;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || !match[1] && !match[2]) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    start = match[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match[2]));
    end = match[1] && match[2] ? Math.min(bytes.length - 1, Number(match[2])) : bytes.length - 1;
    if (![start, end].every(Number.isSafeInteger) || start < 0 || start >= bytes.length || end < start || !match[1] && Number(match[2]) === 0) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    headers.set("Content-Range", `bytes ${start}-${end}/${bytes.length}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  return new Response(request.method === "HEAD" ? null : bytes.slice(start, end + 1), { status: range ? 206 : 200, headers });
}
