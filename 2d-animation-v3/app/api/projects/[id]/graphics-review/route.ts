import "server-only";
import { streamWriting } from "../../../../../server/writing-response.ts";
import { graphicReviewRequestSchema, reviewGraphicShot } from "../../../../../server/graphic-review.ts";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return streamWriting(request, id, (input) => graphicReviewRequestSchema.parse(input), async (input, signal, progress) => ({ review: JSON.stringify(await reviewGraphicShot(id, input, signal, progress)) }));
}
