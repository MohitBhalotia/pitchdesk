import { getOpenAIClient } from "./openaiClient";
import { getCachedEmbedding, setCachedEmbedding } from "./embeddingCache";
import { EMBEDDING_MODEL } from "./limits";

const BATCH_SIZE = 100;

/**
 * Embeds a batch of chunk texts, checking the Redis embedding cache first
 * for each one (Section 4) so duplicate chunk content across ingestion
 * retries never gets re-embedded. Returns embeddings in the same order as
 * `texts`.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const results: (number[] | null)[] = await Promise.all(
    texts.map((text) => getCachedEmbedding(text))
  );

  const missingIndexes = results.reduce<number[]>((acc, value, index) => {
    if (value === null) acc.push(index);
    return acc;
  }, []);

  const client = getOpenAIClient();

  for (let i = 0; i < missingIndexes.length; i += BATCH_SIZE) {
    const batchIndexes = missingIndexes.slice(i, i + BATCH_SIZE);
    const batchTexts = batchIndexes.map((index) => texts[index]);

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batchTexts,
    });

    await Promise.all(
      batchIndexes.map(async (textIndex, batchPosition) => {
        const embedding = response.data[batchPosition].embedding;
        results[textIndex] = embedding;
        await setCachedEmbedding(texts[textIndex], embedding);
      })
    );
  }

  return results as number[][];
}
