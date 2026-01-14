import { NextResponse } from "next/server";
import { dummyData } from "../../../../../data/dummy";
export async function POST(request: Request) {
  const body = await request.json();
  const { name, dob } = body;
  if (!name || !dob) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const resident = dummyData.residents.find(
    (resident) => resident.fullName === name && resident.DOB === dob
  );
  
  return NextResponse.json({ resident });
}
