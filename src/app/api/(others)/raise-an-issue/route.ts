import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { residentId, decsription } = body;
  if (!residentId || !decsription) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  return NextResponse.json({ message: "Issue raised successfully" });
}