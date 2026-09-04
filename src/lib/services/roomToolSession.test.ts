import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ROOM_SESSION_TOKEN_SECRET = "test-secret-please-ignore-0123456789";

vi.mock("@/models/RoomToolSessionModel", () => ({
  default: { create: vi.fn(), findById: vi.fn() },
}));
vi.mock("@/lib/redis", () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
}));

import RoomToolSessionModel from "@/models/RoomToolSessionModel";
import { cacheGet, cacheSet } from "@/lib/redis";
import {
  createRoomToolSession,
  verifyRoomToolSessionToken,
  getConsecutiveFailures,
  recordToolCallOutcome,
  CIRCUIT_BREAKER_THRESHOLD,
} from "./roomToolSession";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SESSION_ID = "507f1f77bcf86cd799439011";
const BASE_INPUT = {
  userId: "u1",
  roomId: "r1",
  pitchId: "p1",
  agentId: "a1",
  knowledgeBaseId: "kb1",
  knowledgeBaseRevision: 2,
};

function mockCreatedRecord(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    _id: SESSION_ID,
    userId: BASE_INPUT.userId,
    roomId: BASE_INPUT.roomId,
    pitchId: BASE_INPUT.pitchId,
    agentId: BASE_INPUT.agentId,
    knowledgeBaseId: BASE_INPUT.knowledgeBaseId,
    knowledgeBaseRevision: BASE_INPUT.knowledgeBaseRevision,
    revoked: false,
    consecutiveFailures: 0,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    ...overrides,
  };
}

function mockFindById(doc: unknown) {
  asMock(RoomToolSessionModel.findById).mockReturnValue({
    lean: () => Promise.resolve(doc),
    select: () => ({ lean: () => Promise.resolve(doc) }),
  });
}

describe("createRoomToolSession", () => {
  beforeEach(() => vi.clearAllMocks());

  it("clamps ttlSeconds within [60, 3h] and writes a matching Mongo record", async () => {
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );

    const before = Date.now();
    const { expiresAt, sessionId } = await createRoomToolSession({
      ...BASE_INPUT,
      ttlSeconds: 999_999, // above the 3h ceiling
    });

    expect(sessionId).toBe(SESSION_ID);
    expect(expiresAt.getTime() - before).toBeLessThanOrEqual(3 * 60 * 60 * 1000 + 1000);
    expect(RoomToolSessionModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", roomId: "r1", knowledgeBaseRevision: 2 })
    );
  });

  it("floors a too-small ttlSeconds to the minimum", async () => {
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );

    const before = Date.now();
    const { expiresAt } = await createRoomToolSession({ ...BASE_INPUT, ttlSeconds: 1 });
    expect(expiresAt.getTime() - before).toBeGreaterThanOrEqual(59 * 1000);
  });
});

describe("verifyRoomToolSessionToken", () => {
  beforeEach(() => vi.clearAllMocks());

  it("round-trips a freshly created session on a cold cache", async () => {
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );
    asMock(cacheGet).mockResolvedValue(null);
    mockFindById(mockCreatedRecord());

    const { token } = await createRoomToolSession({ ...BASE_INPUT, ttlSeconds: 3600 });
    const scope = await verifyRoomToolSessionToken(token);

    expect(scope).toMatchObject({
      sessionId: SESSION_ID,
      userId: "u1",
      roomId: "r1",
      pitchId: "p1",
      agentId: "a1",
      knowledgeBaseId: "kb1",
      knowledgeBaseRevision: 2,
    });
    expect(cacheSet).toHaveBeenCalled();
  });

  it("returns the cached scope without a Mongo lookup on a warm cache", async () => {
    const cachedScope = {
      sessionId: SESSION_ID,
      userId: "u1",
      roomId: "r1",
      pitchId: "p1",
      agentId: "a1",
      knowledgeBaseId: "kb1",
      knowledgeBaseRevision: 2,
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    };
    asMock(cacheGet).mockResolvedValue(JSON.stringify(cachedScope));
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );

    const { token } = await createRoomToolSession({ ...BASE_INPUT, ttlSeconds: 3600 });
    const scope = await verifyRoomToolSessionToken(token);

    expect(scope?.sessionId).toBe(SESSION_ID);
    expect(RoomToolSessionModel.findById).not.toHaveBeenCalled();
  });

  it("returns null for a garbage token", async () => {
    await expect(verifyRoomToolSessionToken("not-a-real-jwt")).resolves.toBeNull();
  });

  it("returns null when the backing record has been revoked", async () => {
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );
    asMock(cacheGet).mockResolvedValue(null);
    mockFindById(mockCreatedRecord({ revoked: true }));

    const { token } = await createRoomToolSession({ ...BASE_INPUT, ttlSeconds: 3600 });
    await expect(verifyRoomToolSessionToken(token)).resolves.toBeNull();
  });

  it("returns null when the backing record has expired server-side", async () => {
    asMock(RoomToolSessionModel.create).mockImplementation((doc: Record<string, unknown>) =>
      Promise.resolve({ _id: SESSION_ID, ...doc })
    );
    asMock(cacheGet).mockResolvedValue(null);
    mockFindById(mockCreatedRecord({ expiresAt: new Date(Date.now() - 1000) }));

    const { token } = await createRoomToolSession({ ...BASE_INPUT, ttlSeconds: 3600 });
    await expect(verifyRoomToolSessionToken(token)).resolves.toBeNull();
  });
});

describe("getConsecutiveFailures / recordToolCallOutcome", () => {
  beforeEach(() => vi.clearAllMocks());

  const scope = {
    sessionId: SESSION_ID,
    userId: "u1",
    roomId: "r1",
    pitchId: "p1",
    agentId: "a1",
    knowledgeBaseId: "kb1",
    knowledgeBaseRevision: 2,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };

  it("falls back to Mongo on a cold failure-count cache", async () => {
    asMock(cacheGet).mockResolvedValue(null);
    mockFindById({ consecutiveFailures: 2 });
    await expect(getConsecutiveFailures(SESSION_ID)).resolves.toBe(2);
  });

  it("resets the counter to zero on a successful call", async () => {
    asMock(RoomToolSessionModel.findById).mockReturnValue({
      lean: () => Promise.resolve({}),
      select: () => ({ lean: () => Promise.resolve({}) }),
    });
    (RoomToolSessionModel as unknown as { updateOne: ReturnType<typeof vi.fn> }).updateOne =
      vi.fn().mockResolvedValue({});

    await recordToolCallOutcome(scope, true);

    expect(cacheSet).toHaveBeenCalledWith(expect.stringContaining(SESSION_ID), "0", expect.any(Number));
  });

  it("increments the counter on failure and caps it at the circuit-breaker threshold", async () => {
    asMock(cacheGet).mockResolvedValue(String(CIRCUIT_BREAKER_THRESHOLD));
    (RoomToolSessionModel as unknown as { updateOne: ReturnType<typeof vi.fn> }).updateOne =
      vi.fn().mockResolvedValue({});

    await recordToolCallOutcome(scope, false);

    expect(cacheSet).toHaveBeenCalledWith(
      expect.stringContaining(SESSION_ID),
      String(CIRCUIT_BREAKER_THRESHOLD),
      expect.any(Number)
    );
  });
});
