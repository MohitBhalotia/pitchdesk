import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";
import { sendApplicationAcceptedEmailEvent, sendApplicationRejectedEmailEvent } from "@/lib/inngest/email-helpers";

export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: programId } = await context.params;

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
export async function PATCH(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: programId } = await context.params;
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

        // Fetch current application to check existing status before updating
        const existingApplication = await IncubationApplication.findById(applicationId);
        if (!existingApplication) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const statusActuallyChanged = existingApplication.status !== status;

        // Update application status
        const application = await IncubationApplication.findByIdAndUpdate(
            applicationId,
            {
                status,
                ...(statusActuallyChanged ? {
                    $push: {
                        statusHistory: {
                            status,
                            changedAt: new Date(),
                            changedBy: session.user._id
                        }
                    }
                } : {})
            },
            { new: true }
        );

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Send email notification only on accept or reject AND only if status actually changed
        if (statusActuallyChanged && (status === 'accepted' || status === 'rejected')) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const appData = application as any;
                const founderEmail = appData.registrationData?.email;
                const founderName = appData.registrationData?.founderName || 'Founder';
                const startupName = appData.registrationData?.startupName || 'Your startup';
                const programName = program.title || 'the program';
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pitchdesk.in';
                const programUrl = `${appUrl}/incubations/${programId}`;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vcName = (session.user as any).fullName || session.user.name || 'The Investment Team';

                if (founderEmail) {
                    if (status === 'accepted') {
                        await sendApplicationAcceptedEmailEvent(founderEmail, founderName, startupName, programName, programUrl, vcName);
                    } else {
                        await sendApplicationRejectedEmailEvent(founderEmail, founderName, startupName, programName, programUrl, vcName);
                    }
                }
            } catch (emailError) {
                // Don't fail the request if email fails — log and continue
                console.error("Failed to send status notification email:", emailError);
            }
        }

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
