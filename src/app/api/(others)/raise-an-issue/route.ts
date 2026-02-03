import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { residentId, description } = body;
  if (!residentId || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  return NextResponse.json({ message: "Issue raised successfully" });
}