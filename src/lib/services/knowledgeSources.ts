import crypto from "crypto";
import KnowledgeSourceModel, { SUPPORTED_FILE_TYPES } from "@/models/KnowledgeSourceModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import KnowledgeChunkModel from "@/models/KnowledgeChunkModel";
import StartupFactModel from "@/models/StartupFactModel";
import { getCloudinary } from "@/lib/cloudinary";
import { enqueueIngestSource } from "@/lib/queues";
import {
  MAX_ACTIVE_SOURCES_PER_ROOM,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES_PER_ROOM,
  MAX_PASTED_TEXT_CHARS,
} from "@/lib/ingestion/limits";
import { getOwnedRoom } from "./pitchRooms";
import { getOrCreateKnowledgeBase } from "./knowledgeBase";

export class KnowledgeSourceError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "KnowledgeSourceError";
    this.status = status;
  }
}

const IMAGE_FILE_TYPES = new Set(["png", "jpg", "jpeg"]);

export function resourceTypeForFileType(fileType: string): "image" | "raw" {
  return IMAGE_FILE_TYPES.has(fileType) ? "image" : "raw";
}

// A source counts against the room's active quota unless it has been
// permanently deleted or definitively failed (a failed source can be
// retried, so it still occupies a slot until the founder removes it).
const ACTIVE_STAGES = [
  "uploading",
  "queued",
  "parsing",
  "extracting",
  "embedding",
  "ready",
  "failed",
];

export async function listSourcesForRoom(userId: string, roomId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) return null;
  return KnowledgeSourceModel.find({ roomId }).sort({ createdAt: -1 }).lean();
}

async function assertRoomCanAcceptSource(
  roomId: string,
  additionalBytes: number
): Promise<void> {
  const activeCount = await KnowledgeSourceModel.countDocuments({
    roomId,
    stage: { $in: ACTIVE_STAGES },
  });
  if (activeCount >= MAX_ACTIVE_SOURCES_PER_ROOM) {
    throw new KnowledgeSourceError(
      `This room already has ${MAX_ACTIVE_SOURCES_PER_ROOM} sources. Remove one before adding another.`,
      400
    );
  }

  const totalBytesResult = await KnowledgeSourceModel.aggregate<{ total: number }>([
    { $match: { roomId, stage: { $in: ACTIVE_STAGES } } },
    { $group: { _id: null, total: { $sum: { $ifNull: ["$cloudinaryBytes", 0] } } } },
  ]);
  const existingBytes = totalBytesResult[0]?.total ?? 0;
  if (existingBytes + additionalBytes > MAX_TOTAL_BYTES_PER_ROOM) {
    throw new KnowledgeSourceError(
      `Adding this would exceed the ${Math.round(
        MAX_TOTAL_BYTES_PER_ROOM / (1024 * 1024)
      )} MB storage limit for this room's knowledge base.`,
      400
    );
  }
}

export interface CreateUploadIntentInput {
  userId: string;
  roomId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

/**
 * Step 1 of the direct-to-Cloudinary upload flow (Section 5, Phase 2): the
 * file's bytes never pass through this server. This only allocates a
 * KnowledgeSource record and hands back a signed Cloudinary upload payload;
 * the browser uploads directly to Cloudinary from there.
 */
export async function createUploadIntent({
  userId,
  roomId,
  fileName,
  fileType,
  fileSize,
}: CreateUploadIntentInput) {
  const normalizedFileType = fileType.toLowerCase().replace(/^\./, "");
  if (!SUPPORTED_FILE_TYPES.includes(normalizedFileType as (typeof SUPPORTED_FILE_TYPES)[number])) {
    throw new KnowledgeSourceError(`Unsupported file type: ${fileType}`, 400);
  }
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new KnowledgeSourceError("A valid file size is required", 400);
  }
  if (fileSize > MAX_FILE_BYTES) {
    throw new KnowledgeSourceError(
      `File exceeds the ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB limit`,
      400
    );
  }

  const kb = await getOrCreateKnowledgeBase(userId, roomId);
  if (!kb) {
    throw new KnowledgeSourceError("Pitch room not found", 404);
  }

  await assertRoomCanAcceptSource(roomId, fileSize);

  const source = await KnowledgeSourceModel.create({
    userId,
    roomId,
    knowledgeBaseId: kb._id,
    sourceType: "file",
    fileName,
    fileType: normalizedFileType,
    stage: "uploading",
  });

  const cloudinary = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `pitch-rooms/${roomId}/sources`;
  const publicId = String(source._id);
  const resourceType = resourceTypeForFileType(normalizedFileType);
  const paramsToSign = { timestamp, folder, public_id: publicId, type: "authenticated" };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    sourceId: String(source._id),
    upload: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
      publicId,
      resourceType,
      type: "authenticated" as const,
    },
  };
}

export interface ConfirmUploadInput {
  userId: string;
  roomId: string;
  sourceId: string;
}

/**
 * Step 2: server-side asset verification before acceptance (Section 5) --
 * we never trust client-supplied metadata about what got uploaded. This
 * re-fetches the resource from Cloudinary's Admin API to get authoritative
 * size/format, then queues ingestion.
 */
