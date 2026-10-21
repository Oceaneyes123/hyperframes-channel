import "server-only";
import { readConfig } from "./config.ts";
import { openStudio } from "./studio.ts";

export function withStudio<T>(run: (studio: ReturnType<typeof openStudio>) => T): T {
  const config = readConfig();
  const studio = openStudio(config.dataDirectory, config.videosDirectory);
  try { return run(studio); } finally { studio.close(); }
}
