import { describe, it, expect, vi, beforeEach } from "vitest";

const getServerSessionMock = vi.fn();
vi.mock("next-auth", () => ({
  getServerSession: (...args: unknown[]) => getServerSessionMock(...args),
}));
vi.mock("@/lib/auth", () => ({ default: {} }));

import {
  resolveSessionUserId,
  UnauthorizedError,
  UserMismatchError,
} from "./authGuard";

describe("resolveSessionUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws UnauthorizedError when there is no session", async () => {
    getServerSessionMock.mockResolvedValue(null);
    await expect(resolveSessionUserId("u1")).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("returns the session userId when no body userId is supplied", async () => {
    getServerSessionMock.mockResolvedValue({ user: { _id: "u1" } });
    await expect(resolveSessionUserId(undefined)).resolves.toBe("u1");
  });

  it("returns the session userId when it matches the body userId", async () => {
    getServerSessionMock.mockResolvedValue({ user: { _id: "u1" } });
    await expect(resolveSessionUserId("u1")).resolves.toBe("u1");
  });

  it("throws UserMismatchError when the body userId does not match the session", async () => {
    getServerSessionMock.mockResolvedValue({ user: { _id: "u1" } });
    await expect(resolveSessionUserId("someone-else")).rejects.toBeInstanceOf(
      UserMismatchError
    );
  });
});
