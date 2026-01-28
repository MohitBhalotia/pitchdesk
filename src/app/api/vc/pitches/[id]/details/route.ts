import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import IncubationProgram from "@/models/IncubationProgramModel";
import Pitch from "@/models/PitchModel";
import { PitchEval } from "@/models/PitchEvalModel";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch the application with all related data
        const application = await IncubationApplication.findById(id)
            .populate({
                path: 'programId',
                select: 'title vcId'
            })
            .populate({
                path: 'founderId',
                select: 'fullName email profileImage'
            })
            .lean();

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Verify ownership - check if this application belongs to a program owned by this VC
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((application.programId as any).vcId.toString() !== session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Fetch the pitch (conversation history)
        const pitch = await Pitch.findById(application.pitchId).lean();

        // Fetch the pitch evaluation
        const evaluation = await PitchEval.findOne({ pitchId: application.pitchId }).lean();

        // Get founder's pitch count
        const founderPitchCount = await Pitch.countDocuments({ userId: application.founderId });

        // Enhance founder data
        const enhancedApplication = {
            ...application,
            founder: {
                ...(application.founderId as any),
                pitchesCount: founderPitchCount
            },
            program: application.programId
        };

        return NextResponse.json({
            application: enhancedApplication,
            pitch,
            evaluation
        });
    } catch (error) {
        console.error("Error fetching pitch details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
