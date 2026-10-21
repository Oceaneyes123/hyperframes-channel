import "server-only";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { generateVisuals } from "../../../../../server/visuals.ts";
import { visualRequestSchema } from "../../../../../workflow/visuals.ts";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => visualRequestSchema.parse(input), async (input, signal, progress) => ({ runId: await generateVisuals(id, input, signal, progress) }));
}
