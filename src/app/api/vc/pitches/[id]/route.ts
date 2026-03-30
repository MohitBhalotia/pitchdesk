import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";
import { sendApplicationAcceptedEmailEvent, sendApplicationRejectedEmailEvent } from "@/lib/inngest/email-helpers";

export async function PUT(req: Request, context: RouteContext) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await context.params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action, message } = body;

        const application = await IncubationApplication.findById(id)
            .populate({
                path: 'programId',
                select: 'vcId title'
            });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Handle status change
        let statusActuallyChanged = false;
        if (action) {
            // Verify only VC can change status
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (session.user.role !== 'vc' || (application.programId as any).vcId.toString() !== session.user._id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            // Only update if status is actually changing
            if (application.status !== action) {
                statusActuallyChanged = true;
                application.status = action;
                application.statusHistory.push({
                    status: action,
                    changedAt: new Date(),
                    changedBy: session.user._id as unknown as typeof application.statusHistory[0]['changedBy'],
                });

                // Auto-message on acceptance
                if (action === 'accepted') {
                    application.messages.push({
                        from: 'vc',
                        message: message || `Congratulations! Your application has been accepted. We'll reach out with next steps shortly.`,
                        timestamp: new Date(),
                    });
                }
            }
        }

        // Handle message only
        if (message && !action) {
            const senderRole = session.user.role === 'vc' ? 'vc' : 'founder';

            // Verify sender permissions
            if (senderRole === 'vc') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((application.programId as any).vcId.toString() !== session.user._id) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
                }
            } else {
                if (application.founderId.toString() !== session.user._id) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
                }
            }

            application.messages.push({
                from: senderRole,
                message,
                timestamp: new Date(),
            });
        }

        await application.save();

        // Send email notification only on accept or reject AND only if status actually changed
        if (statusActuallyChanged && (action === 'accepted' || action === 'rejected')) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const program = application.programId as any;
                const founderEmail = application.registrationData?.email;
                const founderName = application.registrationData?.founderName || 'Founder';
                const startupName = application.registrationData?.startupName || 'Your startup';
                const programName = program?.title || 'the program';
                const programId = program?._id?.toString() || '';
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pitchdesk.in';
                const programUrl = `${appUrl}/incubations/${programId}`;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vcName = (session.user as any).fullName || session.user.name || 'The Investment Team';

                if (founderEmail) {
                    if (action === 'accepted') {
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

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
