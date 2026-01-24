import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationApplication from "@/models/IncubationApplicationModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get filter params from URL
        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        const sortBy = url.searchParams.get('sortBy') || 'recent';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'incubationprograms',
                    localField: 'programId',
                    foreignField: '_id',
                    as: 'program'
                }
            },
            { $unwind: '$program' },
            {
                $match: {
                    'program.vcId': new mongoose.Types.ObjectId(session.user._id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'founderId',
                    foreignField: '_id',
                    as: 'founder'
                }
            },
            { $unwind: '$founder' },
            // Populate pitch if needed? Usually we render summary from application itself or separate call.
        ];

        if (status && status !== 'all') {
            pipeline.push({ $match: { 'status': status } });
        }

        if (sortBy === 'highest_score') {
            pipeline.push({ $sort: { score: -1 } });
        } else if (sortBy === 'oldest') {
            pipeline.push({ $sort: { submittedAt: 1 } });
        } else {
            pipeline.push({ $sort: { submittedAt: -1 } });
        }

        const applications = await IncubationApplication.aggregate(pipeline);

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching pitches:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
