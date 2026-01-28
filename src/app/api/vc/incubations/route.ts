import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const programs = await IncubationProgram.find({ vcId: session.user._id })
            .populate('botId', 'name image')
            .sort({ createdAt: -1 });

        return NextResponse.json(programs);
    } catch (error) {
        console.error("Error fetching incubation programs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            organizationName,
            botId,
            description,
            eligibility,
            rulesAndGuidelines,
            stages,
            timeline,
            fundingAmount,
            equityExpectations,
            cohortSize,
            notes,
            status
        } = body;

        const newProgram = await IncubationProgram.create({
            vcId: session.user._id,
            title,
            organizationName,
            botId,
            description,
            eligibility,
            rulesAndGuidelines,
            stages,
            timeline,
            fundingAmount,
            equityExpectations,
            cohortSize,
            notes,
            status: status || 'draft',
        });

        return NextResponse.json(newProgram, { status: 201 });
    } catch (error) {
        console.error("Error creating incubation program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
