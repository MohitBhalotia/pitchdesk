import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

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
        if (action) {
            // Verify only VC can change status
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (session.user.role !== 'vc' || (application.programId as any).vcId.toString() !== session.user._id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            application.status = action;
            application.statusHistory.push({
                status: action,
                changedAt: new Date(),
                changedBy: session.user._id as any,
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
        return NextResponse.json(application);
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
