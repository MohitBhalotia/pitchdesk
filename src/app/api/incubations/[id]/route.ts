import dbConnect from "@/lib/db";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = await params;

        const program = await IncubationProgram.findById(id)
            .populate('vcId', 'fullName profileImage')
            .populate('botId', 'name image description');

        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        return NextResponse.json(program);
    } catch (error) {
        console.error("Error fetching incubation program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
