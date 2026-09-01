import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/KnowledgeSourceModel", () => ({
  default: { findById: vi.fn(), findOne: vi.fn(), find: vi.fn() },
}));
vi.mock("../../../src/models/KnowledgeBaseModel", () => ({
  default: { findById: vi.fn(), updateOne: vi.fn() },
}));
vi.mock("../../../src/models/KnowledgeChunkModel", () => ({
  default: { insertMany: vi.fn(), countDocuments: vi.fn() },
}));
vi.mock("../../../src/models/StartupFactModel", () => ({
  default: { insertMany: vi.fn(), find: vi.fn() },
}));
vi.mock("../../../src/lib/cloudinary", () => ({
  buildAuthenticatedDownloadUrl: vi.fn(() => "https://example.test/file"),
}));
vi.mock("../../../src/lib/ingestion/unstructuredClient", () => ({
  parseDocumentWithUnstructured: vi.fn(),
}));
vi.mock("../../../src/lib/ingestion/extractStartupFacts", () => ({
  extractStartupFacts: vi.fn(() => Promise.resolve([])),
}));
vi.mock("../../../src/lib/ingestion/embedTexts", () => ({
  embedTexts: vi.fn(),
}));
vi.mock("../../../src/lib/ingestion/buildStartupBrief", () => ({
  buildStartupBrief: vi.fn(() => Promise.resolve("A concise brief.")),
}));

import KnowledgeSourceModel from "../../../src/models/KnowledgeSourceModel";
import KnowledgeBaseModel from "../../../src/models/KnowledgeBaseModel";
import KnowledgeChunkModel from "../../../src/models/KnowledgeChunkModel";
import StartupFactModel from "../../../src/models/StartupFactModel";
import { embedTexts } from "../../../src/lib/ingestion/embedTexts";
import { runIngestSourceJob } from "./runIngestSourceJob";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

function makeSource(overrides: Record<string, unknown> = {}) {
  return {
    _id: "source1",
    userId: "user1",
    roomId: "room1",
    knowledgeBaseId: "kb1",
    sourceType: "pasted_text",
    pastedText: "Our ARR is $1M as of 2025.",
    contentHash: "hash1",
    revision: 1,
    stage: "queued",
    errorMessage: null,
    pageCount: null,
    save: vi.fn(),
    ...overrides,
  };
}

describe("runIngestSourceJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asMock(StartupFactModel.find).mockReturnValue({ lean: () => Promise.resolve([]) });
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(null); // no duplicate by default
    asMock(KnowledgeBaseModel.findById).mockResolvedValue({
      _id: "kb1",
      activeRevision: 0,
      startupBrief: null,
    });
    asMock(KnowledgeChunkModel.countDocuments).mockResolvedValue(1);
    asMock(embedTexts).mockResolvedValue([[0.1, 0.2]]);
  });

  it("does nothing if the source no longer exists", async () => {
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(null);
    await runIngestSourceJob("missing", 1);
    expect(KnowledgeBaseModel.updateOne).not.toHaveBeenCalled();
  });

  it("does nothing if the job's revision is stale", async () => {
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(makeSource({ revision: 2 }));
    await runIngestSourceJob("source1", 1);
    expect(KnowledgeChunkModel.insertMany).not.toHaveBeenCalled();
  });

  it("does nothing if the source is already ready", async () => {
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(makeSource({ stage: "ready" }));
    await runIngestSourceJob("source1", 1);
    expect(KnowledgeChunkModel.insertMany).not.toHaveBeenCalled();
  });

  it("marks the source failed without throwing on a duplicate content hash", async () => {
    const source = makeSource();
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(source);
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue({ _id: "other-source" });
    // KnowledgeSourceModel.find is used by recomputeKnowledgeBaseStatus
    asMock(KnowledgeSourceModel.find).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve([{ stage: "ready" }]) }),
    });

    await expect(runIngestSourceJob("source1", 1)).resolves.toBeUndefined();

    expect(source.stage).toBe("failed");
    expect(source.errorMessage).toMatch(/already been added/);
    expect(KnowledgeChunkModel.insertMany).not.toHaveBeenCalled();
  });

  it("ingests pasted text end to end: chunks, facts, embeddings, and publishes the KB", async () => {
    const source = makeSource();
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(source);
    asMock(KnowledgeSourceModel.find).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve([{ stage: "ready" }]) }),
    });

    await runIngestSourceJob("source1", 1);

    expect(source.stage).toBe("ready");
    expect(KnowledgeChunkModel.insertMany).toHaveBeenCalledTimes(1);
    expect(KnowledgeBaseModel.updateOne).toHaveBeenCalledWith(
      { _id: "kb1" },
      expect.objectContaining({
        $set: expect.objectContaining({ activeRevision: 1, startupBrief: "A concise brief." }),
      })
    );
    // recomputeKnowledgeBaseStatus's own updateOne call
    expect(KnowledgeBaseModel.updateOne).toHaveBeenCalledWith(
      { _id: "kb1" },
      { $set: { status: "ready" } }
    );
  });

  it("marks the source failed and rethrows on a retryable error, for BullMQ to retry", async () => {
    const source = makeSource();
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(source);
    asMock(KnowledgeSourceModel.find).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve([{ stage: "failed" }]) }),
    });
    asMock(embedTexts).mockRejectedValue(new Error("OpenAI is down"));

    await expect(runIngestSourceJob("source1", 1)).rejects.toThrow("OpenAI is down");

    expect(source.stage).toBe("failed");
    expect(source.errorMessage).toBe("OpenAI is down");
  });

  it("keeps the Knowledge Base ready if another source is already ready, even when this one fails", async () => {
    const source = makeSource();
    asMock(KnowledgeSourceModel.findById).mockResolvedValue(source);
    asMock(embedTexts).mockRejectedValue(new Error("boom"));
    asMock(KnowledgeSourceModel.find).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve([{ stage: "ready" }, { stage: "failed" }]) }),
    });

    await expect(runIngestSourceJob("source1", 1)).rejects.toThrow();

    expect(KnowledgeBaseModel.updateOne).toHaveBeenCalledWith(
      { _id: "kb1" },
      { $set: { status: "ready" } }
    );
  });
});
