import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.stage_of_business) {
      return NextResponse.json(
        { error: "stage_of_business is required" },
        { status: 400 }
      );
    }

    //Forward request to FastAPI
    const fastApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_FASTAPI_BACKEND}/valuation-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store", //everytime the user makes a request, the response is fresh
      }
    );

    //Handle FastAPI errors gracefully
    if (!fastApiResponse.ok) {
      const errorText = await fastApiResponse.text();

      return NextResponse.json(
        {
          error: "FastAPI valuation service failed",
          details: errorText,
        },
        { status: fastApiResponse.status }
      );
    }

    //Pass response back to frontend
    const data = await fastApiResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Projection API error:", err);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
