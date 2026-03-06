import dbConnect from "@/lib/db";
import IncubationProgram from "@/models/IncubationProgramModel";
import AgentModel from "@/models/AgentModel"; // Import to register Agent schema
import UserModel from "@/models/UserModel"; // Import to register User schema
import { NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function GET(req: Request, context: RouteContext) {
    try {
        await dbConnect();

        // Ensure models are registered for populate
        if (!AgentModel) {
            throw new Error("Agent model not loaded");
        }
        if (!UserModel) {
            throw new Error("User model not loaded");
        }

        const { id } = await context.params;

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
