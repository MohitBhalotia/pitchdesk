import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { PitchEval } from "@/models/PitchEvalModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        // Get all pitches for this incubation by this founder
        const pitches = await PitchModel.find({
            userId: session.user._id,
            incubationId: id
        })
            .sort({ startTime: -1 })
            .select('title startTime duration creditsUsed');

        // Check if each pitch has an evaluation
        const pitchesWithEvalStatus = await Promise.all(
            pitches.map(async (pitch) => {
                const evaluation = await PitchEval.findOne({ pitchId: pitch._id });
                return {
                    ...pitch.toObject(),
                    hasEvaluation: !!evaluation
                };
            })
        );

        return NextResponse.json(pitchesWithEvalStatus);
    } catch (error) {
        console.error("Error fetching incubation pitches:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
