import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { enabled } = body;

    const deck = await PitchDeckModel.findOne({ _id: id, userId: session.user._id });
    if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });

    if (enabled) {
      if (!deck.shareToken) {
        deck.shareToken = randomBytes(16).toString("hex");
      }
      deck.shareEnabled = true;
    } else {
      deck.shareEnabled = false;
    }
    await deck.save();

    return NextResponse.json({
      shareToken: deck.shareToken,
      shareEnabled: deck.shareEnabled,
    });
  } catch (error) {
    console.error("share error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
