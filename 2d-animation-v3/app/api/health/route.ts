import "server-only";
import { readConfig } from "../../../server/config.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    readConfig();
    return Response.json({ status: "ok", application: "hyperframes-studio-v3", scriptwriting: "implemented", visualPlanning: "implemented", videoGeneration: "not-implemented" });
  } catch {
    return Response.json({ status: "error", reason: "Invalid server configuration" }, { status: 503 });
  }
}
