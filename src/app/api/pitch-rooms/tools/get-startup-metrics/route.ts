import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRoomToolsEnabled } from "@/lib/featureFlags";
import { handleRoomTool, NOT_FOUND_RESULT } from "@/lib/rag/toolHandler";
import { getStartupMetrics } from "@/lib/rag/startupMetrics";

/**
 * Deepgram server-side tool: `get_startup_metrics(metric_names, optional_period)`
 * (plans/RAG_feature.md Section 2 & 3). Prefers structured facts over prose
 * for numerical questions -- reads only StartupFact, never KnowledgeChunk.
 */
const ArgsSchema = z.object({
  metric_names: z.array(z.string().trim().min(1)).min(1).max(10),
  optional_period: z.string().trim().max(100).optional().nullable(),
});

export async function POST(req: NextRequest) {
  if (!isRoomToolsEnabled()) {
    return NextResponse.json(NOT_FOUND_RESULT);
  }

  return handleRoomTool(req, "get_startup_metrics", async (scope, rawArgs) => {
    const parsed = ArgsSchema.safeParse(rawArgs);
    if (!parsed.success || !scope.knowledgeBaseId) {
      return NOT_FOUND_RESULT;
    }

    const metrics = await getStartupMetrics(
      { userId: scope.userId, roomId: scope.roomId, knowledgeBaseId: scope.knowledgeBaseId },
      parsed.data.metric_names,
      parsed.data.optional_period ?? null
    );

    if (metrics.length === 0) {
      return { found: false, reason: "no_matching_metrics" };
    }

    return { found: true, metrics };
  });
}
