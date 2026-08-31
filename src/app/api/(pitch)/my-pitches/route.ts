import { /*NextRequest,*/ NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import authOptions from "@/lib/auth";
import Agent from "@/models/AgentModel";
import UserModel from "@/models/UserModel";

const DEFAULT_PITCH_TITLE_PATTERN = /^Pitch (\d+)$/;

async function preservePitchSequence(
  userId: string,
  pitch: { title?: string; pitchNumber?: number }
) {
  const titleMatch = pitch.title?.match(DEFAULT_PITCH_TITLE_PATTERN);
  const legacyNumber = titleMatch ? Number(titleMatch[1]) : 0;
  const pitchNumber = Math.max(pitch.pitchNumber ?? 0, legacyNumber);

  if (pitchNumber > 0) {
    await UserModel.updateOne(
      { _id: userId },
      { $max: { pitchSequence: pitchNumber } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    const pitchId = req.nextUrl.searchParams.get("pitchId");

    if (pitchId) {
      if (!mongoose.Types.ObjectId.isValid(pitchId)) {
        return NextResponse.json({ error: "Invalid pitch ID" }, { status: 400 });
      }

      const pitch = await PitchModel.findOne({
        _id: pitchId,
        userId: new mongoose.Types.ObjectId(userId),
      })
        .populate({ path: "agentId", select: "name", model: Agent })
        .lean();

      if (!pitch) {
        return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
      }

      return NextResponse.json(pitch, { status: 200 });
    }

    const pitches = await PitchModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      $and: [
        {
          $or: [
            { competitionId: null },
            { competitionId: { $exists: false } }
          ]
        },
        {
          $or: [
            { incubationId: null },
            { incubationId: { $exists: false } }
          ]
        }
      ]
    })
      .populate({ path: "agentId", select: "name", model: Agent })
      .sort({ startTime: -1, _id: -1 })
      .lean();

    return NextResponse.json(pitches, { status: 200 });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pitchId, title } = await req.json()

    const pitch = await PitchModel.findOne({
      _id: pitchId,
      userId: session.user._id,
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    await preservePitchSequence(session.user._id, pitch);
    pitch.title = title;
    await pitch.save();

    return NextResponse.json({ message: "Title updated successfully" })

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pitchId } = await req.json()

    const pitch = await PitchModel.findOne({
      _id: pitchId,
      userId: session.user._id,
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    await preservePitchSequence(session.user._id, pitch);
    await pitch.deleteOne();

    return NextResponse.json({ message: "Pitch deleted successfully" })

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
