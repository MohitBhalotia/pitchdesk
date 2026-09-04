import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isPitchRoomsEnabled,
  isRoomCreationEnabled,
  isRoomIngestionEnabled,
  isRoomToolsEnabled,
  isPitchRoomsEnabledForUser,
} from "./featureFlags";

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  for (const key of [
    "PITCH_ROOMS_ENABLED",
    "PITCH_ROOM_CREATION_ENABLED",
    "PITCH_ROOM_INGESTION_ENABLED",
    "PITCH_ROOM_TOOLS_ENABLED",
    "PITCH_ROOMS_ROLLOUT_PERCENT",
  ]) {
    delete process.env[key];
  }
}

describe("independent kill switches", () => {
  beforeEach(resetEnv);
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("are all off when the master flag is off, regardless of their own value", () => {
    process.env.PITCH_ROOM_CREATION_ENABLED = "true";
    expect(isPitchRoomsEnabled()).toBe(false);
    expect(isRoomCreationEnabled()).toBe(false);
    expect(isRoomIngestionEnabled()).toBe(false);
    expect(isRoomToolsEnabled()).toBe(false);
  });

  it("default to on once the master flag is on", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    expect(isRoomCreationEnabled()).toBe(true);
    expect(isRoomIngestionEnabled()).toBe(true);
    expect(isRoomToolsEnabled()).toBe(true);
  });

  it("can each be independently flipped off without affecting the others", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    process.env.PITCH_ROOM_TOOLS_ENABLED = "false";

    expect(isRoomToolsEnabled()).toBe(false);
    expect(isRoomCreationEnabled()).toBe(true);
    expect(isRoomIngestionEnabled()).toBe(true);
  });
});

describe("isPitchRoomsEnabledForUser (staged rollout)", () => {
  beforeEach(resetEnv);
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("is false for everyone when the master flag is off", () => {
    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "100";
    expect(isPitchRoomsEnabledForUser("user1")).toBe(false);
  });

  it("defaults to true for everyone when no percent is configured", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    expect(isPitchRoomsEnabledForUser("user1")).toBe(true);
  });

  it("is false for everyone at 0%", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "0";
    expect(isPitchRoomsEnabledForUser("user1")).toBe(false);
    expect(isPitchRoomsEnabledForUser("user2")).toBe(false);
  });

  it("is true for everyone at 100%", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "100";
    expect(isPitchRoomsEnabledForUser("user1")).toBe(true);
    expect(isPitchRoomsEnabledForUser("user2")).toBe(true);
  });

  it("is deterministic for the same userId across repeated calls", () => {
    process.env.PITCH_ROOMS_ENABLED = "true";
    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "50";
    const first = isPitchRoomsEnabledForUser("a-stable-user-id");
    const second = isPitchRoomsEnabledForUser("a-stable-user-id");
    expect(first).toBe(second);
  });

  it("a lower percentage is always a strict subset of a higher one for the same users", () => {
    const userIds = Array.from({ length: 200 }, (_, i) => `user-${i}`);

    process.env.PITCH_ROOMS_ENABLED = "true";
    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "20";
    const at20 = new Set(userIds.filter((id) => isPitchRoomsEnabledForUser(id)));

    process.env.PITCH_ROOMS_ROLLOUT_PERCENT = "50";
    const at50 = new Set(userIds.filter((id) => isPitchRoomsEnabledForUser(id)));

    for (const id of at20) {
      expect(at50.has(id)).toBe(true);
    }
    expect(at50.size).toBeGreaterThan(at20.size);
  });
});
