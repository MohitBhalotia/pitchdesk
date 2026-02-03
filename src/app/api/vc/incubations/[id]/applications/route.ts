import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: programId } =  params;

        // Verify the program belongs to this VC
        const program = await IncubationProgram.findOne({
            _id: programId,
            vcId: session.user._id
        });

        if (!program) {
            return NextResponse.json({ error: "Program not found or unauthorized" }, { status: 404 });
        }

        // Get all applications for this program
        const applications = await IncubationApplication.find({ programId })
            .populate('founderId', 'fullName email profileImage')
            .populate('pitchId', 'title startTime duration')
            .sort({ submittedAt: -1 });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update application status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: programId } = await params;
        const body = await req.json();
        const { applicationId, status } = body;

        // Verify the program belongs to this VC
        const program = await IncubationProgram.findOne({
            _id: programId,
            vcId: session.user._id
        });

        if (!program) {
            return NextResponse.json({ error: "Program not found or unauthorized" }, { status: 404 });
        }

        // Update application status
        const application = await IncubationApplication.findByIdAndUpdate(
            applicationId,
            {
                status,
                $push: {
                    statusHistory: {
                        status,
                        changedAt: new Date(),
                        changedBy: session.user._id
                    }
                }
            },
            { new: true }
        );

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
