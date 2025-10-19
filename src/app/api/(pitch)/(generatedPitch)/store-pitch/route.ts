//import mongoose from "mongoose"
import generatedPitchModel  from "@/models/generatedPitch"
import dbConnect from "@/lib/db"
import authOptions from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
    try{
        dbConnect()
        const session = await getServerSession(authOptions)
        if(!session?.user?._id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session?.user?._id
        const body = await req.json();
        const { pitch } = body
        
        //console.log(pitch)

        await generatedPitchModel.create({
            userId,
            pitch
        })

        return NextResponse.json({message: "generated Pitch Stored Successfully"})

    }catch(error){
        console.log(error)
        return NextResponse.json(
           {error: "internal server error"},
           {status: 500}    
        )
        
    }
}

export async function GET(){
    try{
        dbConnect()
        const session = await getServerSession(authOptions)
        if(!session?.user?._id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session?.user?._id
        const pitches = await generatedPitchModel.find({
            userId
        })
        return NextResponse.json({pitches})

    }catch(error){
        console.log(error)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pitchId } = await req.json();
    
    await generatedPitchModel.deleteOne({
      _id: pitchId,
      userId: session.user._id
    });

    return NextResponse.json({ message: "Pitch deleted successfully" });
  } catch (error) {
    console.error("Error deleting pitch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
        await generatedPitchModel.updateOne(
            {_id: pitchId},
            {$set: {title}}
        )
        return NextResponse.json({message: "Title changed successfully"})
    }catch(error){
        console.log(error)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}