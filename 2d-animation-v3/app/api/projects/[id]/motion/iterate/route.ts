import "server-only";
import { streamWriting } from "../../../../../../server/writing-response.ts";
import { iterateMotion, motionIterationRequestSchema } from "../../../../../../server/motion-iteration.ts";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => motionIterationRequestSchema.parse(input), async (input, signal, progress) => {
    const result = await iterateMotion(id, input, signal, progress);
    return { runId: result.artifactId, iterationId: result.id, stop: result.stop, findings: JSON.stringify(result.findings) };
  });
}
