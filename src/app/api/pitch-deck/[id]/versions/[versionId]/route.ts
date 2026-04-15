import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";
import PitchDeckVersionModel from "@/models/PitchDeckVersionModel";

// Restore a version → overwrite the deck's slides with that version's snapshot
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, versionId } = await params;
    const version = await PitchDeckVersionModel.findOne({ _id: versionId, deckId: id, userId: session.user._id });
    if (!version) return NextResponse.json({ error: "Version not found" }, { status: 404 });

    const deck = await PitchDeckModel.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: { slides: version.slides, title: version.title, templateId: version.templateId } },
      { new: true }
    );
    if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });

    return NextResponse.json({ deck });
  } catch (error) {
    console.error("version restore error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
