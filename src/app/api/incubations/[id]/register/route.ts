import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationParticipant from "@/models/IncubationParticipant";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

// Register for an incubation program
export async function POST(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id: programId } = await context.params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if program exists
        const program = await IncubationProgram.findById(programId);
        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Check if program is published
        if (program.status !== 'published') {
            return NextResponse.json({ error: "Program is not accepting registrations" }, { status: 400 });
        }

        // Check if already registered
        const existingParticipant = await IncubationParticipant.findOne({
            programId,
            founderId: session.user._id
        });

        if (existingParticipant) {
            return NextResponse.json({ error: "You are already registered for this program" }, { status: 400 });
        }

        // Create participant registration with dedicated pitch time
        const participant = await IncubationParticipant.create({
            programId,
            founderId: session.user._id,
            pitchTime: 15,
            pitchSubmitted: false,
            pitchEvaluated: false,
            applicationSubmitted: false
        });

        return NextResponse.json({
            success: true,
            participant
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering for program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Check registration status
export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id: programId } = await context.params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const participant = await IncubationParticipant.findOne({
            programId,
            founderId: session.user._id
        });

        if (!participant) {
            return NextResponse.json({ registered: false }, { status: 200 });
        }

        return NextResponse.json({
            registered: true,
            participant
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking registration status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
