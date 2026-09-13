import { NextRequest, NextResponse } from "next/server";
import { fastapiFetch } from "@/lib/fastapiClient";

// Thin server-side passthrough so the browser never talks to FastAPI (and
// never needs INTERNAL_API_KEY) directly. Mirrors the previous client-side
// call to NEXT_PUBLIC_FASTAPI_BACKEND/generate-pitch byte-for-byte.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fastApiResponse = await fastapiFetch("/generate-pitch", {
      method: "POST",
      body: formData,
    });

    const result = await fastApiResponse.json();
    return NextResponse.json(result, { status: fastApiResponse.status });
  } catch (error) {
    console.error("generate-pitch proxy error:", error);
    return NextResponse.json({ error: "Failed to generate pitch." }, { status: 500 });
  }
}
