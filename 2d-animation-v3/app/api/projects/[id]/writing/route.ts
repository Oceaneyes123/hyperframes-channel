import "server-only";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { generateWriting } from "../../../../../server/scriptwriting.ts";
import { writingRequestSchema } from "../../../../../workflow/scriptwriting.ts";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => writingRequestSchema.parse(input), async (input, signal, progress) => ({ runId: await generateWriting(id, input, signal, progress) }));
}
