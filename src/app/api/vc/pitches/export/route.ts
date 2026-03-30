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

        const url = new URL(req.url);
        const status = url.searchParams.get('status') || 'all';
        const programId = url.searchParams.get('programId');

        // Validate programId if provided
        if (programId && !mongoose.Types.ObjectId.isValid(programId)) {
            return NextResponse.json({ error: "Invalid programId" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchStage: any = {
            'program.vcId': new mongoose.Types.ObjectId(session.user._id)
        };

        // If exporting for a specific program, add that filter immediately
        if (programId) {
            matchStage['program._id'] = new mongoose.Types.ObjectId(programId);
        }

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
            { $match: matchStage },
            // Join PitchEval to get authoritative score
            {
                $lookup: {
                    from: 'pitchevaluations',
                    localField: 'pitchId',
                    foreignField: 'pitchId',
                    as: 'pitchEval'
                }
            },
            { $unwind: { path: '$pitchEval', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    score: { $ifNull: ['$pitchEval.scores.TotalScore', '$score'] }
                }
            },
        ];

        // Filter by status after score enrichment
        if (status && status !== 'all') {
            pipeline.push({ $match: { status } });
        }

        pipeline.push({ $sort: { submittedAt: -1 } });

        const applications = await IncubationApplication.aggregate(pipeline);

        // Build CSV
        const headers = [
            'Startup Name',
            'Founder Name',
            'Email',
            'Phone',
            'Industry',
            'Stage',
            'Team Size',
            'Funding Raised',
            'AI Score',
            'Status',
            'Program Name',
            'Submitted Date',
        ];

        const escapeCSV = (value: string | number | undefined | null): string => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('\n') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = applications.map(app => [
            escapeCSV(app.registrationData?.startupName),
            escapeCSV(app.registrationData?.founderName),
            escapeCSV(app.registrationData?.email),
            escapeCSV(app.registrationData?.phone),
            escapeCSV(app.registrationData?.industry),
            escapeCSV(app.registrationData?.stage?.replace(/_/g, ' ')),
            escapeCSV(app.registrationData?.teamSize),
            escapeCSV(app.registrationData?.fundingRaised),
            escapeCSV(app.score),
            escapeCSV(app.status),
            escapeCSV(app.program?.title),
            escapeCSV(app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : ''),
        ].join(','));

        const csv = [headers.join(','), ...rows].join('\n');

        const filename = programId
            ? `program-applications-${status}.csv`
            : `all-pitches-${status}.csv`;

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error("Error exporting CSV:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
