import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/KnowledgeSourceModel", async () => {
  const actual = await vi.importActual<typeof import("@/models/KnowledgeSourceModel")>(
    "@/models/KnowledgeSourceModel"
  );
  return {
    ...actual,
    default: {
      countDocuments: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
    },
  };
});
vi.mock("@/models/KnowledgeBaseModel", () => ({
  default: { updateOne: vi.fn() },
}));
vi.mock("@/models/KnowledgeChunkModel", () => ({
  default: { deleteMany: vi.fn(), aggregate: vi.fn() },
}));
vi.mock("@/models/StartupFactModel", () => ({
  default: { deleteMany: vi.fn() },
}));
vi.mock("@/lib/cloudinary", () => ({
  getCloudinary: vi.fn(),
}));
vi.mock("@/lib/queues", () => ({
  enqueueIngestSource: vi.fn(),
}));
vi.mock("./pitchRooms", () => ({
  getOwnedRoom: vi.fn(),
}));
vi.mock("./knowledgeBase", () => ({
  getOrCreateKnowledgeBase: vi.fn(),
}));

import KnowledgeSourceModel from "@/models/KnowledgeSourceModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { getCloudinary } from "@/lib/cloudinary";
import { enqueueIngestSource } from "@/lib/queues";
import { getOwnedRoom } from "./pitchRooms";
import { getOrCreateKnowledgeBase } from "./knowledgeBase";
import {
  createUploadIntent,
  confirmUpload,
  createPastedTextSource,
  retrySource,
  KnowledgeSourceError,
} from "./knowledgeSources";
import { MAX_ACTIVE_SOURCES_PER_ROOM, MAX_FILE_BYTES } from "@/lib/ingestion/limits";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

beforeEach(() => {
  vi.clearAllMocks();
  asMock(getOrCreateKnowledgeBase).mockResolvedValue({ _id: "kb1" });
  asMock(getOwnedRoom).mockResolvedValue({ _id: "room1" });
  asMock(KnowledgeSourceModel.countDocuments).mockResolvedValue(0);
  asMock(KnowledgeSourceModel.aggregate).mockResolvedValue([]);
});

describe("createUploadIntent", () => {
  it("rejects an unsupported file type", async () => {
    await expect(
      createUploadIntent({
        userId: "u1",
        roomId: "r1",
        fileName: "a.exe",
        fileType: "exe",
        fileSize: 1000,
      })
    ).rejects.toMatchObject({ status: 400 });
    expect(KnowledgeSourceModel.create).not.toHaveBeenCalled();
  });

  it("rejects a file over the size limit", async () => {
    await expect(
      createUploadIntent({
        userId: "u1",
        roomId: "r1",
        fileName: "deck.pdf",
        fileType: "pdf",
        fileSize: MAX_FILE_BYTES + 1,
      })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejects once the room is at the active-source cap", async () => {
    asMock(KnowledgeSourceModel.countDocuments).mockResolvedValue(MAX_ACTIVE_SOURCES_PER_ROOM);

    await expect(
      createUploadIntent({ userId: "u1", roomId: "r1", fileName: "deck.pdf", fileType: "pdf", fileSize: 1000 })
    ).rejects.toBeInstanceOf(KnowledgeSourceError);
    expect(KnowledgeSourceModel.create).not.toHaveBeenCalled();
  });

  it("404s when the room isn't owned by this user", async () => {
    asMock(getOrCreateKnowledgeBase).mockResolvedValue(null);
    await expect(
      createUploadIntent({ userId: "u1", roomId: "r1", fileName: "deck.pdf", fileType: "pdf", fileSize: 1000 })
    ).rejects.toMatchObject({ status: 404 });
  });

  it("creates a queued-for-upload source and signs a Cloudinary payload", async () => {
    asMock(KnowledgeSourceModel.create).mockResolvedValue({ _id: "source1" });
    const cloudinary = {
      utils: { api_sign_request: vi.fn(() => "signed") },
    };
    asMock(getCloudinary).mockReturnValue(cloudinary);

    const result = await createUploadIntent({
      userId: "u1",
      roomId: "r1",
      fileName: "deck.pdf",
      fileType: "PDF",
      fileSize: 1000,
    });

    expect(KnowledgeSourceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ sourceType: "file", fileType: "pdf", stage: "uploading" })
    );
    expect(result.sourceId).toBe("source1");
    expect(result.upload.resourceType).toBe("raw");
    expect(result.upload.signature).toBe("signed");
  });

  it("uses the image resource type for image file types", async () => {
    asMock(KnowledgeSourceModel.create).mockResolvedValue({ _id: "source2" });
    asMock(getCloudinary).mockReturnValue({ utils: { api_sign_request: vi.fn(() => "signed") } });

    const result = await createUploadIntent({
      userId: "u1",
      roomId: "r1",
      fileName: "scan.png",
      fileType: "png",
      fileSize: 1000,
    });

    expect(result.upload.resourceType).toBe("image");
  });
});

