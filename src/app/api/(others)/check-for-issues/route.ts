import { dummyData } from "data/dummy";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { residentId } = body;
  if (!residentId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const issues = dummyData.issues.filter(
    (issue) => issue.residentId === residentId
  );
  const issue = issues[0];

  return NextResponse.json({
    category: issue.category,
    subCategory: issue.subCategory,
    description: issue.description,
    priority: issue.priority,
    status: issue.status,
    createdAt: issue.createdAt,
  });
}
