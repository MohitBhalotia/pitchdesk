/**
 * Server-only helper for calling the FastAPI backend. Injects the shared
 * internal-service secret (`INTERNAL_API_KEY`, set on both pitchdesk-web and
 * pitchdesk-api in Coolify) so the FastAPI process can reject requests that
 * didn't originate from this Next.js server. Never import this from a
 * "use client" component -- the secret must never reach the browser bundle.
 */

const FASTAPI_BASE_URL = process.env.FASTAPI_BACKEND || process.env.NEXT_PUBLIC_FASTAPI_BACKEND || "http://localhost:8000";

export function fastapiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (process.env.INTERNAL_API_KEY) {
    headers.set("X-Internal-Api-Key", process.env.INTERNAL_API_KEY);
  }

  return fetch(`${FASTAPI_BASE_URL}${path}`, { ...init, headers });
}
