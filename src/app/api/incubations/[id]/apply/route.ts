import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";
import { PitchEval } from "@/models/PitchEvalModel";
import { RouteContext } from "@/types/route-context";

export async function POST(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id: programId } = await context.params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { pitchId } = body;

        if (!pitchId) {
            return NextResponse.json({ error: "Pitch ID is required" }, { status: 400 });
        }

        // Check if program exists
        const program = await IncubationProgram.findById(programId);
        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Check if already applied
        const existingApp = await IncubationApplication.findOne({
            programId,
            founderId: session.user._id
        });

        if (existingApp) {
            return NextResponse.json({ error: "You have already applied to this program" }, { status: 400 });
        }

        // Get Pitch Evaluation Score to auto-populate
        // Assuming pitchId refers to the Pitch document which has an Evaluation linked, 
        // OR pitchId refers to the PitchEval itself.
        // Let's assume the user sends the PITCH ID (session), and we find the evaluation.

        const evalData = await PitchEval.findOne({ pitchId: pitchId });

        if (!evalData) {
            return NextResponse.json(
                { error: "Your pitch has not been evaluated yet. Please wait for evaluation to complete before applying." },
                { status: 400 }
            );
        }

        const score = evalData.scores?.TotalScore || 0;
        const feedback = evalData.summary || "No specific feedback generated.";

        const application = await IncubationApplication.create({
            programId,
            founderId: session.user._id,
            pitchId,
            score,
            botFeedback: feedback,
            status: 'pending'
        });

        return NextResponse.json(application, { status: 201 });

    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
