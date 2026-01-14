import { dummyData } from "data/dummy";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { residentId } = body;
  if (!residentId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const issues = dummyData.issues.filter((issue) => issue.residentId === residentId);
  return NextResponse.json({ issues });
}