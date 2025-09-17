import { NextRequest, NextResponse } from "next/server";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";

type Params = {
    params: {userId: string}
}

export async function GET(req: NextRequest, { params }: Params){
    try {
        await dbConnect()

        const pitches: Pitch[] = await PitchModel.find({ userId: params.userId })
        .populate("userId")

        return NextResponse.json(pitches, {status: 200})
    }catch(error){
        console.error("Error fetching pitches:", error)
        return NextResponse.json(
            { error: "Failed to fetch pitches" },
            { status: 500 }
        )
    }
}
