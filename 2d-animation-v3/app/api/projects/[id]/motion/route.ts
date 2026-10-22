import "server-only";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { generateMotion } from "../../../../../server/motion.ts";
import { motionRequestSchema } from "../../../../../workflow/motion.ts";
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => motionRequestSchema.parse(input), async (input, signal, progress) => ({ runId: await generateMotion(id, input, signal, progress) }));
}
