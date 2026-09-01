import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class UserMismatchError extends Error {
  status = 403;
  constructor(message = "User ID does not match the authenticated session") {
    super(message);
    this.name = "UserMismatchError";
  }
}

/**
 * Resolves the acting userId for a pitch-session endpoint from the NextAuth
 * server session — never from the request body alone. A client-supplied
 * userId is still accepted (existing clients send one) but must match the
 * authenticated session, closing the gap where these endpoints previously
 * trusted whatever userId the client sent.
 */
export async function resolveSessionUserId(
  bodyUserId?: string | null
): Promise<string> {
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?._id;

  if (!sessionUserId) {
    throw new UnauthorizedError();
  }

  if (bodyUserId && String(bodyUserId) !== String(sessionUserId)) {
    throw new UserMismatchError();
  }

  return String(sessionUserId);
}
