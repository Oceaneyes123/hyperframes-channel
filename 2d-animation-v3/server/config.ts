import { resolve } from "node:path";
import { z } from "zod";

const environmentSchema = z.object({
  V3_DATA_DIR: z.string().trim().min(1).default(".data"),
  V3_VIDEOS_DIR: z.string().trim().min(1).default("videos"),
  CLIPROXYAPI_BASE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  }, "Expected an HTTP(S) URL without embedded credentials").optional(),
  CLIPROXYAPI_API_KEY: z.string().trim().min(1).optional(),
  CLIPROXYAPI_MODEL: z.string().trim().min(1).optional(),
});

export function readConfig(environment: Record<string, string | undefined> = process.env) {
  const values = environmentSchema.parse(environment);
  return {
    dataDirectory: resolve(values.V3_DATA_DIR),
    videosDirectory: resolve(values.V3_VIDEOS_DIR),
    gateway: {
      baseUrl: values.CLIPROXYAPI_BASE_URL,
      apiKey: values.CLIPROXYAPI_API_KEY,
      model: values.CLIPROXYAPI_MODEL,
    },
  };
}
