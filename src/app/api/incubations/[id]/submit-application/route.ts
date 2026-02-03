import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import PitchModel from "@/models/PitchModel";
import { PitchEval } from "@/models/PitchEvalModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function POST(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: programId } = await context.params;
        const body = await req.json();
        const { pitchId, registrationData } = body;

        // Verify the pitch belongs to this user and incubation
        const pitch = await PitchModel.findOne({
            _id: pitchId,
            userId: session.user._id,
            incubationId: programId
        });

        if (!pitch) {
            return NextResponse.json({ error: "Pitch not found or unauthorized" }, { status: 404 });
        }

        // Get the evaluation for this pitch
        const evaluation = await PitchEval.findOne({ pitchId });

        if (!evaluation) {
            return NextResponse.json({ error: "Pitch must be evaluated before submission" }, { status: 400 });
        }

        // Check if already applied
        const existingApplication = await IncubationApplication.findOne({
            programId,
            founderId: session.user._id
        });

        if (existingApplication) {
            return NextResponse.json({ error: "You have already applied to this program" }, { status: 400 });
        }

        // Create application
        const application = await IncubationApplication.create({
            programId,
            founderId: session.user._id,
            pitchId,
            registrationData,
            score: evaluation.scores?.TotalScore || 0,
            botFeedback: evaluation.summary || "",
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                changedAt: new Date(),
                changedBy: session.user._id
            }]
        });

        return NextResponse.json({
            success: true,
            applicationId: application._id,
            message: "Application submitted successfully!"
        }, { status: 201 });

    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
