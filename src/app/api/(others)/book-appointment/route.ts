import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const body = await request.json();
  console.log(body);
  const { name, age, datetime } = body;
  if (!name || !age || !datetime) {
    return NextResponse.json({
      success: false,
      message: "Missing required fields",   
    }, { status: 400 });
  }
  
  
  return NextResponse.json({
    success: true,
    message: "Appointment booked successfully",
  });
}
