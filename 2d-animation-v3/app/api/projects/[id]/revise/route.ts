import "server-only";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { reviseScript } from "../../../../../server/writer.ts";
import { revisionRequestSchema } from "../../../../../workflow/review.ts";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => revisionRequestSchema.parse(input), async (input, signal, progress) => ({ proposalId: await reviseScript(id, input, signal, progress) }));
}
