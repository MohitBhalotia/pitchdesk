import dbConnect from "../../../lib/db";
import Agent from "../../../models/AgentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  console.log(searchParams);

  const agentId = searchParams.get("agentId");
  if (!agentId) {
    return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    return NextResponse.json({ agent });
  } catch{
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, voice, firstMessage, systemPrompt } = await req.json();
  if (!name || !voice || !firstMessage || !systemPrompt) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  try {
    await dbConnect();
    const agent = await Agent.create({ name, voice, firstMessage, systemPrompt });
    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
