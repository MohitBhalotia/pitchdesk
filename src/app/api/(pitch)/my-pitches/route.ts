import { /*NextRequest,*/ NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import  authOptions  from "@/lib/auth";

export async function GET(/*req: NextRequest*/) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    const pitches = await PitchModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 }); 

    return NextResponse.json(pitches, { status: 200 });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest){
  try{
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pitchId, title } = await req.json()

    await PitchModel.findByIdAndUpdate(
      {_id: pitchId},
      {title}
    )

    return NextResponse.json({message: "Title updated successfully"})

  }catch(error){
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest){
  try{
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pitchId } = await req.json()

    await PitchModel.findByIdAndDelete({
      _id: pitchId
    })

    return NextResponse.json({message:"Pitch deleted successfully"})

  }catch(error){
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}