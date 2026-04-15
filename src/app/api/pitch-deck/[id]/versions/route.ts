import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchDeckModel from "@/models/PitchDeckModel";
import PitchDeckVersionModel from "@/models/PitchDeckVersionModel";

const MAX_VERSIONS = 20;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const versions = await PitchDeckVersionModel.find({ deckId: id, userId: session.user._id })
      .sort({ createdAt: -1 })
      .limit(MAX_VERSIONS)
      .select("_id label createdAt title templateId");
    return NextResponse.json({ versions });
  } catch (error) {
    console.error("versions get error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const { label } = body;

    const deck = await PitchDeckModel.findOne({ _id: id, userId: session.user._id });
    if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });

    const version = await PitchDeckVersionModel.create({
      deckId: deck._id,
      userId: session.user._id,
      slides: deck.slides,
      title: deck.title,
      templateId: deck.templateId,
      label: label || undefined,
    });

    // Cap to last 20 versions
    const all = await PitchDeckVersionModel.find({ deckId: id, userId: session.user._id })
      .sort({ createdAt: -1 })
      .select("_id");
    if (all.length > MAX_VERSIONS) {
      const toDelete = all.slice(MAX_VERSIONS).map((v) => v._id);
      await PitchDeckVersionModel.deleteMany({ _id: { $in: toDelete } });
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error("versions save error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