describe("confirmUpload", () => {
  it("404s when the source doesn't exist", async () => {
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(null);
    await expect(
      confirmUpload({ userId: "u1", roomId: "r1", sourceId: "s1" })
    ).rejects.toMatchObject({ status: 404 });
  });

  it("rejects re-confirming a source that isn't in the uploading stage", async () => {
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue({ stage: "queued" });
    await expect(
      confirmUpload({ userId: "u1", roomId: "r1", sourceId: "s1" })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("verifies the resource server-side and enqueues ingestion on success", async () => {
    const source = {
      _id: "s1",
      stage: "uploading",
      fileType: "pdf",
      knowledgeBaseId: "kb1",
      revision: 1,
      contentHash: null as string | null,
      save: vi.fn(),
    };
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(source);
    const cloudinary = {
      api: { resource: vi.fn().mockResolvedValue({ bytes: 5000, format: "pdf", etag: "etag123" }) },
      uploader: { destroy: vi.fn() },
    };
    asMock(getCloudinary).mockReturnValue(cloudinary);

    await confirmUpload({ userId: "u1", roomId: "r1", sourceId: "s1" });

    expect(source.stage).toBe("queued");
    expect(source.contentHash).toBe("etag123");
    expect(source.save).toHaveBeenCalledTimes(1);
    expect(KnowledgeBaseModel.updateOne).toHaveBeenCalledWith(
      { _id: "kb1" },
      { $inc: { sourceCount: 1, totalBytes: 5000 }, $set: { status: "processing" } }
    );
    expect(enqueueIngestSource).toHaveBeenCalledWith({ sourceId: "s1", revision: 1 });
  });

  it("rejects and cleans up when Cloudinary reports the file is over the size limit", async () => {
    const source = { _id: "s1", stage: "uploading", fileType: "pdf", save: vi.fn() };
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(source);
    const destroy = vi.fn().mockResolvedValue(undefined);
    asMock(getCloudinary).mockReturnValue({
      api: { resource: vi.fn().mockResolvedValue({ bytes: MAX_FILE_BYTES + 1, format: "pdf", etag: "e" }) },
      uploader: { destroy },
    });

    await expect(confirmUpload({ userId: "u1", roomId: "r1", sourceId: "s1" })).rejects.toMatchObject({
      status: 400,
    });
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(source.stage).toBe("uploading"); // never advanced past verification
  });

  it("rejects when Cloudinary can't verify the resource at all", async () => {
    const source = { _id: "s1", stage: "uploading", fileType: "pdf", save: vi.fn() };
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(source);
    asMock(getCloudinary).mockReturnValue({
      api: { resource: vi.fn().mockRejectedValue(new Error("not found")) },
      uploader: { destroy: vi.fn() },
    });

    await expect(confirmUpload({ userId: "u1", roomId: "r1", sourceId: "s1" })).rejects.toMatchObject({
      status: 400,
    });
  });
});

describe("createPastedTextSource", () => {
  it("rejects empty text", async () => {
    await expect(
      createPastedTextSource({ userId: "u1", roomId: "r1", text: "   " })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejects text over the character limit", async () => {
    await expect(
      createPastedTextSource({ userId: "u1", roomId: "r1", text: "a".repeat(50_001) })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("creates a queued source and enqueues ingestion", async () => {
    asMock(KnowledgeSourceModel.create).mockResolvedValue({ _id: "s2", revision: 1 });

    await createPastedTextSource({ userId: "u1", roomId: "r1", text: "Our ARR is $1M." });

    expect(KnowledgeSourceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ sourceType: "pasted_text", stage: "queued" })
    );
    expect(enqueueIngestSource).toHaveBeenCalledWith({ sourceId: "s2", revision: 1 });
  });
});

describe("retrySource", () => {
  it("rejects retrying a source that isn't failed", async () => {
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue({ stage: "ready" });
    await expect(
      retrySource({ userId: "u1", roomId: "r1", sourceId: "s1" })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("bumps the revision and re-enqueues a failed source", async () => {
    const source = { stage: "failed", revision: 1, errorMessage: "boom", save: vi.fn(), _id: "s1" };
    asMock(KnowledgeSourceModel.findOne).mockResolvedValue(source);

    await retrySource({ userId: "u1", roomId: "r1", sourceId: "s1" });

    expect(source.stage).toBe("queued");
    expect(source.revision).toBe(2);
    expect(source.errorMessage).toBeNull();
    expect(enqueueIngestSource).toHaveBeenCalledWith({ sourceId: "s1", revision: 2 });
  });
});
