export function isLocalRequest(host: string | null, origin: string | null) {
  if (!host || !["127.0.0.1:3003", "localhost:3003", "[::1]:3003"].includes(host)) return false;
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && url.host === host;
  } catch {
    return false;
  }
}
