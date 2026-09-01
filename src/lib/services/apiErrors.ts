import { NextResponse } from "next/server";
import { UnauthorizedError, UserMismatchError } from "./authGuard";
import { PitchRoomError } from "./pitchRooms";
import { KnowledgeSourceError } from "./knowledgeSources";
import { StartupFactError } from "./startupFacts";

/** Shared error-to-HTTP-response mapping for the pitch-room API routes. */
export function toErrorResponse(error: unknown, logContext: string) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
  if (error instanceof UserMismatchError) {
    return NextResponse.json({ success: false, message: error.message }, { status: 403 });
  }
  if (
    error instanceof PitchRoomError ||
    error instanceof KnowledgeSourceError ||
    error instanceof StartupFactError
  ) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
  console.error(logContext, error);
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
