import "dotenv/config";
import fs from "fs";
import dbConnect from "../../src/lib/db";
import { searchKnowledgeBase } from "../../src/lib/rag/retrieval";
import { computeRecallAtK, computeMRR, average } from "../../src/lib/eval/scoring";

/**
 * Offline gold-set retrieval eval harness (plans/RAG_feature.md Section 7).
 * Run in CI/staging only, against fixture data -- never production traffic.
 * Gates beta expansion at recall@5 >= 85%.
 *
 * Usage:
 *   npm run eval:rag -- scripts/eval/gold-questions.example.json
 */

const RECALL_AT_K = 5;
const RECALL_GATE = 0.85;

interface GoldQuestion {
  userId: string;
  roomId: string;
  knowledgeBaseId: string;
  knowledgeBaseRevision: number;
  query: string;
  relevantChunkIds: string[];
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npm run eval:rag -- <path-to-gold-questions.json>");
    process.exit(1);
  }

  const questions: GoldQuestion[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (questions.length === 0) {
    console.error("No gold questions found in the given file.");
    process.exit(1);
  }

  await dbConnect();

  const recalls: number[] = [];
  const mrrs: number[] = [];

  for (const question of questions) {
    const passages = await searchKnowledgeBase(
      {
        userId: question.userId,
        roomId: question.roomId,
        knowledgeBaseId: question.knowledgeBaseId,
        knowledgeBaseRevision: question.knowledgeBaseRevision,
      },
      question.query
    );
    const retrievedIds = passages.map((p) => p.chunkId);

    const recall = computeRecallAtK(retrievedIds, question.relevantChunkIds, RECALL_AT_K);
    const mrr = computeMRR(retrievedIds, question.relevantChunkIds);
    recalls.push(recall);
    mrrs.push(mrr);

    console.log(`- "${question.query}" -> recall@${RECALL_AT_K}=${recall.toFixed(2)} mrr=${mrr.toFixed(2)}`);
  }

  const avgRecall = average(recalls);
  const avgMrr = average(mrrs);

  console.log(`\n${questions.length} question(s) evaluated`);
  console.log(`Recall@${RECALL_AT_K}: ${(avgRecall * 100).toFixed(1)}% (gate: >= ${RECALL_GATE * 100}%)`);
  console.log(`MRR: ${avgMrr.toFixed(3)}`);

  if (avgRecall < RECALL_GATE) {
    console.error("\nFAILED -- recall@5 is below the beta-expansion gate.");
    process.exit(1);
  }

  console.log("\nPASSED");
  process.exit(0);
}

main().catch((error) => {
  console.error("Eval harness failed to run:", error);
  process.exit(1);
});
