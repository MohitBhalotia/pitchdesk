import dbConnect from "@/lib/db";
import IncubationProgram from "@/models/IncubationProgramModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Fetch all published programs
        const programs = await IncubationProgram.find({ status: 'published' })
            .populate('vcId', 'fullName profileImage')
            .sort({ createdAt: -1 });

        return NextResponse.json(programs);
    } catch (error) {
        console.error("Error fetching public investment programs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
