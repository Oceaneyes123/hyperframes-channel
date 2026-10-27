import { z } from "zod";
import { readConfig } from "../../../../../server/config.ts";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { openNarrationStudio } from "../../../../../server/narration/studio.ts";
import { pythonNarrationProvider, windowsSpeechProvider } from "../../../../../server/narration/providers/local.ts";
import { narrationRequestSchema } from "../../../../../server/narration/generation.ts";

const inputSchema = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("generate"), scriptId: z.uuid(), provider: z.enum(["windows-speech", "qwen3-custom"]), lineNumber: z.number().int().positive().optional(), pronunciation: narrationRequestSchema.shape.pronunciation, rate: narrationRequestSchema.shape.rate, seed: narrationRequestSchema.shape.seed }),
  z.strictObject({ action: z.literal("import"), id: z.uuid(), baseId: z.uuid().nullable(), reviewed: z.literal(true) }),
]);
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => inputSchema.parse(input), async (input, signal, progress): Promise<Record<string, string>> => {
    const config = readConfig(), store = openNarrationStudio(config.dataDirectory, config.videosDirectory);
    try {
      if (input.action === "import") return { saved: store.import(id, input.id, input.baseId, input.reviewed) };
      const provider = input.provider === "windows-speech" ? windowsSpeechProvider() : (() => {
        const settings = z.object({ V3_QWEN_PYTHON: z.string().min(1), V3_QWEN_MODEL_DIR: z.string().min(1), V3_QWEN_MODEL_VERSION: z.string().min(1), V3_QWEN_SPEAKER: z.string().min(1), V3_QWEN_DEVICE: z.enum(["cpu", "cuda"]) }).parse(process.env);
        return pythonNarrationProvider({ provider: "qwen3-custom", python: settings.V3_QWEN_PYTHON, modelPath: settings.V3_QWEN_MODEL_DIR, version: settings.V3_QWEN_MODEL_VERSION, voice: settings.V3_QWEN_SPEAKER, device: settings.V3_QWEN_DEVICE });
      })();
      progress("Generating an audition from the accepted script. Listening and timing review remain required.");
      return { generated: await store.generate(id, provider, input, signal) };
    } finally { store.close(); }
  });
}
