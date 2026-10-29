import { z } from "zod";
import { readConfig } from "../../../../../server/config.ts";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { openNarrationStudio, studioNarrationRequestSchema } from "../../../../../server/narration/studio.ts";
import { configuredNarrationProvider } from "../../../../../server/narration/providers/local.ts";

const inputSchema = z.discriminatedUnion("action", [
  studioNarrationRequestSchema.extend({ action: z.literal("generate") }),
  z.strictObject({ action: z.literal("import"), id: z.uuid(), baseId: z.uuid().nullable(), reviewed: z.literal(true) }),
]);
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => inputSchema.parse(input), async (input, signal, progress): Promise<Record<string, string>> => {
    const config = readConfig(), store = openNarrationStudio(config.dataDirectory, config.videosDirectory);
    try {
      if (input.action === "import") return { saved: store.import(id, input.id, input.baseId, input.reviewed) };
      const provider = configuredNarrationProvider(input.provider);
      progress("Generating an audition from the accepted script. Listening and timing review remain required.");
      return { generated: await store.generate(id, provider, input, signal, progress) };
    } finally { store.close(); }
  });
}
