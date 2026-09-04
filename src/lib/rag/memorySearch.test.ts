import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/RoomMemoryModel", () => ({
  default: { aggregate: vi.fn() },
}));
vi.mock("@/lib/ingestion/embedTexts", () => ({
  embedTexts: vi.fn(),
}));

import RoomMemoryModel from "@/models/RoomMemoryModel";
import { embedTexts } from "@/lib/ingestion/embedTexts";
import { searchPreviousPitchMemory } from "./memorySearch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SCOPE = { userId: "507f1f77bcf86cd799439001", roomId: "507f1f77bcf86cd799439002" };

describe("searchPreviousPitchMemory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asMock(embedTexts).mockResolvedValue([[0.1, 0.2]]);
  });

  it("returns an empty array (not a throw) when the vector search fails", async () => {
    asMock(RoomMemoryModel.aggregate).mockRejectedValue(new Error("index not ready"));
    await expect(searchPreviousPitchMemory(SCOPE, "weaknesses")).resolves.toEqual([]);
  });

  it("returns matched memories with ISO createdAt", async () => {
    const createdAt = new Date("2026-01-01T00:00:00Z");
    asMock(RoomMemoryModel.aggregate).mockResolvedValue([{ summaryText: "Struggled with CAC math", createdAt }]);

    const result = await searchPreviousPitchMemory(SCOPE, "weaknesses");
    expect(result).toEqual([{ summaryText: "Struggled with CAC math", createdAt: createdAt.toISOString() }]);
  });

  it("caps combined summary text to the output character budget", async () => {
    const longText = "y".repeat(1500);
    asMock(RoomMemoryModel.aggregate).mockResolvedValue([
      { summaryText: longText, createdAt: new Date() },
      { summaryText: longText, createdAt: new Date() },
    ]);

    const result = await searchPreviousPitchMemory(SCOPE, "weaknesses");
    const totalChars = result.reduce((sum, m) => sum + m.summaryText.length, 0);
    expect(totalChars).toBeLessThanOrEqual(2000 + 3);
  });
});
