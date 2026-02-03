import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import Agent from "@/models/AgentModel";
import IncubationProgram from "@/models/IncubationProgramModel";
import IncubationApplication from "@/models/IncubationApplicationModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const vcId = session.user._id;

        // Get counts
        const totalBots = await Agent.countDocuments({ vcId, isActive: true });
        const totalPrograms = await IncubationProgram.countDocuments({ vcId });
        const activePrograms = await IncubationProgram.countDocuments({
            vcId,
            status: 'published'
        });

        // Get all programs for this VC to count applications
        const programs = await IncubationProgram.find({ vcId }).select('_id');
        const programIds = programs.map(p => p._id);

        // Get application stats
        const totalApplications = await IncubationApplication.countDocuments({
            programId: { $in: programIds }
        });

        const acceptedApplications = await IncubationApplication.countDocuments({
            programId: { $in: programIds },
            status: 'accepted'
        });

        const pendingReview = await IncubationApplication.countDocuments({
            programId: { $in: programIds },
            status: 'pending'
        });

        const wishlistCount = await IncubationApplication.countDocuments({
            programId: { $in: programIds },
            status: 'wishlist'
        });

        // Get recent applications (last 5)
        const recentApplications = await IncubationApplication.find({
            programId: { $in: programIds }
        })
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate('founderId', 'fullName email profileImage')
            .populate('programId', 'title')
            .lean();

        return NextResponse.json({
            totalBots,
            totalPrograms,
            activePrograms,
            totalApplications,
            acceptedApplications,
            pendingReview,
            wishlistCount,
            recentApplications
        });
    } catch (error) {
        console.error("Error fetching VC stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