export async function confirmUpload({ userId, roomId, sourceId }: ConfirmUploadInput) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new KnowledgeSourceError("Pitch room not found", 404);
  }

  const source = await KnowledgeSourceModel.findOne({ _id: sourceId, roomId, userId });
  if (!source) {
    throw new KnowledgeSourceError("Knowledge source not found", 404);
  }
  if (source.stage !== "uploading") {
    throw new KnowledgeSourceError("This source has already been confirmed", 400);
  }

  const resourceType = resourceTypeForFileType(source.fileType ?? "");
  const publicId = String(source._id);
  const cloudinary = getCloudinary();

  let resource: { bytes: number; format: string; etag: string };
  try {
    resource = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
      type: "authenticated",
    });
  } catch {
    throw new KnowledgeSourceError("Upload could not be verified", 400);
  }

  if (resource.bytes > MAX_FILE_BYTES) {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type: "authenticated" }).catch(() => {});
    throw new KnowledgeSourceError(
      `File exceeds the ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB limit`,
      400
    );
  }

  try {
    await assertRoomCanAcceptSource(roomId, resource.bytes);
  } catch (error) {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type: "authenticated" }).catch(() => {});
    throw error;
  }

  source.cloudinaryPublicId = publicId;
  source.cloudinaryResourceType = resourceType;
  source.cloudinaryFormat = resource.format;
  source.cloudinaryBytes = resource.bytes;
  source.contentHash = resource.etag;
  source.stage = "queued";
  await source.save();

  await KnowledgeBaseModel.updateOne(
    { _id: source.knowledgeBaseId },
    { $inc: { sourceCount: 1, totalBytes: resource.bytes }, $set: { status: "processing" } }
  );

  await enqueueIngestSource({ sourceId: String(source._id), revision: source.revision });

  return source;
}

export interface CreatePastedTextSourceInput {
  userId: string;
  roomId: string;
  text: string;
}

export async function createPastedTextSource({
  userId,
  roomId,
  text,
}: CreatePastedTextSourceInput) {
  const trimmed = text?.trim();
  if (!trimmed) {
    throw new KnowledgeSourceError("Pasted text cannot be empty", 400);
  }
  if (trimmed.length > MAX_PASTED_TEXT_CHARS) {
    throw new KnowledgeSourceError(
      `Pasted text exceeds the ${MAX_PASTED_TEXT_CHARS.toLocaleString()} character limit`,
      400
    );
  }

  const kb = await getOrCreateKnowledgeBase(userId, roomId);
  if (!kb) {
    throw new KnowledgeSourceError("Pitch room not found", 404);
  }

  const byteSize = Buffer.byteLength(trimmed, "utf8");
  await assertRoomCanAcceptSource(roomId, byteSize);

  const contentHash = crypto.createHash("sha256").update(trimmed).digest("hex");

  const source = await KnowledgeSourceModel.create({
    userId,
    roomId,
    knowledgeBaseId: kb._id,
    sourceType: "pasted_text",
    pastedText: trimmed,
    cloudinaryBytes: byteSize,
    contentHash,
    stage: "queued",
  });

  await KnowledgeBaseModel.updateOne(
    { _id: kb._id },
    { $inc: { sourceCount: 1, totalBytes: byteSize }, $set: { status: "processing" } }
  );

  await enqueueIngestSource({ sourceId: String(source._id), revision: source.revision });

  return source;
}

export interface RetrySourceInput {
  userId: string;
  roomId: string;
  sourceId: string;
}

export async function retrySource({ userId, roomId, sourceId }: RetrySourceInput) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new KnowledgeSourceError("Pitch room not found", 404);
  }

  const source = await KnowledgeSourceModel.findOne({ _id: sourceId, roomId, userId });
  if (!source) {
    throw new KnowledgeSourceError("Knowledge source not found", 404);
  }
  if (source.stage !== "failed") {
    throw new KnowledgeSourceError("Only a failed source can be retried", 400);
  }

  source.stage = "queued";
  source.revision += 1;
  source.errorMessage = null;
  await source.save();

  await enqueueIngestSource({ sourceId: String(source._id), revision: source.revision });

  return source;
}

export interface DeleteSourceInput {
  userId: string;
  roomId: string;
  sourceId: string;
}

/** Individual sources can be permanently removed (Section 5) -- unlike room deletion, this is not reversible. */
export async function deleteSource({ userId, roomId, sourceId }: DeleteSourceInput) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new KnowledgeSourceError("Pitch room not found", 404);
  }

  const source = await KnowledgeSourceModel.findOne({ _id: sourceId, roomId, userId });
  if (!source) {
    throw new KnowledgeSourceError("Knowledge source not found", 404);
  }

  if (source.cloudinaryPublicId) {
    const cloudinary = getCloudinary();
    await cloudinary.uploader
      .destroy(source.cloudinaryPublicId, {
        resource_type: source.cloudinaryResourceType ?? "raw",
        type: "authenticated",
      })
      .catch(() => {});
  }

  const [chunkStats] = await KnowledgeChunkModel.aggregate<{ count: number }>([
    { $match: { sourceId: source._id } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);

  await KnowledgeChunkModel.deleteMany({ sourceId: source._id });
  await StartupFactModel.deleteMany({ sourceId: source._id });

  await KnowledgeBaseModel.updateOne(
    { _id: source.knowledgeBaseId },
    {
      $inc: {
        sourceCount: -1,
        totalBytes: -(source.cloudinaryBytes ?? 0),
        chunkCount: -(chunkStats?.count ?? 0),
      },
    }
  );

  await source.deleteOne();

  return { deleted: true };
}
