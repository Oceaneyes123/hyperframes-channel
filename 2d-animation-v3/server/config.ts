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
  CLIPROXYAPI_VISUAL_MODEL: z.string().trim().min(1).optional(),
  CLIPROXYAPI_DIRECTOR_MODEL: z.string().trim().min(1).optional(),
  CLIPROXYAPI_WRITER_MODEL: z.string().trim().min(1).optional(),
  CLIPROXYAPI_MOTION_MODEL: z.string().trim().min(1).optional(),
  CLIPROXYAPI_CRITIC_MODEL: z.string().trim().min(1).optional(),
  V3_CREATIVE_EXAMPLE_IDS: z.string().optional().transform((value) => value ? value.split(",").map((id) => id.trim()) : []).pipe(z.array(z.uuid()).max(3)),
});

export type ModelRole = "director" | "writer" | "motion" | "critic";
export type Config = {
  dataDirectory: string; videosDirectory: string; visualModel?: string;
  roleModels?: Partial<Record<ModelRole, string>>; creativeExampleIds?: string[];
  gateway: { baseUrl?: string; apiKey?: string; model?: string };
};

export function modelFor(config: Config, role: ModelRole) {
  return config.roleModels?.[role] ?? ((role === "director" || role === "critic") ? config.visualModel : undefined) ?? config.gateway.model;
}

export function readConfig(environment: Record<string, string | undefined> = process.env): Config {
  const values = environmentSchema.parse(environment);
  return {
    dataDirectory: resolve(values.V3_DATA_DIR),
    videosDirectory: resolve(values.V3_VIDEOS_DIR),
    visualModel: values.CLIPROXYAPI_VISUAL_MODEL,
    roleModels: { director: values.CLIPROXYAPI_DIRECTOR_MODEL, writer: values.CLIPROXYAPI_WRITER_MODEL, motion: values.CLIPROXYAPI_MOTION_MODEL, critic: values.CLIPROXYAPI_CRITIC_MODEL },
    creativeExampleIds: values.V3_CREATIVE_EXAMPLE_IDS,
    gateway: {
      baseUrl: values.CLIPROXYAPI_BASE_URL,
      apiKey: values.CLIPROXYAPI_API_KEY,
      model: values.CLIPROXYAPI_MODEL,
    },
  };
}
