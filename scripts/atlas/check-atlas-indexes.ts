import "dotenv/config";
import dbConnect from "../../src/lib/db";
import mongoose from "mongoose";
import { expectedAtlasIndexes } from "./indexDefinitions";

/**
 * The driver's `listSearchIndexes` typings only guarantee `name`; the
 * actual Atlas response also includes `status`/`queryable`, per
 * https://www.mongodb.com/docs/manual/reference/method/db.collection.getSearchIndexes/
 */
interface AtlasSearchIndexInfo {
  name: string;
  status?: string;
  queryable?: boolean;
}

/**
 * Deployment-time gate: verifies every Atlas Search/Vector index the RAG
 * feature depends on (scripts/atlas/indexDefinitions.ts) exists and is
 * queryable. Exits non-zero if anything is missing or still building, so it
 * can block a deploy from going live before retrieval is actually ready.
 *
 * Until Phase 2 creates the KnowledgeChunk/RoomMemory collections, every
 * index here is expected to report "missing" — that's correct, not a bug.
 *
 * Usage: npm run atlas:check-indexes
 */
async function main() {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("No active database connection");
  }

  let allReady = true;

  for (const expected of expectedAtlasIndexes) {
    const collection = db.collection(expected.collection);
    try {
      const existingIndexes = (await collection
        .listSearchIndexes(expected.name)
        .toArray()) as AtlasSearchIndexInfo[];
      const found = existingIndexes[0];

      if (!found) {
        allReady = false;
        console.log(`[MISSING] ${expected.collection}.${expected.name} (${expected.type})`);
        console.log(`          ${expected.description}`);
        continue;
      }

      if (found.queryable !== true || found.status !== "READY") {
        allReady = false;
        console.log(
          `[NOT READY] ${expected.collection}.${expected.name} — status=${found.status}, queryable=${found.queryable}`
        );
        continue;
      }

      console.log(`[READY] ${expected.collection}.${expected.name}`);
    } catch (error) {
      allReady = false;
      const message = error instanceof Error ? error.message : String(error);
      console.log(
        `[ERROR] ${expected.collection}.${expected.name} — could not list search indexes: ${message}`
      );
      console.log(
        "          (this collection may not exist yet, or the cluster may not support Atlas Search)"
      );
    }
  }

  await mongoose.disconnect();

  if (!allReady) {
    console.error("\nAtlas index readiness check FAILED — see missing/not-ready indexes above.");
    process.exit(1);
  }

  console.log("\nAll expected Atlas indexes are READY.");
}

main().catch((error) => {
  console.error("Atlas index readiness check crashed:", error);
  process.exit(1);
});
