import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/StartupFactModel", () => ({
  default: { findOne: vi.fn(), find: vi.fn(), create: vi.fn() },
}));
vi.mock("@/models/KnowledgeBaseModel", () => ({
  default: { updateOne: vi.fn() },
}));
vi.mock("./pitchRooms", () => ({
  getOwnedRoom: vi.fn(),
}));

import StartupFactModel from "@/models/StartupFactModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { getOwnedRoom } from "./pitchRooms";
import { confirmFact, disableFact, correctFact, StartupFactError } from "./startupFacts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

beforeEach(() => {
  vi.clearAllMocks();
  asMock(getOwnedRoom).mockResolvedValue({ _id: "room1" });
  asMock(StartupFactModel.find).mockReturnValue({ lean: () => Promise.resolve([]) });
});

describe("confirmFact / disableFact", () => {
  it("throws 404 when the room isn't owned by this user", async () => {
    asMock(getOwnedRoom).mockResolvedValue(null);
    await expect(confirmFact("u1", "r1", "f1")).rejects.toBeInstanceOf(StartupFactError);
  });

  it("throws 404 when the fact doesn't exist in this room", async () => {
    asMock(StartupFactModel.findOne).mockResolvedValue(null);
    await expect(confirmFact("u1", "r1", "f1")).rejects.toMatchObject({ status: 404 });
  });

  it("confirming sets status active and raises confidence to 1", async () => {
    const fact = { status: "active", confidence: 0.6, save: vi.fn() };
    asMock(StartupFactModel.findOne).mockResolvedValue(fact);

    await confirmFact("u1", "r1", "f1");

    expect(fact.status).toBe("active");
    expect(fact.confidence).toBe(1);
    expect(fact.save).toHaveBeenCalledTimes(1);
  });

  it("disabling sets status disabled and refreshes contradictions", async () => {
    const fact = { status: "active", knowledgeBaseId: "kb1", save: vi.fn() };
    asMock(StartupFactModel.findOne).mockResolvedValue(fact);

    await disableFact("u1", "r1", "f1");

    expect(fact.status).toBe("disabled");
    expect(KnowledgeBaseModel.updateOne).toHaveBeenCalledWith(
      { _id: "kb1" },
      { $set: { contradictions: [] } }
    );
  });
});

describe("correctFact", () => {
  it("throws 400 when no corrected value is supplied", async () => {
    asMock(StartupFactModel.findOne).mockResolvedValue({ save: vi.fn() });
    await expect(
      correctFact("u1", "r1", "f1", { rawValue: "  " })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("disables the original and creates a new superseding fact, preserving original evidence", async () => {
    const original = {
      _id: "fact-original",
      status: "active",
      metric: "ARR",
      unit: "USD",
      currency: "USD",
      period: "2025",
      valueType: "actual",
      sourceId: "source1",
      locator: "Page 3",
      knowledgeBaseId: "kb1",
      save: vi.fn(),
    };
    asMock(StartupFactModel.findOne).mockResolvedValue(original);
    const corrected = { _id: "fact-corrected" };
    asMock(StartupFactModel.create).mockResolvedValue(corrected);

    const result = await correctFact("u1", "r1", "fact-original", {
      rawValue: "$2M",
      numericValue: 2_000_000,
    });

    expect(original.status).toBe("disabled");
    expect(original.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(corrected);

    expect(StartupFactModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metric: "ARR",
        rawValue: "$2M",
        numericValue: 2_000_000,
        provenance: "founder_correction",
        status: "active",
        supersedesFactId: "fact-original",
        // unchanged fields carried over from the original
        unit: "USD",
        currency: "USD",
        period: "2025",
        valueType: "actual",
        sourceId: "source1",
        locator: "Page 3",
      })
    );
  });
});
