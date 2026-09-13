import { NextRequest, NextResponse } from "next/server";
import { fastapiFetch } from "@/lib/fastapiClient";

// Thin server-side passthrough so the browser never talks to FastAPI (and
// never needs INTERNAL_API_KEY) directly. Mirrors the previous client-side
// call to NEXT_PUBLIC_FASTAPI_BACKEND/5minsummmary byte-for-byte.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fastApiResponse = await fastapiFetch("/5minsummmary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await fastApiResponse.json();
    return NextResponse.json(result, { status: fastApiResponse.status });
  } catch (error) {
    console.error("five-min-summary proxy error:", error);
    return NextResponse.json({ error: "Failed to generate summary." }, { status: 500 });
  }
}
