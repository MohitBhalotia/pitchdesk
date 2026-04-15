import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await dbConnect();
    const { token } = await params;
    const deck = await PitchDeckModel.findOne({ shareToken: token, shareEnabled: true });
    if (!deck) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      deck: {
        _id: deck._id,
        title: deck.title,
        templateId: deck.templateId,
        slides: deck.slides,
        defaultTransition: deck.defaultTransition,
      },
    });
  } catch (error) {
    console.error("public deck error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
