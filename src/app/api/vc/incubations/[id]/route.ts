import dbConnect from "@/lib/db";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = params;

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const program = await IncubationProgram.findById(id)
            .populate('botId', 'name image');

        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Verify ownership
        if (program.vcId.toString() !== session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(program);
    } catch (error) {
        console.error("Error fetching program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = params;

        if (!session || session.user.role !== 'vc') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const program = await IncubationProgram.findById(id);

        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        // Verify ownership
        if (program.vcId.toString() !== session.user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const updatedProgram = await IncubationProgram.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('botId', 'name image');

        return NextResponse.json(updatedProgram);
    } catch (error) {
        console.error("Error updating program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
