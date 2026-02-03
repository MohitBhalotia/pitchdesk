import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Get all pitches for this incubation by this founder
        const pitches = await PitchModel.find({
            userId: session.user._id,
            incubationId: id
        })
            .sort({ startTime: -1 })
            .select('title startTime duration creditsUsed');

        return NextResponse.json(pitches);
    } catch (error) {
        console.error("Error fetching incubation pitches:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
